import {catchError, concatMap, delay, map, retryWhen, scan} from "rxjs/operators";
import {from, MonoTypeOperatorFunction, of, OperatorFunction} from "rxjs";
import {BigNumber} from "ethers";
import {parseEther} from "ethers/lib/utils";
import Moralis from "moralis";
import {Network} from "@ethersproject/networks";
import MoralisWeb3Provider = Moralis.MoralisWeb3Provider;

export function castAsBigNumberOrNull() {
  return concatMap((value => {
    if (value != null) {
      try {
        return of(BigNumber.from(value));
      } catch (error) {
        return of(null);
      }
    }
    return of(null);
  }));
}

export function castWithParseEther() {
  return concatMap((value: string) => {
    try {
      return of(parseEther(value))
    } catch (e) {
      return of(null);
    }
  });
}

export function retryWithDelay<T>(
  delayInMilliseconds: number,
  count = 1
): MonoTypeOperatorFunction<T> {
  return (input) =>
    input.pipe(
      retryWhen((errors) =>
        errors.pipe(
          scan((acc, error) => ({ count: acc.count + 1, error }), {
            count: 0,
            error: undefined as any,
          }),
          map((current) => {
            if (current.count > count) {
              throw current.error;
            }
            return current;
          }),
          delay(delayInMilliseconds)
        )
      )
    );
}

export function retryForever<T>(delayInMilliseconds: number) : MonoTypeOperatorFunction<T> {
  return (input) =>
    input.pipe(
      retryWhen((errors) =>
        errors.pipe(
          map((errors) => {
            console.log(errors);
          }),
          delay(delayInMilliseconds)
        )
      )
    );
}

export function concatNetworkVerification(): OperatorFunction<any, any> {
  return concatMap((provider: MoralisWeb3Provider) => {
    return from(provider.getNetwork()).pipe(
      catchError(() => of(null)),
      concatMap((network: null | Network) => {
        if (network?.chainId != 43114) {
          throw 'You are in the wrong Network, please make sure you are on the Avalanche network before continuing.';
        } else {
          return of(network?.chainId);
        }
      })
    );
  });
}
