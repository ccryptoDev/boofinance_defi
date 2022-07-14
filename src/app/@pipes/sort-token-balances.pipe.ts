import {Pipe, PipeTransform} from '@angular/core';
import {KeyValue} from "@angular/common";
import {TokenBalance} from "../@models/token-balance";

@Pipe({
  name: 'sortTokenBalances'
})

/**
  Sorts a KeyValue array of TokenBalances by their symbols
  if the BOOFI token is present on the array it will always be sorted first
 **/
export class SortTokenBalancesPipe implements PipeTransform {
  transform(keyValueTokens: Array<KeyValue<string, TokenBalance>>):  Array<KeyValue<string, TokenBalance>> {
    return keyValueTokens?.sort((a,b) => {
      // If it's the BOOFI token, it will always go first
      if (a.value.symbol.toLowerCase().includes('boofi')) {
        return -1;
      } else if (b.value.symbol.toLowerCase().includes('boofi')) {
        return 1;
      }
      // Else sort by symbol
      return a.value.symbol.localeCompare(b.value.symbol);
    });
  }
}
