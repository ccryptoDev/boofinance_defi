import {Pipe, PipeTransform} from '@angular/core';
import {TokenBalance} from "../@models/token-balance";
import {Token} from "../@models/token";

@Pipe({
  name: 'filterTokenBalances'
})
export class FilterTokenBalancesPipe implements PipeTransform {
  transform(tokenBalances: Map<string, TokenBalance>, nameOrSymbol?: string, existsOnTokenList?: Map<string, Token>): Map<string, TokenBalance> {
    // If nameOrSymbol is present, proceed to filter by name or symbol
    if (nameOrSymbol) {
      nameOrSymbol = nameOrSymbol.toLowerCase();
      return new Map([...tokenBalances].filter(([key, tokenBalance]) => {
        // Verify name or symbol matches
        let match = tokenBalance.name.toLowerCase().includes(nameOrSymbol!) || tokenBalance.symbol.toLowerCase().includes(nameOrSymbol!);
        // If existsOnTokenList is also present, ensure this token is part of the list
        if (match && existsOnTokenList) {
          match = existsOnTokenList.has(tokenBalance.token_address.toLowerCase());
        }
        return match;
      }));
    }

    if (existsOnTokenList) {
      return new Map([...tokenBalances].filter(([key, tokenBalance]) => {
        return existsOnTokenList.has(tokenBalance.token_address.toLowerCase());
      }));
    }
    // Else we'll just return the tokenBalances as they are
    return tokenBalances;
  }
}
