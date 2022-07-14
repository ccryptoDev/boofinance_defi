import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {formatEther, parseEther} from "ethers/lib/utils";
import {fadeInOnEnterAnimation} from "angular-animations";
import {Subscription, timer} from "rxjs";
import {User} from "../../@models/user";
import {BigNumber} from "ethers";
import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {EtherFormatValidator} from "../../@validators/ether-format-validator";
import {StakingMode} from "../../@enums/staking-mode";
import {AccountService} from "../../@services/account.service";
import {AuthenticationService} from "../../@services/authentication.service";
import {NbToastrService} from "@nebular/theme";
import {environment} from "../../../environments/environment";
import {concatMap, filter, first, startWith, throttleTime} from "rxjs/operators";
import {ToastrConfig} from "../../@configurations/toastr-config";
import {ErrorHandler} from "../../@utils/error-handler";
import {WellOfSoulsService} from "../../@services/well-of-souls.service";
import {EthereumUtils} from "../../@utils/ethereum-utils";
import {ZboofiStakingDetails} from "../../@models/zboofi-staking-details";
import {WellOfSoulsHarvester} from "../../@models/well-of-souls-harvester";
import {retryWithDelay} from "../../@utils/rxjs-utils";
import {UserConfigurationService} from "../../@services/user-configuration.service";
import {UserConfiguration} from "../../@models/user-configuration";

@Component({
  selector: 'app-well-of-souls',
  templateUrl: './well-of-souls.component.html',
  styleUrls: ['./well-of-souls.component.scss'],
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
  ],
})
export class WellOfSoulsComponent implements OnInit, OnDestroy {
  @HostBinding('@enter')
  // Constants
  readonly minimumAllowanceToRequestApproval = environment.minimumAllowanceToRequestApproval;
  // Subscriptions
  user$: Subscription;
  userConfiguration$: Subscription;
  userZBoofiBalance$: Subscription;
  userZboofiAllowance$: Subscription;
  userAmountDeposited$: Subscription;
  userPendingRewards$: Subscription;
  harvesters$: Subscription;
  zBoofiStakingDetails$: Subscription;
  userHarvester$: Subscription;
  // Subscription variables (Variables that are fetched by Subscribing to Observables)
  user: User | null;
  userConfiguration: UserConfiguration;
  userZboofiAllowance: BigNumber | null;
  userZboofiBalance: BigNumber | undefined | null = null;
  userPendingRewards: BigNumber | null = null;
  userAmountDeposited: BigNumber | null;
  userHarvester: WellOfSoulsHarvester | null;
  harvesters: WellOfSoulsHarvester[] | null | undefined;
  totalHarvesters: number = 0;
  zBoofiStakingDetails: ZboofiStakingDetails | null;
  // Loading booleans
  loadingZboofiAllowance: boolean = false;
  loadingDepositTransaction: boolean = false;
  loadingWithdrawTransaction: boolean = false;
  loadingApproveAllowanceTransaction: boolean = false;
  loadingHarvestTransaction: boolean = false;
  // Failed request booleans
  failedLoadingZboofiAllowance: boolean = false;
  // Inputs
  depositAmountControl: FormControl = new FormControl(null, [
    EtherFormatValidator(false, false),
    this.validateStakeBalance(),
  ]);
  withdrawAmountControl: FormControl = new FormControl(null, [
    EtherFormatValidator(false, false),
    this.validateUnstakeBalance(),
  ]);
  // Menu variables
  StakingModeEnum = StakingMode;
  stakingMode = StakingMode.Deposit;
  currentHarvestersPage: number = 1;
  userRankPageNum: number = 1;

  constructor(
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private toastrService: NbToastrService,
    private wellOfSoulsService: WellOfSoulsService,
    private userConfigurationService: UserConfigurationService
  ) { }

  ngOnInit(): void {
    this.user$ = this.authenticationService.getConnectedUser().subscribe(user => {
      this.onUserChanges();
      this.user = user;
      if (user) {
        this.depositAmountControl.enable();
        this.withdrawAmountControl.enable();
        this.getUserZboofiAllowance();
        this.getUserZBoofiBalance();
        this.getUserAmountDeposited();
        this.getUserPendingRewards();
        this.getUserHarvester();
      }
    });
    this.getPaginatedHarvesters();
    this.getZBoofiStakingDetails();
    this.userConfiguration$ = this.userConfigurationService.getUserConfiguration().subscribe(configuration => {
      this.userConfiguration = configuration;
    });
  }

  /**
    Subscribes to the current zBOOFI Staking Details
  **/
  getZBoofiStakingDetails() {
    this.zBoofiStakingDetails$?.unsubscribe();
    this.zBoofiStakingDetails$ = this.wellOfSoulsService.getZboofiStakingDetails().subscribe((zBoofiStakingDetails) => {
      this.zBoofiStakingDetails = zBoofiStakingDetails;
    });
  }

  /**
    Subscribes to the Harvesters leaderboard, refreshing it every time the Harvest event is emitted and throttling it every 2.5s
    to avoid making to many requests consecutively.
    @param page the leaderboard page to which we want to subscribe
  **/
  getPaginatedHarvesters(page: number = 1): void {
    this.harvesters$?.unsubscribe();
    this.harvesters = null;
    this.harvesters$ = this.wellOfSoulsService.onWellOfSoulsContributorEventEmitted().pipe(
      startWith({}),
      throttleTime(2500, undefined, {
        leading: true,
        trailing: true,
      }),
      concatMap(()=> {
        console.log('getPaginatedHarvesters');
        return this.wellOfSoulsService.getPaginatedHarvesters(page);
      })
    ).subscribe((paginatedTopHarvesters) => {
      this.harvesters = paginatedTopHarvesters?.results;
      this.totalHarvesters = paginatedTopHarvesters?.count ? paginatedTopHarvesters!.count! : 0;
    });
  }

  changeHarvestersPage(page: number) {
    this.currentHarvestersPage = page;
    this.getPaginatedHarvesters(page);
  }

  /**
    Subscribes to the connected user Harvester data, refreshing it every time a Well of Souls Contributor
    is Updated and throttled by 5s
  **/
  getUserHarvester() {
    this.userHarvester$?.unsubscribe();
    if (this.user) {
      this.userHarvester$ = this.wellOfSoulsService.onWellOfSoulsContributorEventEmitted().pipe(
        startWith({}),
        throttleTime(5000, undefined, {
            leading: true,
            trailing: true,
          }),
        filter(() => this.user != null),
        concatMap(() => this.wellOfSoulsService.getHarvester(this.user!.address))
      ).subscribe((harvester) => {
        this.userHarvester = harvester;
        // store ranking page number of user
        if(Number(this.userHarvester?.rank) > 0) {
          this.userRankPageNum = Math.floor(Number(this.userHarvester?.rank) / 12) + 1;
          console.log('user ranking page number: ', this.userRankPageNum);
        }
      });
    }
  }

  /**
    Subscribes to the connected User pending rewards, refreshing them on an Interval of 15 seconds
  **/
  getUserPendingRewards() {
    this.userPendingRewards$?.unsubscribe();
    this.userPendingRewards$ = timer(0, 15000).pipe(
      concatMap(() => {
        return this.wellOfSoulsService.getUserPendingRewards(this.user!.address);
      })
    ).subscribe((pendingRewards: BigNumber | null) => {
      console.log('getUserPendingRewards', pendingRewards);
      this.userPendingRewards = pendingRewards;
    });
  }

  /**
    Subscribes to the connected User amount deposited, refreshing them on every transaction he/she makes
  **/
  getUserAmountDeposited() {
    this.userAmountDeposited$?.unsubscribe();
    this.userAmountDeposited$ = this.accountService.onUserExecutesTransaction(this.user!.address).pipe(
      concatMap(() => {
        return this.wellOfSoulsService.getUserAmountDeposited(this.user!.address);
      })
    ).subscribe(amountDeposited => {
      this.userAmountDeposited = amountDeposited;
      this.withdrawAmountControl.updateValueAndValidity();
    });
  }

  /**
    Subscribes to the connected User zBOOFI Balance, refreshing them on every transaction he/she makes
  **/
  getUserZBoofiBalance() {
    this.userZBoofiBalance$?.unsubscribe();
    this.userZBoofiBalance$ = this.accountService.onUserExecutesTransaction(this.user!.address)
      .pipe(
        concatMap(() => {
          return this.accountService.getUserTokenBalance(environment.contractAddresses.zBoofi, this.user!.address)
        })
      ).subscribe(zBoofiBalance => {
        this.userZboofiBalance = zBoofiBalance;
        this.depositAmountControl.updateValueAndValidity();
      }, error => {
        console.log('failed to zBOOFI Balance balance', error);
      });
  }

  /**
    Subscribes to the connected User zBOOFI Allowance only once.
  **/
  getUserZboofiAllowance() {
    this.userZboofiAllowance$?.unsubscribe();
    this.loadingZboofiAllowance = true;
    this.failedLoadingZboofiAllowance = false;
    this.userZboofiAllowance$ = this.accountService.getUserTokenAllowance(
      environment.contractAddresses.zBoofi,
      environment.contractAddresses.zBoofiStaking,
      this.user?.address
    ).pipe(
      // If the request fails, we'll try to make it again up to 6 times every 5s.
      retryWithDelay(5000, 6),
    ).subscribe(zBoofiAllowance => {
      this.userZboofiAllowance = zBoofiAllowance;
      this.loadingZboofiAllowance = false;
    }, error => {
      console.log(error);
      this.failedLoadingZboofiAllowance = true;
      this.loadingZboofiAllowance = false;
    });
  }

  /**
    Performs a deposit transaction with the connected user
  **/
  deposit(): void {
    if (this.user && this.depositAmountControl.valid) {
      const amount = parseEther(this.depositAmountControl.value);
      this.loadingDepositTransaction = true;
      this.depositAmountControl.disable();
      this.wellOfSoulsService.deposit(amount).pipe(first()).subscribe(receipt => {
        this.loadingDepositTransaction = false;
        this.depositAmountControl.reset();
        this.depositAmountControl.enable();
        const message = `Successfully staked ${formatEther(amount)} zBOOFI`;
        this.toastrService.show(message, 'Success', ToastrConfig.Success);
      }, error => {
        console.log(error);
        this.loadingDepositTransaction = false;
        this.depositAmountControl.enable();
        this.getUserZBoofiBalance();
        this.toastrService.show(ErrorHandler.getMessage(error), 'Error', ToastrConfig.Warning);
      });
    }
  }

  /**
    Returns a string that let us know if we should display the user's data at the top or bottom of the leaderboard
    It will return "none" if the user's data is unavailable or if it's already inside the current page
  **/
  get additionalUserDataInLeaderboard(): 'none' | 'top' | 'bottom' {
    if (this.user && this.userHarvester && this.userHarvester?.rank != 'Unranked' && this.harvesters) {
      // If the user is already on the Harvesters list, don't display it
      if (this.harvesters.find(x => x.userAddress == this.user!.address)) {
        return 'none';
      } else {
        if (this.harvesters[0]?.rank != null && this.userHarvester.rank != null) {
          if (this.harvesters![0].rank < this.userHarvester.rank) {
            return 'bottom';
          } else {
            return 'top';
          }
        }
      }
    }
    return 'none';
  }

  /**
    Performs a withdraw transaction with the connected user
  **/
  withdraw(): void {
    if (this.user && this.withdrawAmountControl.valid) {
      const amount = parseEther(this.withdrawAmountControl.value);
      this.loadingWithdrawTransaction = true;
      this.withdrawAmountControl.disable();
      this.wellOfSoulsService.withdraw(amount).pipe(first()).subscribe(receipt => {
        this.loadingWithdrawTransaction = false;
        this.withdrawAmountControl.reset();
        this.withdrawAmountControl.enable();
        const message = `Successfully unstaked ${formatEther(amount)} zBOOFI`;
        this.toastrService.show(message, 'Success', ToastrConfig.Success);
      }, error => {
        console.log(error);
        this.loadingWithdrawTransaction = false;
        this.withdrawAmountControl.enable();
        this.getUserZBoofiBalance();
        this.toastrService.show(ErrorHandler.getMessage(error), 'Error', ToastrConfig.Warning);
      });
    }
  }

  /**
    Performs a harvest transaction with the connected user
  **/
  harvest(): void {
    if (this.user) {
      this.loadingHarvestTransaction = true;
      this.wellOfSoulsService.harvest().pipe(first()).subscribe(receipt => {
        this.loadingHarvestTransaction = false;
        this.userPendingRewards = BigNumber.from(0);
        this.getUserPendingRewards();
        const message = `Successfully harvested your rewards!`;
        this.toastrService.show(message, 'Success', ToastrConfig.Success);
      }, error => {
        console.log(error);
        this.loadingHarvestTransaction = false;
        this.getUserZBoofiBalance();
        if (this.userHarvester) {
          this.userHarvester.totalHarvested = null;
        }
        this.getUserHarvester();
        this.toastrService.show(ErrorHandler.getMessage(error), 'Error', ToastrConfig.Warning);
      });
    }
  }

  /**
    Performs an approve zBOOFI allowance transaction with the connected user
  **/
  approveZboofiAllowance() {
    if (this.user?.address) {
      this.loadingApproveAllowanceTransaction = true;
      this.accountService.setUserTokenAllowance(
        environment.contractAddresses.zBoofi,
        environment.contractAddresses.zBoofiStaking,
        EthereumUtils.MaximumBigNumber
      ).pipe(first()).subscribe(receipt => {
        // If the transaction succeeded we'll assume the user has an allowance of a maximum uint256
        this.userZboofiAllowance = EthereumUtils.MaximumBigNumber;
        this.loadingApproveAllowanceTransaction = false;
      }, error => {
        console.log(error);
        this.loadingApproveAllowanceTransaction = false;
        this.toastrService.show(ErrorHandler.getMessage(error), 'Error', ToastrConfig.Warning);
      });
    }
  }

  /**
    Unsubscribes from the connected user data and clears it, also disables and clears form controls
  **/
  onUserChanges(): void {
    this.userAmountDeposited$?.unsubscribe();
    this.userZBoofiBalance$?.unsubscribe();
    this.userZboofiAllowance$?.unsubscribe();
    this.userPendingRewards$?.unsubscribe();
    this.userHarvester$?.unsubscribe();
    this.userPendingRewards = null;
    this.userZboofiAllowance = null;
    this.userZboofiBalance = null;
    this.userAmountDeposited = null;
    this.userHarvester = null;
    this.depositAmountControl.disable();
    this.withdrawAmountControl.disable();
    this.depositAmountControl.reset();
    this.withdrawAmountControl.reset();
  }

  /**
    Set the depositAmountControl with the user maximum balance
  **/
  maxUserStakeBalance() {
    this.depositAmountControl.setValue(this.userZboofiBalance ? formatEther(this.userZboofiBalance) : '0');
  }

  /**
    Set the withdrawAmountControl with the user amount deposited
  **/
  maxUserUnstakeBalance() {
    this.withdrawAmountControl.setValue(this.userAmountDeposited ? formatEther(this.userAmountDeposited) : '0');
  }

  /**
   Validation function that verifies if the user has enough balance to stake
   @return ValidatorFn The validation function which receives an abstract form control and synchronously returns a map of
   validation errors if present
   **/
  validateStakeBalance(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      try {
        if (this.userZboofiBalance && EthereumUtils.isValidEtherFormat(control.value)) {
          const controlBalanceValue = parseEther(control.value);
          // If the Input has a balance higher than the user one, fail the validation.
          if (controlBalanceValue.gt(this.userZboofiBalance)) {
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
   Validation function that verifies if the user has enough balance to unstake
   @return ValidatorFn The validation function which receives an abstract form control and synchronously returns a map of
   validation errors if present
   **/
  validateUnstakeBalance(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      try {
        if (this.userAmountDeposited && EthereumUtils.isValidEtherFormat(control.value)) {
          const controlBalanceValue = parseEther(control.value);
          // If the Input has a balance higher than the user one, fail the validation.
          if (controlBalanceValue.gt(this.userAmountDeposited)) {
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
    newConfiguration.helpToggles.howToUseWellOfSouls = !newConfiguration.helpToggles.howToUseWellOfSouls;
    this.userConfigurationService.setUserConfiguration(newConfiguration);
  }

  /**
    Go to the rank page of current user in the Leaderboard table
  **/
  onGotoUserRankPage(): void {
    if(this.userRankPageNum > 0) {
      this.changeHarvestersPage(this.userRankPageNum);
    }
  } 

  /**
    Unsubscribe from any active subscriptions to avoid memory leaks
  **/
  ngOnDestroy(): void {
    this.onUserChanges();
    this.user$?.unsubscribe();
    this.userConfiguration$.unsubscribe();
    this.zBoofiStakingDetails$?.unsubscribe();
    this.accountService.unsubscribeFromLiveQueries();
    this.wellOfSoulsService.unsubscribeFromLiveQueries();
  }

}
