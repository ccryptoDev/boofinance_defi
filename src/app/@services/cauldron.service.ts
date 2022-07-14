import {Injectable} from '@angular/core';
import {BigNumber, FixedNumber} from "ethers";
import {BehaviorSubject, combineLatest, from, Observable, ObservableInput, of} from "rxjs";
import {Moralis} from "moralis";
import {catchError, concatMap, filter} from "rxjs/operators";
import HauntedHouseSol from "../@artifacts/contracts/HauntedHouse.sol/HauntedHouse.json";
import HauntedHouseAvaxDepositHelper from "../@artifacts/contracts/BoofiAvaxDepositHelper.sol/BoofiAvaxDepositHelper.json";
import HauntedHouseHarvestHelper from "../@artifacts/contracts/HauntedHouseHarvestHelper.sol/HauntedHouseHarvestHelper.json";
import {environment} from "../../environments/environment";
import {CauldronTokenDetails} from "../@models/cauldron-token-details";
import {CauldronUserTokenInfo} from "../@models/cauldron-user-token-info";
import {CauldronComposition} from "../@models/cauldron-composition";
import {TokenPriceService} from "./token-price.service";
import {concatNetworkVerification, retryForever} from "../@utils/rxjs-utils";
import {EthereumUtils} from "../@utils/ethereum-utils";
import {AvaxToken, WavaxToken} from "../../environments/configurations/production-tokens-environment";
import {Token} from "../@models/token";
import {CauldronTokenInfo} from "../@models/cauldron-token-info";
import {aprToApy} from "../@utils/number-utils";
import LiveQuerySubscription = Moralis.LiveQuerySubscription;
import executeFunctionOptions = Moralis.ExecuteFunctionOptions;
import {CauldronUserTokenDetails} from "../@models/cauldron-user-token-details";
import {CauldronUserZboofiReward} from "../@models/cauldron-user-zboofi-reward";
import {CauldronUserOverallZboofiRewards} from "../@models/cauldron-user-overall-zboofi-rewards";

@Injectable({
  providedIn: 'root'
})
export class CauldronService {
  constructor(
    private tokenPriceService: TokenPriceService
  ) {}
  private depositEventEmittedBehaviourSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private depositEventEmittedLiveQuerySubscription: LiveQuerySubscription | null;
  private withdrawEventEmittedBehaviourSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private withdrawEventEmittedLiveQuerySubscription: LiveQuerySubscription | null;

  deposit(tokenAddress: string, amount: BigNumber, userAddress: string) {
    const sendOptions: executeFunctionOptions = {
      contractAddress: environment.contractAddresses.hauntedHouse,
      abi: HauntedHouseSol.abi,
      functionName: 'deposit(address,uint256,address)',
      params: {
        token: tokenAddress,
        amount: amount,
        to: userAddress
      }
    };
    return from(Moralis.enableWeb3()).pipe(
      concatNetworkVerification(),
      concatMap(() => {
        return from<ObservableInput<any>>(Moralis.executeFunction(sendOptions));
      })
    );
  }

  depositAvax(amount: BigNumber) {
    return from(Moralis.enableWeb3()).pipe(
      concatNetworkVerification(),
      concatMap(() => {
        return from<ObservableInput<any>>(Moralis.executeFunction({
          contractAddress: environment.contractAddresses.hauntedHouseAvaxDepositHelper,
          abi: HauntedHouseAvaxDepositHelper.abi,
          functionName: 'deposit',
          msgValue: amount.toString()
        }));
      })
    );
  }

  withdraw(tokenAddress: string, amount: BigNumber, userAddress: string) {
    return from(Moralis.enableWeb3()).pipe(
      concatNetworkVerification(),
      concatMap(() => {
        return from<ObservableInput<any>>(Moralis.executeFunction({
          contractAddress: environment.contractAddresses.hauntedHouse,
          abi: HauntedHouseSol.abi,
          functionName: 'withdraw',
          params: {
            token: tokenAddress,
            amountShares: amount,
            to: userAddress
          },
        }));
      })
    );
  }

  withdrawAndHarvest(tokenAddress: string, amount: BigNumber, userAddress: string) {
    tokenAddress = tokenAddress == AvaxToken.address ? WavaxToken.address : tokenAddress;
    return from(Moralis.enableWeb3()).pipe(
      concatNetworkVerification(),
      concatMap(() => {
        return from<ObservableInput<any>>(Moralis.executeFunction({
          contractAddress: environment.contractAddresses.hauntedHouse,
          abi: HauntedHouseSol.abi,
          functionName: 'withdrawAndHarvest',
          params: {
            token: tokenAddress,
            amountShares: amount,
            to: userAddress
          },
        }));
      })
    );
  }

  getCauldronTokenDetailsFromOracle(tokenAddress: string): Observable<CauldronTokenDetails | null> {
    return from(Moralis.Cloud.run('getCauldronTokenDetails', {tokenAddress: tokenAddress.toLowerCase()})).pipe(
      concatMap(response  => {
        return of({
          tokenAddress: response.tokenAddress,
          liquidity: BigNumber.from(response.liquidity),
          liquidityInUsd: response.liquidityInUsd,
          volume: BigNumber.from(response.volume),
          storedPrice: BigNumber.from(response.storedPrice),
          apr: response.apr,
          apy: response.apy,
        });
      })
    );
  }

  getCauldronUserTokensDetails(userAddress: string): Observable<Map<string, CauldronUserTokenDetails>> {
    return from(Moralis.Cloud.run('getCauldronUserTokensDetails', {userAddress: userAddress.toLowerCase()})).pipe(
      concatMap(((userTokensDetails: any[])  => {
        const userTokensDetailsMap = new Map<string, CauldronUserTokenDetails>();
        if (userTokensDetails && userTokensDetails.length > 0) {
          userTokensDetails.forEach(userTokenDetail => {
            userTokensDetailsMap.set(userTokenDetail.tokenAddress.toLowerCase(), {
              hasLiquidity: userTokenDetail.hasLiquidity,
              userLiquidity: BigNumber.from(userTokenDetail.userLiquidity),
              tokenAddress: userTokenDetail.tokenAddress.toLowerCase(),
              userAddress: userTokenDetail.userAddress.toLowerCase()
            });
          });
        }
        return of(userTokensDetailsMap);
      }))
    );
  }

  getCauldronTokenDetails(token: Token): Observable<CauldronTokenDetails | null> {
    const tokenAddress = token.address == AvaxToken.address ? WavaxToken.address : token.address;
    return combineLatest([
      // Fetch Haunted House token Info
      this.getTokenInfo(tokenAddress),
      // Fetch token price
      this.tokenPriceService.getTokenPriceInUsd(token),
      // Fetch Cauldron token details from the Oracle
      this.getCauldronTokenDetailsFromOracle(tokenAddress),
    ]).pipe(
      concatMap(([tokenInfo, tokenPrice, oracleCauldronTokenDetails]) => {
        let contractLiquidity = tokenInfo?.totalTokens;
        let volume = oracleCauldronTokenDetails?.volume;
        let differenceBetweenLiquidity: BigNumber;
        /*
         We'll use the latest Volume in the oracle plus the difference between the Oracle and Smart Contract liquidity to Calculate
         a more accurate Volume.
        */
        if (contractLiquidity && oracleCauldronTokenDetails?.liquidity && volume) {
          differenceBetweenLiquidity = EthereumUtils.differenceBetweenBigNumbers(contractLiquidity, oracleCauldronTokenDetails.liquidity);
          volume = volume.add(differenceBetweenLiquidity);
        }
        // Calculate Liquidity in USD
        let liquidityInUsd;
        if (contractLiquidity && tokenPrice) {
          try {
            const formattedLiquidity = Number(EthereumUtils.formatAndTruncate(contractLiquidity, token.decimals, 16));
            liquidityInUsd = formattedLiquidity * tokenPrice;
          } catch (error) {
            console.log('failedToCalculate liquidityInUsd', error);
          }
        }
        // Calculate Volume in USD
        let volumeInUsd;
        if (volume && tokenPrice) {
          try {
            const formattedVolume = Number(EthereumUtils.formatAndTruncate(volume, token.decimals, 16));
            volumeInUsd = formattedVolume * tokenPrice;
          } catch (error) {
            console.log('failedToCalculate volumeInUsd', error);
          }
        }

        // If the APY is null but the APR isn't, the APR might have reached the Infinity value
        if (oracleCauldronTokenDetails?.apr && oracleCauldronTokenDetails.apr > 0) {
          oracleCauldronTokenDetails.apy = aprToApy(oracleCauldronTokenDetails.apr, 365);
        }

        return of<CauldronTokenDetails>({
          liquidity: contractLiquidity,
          liquidityInUsd: liquidityInUsd,
          volume: volume,
          volumeInUsd: volumeInUsd,
          tokenPrice: tokenPrice,
          storedPrice: tokenInfo?.storedPrice,
          apr: oracleCauldronTokenDetails?.apr,
          apy: oracleCauldronTokenDetails?.apy,
        });
      })
    );
  }

  getTokenInfo(tokenAddress: string): Observable<CauldronTokenInfo | null> {
    return from<ObservableInput<any>>(Moralis.Web3API.native.runContractFunction({
      address: environment.contractAddresses.hauntedHouse,
      function_name: 'tokenParameters',
      chain: environment.moralis.chain,
      // @ts-ignore
      abi: HauntedHouseSol.abi,
      params: {
        "": tokenAddress,
      },
    })).pipe(
      retryForever(environment.failedRequestsRetryThreshold),
      concatMap((tokenInfo: any) => {
        return of<CauldronTokenInfo>({
          tokenAddress: tokenAddress,
          lastRewardTime: BigNumber.from(tokenInfo.lastRewardTime),
          lastCumulativeReward: BigNumber.from(tokenInfo.lastCumulativeReward),
          storedPrice: BigNumber.from(tokenInfo.storedPrice),
          accZBOOFIPerShare: BigNumber.from(tokenInfo.accZBOOFIPerShare),
          totalTokens: BigNumber.from(tokenInfo.totalTokens),
          totalShares: BigNumber.from(tokenInfo.totalShares),
          multiplier: BigNumber.from(tokenInfo.withdrawFeeBP),
          withdrawFeeBP: tokenInfo.withdrawFeeBP,
        });
      }),
    );
  }

  getCauldronComposition(withWavaxAsAvax: boolean = false, lpTokens: Map<string, Token>): Observable<CauldronComposition | null> {
    return from(Moralis.Cloud.run('getCauldronComposition')).pipe(
      // filter lp tokens
      filter((tokensDetailsResponse) => {
        let isLpToken: boolean = false;
        for (let i = 0; i < tokensDetailsResponse.length; i++) {
          isLpToken = false;
          tokensDetailsResponse[i].isLpToken = false;
          lpTokens.forEach((lpToken) => {
            if(tokensDetailsResponse[i].tokenAddress == lpToken.address) {
              isLpToken = true;
            }
          });
          if(isLpToken) {
            tokensDetailsResponse[i].isLpToken = true;
          }
        };
        return tokensDetailsResponse;
      }),
      concatMap(tokensDetailsResponse  => {
        if (tokensDetailsResponse) {
          const tokensDetailsMap = new Map<string, CauldronTokenDetails>();
          let totalLiquidityInUsd = FixedNumber.from(0);
          for (let i = 0; i < tokensDetailsResponse.length; i++) {
            if(tokensDetailsResponse[i].isLpToken == true)
              totalLiquidityInUsd = totalLiquidityInUsd.addUnsafe(FixedNumber.from(tokensDetailsResponse[i].liquidityInUsd.toString()));
          }

          for (let i = 0; i < tokensDetailsResponse.length; i++) {
            if(tokensDetailsResponse[i].isLpToken == true) {
              let percent: number = 0;
              const liquidityInUsd = FixedNumber.from(tokensDetailsResponse[i].liquidityInUsd.toString());
              if (!totalLiquidityInUsd.isZero()) {
                try {
                  percent = liquidityInUsd.mulUnsafe(FixedNumber.from(100)).divUnsafe(totalLiquidityInUsd).toUnsafeFloat();
                } catch (e) {
                  console.log('Failed to measure liquidity percent');
                }
              }
              tokensDetailsMap.set(tokensDetailsResponse[i].tokenAddress.toLowerCase(), {
                liquidity: BigNumber.from(tokensDetailsResponse[i].liquidity),
                liquidityInUsd: tokensDetailsResponse[i].liquidityInUsd,
                storedPrice: BigNumber.from(tokensDetailsResponse[i].storedPrice),
                apr: tokensDetailsResponse[i].apr,
                apy: tokensDetailsResponse[i].apy,
                tokenAddress: tokensDetailsResponse[i].tokenAddress,
                percentageOfComposition: percent
              });
              // If we are adding the WAVAX Token, also add it as AVAX
              if (withWavaxAsAvax && tokensDetailsResponse[i].tokenAddress.toLowerCase() == WavaxToken.address) {
                tokensDetailsMap.set(AvaxToken.address, {
                  liquidity: BigNumber.from(tokensDetailsResponse[i].liquidity),
                  liquidityInUsd: tokensDetailsResponse[i].liquidityInUsd,
                  storedPrice: BigNumber.from(tokensDetailsResponse[i].storedPrice),
                  apr: tokensDetailsResponse[i].apr,
                  apy: tokensDetailsResponse[i].apy,
                  tokenAddress: AvaxToken.address,
                  percentageOfComposition: percent
                });
              }
            }
          }
          return of({
            tokensDetailsMap: tokensDetailsMap,
            totalLiquidityInUsd: totalLiquidityInUsd
          });
        }
        return of(null);
      })
    );
  }

  // Get only composition as for single tokens
  getSingleTokenComposition(withWavaxAsAvax: boolean = false, singleTokens: Map<string, Token>): Observable<CauldronComposition | null> {
    return from(Moralis.Cloud.run('getCauldronComposition')).pipe(
      // filter single tokens
      filter((tokensDetailsResponse) => {
        let isSingleToken: boolean = false;
        for (let i = 0; i < tokensDetailsResponse.length; i++) {
          isSingleToken = false;
          tokensDetailsResponse[i].isLpToken = false;
          singleTokens.forEach((singleToken) => {
            if(tokensDetailsResponse[i].tokenAddress == singleToken.address) {
              isSingleToken = true;
            }
          });
          if(isSingleToken) {
            tokensDetailsResponse[i].isSingleToken = true;
          }
        };
        return tokensDetailsResponse;
      }),
      concatMap(tokensDetailsResponse  => {
        if (tokensDetailsResponse) {
          const tokensDetailsMap = new Map<string, CauldronTokenDetails>();
          let totalLiquidityInUsd = FixedNumber.from(0);
          for (let i = 0; i < tokensDetailsResponse.length; i++) {
            if(tokensDetailsResponse[i].isSingleToken == true)
              totalLiquidityInUsd = totalLiquidityInUsd.addUnsafe(FixedNumber.from(tokensDetailsResponse[i].liquidityInUsd.toString()));
          }

          for (let i = 0; i < tokensDetailsResponse.length; i++) {
            if(tokensDetailsResponse[i].isSingleToken == true) {
              let percent: number = 0;
              const liquidityInUsd = FixedNumber.from(tokensDetailsResponse[i].liquidityInUsd.toString());
              if (!totalLiquidityInUsd.isZero()) {
                try {
                  percent = liquidityInUsd.mulUnsafe(FixedNumber.from(100)).divUnsafe(totalLiquidityInUsd).toUnsafeFloat();
                } catch (e) {
                  console.log('Failed to measure liquidity percent');
                }
              }
              tokensDetailsMap.set(tokensDetailsResponse[i].tokenAddress.toLowerCase(), {
                liquidity: BigNumber.from(tokensDetailsResponse[i].liquidity),
                liquidityInUsd: tokensDetailsResponse[i].liquidityInUsd,
                storedPrice: BigNumber.from(tokensDetailsResponse[i].storedPrice),
                apr: tokensDetailsResponse[i].apr,
                apy: tokensDetailsResponse[i].apy,
                tokenAddress: tokensDetailsResponse[i].tokenAddress,
                percentageOfComposition: percent
              });
              // If we are adding the WAVAX Token, also add it as AVAX
              if (withWavaxAsAvax && tokensDetailsResponse[i].tokenAddress.toLowerCase() == WavaxToken.address) {
                tokensDetailsMap.set(AvaxToken.address, {
                  liquidity: BigNumber.from(tokensDetailsResponse[i].liquidity),
                  liquidityInUsd: tokensDetailsResponse[i].liquidityInUsd,
                  storedPrice: BigNumber.from(tokensDetailsResponse[i].storedPrice),
                  apr: tokensDetailsResponse[i].apr,
                  apy: tokensDetailsResponse[i].apy,
                  tokenAddress: AvaxToken.address,
                  percentageOfComposition: percent
                });
              }
            }
          }
          return of({
            tokensDetailsMap: tokensDetailsMap,
            totalLiquidityInUsd: totalLiquidityInUsd
          });
        }
        return of(null);
      })
    );
  }

  getUserTokenInfo(tokenAddress?: string, userAddress?: string): Observable<CauldronUserTokenInfo | null> {
    if (tokenAddress && userAddress) {
      tokenAddress = tokenAddress == AvaxToken.address ? WavaxToken.address : tokenAddress;
      return combineLatest([
        // Request the user amount deposited
        from<ObservableInput<any>>(Moralis.Web3API.native.runContractFunction({
          address: environment.contractAddresses.hauntedHouse,
          function_name: 'userInfo',
          chain: environment.moralis.chain,
          // @ts-ignore
          abi: HauntedHouseSol.abi,
          params: {
            "token": tokenAddress,
            "userAddress": userAddress
          },
        })).pipe(catchError(() => of(null))),
        // Request the user pending rewards
        from(Moralis.Web3API.native.runContractFunction({
          address: environment.contractAddresses.hauntedHouse,
          function_name: 'pendingZBOOFI',
          chain: environment.moralis.chain,
          // @ts-ignore
          abi: HauntedHouseSol.abi,
          params: {
            "token": tokenAddress,
            "userAddress": userAddress
          },
        })).pipe(catchError(() => of(null))),
      ]).pipe(concatMap(([userInfo, pendingRewards]) => {
        return of<CauldronUserTokenInfo>({
          amountDeposited: userInfo?.amount ? BigNumber.from(userInfo.amount) : null,
          pendingRewards: pendingRewards ? BigNumber.from(pendingRewards) : null,
        });
      }));
    }
    return of(null);
  }

  harvest(tokenAddress: string, userAddress: string) {
    tokenAddress = tokenAddress == AvaxToken.address ? WavaxToken.address : tokenAddress;
    return from(Moralis.enableWeb3()).pipe(
      concatNetworkVerification(),
      concatMap(() => {
        return from<ObservableInput<any>>(Moralis.executeFunction({
          contractAddress: environment.contractAddresses.hauntedHouse,
          abi: HauntedHouseSol.abi,
          functionName: 'harvest',
          params: {
            token: tokenAddress,
            to: userAddress
          },
        }));
      })
    );
  }

  batchPendingZboofi(userAddress: string , tokenAddresses: string[]): Observable<CauldronUserOverallZboofiRewards | null> {
    if (tokenAddresses.length > 0) {
      return from<ObservableInput<any>>(Moralis.Web3API.native.runContractFunction({
        address: environment.contractAddresses.hauntedHouseHarvestHelper,
        function_name: 'batchPendingZBOOFI',
        chain: environment.moralis.chain,
        // @ts-ignore
        abi: HauntedHouseHarvestHelper.abi,
        params: {
          "userAddress": userAddress,
          "tokenAddresses": tokenAddresses
        },
      })).pipe(
        concatMap((rewardsResponse: any[]) => {
          if (rewardsResponse && rewardsResponse.length > 0) {
            const zBoofiRewards: CauldronUserZboofiReward[] = [];
            let totalZBoofiRewards: BigNumber = BigNumber.from(0);
            rewardsResponse.forEach(([tokenAddress, pendingZBOOFI]: [string, string | BigNumber]) => {
              pendingZBOOFI = BigNumber.from(pendingZBOOFI.toString());
              totalZBoofiRewards = totalZBoofiRewards.add(pendingZBOOFI);
              zBoofiRewards.push({
                tokenAddress: tokenAddress,
                pendingZBOOFI: pendingZBOOFI
              });
            });
            return of<CauldronUserOverallZboofiRewards>({
              zBoofiRewards: zBoofiRewards,
              totalZBoofiRewards: totalZBoofiRewards,
            });
          }
          return of(null);
        })
      );
    } else {
      return of<CauldronUserOverallZboofiRewards>({
        zBoofiRewards: [],
        totalZBoofiRewards: BigNumber.from('0'),
      });
    }
  }

  batchHarvest(tokenAddresses: string[]) {
    return from(Moralis.enableWeb3()).pipe(
      concatNetworkVerification(),
      concatMap(() => {
        return from<ObservableInput<any>>(Moralis.executeFunction({
          contractAddress: environment.contractAddresses.hauntedHouse,
          abi: HauntedHouseSol.abi,
          functionName: 'batchHarvest',
          params: {
            tokens: tokenAddresses,
          },
        }));
      })
    );
  }

  onDepositEventEmitted(): Observable<any> {
    const query = new Moralis.Query(environment.moralis.tables.cauldronDeposit);
    return from(query.subscribe()).pipe(
      concatMap((liveQuery: LiveQuerySubscription) => {
        // Unsubscribe from previous live query if we had one active
        this.depositEventEmittedLiveQuerySubscription?.unsubscribe();
        // Save the current live query
        this.depositEventEmittedLiveQuerySubscription = liveQuery;
        // Listen to Create events
        liveQuery.on('create', (response) => {
          this.depositEventEmittedBehaviourSubject.next(response);
        });
        liveQuery.on('update', (response) => {
          this.depositEventEmittedBehaviourSubject.next(response);
        });
        liveQuery.on('enter', (response) => {
          this.depositEventEmittedBehaviourSubject.next(response);
        });
        return this.depositEventEmittedBehaviourSubject.asObservable();
      })
    );
  }

  onWithdrawEventEmitted(): Observable<any> {
    const query = new Moralis.Query(environment.moralis.tables.cauldronWithdraw);
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
        liveQuery.on('update', (response) => {
          this.withdrawEventEmittedBehaviourSubject.next(response);
        });
        liveQuery.on('enter', (response) => {
          this.withdrawEventEmittedBehaviourSubject.next(response);
        });
        return this.withdrawEventEmittedBehaviourSubject.asObservable();
      })
    );
  }

  onDepositOrWithdrawEventsEmitted(): Observable<[any, any]> {
    return combineLatest([
      this.onDepositEventEmitted(),
      this.onWithdrawEventEmitted()
    ]);
  }

  unsubscribeFromLiveQueries() {
    this.depositEventEmittedLiveQuerySubscription?.unsubscribe();
    this.withdrawEventEmittedLiveQuerySubscription?.unsubscribe();
  }

}
