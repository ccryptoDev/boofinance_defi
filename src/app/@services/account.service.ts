import {Injectable} from '@angular/core';
import {Moralis} from 'moralis';
import {BehaviorSubject, combineLatest, from, Observable, ObservableInput, of} from "rxjs";
import {TokenBalance} from "../@models/token-balance";
import {catchError, concatMap, debounceTime, map} from "rxjs/operators";
import {BigNumber} from "ethers";
import ERC20Sol from '../@artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import {environment} from "../../environments/environment";
import {castAsBigNumberOrNull, concatNetworkVerification, retryForever} from "../@utils/rxjs-utils";
import LiveQuerySubscription = Moralis.LiveQuerySubscription;
import {AvaxToken} from "../../environments/configurations/production-tokens-environment";
import {EthereumUtils} from "../@utils/ethereum-utils";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userExecutesTransactionBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private userExecutesTransactionLiveQuerySubscription: LiveQuerySubscription | null;
  constructor() {
  }

  onUserExecutesTransaction(userAddress: string | null | undefined) {
    const query = new Moralis.Query(environment.moralis.tables.transaction).equalTo('from_address', userAddress);
    return from(query.subscribe()).pipe(
      concatMap((liveQuery: LiveQuerySubscription) => {
        // Unsubscribe from previous live query if we had one active
        this.userExecutesTransactionLiveQuerySubscription?.unsubscribe();
        // Save the current live query
        this.userExecutesTransactionLiveQuerySubscription = liveQuery;
        // Listen to Create events
        liveQuery.on('create', (response) => {
          this.userExecutesTransactionBehaviorSubject.next(response);
        });
        liveQuery.on('update', (response) => {
          this.userExecutesTransactionBehaviorSubject.next(response);
        });
        liveQuery.on('enter', (response) => {
          this.userExecutesTransactionBehaviorSubject.next(response);
        });
        return this.userExecutesTransactionBehaviorSubject.asObservable();
      })
    );
  }

  /**
    Returns an Observable with a Map holding the user token balances, refreshing it on every transaction he/she makes.
    It will also return the user AVAX balance mapped with the index of the zero address.
    @param userAddress the address of the user we want to observe the changes
    @return observable Map with the user balances
  **/
  getUserTokenBalances(userAddress: string | null | undefined): Observable<Map<string, TokenBalance>> {
    const tokenBalancesMap = new Map<string, TokenBalance>();
    if (userAddress) {
      return combineLatest([
        from<any>(Moralis.Web3API.account.getNativeBalance({
          chain: environment.moralis.chain,
          address: userAddress
        })).pipe(
          retryForever(environment.failedRequestsRetryThreshold)
        ),
        from<any>(Moralis.Web3API.account.getTokenBalances({
          chain: environment.moralis.chain,
          address: userAddress
        })).pipe(
          retryForever(environment.failedRequestsRetryThreshold)
        ),
      ]).pipe(
        concatMap(([nativeBalance, tokenBalances]: [any, any]) => {
          console.log('nativeBalance', nativeBalance);
          if (EthereumUtils.isValidEtherFormat(nativeBalance?.balance)) {
            const balance = BigNumber.from(nativeBalance!.balance);
            if (!balance.isZero()) {
              tokenBalancesMap.set(
                AvaxToken.address, {
                  name: AvaxToken.name,
                  symbol: AvaxToken.symbol,
                  thumbnail: AvaxToken.logoURI,
                  token_address: AvaxToken.address,
                  logo: AvaxToken.logoURI,
                  decimals: AvaxToken.decimals,
                  balance: nativeBalance!.balance,
                }
              );
            }
          }
          tokenBalances.forEach((tokenBalance: any) => {
            tokenBalancesMap.set(tokenBalance.token_address.toLowerCase(), {
              name: tokenBalance.name,
              symbol: tokenBalance.symbol,
              thumbnail: tokenBalance.thumbnail,
              token_address: tokenBalance.token_address,
              logo: tokenBalance.logo,
              decimals: tokenBalance.decimals,
              balance: BigNumber.from(tokenBalance.balance),
            });
          });
          return of(tokenBalancesMap);
        })
      );
    }
    return of(tokenBalancesMap);
  }

  /**
    Returns an Observable of the user token balance.
    It will return the user AVAX balance if the provided token address is the zero address.
    @param tokenAddress the address of the token
    @param userAddress the address of the user
    @return observable Map with the user balances
  **/
  getUserTokenBalance(tokenAddress: string, userAddress: string | null | undefined): Observable<BigNumber | null> {
    if (tokenAddress && userAddress) {
      if (tokenAddress == AvaxToken.address) {
        return from<ObservableInput<any>>(Moralis.Web3API.account.getNativeBalance({
          chain: environment.moralis.chain,
          address: userAddress
        })).pipe(
          retryForever(environment.failedRequestsRetryThreshold),
          concatMap((response: any) => {
            if (response.balance) {
              return of(BigNumber.from(response.balance));
            }
            return of(null);
          })
        );
      } else {
        return from<ObservableInput<any>>(Moralis.Web3API.native.runContractFunction({
          address: tokenAddress,
          function_name: 'balanceOf',
          chain: environment.moralis.chain,
          // @ts-ignore
          abi: ERC20Sol.abi,
          params: {
            "account": userAddress,
          },
        })).pipe(
          retryForever(environment.failedRequestsRetryThreshold),
          castAsBigNumberOrNull()
        );
      }
    }
    return of(null);
  }

  /**
    Returns an Observable of the user allowance.
    It will return a maximum Bignumber if the token address is the zero address.
    @param tokenAddress the address of the token
    @param spenderAddress the address of who will spend the user tokens
    @param userAddress the address of the user
    @return observable bignumber with the user allowance
  **/
  getUserTokenAllowance(tokenAddress: string, spenderAddress: string, userAddress: string | null | undefined): Observable<BigNumber | null> {
    if (userAddress) {
      // If the token address is the AVAX address, it will have maximum allowance
      if (tokenAddress == AvaxToken.address) {
        return of(EthereumUtils.MaximumBigNumber);
      } else {
        return from<ObservableInput<any>>(Moralis.Web3API.token.getTokenAllowance({
          chain: environment.moralis.chain,
          address: tokenAddress,
          owner_address: userAddress,
          spender_address: spenderAddress
        })).pipe(concatMap((response: {allowance: BigNumber}) => {
          return of(BigNumber.from(response.allowance));
        }));
      }
    }
    return of(null);
  }

  setUserTokenAllowance(tokenAddress: string, spenderAddress: string, tokenAmount: BigNumber) {
    return from(Moralis.enableWeb3()).pipe(
      concatNetworkVerification(),
      concatMap(() => {
        return from<ObservableInput<any>>(Moralis.executeFunction({
          contractAddress: tokenAddress,
          abi: ERC20Sol.abi,
          functionName: 'approve',
          params: {
            spender: spenderAddress,
            amount: tokenAmount
          },
        }))
    }));
  }

  unsubscribeFromLiveQueries() {
    this.userExecutesTransactionLiveQuerySubscription?.unsubscribe();
  }

}
