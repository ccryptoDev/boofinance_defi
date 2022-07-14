import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Token} from "../@models/token";
import {concatMap, first} from "rxjs/operators";
import Moralis from "moralis";
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class TokensService {
  tokensBehaviourSubject = new BehaviorSubject<Map<string, Token>>(new Map<string, Token>());
  LPtokensBehaviourSubject = new BehaviorSubject<Map<string, Token>>(new Map<string, Token>());
  StokensBehaviourSubject = new BehaviorSubject<Map<string, Token>>(new Map<string, Token>());

  initialize() {
    // this.getTokens();
    this.getLPTokens();
    this.getSingleTokens();
  }
  // Getting both LP and single tokens
  getTokens(): Observable<Map<string, Token>> {
    // Verify if the tokensBehaviourSubject was already populated
    if (this.tokensBehaviourSubject.value.size == 0) {
      let tokens: Map<string, Token> = new Map<string, Token>();
      environment.tokens.forEach(token => {
        if (token.availableInTheCauldron) {
          tokens.set(token.address.toLowerCase(), token);
        }
      });
      this.tokensBehaviourSubject.next(tokens);
    }
    return this.tokensBehaviourSubject.asObservable();
  }

  // Getting only LP tokens
  getLPTokens(): Observable<Map<string, Token>> {
    // Verify if the tokensBehaviourSubject was already populated
    if (this.LPtokensBehaviourSubject.value.size == 0) {
      let tokens: Map<string, Token> = new Map<string, Token>();
      environment.tokensLP.forEach(token => {
        if (token.availableInTheCauldron) {
          tokens.set(token.address.toLowerCase(), token);
        }
      });
      this.LPtokensBehaviourSubject.next(tokens);
    }
    return this.LPtokensBehaviourSubject.asObservable();
  }

  // Getting only Single tokens
  getSingleTokens(): Observable<Map<string, Token>> {
    // Verify if the tokensBehaviourSubject was already populated
    if (this.StokensBehaviourSubject.value.size == 0) {
      let tokens: Map<string, Token> = new Map<string, Token>();
      environment.tokensSingle.forEach(token => {
        if (token.availableInTheCauldron) {
          tokens.set(token.address.toLowerCase(), token);
        }
      });
      this.StokensBehaviourSubject.next(tokens);
    }
    return this.StokensBehaviourSubject.asObservable();
  }

  addTokenToWallet(token: Token): Observable<any> {
    return from(window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: token.logoURI,
        },
      },
    }));
  }
}

