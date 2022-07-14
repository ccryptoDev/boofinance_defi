import {Pipe, PipeTransform} from '@angular/core';
import {Token} from "../@models/token";

@Pipe({
  name: 'filterTokens'
})
export class FilterTokensPipe implements PipeTransform {
  transform(tokenMap: Map<string, Token>, type: 'any' | 'single-token' | 'liquidity-pair-token', nameOrSymbol?: string): Map<string, Token> {
    return new Map(
      [...tokenMap].filter(([key, token]) => {
        // Filter by type
        let typeMatch: boolean;
        switch (type) {
          case 'any':
            typeMatch = true;
            break;
          case 'liquidity-pair-token':
            typeMatch = token.liquidityPairDetails != null;
            break;
          case "single-token":
          default:
            typeMatch = token.liquidityPairDetails == null;
            break;
        }
        // Filter by name or symbol
        let nameOrSymbolMatch: boolean;
        if (nameOrSymbol) {
          console.log('------------------------------------------------------------------');
          console.log('nameOrSymbol', nameOrSymbol);
          console.log('token.name', token.name);
          nameOrSymbol = nameOrSymbol.toLowerCase();
          nameOrSymbolMatch = token.name.toLowerCase().includes(nameOrSymbol!) || token.symbol.toLowerCase().includes(nameOrSymbol!);
        } else {
          nameOrSymbolMatch = true;
        }
        console.log('typematch', typeMatch, 'nameOrSymbolMatch', nameOrSymbolMatch, 'should display', typeMatch && nameOrSymbolMatch);
        return typeMatch && nameOrSymbolMatch;
      })
    );
  }
}
