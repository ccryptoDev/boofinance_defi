import {Injectable} from '@angular/core';
import {BigNumber, FixedNumber} from "ethers";
import {BehaviorSubject, combineLatest, from, Observable, ObservableInput, of} from "rxjs";
import {Moralis} from "moralis";
import {catchError, concatMap} from "rxjs/operators";
import {environment} from "../../environments/environment";
import zBoofiStaking from "../@artifacts/contracts/zBOOFI_Staking.sol/zBOOFI_Staking.json";
import {castAsBigNumberOrNull, concatNetworkVerification, retryForever} from "../@utils/rxjs-utils";
import {ZboofiStakingDetails} from "../@models/zboofi-staking-details";
import {Paginated} from "../@models/paginated";
import {WellOfSoulsHarvester} from "../@models/well-of-souls-harvester";
import {BoofiPerShareHistory} from "../@models/boofi-per-share-history";
import {StakeService} from "./stake.service";
import {parseEther} from "ethers/lib/utils";
import LiveQuerySubscription = Moralis.LiveQuerySubscription;

@Injectable({
  providedIn: 'root'
})
export class WellOfSoulsService {
  private harvestEventEmittedBehaviourSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private harvestEventEmittedLiveQuerySubscription: LiveQuerySubscription | null;

  constructor(
    private stakeService: StakeService
  ) {}

  deposit(amount: BigNumber) {
    return from(Moralis.enableWeb3()).pipe(
      concatNetworkVerification(),
      concatMap(() => {
        return from(Moralis.executeFunction({
          contractAddress: environment.contractAddresses.zBoofiStaking,
          abi: zBoofiStaking.abi,
          functionName: 'deposit',
          params: {
            amount: amount,
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
          contractAddress: environment.contractAddresses.zBoofiStaking,
          abi: zBoofiStaking.abi,
          functionName: 'withdraw',
          params: {
            amount: amount,
          },
        }));
      })
    );
  }

  harvest() {
    return from(Moralis.enableWeb3()).pipe(
      concatNetworkVerification(),
      concatMap(() => {
        return from(Moralis.executeFunction({
          contractAddress: environment.contractAddresses.zBoofiStaking,
          abi: zBoofiStaking.abi,
          functionName: 'harvest',
        }));
      })
    );
  }

  getUserAmountDeposited(userAddress: string): Observable<BigNumber | null> {
    return from(Moralis.Web3API.native.runContractFunction({
      address: environment.contractAddresses.zBoofiStaking,
      function_name: 'shares',
      chain: environment.moralis.chain,
      // @ts-ignore
      abi: zBoofiStaking.abi,
      params: {
        "": userAddress
      }
    })).pipe(
      catchError((error => {
        console.log(error);
        return of(null);
      })),
      castAsBigNumberOrNull(),
    );
  }

  getHarvester(userAddress: string): Observable<WellOfSoulsHarvester> {
    return from(Moralis.Cloud.run('getHarvester', {userAddress: userAddress})).pipe(concatMap((response) => {
      return of<WellOfSoulsHarvester>({
        rank: response.rank,
        totalHarvestPoints: response.totalHarvestPoints,
        totalHarvested: BigNumber.from(response.totalHarvested),
        shares: BigNumber.from(response.shares),
        userAddress: response.userAddress,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      });
    }));
  }

  getPaginatedHarvesters(page: number = 1): Observable<Paginated<WellOfSoulsHarvester> | null> {
    return from(Moralis.Cloud.run('getPaginatedHarvesters', {page: page})).pipe(
      concatMap((response => {
        if (response?.results && response?.count) {
          const pageSize = 12;
          const paginatedData = new Paginated<WellOfSoulsHarvester>();
          if (response.results.length > 0) {
            response.results.forEach((result: any, index: number) => {
              paginatedData.results.push({
                rank: index + ((page - 1) * pageSize) + 1,
                totalHarvested: BigNumber.from(result.totalHarvested),
                userAddress: result.userAddress,
                totalHarvestPoints: result.totalHarvestPoints,
                shares: BigNumber.from(result.shares),
                updatedAt: result.updatedAt,
                createdAt: result.createdAt,
                user: result.user ? {
                  address: result.user.address,
                  avatar: result.user.avatar,
                  avatarBackgroundColor: result.user.avatarBackgroundColor,
                  nickname: result.user.nickname,
                  createdAt: result.user.createdAt,
                  updatedAt: result.user.updatedAt,
                } : null,
              });
            });
          }
          paginatedData.count = response.count;
          return of(paginatedData);
        }
        return of(null);
      }))
    );
  }

  getUserPendingRewards(userAddress: string): Observable<BigNumber | null> {
    return from(Moralis.Web3API.native.runContractFunction({
      address: environment.contractAddresses.zBoofiStaking,
      function_name: 'pendingBOOFI',
      chain: environment.moralis.chain,
      // @ts-ignore
      abi: zBoofiStaking.abi,
      params: {
        "user": userAddress
      }
    })).pipe(
      catchError((error => {
        console.log(error);
        return of(null);
      })),
      castAsBigNumberOrNull(),
    );
  }

  getZboofiStakingDetails(): Observable<ZboofiStakingDetails | null> {
    return combineLatest([
      this.getCurrentBoofiPerShareHistory(),
      this.getBoofiPerSharesHistory(7),
      this.stakeService.getExchangeRatesHistory(7),
    ]).pipe(concatMap(([currentBoofiPerHistoryShare,boofiPerSharesHistory, exchangeRatesHistory ]) => {
      console.log('boofiPerSharesHistory', boofiPerSharesHistory);
      if (currentBoofiPerHistoryShare && boofiPerSharesHistory && exchangeRatesHistory) {
        try {
          const firstBoofiPerShareHistory: BoofiPerShareHistory = boofiPerSharesHistory[0];
          let lastBoofiPerShareHistory;
          // If the firstBoofiPerShareHistory and lastBoofiPerShareHistory are equal, we'll use the currentBoofiPerShare
          if (firstBoofiPerShareHistory.boofiPerShare._hex == boofiPerSharesHistory[boofiPerSharesHistory.length - 1].boofiPerShare._hex) {
            lastBoofiPerShareHistory = currentBoofiPerHistoryShare;
          } else {
            lastBoofiPerShareHistory = boofiPerSharesHistory[boofiPerSharesHistory.length - 1];
          }
          /*
              (length of period in days)
          */
          let lengthOfPeriod = lastBoofiPerShareHistory.timestamp.subUnsafe(firstBoofiPerShareHistory.timestamp).divUnsafe(FixedNumber.from(86400));
          console.log('lengthOfPeriod', lengthOfPeriod);
          console.log('lastBoofiPerShareHistory', lastBoofiPerShareHistory);
          console.log('firstBoofiPerShareHistory', firstBoofiPerShareHistory);
          // If the last boofiPerShare isn't zero
          if (!lastBoofiPerShareHistory.boofiPerShare.isZero()) {
            const averageBoofiPerDayPerStakedZBoofi = lastBoofiPerShareHistory.boofiPerShare.subUnsafe(firstBoofiPerShareHistory.boofiPerShare)
              .divUnsafe(lengthOfPeriod.mulUnsafe(FixedNumber.from(parseEther('1'))));
            const firstExchangeRateHistory = exchangeRatesHistory[0];

            const averageBoofiPerDayPerStakedBoofi = averageBoofiPerDayPerStakedZBoofi.mulUnsafe(FixedNumber.from(parseEther('1')))
              .divUnsafe(firstExchangeRateHistory.rate);

            const apr = averageBoofiPerDayPerStakedBoofi.toUnsafeFloat() * 365;
            const apy = apr > 0 ? ((Math.pow((1 + (apr / 365)), 365)) - 1) : 0;
            return of<ZboofiStakingDetails>({
              apr: apr,
              apy: apy,
            });
          } else {
            return of<ZboofiStakingDetails>({
              apr: 0,
              apy: 0,
            });
          }
        } catch (error) {
          console.log('Failed to calculate zBoofi Staking details', error);
        }
      }
      return of(null);
    }));
  }

  getCurrentBoofiPerShareHistory(): Observable<BoofiPerShareHistory | null> {
    return from<ObservableInput<any>>(Moralis.Web3API.native.runContractFunction({
      address: environment.contractAddresses.zBoofiStaking,
      function_name: 'boofiPerShare',
      chain: environment.moralis.chain,
      // @ts-ignore
      abi: zBoofiStaking.abi,
    })).pipe(
      retryForever(environment.failedRequestsRetryThreshold),
      catchError((error => {
        console.log(error);
        return of(null);
      })),
      concatMap((boofiPerShare) => {
        return boofiPerShare ? of<BoofiPerShareHistory>({
          boofiPerShare: FixedNumber.from(boofiPerShare),
          timestamp: FixedNumber.from(Math.floor((new Date().getTime() / 1000)))
        }) : of(null);
      })
    );
  }

  getBoofiPerSharesHistory(amountDays: number | BigNumber): Observable<BoofiPerShareHistory[] | null> {
    return from<ObservableInput<any>>(Moralis.Web3API.native.runContractFunction({
      address: environment.contractAddresses.zBoofiStaking,
      function_name: 'getBoofiPerShareHistory',
      chain: environment.moralis.chain,
      // @ts-ignore
      abi: zBoofiStaking.abi,
      params: {
        "amountDays": amountDays
      }
    })).pipe(
      retryForever(environment.failedRequestsRetryThreshold),
      catchError((error => {
        console.log(error);
        return of([null, null]);
      })),
      concatMap((response) => {
        console.log('response boofiPerSharesHistory', response);
        const responseValues = Object.values(response);
        const boofiPerShares: any = responseValues[0];
        const timestamps: any = responseValues[1];
        if (boofiPerShares && timestamps) {
          const boofiPerSharesHistory: BoofiPerShareHistory[] = [];
          for (let i= 0; i < boofiPerShares.length; i++) {
            boofiPerSharesHistory.push({
              boofiPerShare: FixedNumber.from(boofiPerShares[i]),
              timestamp: FixedNumber.from(timestamps[i])
            });
          }
          return of(boofiPerSharesHistory);
        }
        return of(null);
      })
    );
  }

  onWellOfSoulsContributorEventEmitted(): Observable<any> {
    const query = new Moralis.Query(environment.moralis.tables.wellOfSoulsContributor);
    return from(query.subscribe()).pipe(
      concatMap((liveQuery: LiveQuerySubscription) => {
        // Unsubscribe from previous live query if we had one active
        this.harvestEventEmittedLiveQuerySubscription?.unsubscribe();
        // Save the current live query
        this.harvestEventEmittedLiveQuerySubscription = liveQuery;
        liveQuery.on('open', () => {
          console.log('onHarvestEventEmitted');
          this.harvestEventEmittedBehaviourSubject.next({});
        });
        liveQuery.on('create', (response) => {
          console.log('onHarvestEventEmitted');
          this.harvestEventEmittedBehaviourSubject.next(response);
        });
        liveQuery.on('update', (response) => {
          console.log('onHarvestEventEmitted');
          this.harvestEventEmittedBehaviourSubject.next(response);
        });
        liveQuery.on('enter', (response) => {
          console.log('onHarvestEventEmitted');
          this.harvestEventEmittedBehaviourSubject.next(response);
        });
        return this.harvestEventEmittedBehaviourSubject.asObservable();
      }),
    );
  }

  unsubscribeFromLiveQueries() {
    this.harvestEventEmittedLiveQuerySubscription?.unsubscribe();
  }

}
