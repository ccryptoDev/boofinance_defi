import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {BigNumber} from "ethers";
import {StakingMode} from "../../@enums/staking-mode";
import {fadeInOnEnterAnimation} from "angular-animations";
import {NbToastrService} from "@nebular/theme";
import {AuthenticationService} from "../../@services/authentication.service";
import {AccountService} from "../../@services/account.service";
import {concatMap, debounceTime, distinctUntilChanged, filter, first, tap, throttleTime} from "rxjs/operators";
import {combineLatest, of, Subscription, timer} from "rxjs";
import {User} from "../../@models/user";
import {environment} from "../../../environments/environment";
import {StakeService} from "../../@services/stake.service";
import {BoofiStakingDetails} from "../../@models/boofi-staking-details";
import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {EtherFormatValidator} from "../../@validators/ether-format-validator";
import {formatEther, parseEther} from "ethers/lib/utils";
import {ErrorHandler} from "../../@utils/error-handler";
import {ToastrConfig} from "../../@configurations/toastr-config";
import {EthereumUtils} from "../../@utils/ethereum-utils";
import {castWithParseEther, retryWithDelay} from "../../@utils/rxjs-utils";
import {UserConfiguration} from "../../@models/user-configuration";
import {UserConfigurationService} from "../../@services/user-configuration.service";

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss'],
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
export class StakeComponent implements OnInit, OnDestroy {
  @HostBinding('@enter')
  // Constants
  readonly minimumAllowanceToRequestApproval = environment.minimumAllowanceToRequestApproval;
  // Subscriptions
  userTokenBalances$: Subscription;
  user$: Subscription;
  userConfiguration$: Subscription;
  boofiStakingDetails$: Subscription;
  userBoofiAllowance$: Subscription;
  onDepositAmountControlChanges$: Subscription;
  onWithdrawAmountControlChanges$: Subscription;
  withdrawalFee$: Subscription;
  // Subscription variables (Variables that are fetched by Subscribing to Observables)
  user: User | null;
  userConfiguration: UserConfiguration;
  boofiStakingDetails: BoofiStakingDetails | null;
  userBoofiAllowance: BigNumber | null;
  userBoofiBalance: BigNumber | undefined | null = null;
  userZboofiBalance: BigNumber | undefined | null = null;
  expectedZboofiReceived: BigNumber | null = null;
  expectedBoofiReceived: BigNumber | null = null;
  withdrawalFee: number | null | undefined = null;
  // Loading booleans
  loadingBoofiAllowance: boolean = false;
  loadingDepositTransaction: boolean = false;
  loadingWithdrawTransaction: boolean = false;
  loadingApproveAllowanceTransaction: boolean = false;
  // Failed request booleans
  failedLoadingBoofiAllowance: boolean = false;
  // Inputs
  depositAmountControl: FormControl = new FormControl(null, [
    EtherFormatValidator(false, false),
    this.validateStakeBalance()
  ]);
  withdrawAmountControl: FormControl = new FormControl(null, [
    EtherFormatValidator(false, false),
    this.validateUnstakeBalance(),
  ]);
  // Menu variables
  StakingModeEnum = StakingMode;
  stakingMode = StakingMode.Deposit;

  constructor(
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private stakeService: StakeService,
    private toastrService: NbToastrService,
    private userConfigurationService: UserConfigurationService
  ) { }

  ngOnInit(): void {
    // Retrieve the connected user
    this.user$ = this.authenticationService.getConnectedUser().subscribe(user => {
      this.onUserChanges();
      this.user = user;
      if (user) {
        this.depositAmountControl.enable();
        this.withdrawAmountControl.enable();
        this.getUserBoofiAllowance();
        this.getUserTokenBalances();
      }
    });
    this.getBoofiStakingDetails();
    this.getExpectedZboofiReceived();
    this.getExpectedBoofiReceived();
    this.getWithdrawalFee();

    this.userConfiguration$ = this.userConfigurationService.getUserConfiguration().subscribe(configuration => {
      this.userConfiguration = configuration;
    });
  }

  /**
    Subscribes to the current withdrawal fee refreshing it self every time a Leave event
    is triggered within the ZombieBOOFI Smart Contract and throttled by 2 seconds.
  **/
  getWithdrawalFee() {
    this.withdrawalFee$?.unsubscribe();
    this.withdrawalFee$ = this.stakeService.onWithdrawalEventEmitted().pipe(
      throttleTime(2000),
      concatMap(() => {
        return this.stakeService.getWithdrawalFee()
      })
    ).subscribe(withdrawalFee => {
      console.log('withdrawalFeeUpdated', withdrawalFee);
      this.withdrawalFee = withdrawalFee;
    }, error => {
      console.log('Failed to load withdrawal fees', error);
    });
  }

  /**
    Subscribes to changes on the depositAmountControl debouncing and filtering them for validity,
    afterwards it requests the expected zBOOFI Received for such amount refreshing it
    if the user writes on the deposit control or every 5 seconds, debouncing these triggers by 500ms
  **/
  getExpectedZboofiReceived() {
    this.onDepositAmountControlChanges$?.unsubscribe();
    this.onDepositAmountControlChanges$ = combineLatest([
        this.depositAmountControl.valueChanges.pipe(
          distinctUntilChanged(),
          tap(() => this.expectedZboofiReceived = null),
        ),
        timer(0, 5000),
      ]).pipe(
        filter(() => this.depositAmountControl.valid),
        debounceTime(500),
        concatMap(([depositAmount, timer]: [string, number]) => {
          return of(depositAmount).pipe(castWithParseEther());
        }),
        filter((value) => value != null),
        concatMap((value) => {
          return this.stakeService.getExpectedZboofiReceived(value!);
        })
      ).subscribe((expectedZboofiReceived) => {
      console.log('expectedZboofiReceived', expectedZboofiReceived);
      this.expectedZboofiReceived = expectedZboofiReceived;
    });
  }

  /**
    Subscribes to changes on the withdrawAmountControl debouncing and filtering them for validity,
    afterwards it requests the expected BOOFI Received for such amount refreshing it
    if the user writes on the withdraw control or every 5 seconds, debouncing these triggers by 500ms
  **/
  getExpectedBoofiReceived() {
    this.onWithdrawAmountControlChanges$?.unsubscribe();
    this.onWithdrawAmountControlChanges$ = combineLatest([
      this.withdrawAmountControl.valueChanges.pipe(
        distinctUntilChanged(),
        tap(() => this.expectedBoofiReceived = null),
      ),
      timer(0, 5000),
    ]).pipe(
      filter(() => this.withdrawAmountControl.valid),
      debounceTime(500),
      concatMap(([withdrawAmount, timer]: [string, number]) => {
        return of(withdrawAmount).pipe(castWithParseEther());
      }),
      filter((value) => value != null),
      concatMap((value) => {
        return this.stakeService.getExpectedBoofiReceived(value!)
      })
    ).subscribe((expectedBoofiReceived) => {
      console.log('expectedBoofiReceived', expectedBoofiReceived);
      this.expectedBoofiReceived = expectedBoofiReceived;
    });
  }

  /**
    Subscribes to BOOFI staking details like the current exchange rate, 7 days exchange rates, APY and APR
    refreshing them on an Interval of 120 seconds
  **/
  getBoofiStakingDetails() {
    this.boofiStakingDetails$?.unsubscribe();
    this.boofiStakingDetails$ = timer(0, 120000).pipe(
      concatMap(() => {
        return this.stakeService.getBoofiStakingDetails();
      })
    ).subscribe(boofiStakingDetails => {
      this.boofiStakingDetails = boofiStakingDetails;
    });
  }

  /**
    Subscribes to the connected User BOOFI Allowance only once.
  **/
  getUserBoofiAllowance() {
    this.userBoofiAllowance$?.unsubscribe();
    this.loadingBoofiAllowance = true;
    this.failedLoadingBoofiAllowance = false;
    this.userBoofiAllowance$ = this.accountService.getUserTokenAllowance(
      environment.contractAddresses.boofi,
      environment.contractAddresses.zBoofi,
      this.user?.address
    ).pipe(
      // If the request fails, we'll try to make it again up to 6 times every 5s.
      retryWithDelay(5000, 6),
    ).subscribe(boofiAllowance => {
      console.log('boofiAllowance', boofiAllowance);
      this.userBoofiAllowance = boofiAllowance;
      this.loadingBoofiAllowance = false;
    }, error => {
      console.log(error);
      this.failedLoadingBoofiAllowance = true;
      this.loadingBoofiAllowance = false;
    });
  }

  /**
    Subscribes to the connected User BOOFI and zBOOFI Balances
    refreshing them on every transaction he/she makes
  **/
  getUserTokenBalances() {
    this.userTokenBalances$?.unsubscribe();
    if (this.user) {
      this.userTokenBalances$ = this.accountService.onUserExecutesTransaction(this.user!.address).pipe(
        concatMap(() => {
          return combineLatest([
            this.accountService.getUserTokenBalance(environment.contractAddresses.boofi, this.user?.address),
            this.accountService.getUserTokenBalance(environment.contractAddresses.zBoofi, this.user?.address)
          ]);
        })
      ).subscribe(([boofiBalance, zBoofiBalance]) => {
        this.userBoofiBalance = boofiBalance;
        this.userZboofiBalance = zBoofiBalance;
        this.depositAmountControl.updateValueAndValidity();
        this.withdrawAmountControl.updateValueAndValidity();
      }, error => {
        console.log('failed to load user tokens', error);
      });
    }
  }

  /**
    Performs a deposit transaction with the connected user giving BOOFI for zBOOFI
  **/
  deposit(): void {
    if (this.user && this.depositAmountControl.valid) {
      const amount = parseEther(this.depositAmountControl.value);
      this.loadingDepositTransaction = true;
      this.depositAmountControl.disable();
      this.stakeService.deposit(amount).pipe(first()).subscribe(receipt => {
        this.loadingDepositTransaction = false;
        this.depositAmountControl.reset();
        this.depositAmountControl.enable();
        const message = `Successfully staked ${formatEther(amount)} BOOFI`;
        this.toastrService.show(message, 'Success', ToastrConfig.Success);
      }, error => {
        console.log(error);
        this.loadingDepositTransaction = false;
        this.depositAmountControl.enable();
        this.getUserTokenBalances();
        this.toastrService.show(ErrorHandler.getMessage(error), 'Error', ToastrConfig.Warning);
      });
    }
  }

  /**
    Performs a withdraw transaction with the connected user giving zBOOFI for BOOFI
  **/
  withdraw(): void {
    if (this.user && this.withdrawAmountControl.valid) {
      const amount = parseEther(this.withdrawAmountControl.value);
      this.loadingWithdrawTransaction = true;
      this.withdrawAmountControl.disable();
      this.stakeService.withdraw(amount).pipe(first()).subscribe(receipt => {
        this.loadingWithdrawTransaction = false;
        this.withdrawAmountControl.reset();
        this.withdrawAmountControl.enable();
        const message = `Successfully unstaked ${formatEther(amount)} zBOOFI`;
        this.toastrService.show(message, 'Success', ToastrConfig.Success);
      }, error => {
        console.log(error);
        this.loadingWithdrawTransaction = false;
        this.withdrawAmountControl.enable();
        this.getUserTokenBalances();
        this.toastrService.show(ErrorHandler.getMessage(error), 'Error', ToastrConfig.Warning);
      });
    }
  }

  /**
    Performs an approve BOOFI allowance transaction with the connected user
  **/
  approveBoofiAllowance() {
    if (this.user?.address) {
      this.loadingApproveAllowanceTransaction = true;
      this.accountService.setUserTokenAllowance(
        environment.contractAddresses.boofi,
        environment.contractAddresses.zBoofi,
        EthereumUtils.MaximumBigNumber
      ).pipe(first()).subscribe(receipt => {
        // If the transaction succeeded we'll assume the user has an allowance of a maximum uint256
        this.userBoofiAllowance = EthereumUtils.MaximumBigNumber;
        this.loadingApproveAllowanceTransaction = false;
        this.toastrService.show('Successfully updated your allowances', 'Success', ToastrConfig.Success);
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
    this.userBoofiAllowance$?.unsubscribe();
    this.userTokenBalances$?.unsubscribe();
    this.userBoofiBalance = null;
    this.userZboofiBalance = null;
    this.userBoofiAllowance = null;
    this.depositAmountControl.disable();
    this.withdrawAmountControl.disable();
    this.depositAmountControl.reset();
    this.withdrawAmountControl.reset();
    this.expectedZboofiReceived = null;
    this.expectedBoofiReceived = null;
  }

  /**
    Returns the text color css class that the dynamic withdrawal fee must use.
  **/
  get dynamicWithdrawalFeeClass(): string {
    if (this.withdrawalFee) {
      if (this.withdrawalFee < 0.05) {
        return 'text-warning';
      }
      if (this.withdrawalFee <= 0.099) {
        return 'text-bronze';
      }
    }
    return 'text-light-red';
  }

  /**
    Set the depositAmountControl with the user maximum balance
  **/
  maxUserStakeBalance() {
    this.depositAmountControl.setValue(this.userBoofiBalance ? formatEther(this.userBoofiBalance) : '0');
  }

  /**
    Set the withdrawAmountControl with the user maximum balance
  **/
  maxUserUnstakeBalance() {
    this.withdrawAmountControl.setValue(this.userZboofiBalance ? formatEther(this.userZboofiBalance) : '0');
  }

  /**
    Validation function that verifies if the user has enough balance to stake
    @return ValidatorFn The validation function which receives an abstract form control and synchronously returns a map of
    validation errors if present
  **/
  validateStakeBalance(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      try {
        if (this.userBoofiBalance && EthereumUtils.isValidEtherFormat(control.value)) {
          const controlBalanceValue = parseEther(control.value);
          // If the Input has a balance higher than the user one, fail the validation.
          if (controlBalanceValue.gt(this.userBoofiBalance)) {
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
   Toggle the Information card help and save his status on the user configuration
   **/
  onHelpToggled(): void {
    const newConfiguration = this.userConfiguration;
    newConfiguration.helpToggles.howToStakeBoofi = !newConfiguration.helpToggles.howToStakeBoofi;
    this.userConfigurationService.setUserConfiguration(newConfiguration);
  }

  /**
    Unsubscribe from any active subscriptions to avoid memory leaks
  **/
  ngOnDestroy(): void {
    this.onUserChanges();
    this.user$?.unsubscribe();
    this.boofiStakingDetails$?.unsubscribe();
    this.onDepositAmountControlChanges$?.unsubscribe();
    this.onWithdrawAmountControlChanges$?.unsubscribe();
    this.withdrawalFee$?.unsubscribe();
    this.userConfiguration$.unsubscribe();
    this.stakeService.unsubscribeFromLiveQueries();
    this.accountService.unsubscribeFromLiveQueries();
  }

}
