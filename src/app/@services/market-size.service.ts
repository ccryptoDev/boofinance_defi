import {Injectable} from '@angular/core';
import {from, Observable, ObservableInput, of} from "rxjs";
import {Moralis} from "moralis";
import {catchError, concatMap, filter} from "rxjs/operators";
import {BigNumber, FixedNumber} from "ethers";
import {MarketSize} from "../@models/market-size";
import {retryWithDelay} from "../@utils/rxjs-utils";

@Injectable({
  providedIn: 'root'
})
export class MarketSizeService {
  constructor() {}

  getLatestMarketSize(): Observable<MarketSize> {
    return from<ObservableInput<any>>(Moralis.Cloud.run('getLatestMarketSize')).pipe(
      retryWithDelay(10000, 15),
      catchError(() => of(null)),
      filter((response) => response != null),
      concatMap((response: any)  => {
        return of<MarketSize>({
          totalTVL: FixedNumber.from(response.totalTVL),
          cauldronTVL: FixedNumber.from(response.cauldronTVL),
          wellOfSoulsTVL: FixedNumber.from(response.wellOfSoulsTVL),
          stakeTVL: FixedNumber.from(response.stakeTVL),
        });
      })
    );
  }
}
