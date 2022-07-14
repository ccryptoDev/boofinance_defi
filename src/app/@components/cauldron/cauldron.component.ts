import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector'
import {CauldronTokenDetails} from "../../@models/cauldron-token-details";
import {CauldronTokenSelectionMenu} from "../../@enums/cauldron-token-selection-menu";
import {AveragePercentageMenu} from "../../@enums/average-percentage-menu";
import {CauldronContributionMenu} from "../../@enums/cauldron-contribution-menu";
import {TokenSortingMenu} from "../../@enums/token-sorting-menu";
import {combineLatest, Observable, of, Subscription, timer} from "rxjs";
import {TokenBalance} from "../../@models/token-balance";
import {AccountService} from "../../@services/account.service";
import {TokensService} from "../../@services/tokens.service";
import {Token} from "../../@models/token";
import {
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  startWith,
  throttleTime
} from "rxjs/operators";
import {NbDialogService, NbMenuItem, NbMenuService, NbToastrService} from "@nebular/theme";
import {PaginationInstance} from "ngx-pagination";
import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {collapseAnimation, fadeInOnEnterAnimation} from "angular-animations";
import {AuthenticationService} from "../../@services/authentication.service";
import {User} from "../../@models/user";
import {CauldronCompositionComponent} from "../@modals/cauldron-composition/cauldron-composition.component";
import {environment} from "../../../environments/environment";
import {BigNumber, FixedNumber} from "ethers";
import {formatUnits, parseUnits} from "ethers/lib/utils";
import {EthereumUtils} from "../../@utils/ethereum-utils";
import {ToastrConfig} from "../../@configurations/toastr-config";
import {ErrorHandler} from "../../@utils/error-handler";
import {CauldronService} from "../../@services/cauldron.service";
import {EtherFormatValidator} from "../../@validators/ether-format-validator";
import {retryForever, retryWithDelay} from "../../@utils/rxjs-utils";
import {StakeService} from "../../@services/stake.service";
import {BoofiStakingDetails} from "../../@models/boofi-staking-details";
import {AvaxToken, WavaxToken} from "../../../environments/configurations/production-tokens-environment";
import {UserConfigurationService} from "../../@services/user-configuration.service";
import {UserConfiguration} from "../../@models/user-configuration";
import {aprToApy} from "../../@utils/number-utils";
import {CauldronUserTokenInfo} from "../../@models/cauldron-user-token-info";
import {CauldronCompositeInterestRate} from "../../@models/cauldron-composite-interest-rate";
import {CauldronComposition} from "../../@models/cauldron-composition";
import {CauldronUserOverallZboofiRewards} from "../../@models/cauldron-user-overall-zboofi-rewards";
import {CauldronHarvestSelectionMenu} from "../../@enums/cauldron-harvest-selection-menu";

@Component({
  selector: 'app-cauldron',
  templateUrl: './cauldron.component.html',
  styleUrls: ['./cauldron.component.scss'],
  styles: [':host { display: block }'],
  animations: [
    fadeInOnEnterAnimation({
      duration: 400,
      delay: 120
    }),
    fadeInOnEnterAnimation({
      anchor: 'enter',
      duration: 750
    }),
    collapseAnimation()
  ],
})
export class CauldronComponent implements OnInit, OnDestroy {
  @HostBinding('@enter')
  // Constants
  readonly minimumAllowanceToRequestApproval = environment.minimumAllowanceToRequestApproval;
  // Subscriptions
  menuOnClick$: Subscription;
  tokens$: Subscription;
  userTokens$: Subscription;
  userOverallZboofiRewards$: Subscription;
  tokenSearchControl$: Subscription;
  boofiStakingDetails$: Subscription;
  selectedTokenAllowance$: Subscription;
  selectedTokenCauldronDetails$: Subscription;
  selectedTokenUserDetails$: Subscription;
  selectedTokenBalance$: Subscription;
  user$: Subscription;
  userConfiguration$: Subscription;
  cauldronComposition$: Subscription;
  // Subscription variables (Variables that are fetched by Subscribing to Observables)
  tokens: Map<string, Token>;
  userTokens: Map<string, Token> | null;
  userStakedTokenAddresses: string[] | null;
  userHasTokenStaked: Map<string, boolean> | null;
  user: User | null;
  userOverallZboofiRewards: CauldronUserOverallZboofiRewards | null;
  userConfiguration: UserConfiguration;
  selectedToken: Token | null;
  selectedTokenBalance: BigNumber | null;
  selectedTokenAllowance: BigNumber | null;
  selectedTokenCauldronDetails: CauldronTokenDetails | null;
  selectedTokenUserInfo: CauldronUserTokenInfo | null;
  searchByNameOrSymbolTokenFilter: string;
  boofiStakingDetails: BoofiStakingDetails;
  cauldronComposition: CauldronComposition | null;
  // Loading booleans
  loadingApproveTokenAllowance: boolean = false;
  loadingUserTokens: boolean = true;
  loadingUserTokenAllowances: boolean = false;
  loadingUserOverallZboofiRewards: boolean = false;
  loadingDepositTransaction: boolean = false;
  loadingWithdrawTransaction: boolean = false;
  loadingHarvestTransaction: boolean = false;
  loadingBatchHarvestTransaction: boolean = false;
  loadingCauldronComposition: boolean = true;
  // Failed request booleans
  failedLoadingUserTokenAllowances: boolean = false;
  // Inputs
  tokenSearchControl: FormControl = new FormControl(null);
  contributionAmountControl: FormControl = new FormControl(null, [
    EtherFormatValidator(false, false),
    this.validateContributionBalance(),
  ]);
  withdrawAmountControl: FormControl = new FormControl(null, [
    EtherFormatValidator(false, false),
    this.validateWithdrawBalance(),
  ]);
  // Enums
  AveragePercentageMenuEnum = AveragePercentageMenu;
  CauldronTokenSelectionMenuEnum = CauldronTokenSelectionMenu;
  CauldronContributionMenuEnum = CauldronContributionMenu;
  TokenSortingMenuEnum = TokenSortingMenu;
  CauldronHarvestSelectionMenuEnum = CauldronHarvestSelectionMenu;
  // Menu variables
  wavaxToken: Token = WavaxToken;
  userTokensCurrentPage: number = 1;
  liquidityTokensCurrentPage: number = 1;
  singleTokensCurrentPage: number = 1;
  averagePercentageMenu: AveragePercentageMenu = AveragePercentageMenu.APR;
  // Flag that specifies if the user changed the token selection menu at least once
  userUpdatedCauldronSelectionMenu: boolean = false;
  // Flag that specifies if the user changed the Harvest selection menu at least once
  userUpdatedHarvestSelectionMenu: boolean = false;
  cauldronTokenSelectionMenu: CauldronTokenSelectionMenu = CauldronTokenSelectionMenu.UserTokens;
  cauldronHarvestSelectionMenu: CauldronHarvestSelectionMenu = CauldronHarvestSelectionMenu.All;
  cauldronContributionMenu: CauldronContributionMenu = CauldronContributionMenu.Contribute;
  selectedSortBy: TokenSortingMenu = TokenSortingMenu.DEFAULT;
  Number = Number;
  tokenSortByMenuOptions: NbMenuItem[] = [
    {
      title: 'Default',
      data: {
        sortBy: TokenSortingMenu.DEFAULT
      }
    },
    {
      title: 'Hot',
      data: {
        sortBy: TokenSortingMenu.HOT
      }
    },
    {
      title: 'New',
      data: {
        sortBy: TokenSortingMenu.NEW
      }
    },
    {
      title: 'APR',
      data: {
        sortBy: TokenSortingMenu.APR
      }
    },
    {
      title: 'Liquidity',
      data: {
        sortBy: TokenSortingMenu.Liquidity
      }
    }
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private accountService: AccountService,
    private tokensService: TokensService,
    private nbMenuService: NbMenuService,
    private nbDialogService: NbDialogService,
    private toastrService: NbToastrService,
    private cauldronService: CauldronService,
    private stakeService: StakeService,
    private userConfigurationService: UserConfigurationService,
    private deviceService: DeviceDetectorService
  ) {
  }

  ngOnInit(): void {
    // Retrieve tokens from our token list
    this.tokens$ = this.tokensService.getLPTokens().subscribe(
      tokenList => {
        this.tokens = tokenList;
    });

    // Retrieve the connected user
    this.user$ = this.authenticationService.getConnectedUser().subscribe(user => {
      this.user = user;
      // Clear the user tokens
      this.userTokens = null;
      this.userStakedTokenAddresses = null;
      this.userHasTokenStaked = null;
      // Clear the selected token balance
      this.selectedTokenBalance = null;
      // Clear the last selected token allowance
      this.selectedTokenAllowance = null;
      // Clear the selected token User info
      this.selectedTokenUserInfo = null;
      // Clear the user overall zBOOFI rewards
      this.userOverallZboofiRewards = null;
      // Set Cauldron Menu to Contribute
      this.cauldronContributionMenu = CauldronContributionMenu.Contribute;
      // If the user is connected get tokens from his/her wallet and from their active stakes on the Cauldron
      if (this.user) {
        this.loadingUserTokens = true;
        this.loadingUserOverallZboofiRewards = true;
        // Get the user tokens from their wallet and the ones deposited inside the Cauldron
        this.getUserTokens();
        // Get the user overall zBOOFI rewards
        this.getUserOverallZboofiRewards();
        // Refresh selected token user details
        if (this.selectedToken != null) {
          // Get the selected token User Info
          this.getCauldronUserTokenInfo(this.selectedToken);
          // Get the selected token balance
          this.getUserTokenBalance(this.selectedToken);
          // Get the selected token allowance
          this.getUserTokenAllowance(this.selectedToken);
        }
      } else {
        this.loadingUserTokens = false;
        this.loadingUserOverallZboofiRewards = false;
      }
    });

    // Listen Sort By Menu updates
    this.menuOnClick$ = this.nbMenuService.onItemClick().subscribe(sortBy => {
      if (sortBy.item.data?.sortBy != null) {
        this.selectedSortBy = sortBy.item.data.sortBy;
      }
    });

    // Listen to Search Control Input changes
    this.tokenSearchControl$ = this.tokenSearchControl.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(300)
    ).subscribe(search => {
      this.searchByNameOrSymbolTokenFilter = search;
    });

    // Retrieves BOOFI Staking APR and APY
    this.boofiStakingDetails$ = timer(0, 5000).pipe(
      concatMap(() => {
        return this.stakeService.getBoofiStakingDetails();
      }),
      catchError(() => of(null)),
    ).subscribe(boofiStakingDetails => {
      if (boofiStakingDetails) {
        this.boofiStakingDetails = boofiStakingDetails;
      }
    });

    this.userConfiguration$ = this.userConfigurationService.getUserConfiguration().subscribe(configuration => {
      this.userConfiguration = configuration;
    });

    this.getCauldronComposition();
  }

  /**
    Observes the connected user and if it performs any transaction
  **/
  onUserConnectedAndExecutesTransaction(): Observable<[User | null, any]> {
    return this.authenticationService.getConnectedUser().pipe(
      filter(user => user != null),
      concatMap((user) => {
        return combineLatest([
          of(user),
          this.accountService.onUserExecutesTransaction(user!.address),
        ])
      }),
    );
  }

  /**
    Subscribes to the selected token user balance and refreshes on user connections/disconnections
    and if he/she performs any Transaction.
    @param token The token of which we want to know the user balance.
  **/
  getUserTokenBalance(token: Token): void {
    this.selectedTokenBalance$?.unsubscribe();
    this.selectedTokenBalance$ = this.onUserConnectedAndExecutesTransaction().pipe(
      concatMap(([user, transaction]) => {
        return this.accountService.getUserTokenBalance(token.address, user!.address)
      })
    ).subscribe(selectedTokenBalance => {
      // Update the user selected token balance
      this.selectedTokenBalance = selectedTokenBalance;
      // Verify the validity of the contribution control.
      this.contributionAmountControl.updateValueAndValidity();
    });
  }

  /**
    Subscribes to the selected token userInfo and refreshes on user connections, if he/she performs any Transaction
    and every 10s, throttled by 2.5s
    @param token The token of which we want to know the userInfo
  **/
  getCauldronUserTokenInfo(token: Token): void {
    this.selectedTokenUserDetails$?.unsubscribe();
    this.selectedTokenUserDetails$ = combineLatest([
      this.onUserConnectedAndExecutesTransaction(),
      timer(0, 10000),
    ]).pipe(
      filter(([[user, transaction], timer]) => user != null),
      throttleTime(2500, undefined, {
        leading: true,
        trailing: true,
      }),
      concatMap(([[user, transaction], timer]) => {
        return this.cauldronService.getUserTokenInfo(token.address, user!.address)
      })
    ).subscribe(userTokenInfo => {
        console.log('userTokenInfo', userTokenInfo);
        this.selectedTokenUserInfo = userTokenInfo;
        // Verify the validity of the withdraw control.
        this.withdrawAmountControl.updateValueAndValidity();
      }
    );
  }


  /**
    Subscribes to the Cauldron Composition, we'll use it to provide filters by APR, APY, Liquidity, etc.
  **/
  getCauldronComposition() {
    this.cauldronComposition$?.unsubscribe();
    this.cauldronComposition$ = this.cauldronService.getCauldronComposition(true, this.tokens).pipe(
      retryForever(environment.failedRequestsRetryThreshold)
    ).subscribe(cauldronComposition => {
      this.cauldronComposition = cauldronComposition;
      this.loadingCauldronComposition = false;
    });
  }

  /**
    Subscribes to the selected token allowance only once.
    @param token The token of which we want to know the Allowance.
  **/
  getUserTokenAllowance(token: Token | null): void {
    this.selectedTokenAllowance$?.unsubscribe();
    this.failedLoadingUserTokenAllowances = false;
    if (token) {
      this.loadingUserTokenAllowances = true;
      this.selectedTokenAllowance$ = this.accountService.getUserTokenAllowance(
        token.address,
        environment.contractAddresses.hauntedHouse,
        this.user?.address
      ).pipe(
        // If the request fails, we'll try to make it again up to 6 times every 5s.
        retryWithDelay(5000, 6),
      ).subscribe(tokenAllowance => {
        console.log('tokenAllowance', tokenAllowance);
        this.selectedTokenAllowance = tokenAllowance;
        this.loadingUserTokenAllowances = false;
      }, error => {
        console.log(error);
        this.failedLoadingUserTokenAllowances = true;
        this.loadingUserTokenAllowances = false;
      });
    }
  }

  /**
    Subscribes to the user selected token "CauldronTokenDetails", refreshing his data
    every time a Deposit or Withdraw event is emitted within the Haunted House Smart Contract
    and throttled by 2.5s to avoid to many requests at once
    @param token The token of which we want to know the CauldronTokenDetails.
  **/
  getCauldronTokenDetails(token: Token) {
    this.selectedTokenCauldronDetails$?.unsubscribe();
    this.selectedTokenCauldronDetails$ = combineLatest([
        this.cauldronService.onDepositOrWithdrawEventsEmitted().pipe(startWith(() => {})),
        timer(0, 5000),
      ]).pipe(
        throttleTime(2500, undefined, {
          leading: true,
          trailing: true,
        }),
        concatMap(() => {
          return this.cauldronService.getCauldronTokenDetails(token)
        })
    ).subscribe(
      tokenDetails => {
        this.selectedTokenCauldronDetails = tokenDetails;
      }
    );
  }

  /**
    Subscribes to the connected user tokens (The ones deposited inside the Cauldron or available on their wallets)
  **/
  getUserTokens() {
    this.userTokens$?.unsubscribe();
    this.userTokens$ = this.onUserConnectedAndExecutesTransaction().pipe(
      concatMap(([user, transaction]) => {
        return combineLatest([
          this.tokensService.getLPTokens(),
          this.accountService.getUserTokenBalances(user!.address),
          this.cauldronService.getCauldronUserTokensDetails(user!.address),
        ]);
      })
    ).subscribe(([tokens, tokenBalances, cauldronUserTokenDetails]) => {
      let userTokens = new Map<string, Token>();
      let userHasTokenStaked = new Map<string, boolean>();
      let userStakedTokenAddresses: string[] = [];
      tokens.forEach(token => {
        if (tokenBalances.has(token.address.toLowerCase()) || cauldronUserTokenDetails.has(token.address.toLowerCase())) {
          // If we are verifying the AVAX token and the user has liquidity on WAVAX
          if (token.address == AvaxToken.address && cauldronUserTokenDetails.get(WavaxToken.address)?.hasLiquidity == true) {
            userHasTokenStaked.set(token.address, true);
          // Else verify if the user has liquidity on that specific token.
          } else {
            userHasTokenStaked.set(token.address, cauldronUserTokenDetails.get(token.address.toLowerCase())?.hasLiquidity == true);
          }
          // If the token is Staked and isn't the AVAX token, add it to the userStakedTokenAddresses array
          if (userHasTokenStaked.get(token.address) && token.address != AvaxToken.address) {
            userStakedTokenAddresses.push(token.address);
          }
          userTokens.set(token.address, token);
        }
      });
      // If the user has no Tokens available and he/she never switched menus manually, we'll switch to the LP tokens tab
      if (userTokens.size == 0 && !this.userUpdatedCauldronSelectionMenu) {
        this.cauldronTokenSelectionMenu = CauldronTokenSelectionMenu.LiquidityPoolTokens;
      }
      this.loadingUserTokens = false;
      this.userTokens = userTokens;
      this.userStakedTokenAddresses = userStakedTokenAddresses;
      this.userHasTokenStaked = userHasTokenStaked;
    }, error => {
      console.log('failed to load user tokens', error);
      this.loadingUserTokens = false;
    });
  }

  /**
    Subscribes to the user zBOOFI rewards overall his tokens
    @notice further optimizations might be required, since we are likely to hit a gas limit at some point if the token list continues to grow
  **/
  getUserOverallZboofiRewards() {
    this.userOverallZboofiRewards$?.unsubscribe();
    this.userOverallZboofiRewards$ = timer(5000, 10000).pipe(
      filter(() => this.user != null && this.userStakedTokenAddresses != null),
      concatMap(() => {
        return this.cauldronService.batchPendingZboofi(this.user!.address, this.userStakedTokenAddresses!);
      }),
      catchError((err, caught) => {
        console.log(err);
        return caught.pipe(
          filter(() => false)
        );
      })
    ).subscribe((cauldronOverallZboofiRewards) => {
      this.loadingUserOverallZboofiRewards = false;
      console.log('getUserOverallZboofiRewards', cauldronOverallZboofiRewards);
      this.userOverallZboofiRewards = cauldronOverallZboofiRewards;
    });
  }

  /**
    Retrieves a Token from a TokenBalance object
    @param tokenBalance the TokenBalance we wish to convert to a Token
    @return token the Converted token.
  **/
  getTokenFromTokenBalance(tokenBalance: TokenBalance): Token {
    // Find the token on our token list
    let token: Token | undefined = this.tokens.get(tokenBalance.token_address.toLowerCase());
    // If the token isn't part of our token list, generate a valid one dynamically
    if (token == null) {
      return {
        address: tokenBalance.token_address,
        chainId: 43114,
        decimals: tokenBalance.decimals,
        logoURI: tokenBalance.logo,
        name: tokenBalance.name,
        symbol: tokenBalance.symbol,
        compositionChartBackgroundColor: '#ffffff',
      };
    }
    return token;
  }

  /**
    Selects a token and subscribes to all his corresponding observables
    @param token the token we wish to select
  **/
  tokenSelected(token: Token) {
    // If we are selecting the same token, ignore it.
    if (this.selectedToken?.address == token.address) {
      return;
    }
    this.unselectToken();
    // Set the Cauldron Tab to his default state.
    this.cauldronContributionMenu = CauldronContributionMenu.Contribute;
    // Set token as the selected Token
    this.selectedToken = token;
    // Get the selected token balance
    this.getUserTokenBalance(token);
    // Get the selected token allowance
    this.getUserTokenAllowance(token);
    // Get the selected token Cauldron info
    this.getCauldronTokenDetails(token);
    // Get the selected token User Info
    this.getCauldronUserTokenInfo(token);
    // Update the selected Harvest menu to this token
    this.cauldronHarvestSelectionMenu = CauldronHarvestSelectionMenu.ThisToken;
    // scrolling to the contribute block when a token is selected on mobile devices
    if(this.deviceService.isMobile()) {
      let contributeBlockElem = document.getElementById('contribute_block');
      contributeBlockElem?.scrollIntoView();
    }
  }

  /**
    Returns the pagination configuration for ngx-pagination
    @return paginationInstance
  **/
  paginationConfig(instanceId: string, currentPage: number): PaginationInstance {
    return {
      id: instanceId,
      itemsPerPage: window.innerWidth >= 1200 ? 30 : 28,
      currentPage: currentPage,
    }
  }

  /**
    Performs an approve allowance transaction with the connected user and the currently selected token
  **/
  approveSelectedTokenAllowance() {
    if (this.selectedToken && this.user?.address) {
      this.loadingApproveTokenAllowance = true;
      of(this.selectedToken.address).pipe(
        first(),
        concatMap((tokenAddress: string) => {
          return combineLatest([
            of(tokenAddress),
            this.accountService.setUserTokenAllowance(
              tokenAddress,
              environment.contractAddresses.hauntedHouse,
              EthereumUtils.MaximumBigNumber
            )
          ]);
        })
      ).subscribe(([tokenAddress, receipt]) => {
        // If the transaction succeeded we'll assume the user has an allowance of a maximum uint256
        if (tokenAddress == this.selectedToken?.address) {
          this.selectedTokenAllowance = EthereumUtils.MaximumBigNumber;
          this.loadingApproveTokenAllowance = false;
        }
      }, error => {
        console.log(error);
        this.loadingApproveTokenAllowance = false;
        this.toastrService.show(ErrorHandler.getMessage(error), 'Transaction Cancelled', ToastrConfig.Warning);
      });
    }
  }

  /**
    Performs a deposit transaction with the connected user and the currently selected token
  **/
  depositSelectedToken(): void {
    console.log('depositSelectedToken');
    if (this.contributionAmountControl.valid && this.selectedToken && this.user?.address) {
      this.loadingDepositTransaction = true;
      this.contributionAmountControl.disable();
      const decimals = this.selectedToken.decimals;
      const symbol = this.selectedToken.symbol;
      const amount = parseUnits(this.contributionAmountControl.value, decimals);
      let depositRequest: Observable<any>;
      if (this.selectedToken.address == AvaxToken.address) {
        depositRequest = this.cauldronService.depositAvax(amount);
      } else {
        depositRequest = this.cauldronService.deposit(
          this.selectedToken.address,
          amount,
          this.user.address
        );
      }
      depositRequest.pipe(
        first(),
      ).subscribe(receipt => {
        const message = `Successfully deposited ${formatUnits(amount, decimals)} ${symbol}`;
        this.toastrService.show(message, 'Success', ToastrConfig.Success);
        this.loadingDepositTransaction = false;
        this.contributionAmountControl.enable();
        this.contributionAmountControl.reset();
        if (this.selectedToken) {
          this.getUserTokenBalance(this.selectedToken);
        }
        this.getUserTokens();
      }, error => {
        console.log(error);
        this.loadingDepositTransaction = false;
        this.toastrService.show(ErrorHandler.getMessage(error), 'Error', ToastrConfig.Warning);
        this.contributionAmountControl.enable();
      });
    }
  }

  /**
    Performs a withdraw transaction with the connected user and the currently selected token
  **/
  withdrawSelectedToken(): void {
    console.log('withdrawSelectedToken');
    if (this.withdrawAmountControl.valid && this.selectedToken && this.user?.address) {
      this.loadingWithdrawTransaction = true;
      this.withdrawAmountControl.disable();
      const decimals = this.selectedToken.decimals;
      const symbol = this.selectedToken.symbol;
      const amount = parseUnits(this.withdrawAmountControl.value, decimals);
      this.cauldronService.withdrawAndHarvest(
        this.selectedToken.address,
        amount,
        this.user.address
      ).pipe(
        first(),
      ).subscribe(receipt => {
        const message = `Successfully withdrawn ${formatUnits(amount, decimals)} ${symbol}`;
        this.toastrService.show(message, 'Success', ToastrConfig.Success);
        this.loadingWithdrawTransaction = false;
        this.withdrawAmountControl.enable();
        this.withdrawAmountControl.reset();
        if (this.selectedToken) {
          this.getUserTokenBalance(this.selectedToken);
        }
        this.getUserTokens();
      }, error => {
        console.log(error);
        this.loadingWithdrawTransaction = false;
        this.toastrService.show(ErrorHandler.getMessage(error), 'Error', ToastrConfig.Warning);
        this.withdrawAmountControl.enable();
      });
    }
  }

  /**
    Performs a harvest transaction with the connected user and the currently selected token
  **/
  harvestSelectedToken(): void {
    if (this.selectedToken && this.user?.address) {
      this.loadingHarvestTransaction = true;
      this.cauldronService.harvest(this.selectedToken.address, this.user.address)
        .pipe(first())
        .subscribe(receipt => {
          const message = `Successfully harvested your zBOOFI rewards`;
          this.toastrService.show(message, 'Success', ToastrConfig.Success);
          this.loadingHarvestTransaction = false;
          this.getUserTokens();
        }, error => {
          console.log(error);
          this.loadingHarvestTransaction = false;
          this.toastrService.show(ErrorHandler.getMessage(error), 'Error', ToastrConfig.Warning);
        });
    }
  }

  /**
    Performs a batch harvest transaction with the connected user and their currently staked tokens
  **/
  harvestAll(): void {
    if (this.userStakedTokenAddresses?.length && this.user?.address) {
      this.loadingBatchHarvestTransaction = true;
      this.cauldronService.batchHarvest(this.userStakedTokenAddresses)
        .pipe(first())
        .subscribe(receipt => {
          const message = `Successfully harvested all your zBOOFI rewards`;
          this.toastrService.show(message, 'Success', ToastrConfig.Success);
          this.loadingBatchHarvestTransaction = false;
          // Resets the user overall zBOOFI rewards.
          this.userOverallZboofiRewards = null;
          this.loadingUserOverallZboofiRewards = true;
          // Refresh the user zBOOFI overall rewards
          this.getUserOverallZboofiRewards();
          // If the user has a token selected reset and refresh his rewards
          if (this.selectedToken && this.selectedTokenUserInfo) {
            this.selectedTokenUserInfo.pendingRewards = null;
            this.getCauldronUserTokenInfo(this.selectedToken);
          }
        }, error => {
          console.log(error);
          this.loadingBatchHarvestTransaction = false;
          this.toastrService.show(ErrorHandler.getMessage(error), 'Error', ToastrConfig.Warning);
        });
    }
  }

  /**
    Opens a modal window with the Cauldron composition
  **/
  openCauldronCompositionDialog(): void {
    this.nbDialogService.open(CauldronCompositionComponent, {
      dialogClass: 'dialog-lg',
    });
  }

  /**
    Unselects a token, deactivating all loading spinners, unsubscribing from all his Observables
    and clearing all his variables.
  **/
  unselectToken() {
    // Disable selected token loading spinners
    this.loadingHarvestTransaction = false;
    this.loadingWithdrawTransaction = false;
    this.loadingDepositTransaction = false;
    // Unsubscribe from previous requests
    this.selectedTokenAllowance$?.unsubscribe();
    this.selectedTokenCauldronDetails$?.unsubscribe();
    this.selectedTokenUserDetails$?.unsubscribe();
    this.selectedTokenBalance$?.unsubscribe();
    // Clear the selected token
    this.selectedToken = null;
    // Clear the selected token balance
    this.selectedTokenBalance = null;
    // Clear the last selected token allowance
    this.selectedTokenAllowance = null;
    // Clear the selected token Cauldron Details
    this.selectedTokenCauldronDetails = null;
    // Clear the selected token User info
    this.selectedTokenUserInfo = null;
    // Clear form controls
    this.contributionAmountControl.reset();
    this.withdrawAmountControl.reset();
    this.contributionAmountControl.enable();
    this.withdrawAmountControl.enable();
    // Clear loading states
    this.loadingApproveTokenAllowance = false;
    this.loadingUserTokenAllowances = false;
    this.loadingDepositTransaction = false;
    this.loadingWithdrawTransaction = false;
    this.loadingHarvestTransaction = false;
  }

  /**
    Opens a new window pointing to the exchange of the selected token
  **/
  openGetTokensUrl() {
    if (this.selectedToken?.getTokensUrl != null) {
      window.open(this.selectedToken?.getTokensUrl, '_blank');
    }
  }

  /**
    Set the contributionAmountControl with the user maximum balance
  **/
  maxUserContributionBalance() {
    if (this.selectedToken && this.selectedTokenBalance) {
      this.contributionAmountControl.setValue(formatUnits(this.selectedTokenBalance, this.selectedToken.decimals));
    } else {
      this.contributionAmountControl.setValue('0');
    }
  }

  /**
    Set the withdrawAmountControl with the user amount deposited
  **/
  maxUserWithdrawBalance() {
    if (this.selectedToken && this.selectedTokenUserInfo?.amountDeposited) {
      this.withdrawAmountControl.setValue(formatUnits(this.selectedTokenUserInfo.amountDeposited, this.selectedToken.decimals));
    } else {
      this.withdrawAmountControl.setValue('0');
    }
  }

  /**
    Validation function that verifies if the user has enough balance before contributing
    @return ValidatorFn The validation function which receives an abstract form control and synchronously returns a map of
            validation errors if present
  **/
  validateContributionBalance(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      try {
        if (this.selectedToken && this.selectedTokenBalance && EthereumUtils.isValidEtherFormat(control.value)) {
          const controlBalanceValue = parseUnits(control.value, this.selectedToken.decimals);
          // If the Input has a balance higher than the user one, fail the validation.
          if (controlBalanceValue.gt(this.selectedTokenBalance)) {
            return {
              exceedsBalance: {
                value: control.value
              }
            }
          }
        }
      } catch (e) {}
      return null;
    };
  }

  /**
    Validation function that verifies if the user has enough balance to withdraw
    @return ValidatorFn The validation function which receives an abstract form control and synchronously returns a map of
            validation errors if present
  **/
  validateWithdrawBalance(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      try {
        if (this.selectedToken && this.selectedTokenUserInfo?.amountDeposited && EthereumUtils.isValidEtherFormat(control.value)) {
          const controlBalanceValue = parseUnits(control.value, this.selectedToken.decimals);
          // If the Input has a balance higher than the user one, fail the validation.
          if (controlBalanceValue.gt(this.selectedTokenUserInfo.amountDeposited)) {
            return {
              exceedsBalance: {
                value: control.value
              }
            }
          }
        }
      } catch (e) {}
      return null;
    };
  }

  /**
    Toggle the Information card help and save his status on the user configuration
  **/
  onHelpToggled(): void {
    const newConfiguration = this.userConfiguration;
    newConfiguration.helpToggles.howToUseCauldron = !newConfiguration.helpToggles.howToUseCauldron;
    this.userConfigurationService.setUserConfiguration(newConfiguration);
  }

  /**
    Updates the active "Select a token" tab
    @param cauldronTokenSelectionMenu The Enum index which the Tab we want to display
  **/
  setTokenSelectionTab(cauldronTokenSelectionMenu: CauldronTokenSelectionMenu): void {
    this.userUpdatedCauldronSelectionMenu = true;
    this.cauldronTokenSelectionMenu = cauldronTokenSelectionMenu;
  }

  /**
    Updates the active Harvest tab
    @param cauldronHarvestSelectionMenu The Enum index which the Tab we want to display
  **/
  setHarvestTab(cauldronHarvestSelectionMenu: CauldronHarvestSelectionMenu): void {
    this.userUpdatedHarvestSelectionMenu = true;
    this.cauldronHarvestSelectionMenu = cauldronHarvestSelectionMenu;
  }

  /**
    Returns the Selected token Composite Interest rate through the following formula
    (emissions APR / growth APR) * [(1 + growth APR/365)^X - 1]
    @return {CauldronCompositeInterestRate | null}
  **/
  get selectedTokenCompositeInterestRate(): CauldronCompositeInterestRate | null {
    if (this.selectedTokenCauldronDetails?.apr != null && this.boofiStakingDetails?.apr != null) {
      const totalApr = (this.selectedTokenCauldronDetails.apr / this.boofiStakingDetails.apr) * (Math.pow((1 + (this.boofiStakingDetails.apr / 365)), 365) - 1);
      return {
        tokenApr: this.selectedTokenCauldronDetails.apr,
        stakeApr: this.boofiStakingDetails.apr,
        compositeApr: totalApr,
        compositeApy: aprToApy(totalApr, 365)
      }
    }
    return null;
  }

  /**
    Returns the USD value of the currently selected token User Balance
    @return {string | null}
  **/
  get selectedTokenBalanceInUsd(): string | null {
    if (this.user && this.selectedToken && this.selectedTokenBalance && this.selectedTokenCauldronDetails?.tokenPrice) {
      const tokenBalance = FixedNumber.from(formatUnits(this.selectedTokenBalance, this.selectedToken.decimals));
      const tokenPrice =  FixedNumber.from(this.selectedTokenCauldronDetails.tokenPrice.toString());
      return tokenBalance.mulUnsafe(tokenPrice).toString();
    }
    return null;
  }

  /**
    Returns the USD value of the currently selected token User Stake
    @return {string | null}
  **/
  get selectedTokenStakeInUsd(): string | null {
    if (this.user && this.selectedToken && this.selectedTokenUserInfo?.amountDeposited && this.selectedTokenCauldronDetails?.tokenPrice) {
      const tokenStake = FixedNumber.from(formatUnits(this.selectedTokenUserInfo.amountDeposited, this.selectedToken.decimals));
      const tokenPrice =  FixedNumber.from(this.selectedTokenCauldronDetails.tokenPrice.toString());
      return tokenStake.mulUnsafe(tokenPrice).toString();
    }
    return null;
  }

  /**
    Unsubscribe from any active subscriptions to avoid memory leaks
  **/
  ngOnDestroy(): void {
    this.unselectToken();
    this.userTokens$?.unsubscribe();
    this.tokens$?.unsubscribe();
    this.menuOnClick$?.unsubscribe();
    this.tokenSearchControl$?.unsubscribe();
    this.boofiStakingDetails$?.unsubscribe();
    this.userConfiguration$?.unsubscribe();
    this.cauldronComposition$?.unsubscribe();
    this.userOverallZboofiRewards$?.unsubscribe();
    this.accountService.unsubscribeFromLiveQueries();
    this.cauldronService.unsubscribeFromLiveQueries();
  }

}
