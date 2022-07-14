import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, from, Observable, of} from "rxjs";
import {Moralis} from "moralis";
import {environment} from "../../environments/environment";
import ZoombieBoofi from "../@artifacts/contracts/ZombieBOOFI.sol/ZombieBOOFI.json";
import {catchError, concatMap} from "rxjs/operators";
import {BigNumber, FixedNumber} from "ethers";
import {castAsBigNumberOrNull, concatNetworkVerification, retryForever} from "../@utils/rxjs-utils";
import {StakeExchangeRateHistory} from "../@models/stake-exchange-rate-history";
import {BoofiStakingDetails} from "../@models/boofi-staking-details";
import {parseEther} from "ethers/lib/utils";
import LiveQuerySubscription = Moralis.LiveQuerySubscription;

@Injectable({
  providedIn: 'root'
})
export class StakeService {
  private withdrawEventEmittedBehaviourSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private withdrawEventEmittedLiveQuerySubscription: LiveQuerySubscription | null;

  constructor() {
  }

  getExchangeRatesHistory(amountOfDays: number): Observable<StakeExchangeRateHistory[] | null> {
    return from(Moralis.Web3API.native.runContractFunction({
      address: environment.contractAddresses.zBoofi,
      function_name: 'getExchangeRateHistory',
      chain: environment.moralis.chain,
      // @ts-ignore
      abi: ZoombieBoofi.abi,
      params: {
        amountDays: amountOfDays,
      },
    })).pipe(
      retryForever(environment.failedRequestsRetryThreshold),
      catchError((error) => {
        console.log(error);
        return of(null);
      }),
      concatMap((response) => {
        if (response) {
          try {
            const responseValues = Object.values(response);
            const exchangeRates = responseValues[0];
            const timestamps = responseValues[1];
            const stakeExchangeRateHistory: StakeExchangeRateHistory[] = [];
            for (let i = 0; i < exchangeRates.length; i++) {
              stakeExchangeRateHistory.push({
                rate: FixedNumber.from(exchangeRates[i]),
                timestamp: FixedNumber.from(timestamps[i])
              })
            }
            return of(stakeExchangeRateHistory);
          } catch (error) {
            console.log('Failed to getExchangeRateHistory', error);
          }
        }
        return of(null);
      })
    );
  }

  getExpectedZboofiReceived(amount: BigNumber): Observable<BigNumber | null> {
    return from(Moralis.Web3API.native.runContractFunction({
      address: environment.contractAddresses.zBoofi,
      function_name: 'expectedZBOOFI',
      chain: environment.moralis.chain,
      // @ts-ignore
      abi: ZoombieBoofi.abi,
      params: {
        amountBoofi: amount
      }
    })).pipe(
      retryForever(environment.failedRequestsRetryThreshold),
      catchError((error => {
        console.log(error);
        return of(null);
      })),
      castAsBigNumberOrNull(),
    );
  }

  getExpectedBoofiReceived(amount: BigNumber): Observable<BigNumber | null> {
    return from(Moralis.Web3API.native.runContractFunction({
      address: environment.contractAddresses.zBoofi,
      function_name: 'expectedBOOFI',
      chain: environment.moralis.chain,
      // @ts-ignore
      abi: ZoombieBoofi.abi,
      params: {
        amountZBoofi: amount
      }
    })).pipe(
      retryForever(environment.failedRequestsRetryThreshold),
      catchError((error => {
        console.log(error);
        return of(null);
      })),
      castAsBigNumberOrNull(),
    );
  }

  getCurrentExchangeRate(): Observable<BigNumber | null> {
    return from(Moralis.Web3API.native.runContractFunction({
      address: environment.contractAddresses.zBoofi,
      function_name: 'currentExchangeRate',
      chain: environment.moralis.chain,
      // @ts-ignore
      abi: ZoombieBoofi.abi,
    })).pipe(
      retryForever(environment.failedRequestsRetryThreshold),
      catchError((error => {
        console.log(error);
        return of(null);
      })),
      castAsBigNumberOrNull(),
    );
  }

  deposit(amount: BigNumber) {
    return from(Moralis.enableWeb3()).pipe(
      concatNetworkVerification(),
      concatMap(() => {
        return from(Moralis.executeFunction({
          contractAddress: environment.contractAddresses.zBoofi,
          abi: ZoombieBoofi.abi,
          functionName: 'enter',
          params: {
            _amount: amount,
          },
        }));
      })
    );
  }

  withdraw(amount: BigNumber) {
    return from(Moralis.enableWeb3()).pipe(
      concatNetworkVerification(),
      concatMap(() => {
        return from(Moralis.executeFunction({
          contractAddress: environment.contractAddresses.zBoofi,
          abi: ZoombieBoofi.abi,
          functionName: 'leave',
          params: {
            _share: amount,
          },
        }));
      })
    );
  }

  getBoofiStakingDetails(): Observable<BoofiStakingDetails> {
    return combineLatest([
      this.getCurrentExchangeRate(),
      this.getExchangeRatesHistory(3)
    ]).pipe(concatMap(([currentExchangeRate, exchangeRatesHistory]) => {
      let boofiToZBoofiExchangeRate;
      let apy;
      let apr;
      // If we have the currentExchangeRate available, calculate the boofiToZBoofiExchangeRate
      if (currentExchangeRate) {
        try {
          // Using a Rule of Three
          boofiToZBoofiExchangeRate = BigNumber.from(FixedNumber.from(parseEther('1'))
            .divUnsafe(FixedNumber.from(currentExchangeRate)));
        } catch (e) {
          console.log('Failed to calculate Exchange rates');
        }
      }
      // If we have the exchangeRateHistory available along the currentExchangeRate calculate the APR and APY.
      if (exchangeRatesHistory && currentExchangeRate) {
        const firstExchangeRate = exchangeRatesHistory[0];
        let lastExchangeRate: StakeExchangeRateHistory;
        // If the firstExchangeRate and the lastExchangeRate are the same, we'll use the currentExchangeRate as a fallback
        // along the current timestamp measured in seconds.
        if (firstExchangeRate.rate._hex == exchangeRatesHistory[exchangeRatesHistory.length - 1].rate._hex) {
          lastExchangeRate = {
            rate: FixedNumber.from(currentExchangeRate),
            timestamp: FixedNumber.from(Math.floor((new Date().getTime() / 1000))),
          }
        } else {
          lastExchangeRate = exchangeRatesHistory[exchangeRatesHistory.length - 1]
        }
        /*
          AverageDailyMultiplier = [(exchange rate at end of period) / (exchange rate at start of period) - 1] / (length of period in days) + 1
         */
        try {
          /*
            [(exchange rate at end of period) / (exchange rate at start of period) - 1]
          */
          let multiplierOfTrailingDays = lastExchangeRate.rate.divUnsafe(firstExchangeRate.rate).subUnsafe(FixedNumber.from(1));
          /*
            (length of period in days)
           */
          let lengthOfPeriod = lastExchangeRate.timestamp.subUnsafe(firstExchangeRate.timestamp).divUnsafe(FixedNumber.from(86400));
          if (lengthOfPeriod.isZero()) {
            lengthOfPeriod = FixedNumber.from(Math.floor((new Date().getTime() / 1000))).subUnsafe(firstExchangeRate.timestamp).divUnsafe(FixedNumber.from(86400));
          }
          const averageDailyMultiplier = multiplierOfTrailingDays.divUnsafe(lengthOfPeriod);
          apr = averageDailyMultiplier.mulUnsafe(FixedNumber.from(365)).toUnsafeFloat();
          /*
            APY = [1 + (APR / Number of Periods)]^(Number of Periods) - 1
            Considering Daily compounding
           */
          apy = apr > 0 ? ((Math.pow((1 + (apr / 365)), 365)) - 1) : 0;
        } catch (e) {
          console.log('Failed to Calculate APR and APY', e);
        }
      }
      return of<BoofiStakingDetails>({
        zBoofiToBoofiExchangeRate: currentExchangeRate,
        boofiToZBoofiExchangeRate: boofiToZBoofiExchangeRate,
        apy: apy,
        apr: apr
      });
    }));
  }

  onWithdrawalEventEmitted() {
    const query = new Moralis.Query(environment.moralis.tables.stakeWithdraw);
    return from(query.subscribe()).pipe(
      concatMap((liveQuery: LiveQuerySubscription) => {
        // Unsubscribe from previous live query if we had one active
        this.withdrawEventEmittedLiveQuerySubscription?.unsubscribe();
        // Save the current live query
        this.withdrawEventEmittedLiveQuerySubscription = liveQuery;
        // Listen to Create events
        liveQuery.on('create', (response) => {
          this.withdrawEventEmittedBehaviourSubject.next(response);
        });
        return this.withdrawEventEmittedBehaviourSubject.asObservable();
      })
    );
  }

  getWithdrawalFee(): Observable<number | null | undefined> {
    return from(Moralis.Web3API.native.runContractFunction({
      address: environment.contractAddresses.zBoofi,
      function_name: 'withdrawalFee',
      chain: environment.moralis.chain,
      // @ts-ignore
      abi: ZoombieBoofi.abi,
    })).pipe(
      retryForever(environment.failedRequestsRetryThreshold),
      catchError((error => {
        console.log(error);
        return of(null);
      })),
      castAsBigNumberOrNull(),
      concatMap((withdrawalFee) => {
        try {
          if (withdrawalFee) {
            return of(withdrawalFee.toNumber() / 10000);
          }
        } catch (error) {
          console.log('Failed to calculate withdrawal fee');
        }
        return of(null);
      })
    );
  }

  unsubscribeFromLiveQueries() {
    this.withdrawEventEmittedLiveQuerySubscription?.unsubscribe();
  }
}
