import {Injectable} from '@angular/core';
import {BigNumber} from "ethers";
import {tap} from "rxjs/operators";
import {from, Observable} from "rxjs";
import {Token} from "../@models/token";
import Moralis from "moralis";

@Injectable({
  providedIn: 'root'
})
export class TokenPriceService {
  /**
   Requests the price of a given token address
   @param token from which we want to retrieve the price in USD
   @return Observable<BigNumber|null> Returns an Observable number if succeeds or Null if it doesn't
   **/
  getTokenPriceInUsd(token: Token): Observable<number | null> {
    return from(Moralis.Cloud.run('getTokenPriceInUsd', {tokenAddress: token.address.toLowerCase()})).pipe(
      tap(response => {
        console.log('getTokenPriceInUsd', response);
      })
    );
  }
}

