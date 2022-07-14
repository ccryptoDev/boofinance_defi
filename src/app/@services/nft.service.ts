import {Injectable} from '@angular/core';
import {BehaviorSubject, from, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Nft} from "../@models/nft";
import {concatMap, first} from "rxjs/operators";
import Moralis from "moralis";
import {userNftDummy, newNftDummy} from "./nftDummy"
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class NftService {
  userNftBehaviourSubject = new BehaviorSubject<Map<Number, Nft>>(new Map<Number, Nft>());
  newNftBehaviourSubject = new BehaviorSubject<Map<Number, Nft>>(new Map<Number, Nft>());

  initialize() {
    this.getUserNftTokens();
    this.getNewNftTokens();
  }

  getUserNftTokens(): Observable<Map<Number, Nft>> {
    // Verify if the userNftBehaviourSubject was already populated
    if (this.userNftBehaviourSubject.value.size == 0) {
      let tokens: Map<Number, Nft> = new Map<Number, Nft>();
      // Bring user tokens from Moralis, but use dummy data for now
      userNftDummy.forEach(token => {
        tokens.set(token.tokenId, token);
      })
      this.userNftBehaviourSubject.next(tokens);
    }
    return this.userNftBehaviourSubject.asObservable();
  }

  getNewNftTokens(): Observable<Map<Number, Nft>> {
    // Verify if the userNftBehaviourSubject was already populated
    if (this.newNftBehaviourSubject.value.size == 0) {
      let tokens: Map<Number, Nft> = new Map<Number, Nft>();
      // Bring new tokens from Moralis, but use dummy data for now
      if(newNftDummy && newNftDummy.length > 0) {
        newNftDummy.forEach(token => {
          tokens.set(token?.tokenId, token);
        })
      }
      this.newNftBehaviourSubject.next(tokens);
    }
    return this.newNftBehaviourSubject.asObservable();
  }
}

