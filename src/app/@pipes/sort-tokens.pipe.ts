import {Pipe, PipeTransform} from '@angular/core';
import {Token} from "../@models/token";
import {KeyValue} from "@angular/common";
import {TokenSortingMenu} from "../@enums/token-sorting-menu";
import {CauldronComposition} from "../@models/cauldron-composition";

@Pipe({
  name: 'sortTokens'
})

/**
  Sorts a KeyValue array of Tokens by their symbols
  if the BOOFI token is present on the array it will always be sorted first
 **/
export class SortTokensPipe implements PipeTransform {
  transform(keyValueTokens: Array<KeyValue<string, Token>>, sortType: TokenSortingMenu = TokenSortingMenu.DEFAULT, cauldronComposition: CauldronComposition | null = null): Array<KeyValue<string, Token>> {
    switch (sortType) {
      case TokenSortingMenu.Liquidity:
        return sortByLiquidity(keyValueTokens, cauldronComposition);
      case TokenSortingMenu.APR:
        return sortByApr(keyValueTokens, cauldronComposition);
      case TokenSortingMenu.HOT:
        return sortByHot(keyValueTokens);
      case TokenSortingMenu.NEW:
        return sortByNew(keyValueTokens);
      case TokenSortingMenu.DEFAULT:
      default:
        // Sort BY: APR/APY/Liquidity/Volume
        return defaultSort(keyValueTokens);
    }
  }
}

function sortByLiquidity(keyValueTokens: Array<KeyValue<string, Token>>, cauldronComposition: CauldronComposition | null): Array<KeyValue<string, Token>> {
  // If the Cauldron composition is available
  if (cauldronComposition) {
    return keyValueTokens.sort((a, b) => {
      let AtokenLiquidity: number = cauldronComposition.tokensDetailsMap.get(a.key)?.liquidityInUsd ? cauldronComposition.tokensDetailsMap.get(a.key)!.liquidityInUsd! : 0;
      let BtokenLiquidity: number = cauldronComposition.tokensDetailsMap.get(b.key)?.liquidityInUsd ? cauldronComposition.tokensDetailsMap.get(b.key)!.liquidityInUsd! : 0;
      // Sort in descending order by APR
      return BtokenLiquidity - AtokenLiquidity;
    });
  }
  // If the cauldron composition isn't available use the default sorting method
  return defaultSort(keyValueTokens);
}

function sortByApr(keyValueTokens: Array<KeyValue<string, Token>>, cauldronComposition: CauldronComposition | null): Array<KeyValue<string, Token>> {
  // If the Cauldron composition is available
  if (cauldronComposition) {
    return keyValueTokens.sort((a, b) => {
      let AtokenApr: number = cauldronComposition.tokensDetailsMap.get(a.key)?.apr ? cauldronComposition.tokensDetailsMap.get(a.key)!.apr! : 0;
      let BtokenApr: number = cauldronComposition.tokensDetailsMap.get(b.key)?.apr ? cauldronComposition.tokensDetailsMap.get(b.key)!.apr! : 0;
      // Sort in descending order by APR
      return BtokenApr - AtokenApr;
    });
  }
  // If the cauldron composition isn't available use the default sorting method
  return defaultSort(keyValueTokens);
}

function sortByHot(keyValueTokens: Array<KeyValue<string, Token>>): Array<KeyValue<string, Token>> {
  let hotTokens: Array<KeyValue<string, Token>> = [];
  let otherTokens: Array<KeyValue<string, Token>> = [];
  for (let i = 0; i < keyValueTokens.length; i++) {
    const keyValue = keyValueTokens[i];
    if (keyValue.value.displayAsHotToken === true) {
      hotTokens.push(keyValue);
      continue;
    }
    otherTokens.push(keyValue);
  }
  // Return the KeyValue tokens array grouped by hot tokens + other tokens sorted by A-Z
  return [
    ...hotTokens.sort((a, b) => a.value.symbol.localeCompare(b.value.symbol)),
    ...otherTokens.sort((a, b) => a.value.symbol.localeCompare(b.value.symbol))
  ];
}

function sortByNew(keyValueTokens: Array<KeyValue<string, Token>>): Array<KeyValue<string, Token>> {
  let newTokens: Array<KeyValue<string, Token>> = [];
  let otherTokens: Array<KeyValue<string, Token>> = [];
  for (let i = 0; i < keyValueTokens.length; i++) {
    const keyValue = keyValueTokens[i];
    if (keyValue.value.displayAsNewToken === true) {
      newTokens.push(keyValue);
      continue;
    }
    otherTokens.push(keyValue);
  }
  // Return the KeyValue tokens array grouped by new tokens + other tokens sorted by A-Z
  return [
    ...newTokens.sort((a, b) => a.value.symbol.localeCompare(b.value.symbol)),
    ...otherTokens.sort((a, b) => a.value.symbol.localeCompare(b.value.symbol))
  ];
}

/*
  Sorts by HOT <- NEW <- BOOFI <- A-Z
*/
function defaultSort(keyValueTokens: Array<KeyValue<string, Token>>): Array<KeyValue<string, Token>> {
  let hotTokens: Array<KeyValue<string, Token>> = [];
  let newTokens: Array<KeyValue<string, Token>> = [];
  let boofiTokens: Array<KeyValue<string, Token>> = [];
  let otherTokens: Array<KeyValue<string, Token>> = [];
  // Separate each token by his type
  for (let i = 0; i < keyValueTokens.length; i++) {
    const keyValue = keyValueTokens[i];
    if (keyValue.value.displayAsHotToken === true) {
      hotTokens.push(keyValue);
      continue;
    }
    if (keyValue.value.displayAsNewToken === true) {
      newTokens.push(keyValue);
      continue;
    }
    if (keyValue.value.symbol.toLowerCase().includes('boofi')) {
      boofiTokens.push(keyValue);
      continue;
    }
    otherTokens.push(keyValue);
  }
  // Return the KeyValue tokens array grouped by their types and sorted by A-Z
  return [
    ...hotTokens.sort((a, b) => a.value.symbol.localeCompare(b.value.symbol)),
    ...newTokens.sort((a, b) => a.value.symbol.localeCompare(b.value.symbol)),
    ...boofiTokens.sort((a, b) => a.value.symbol.localeCompare(b.value.symbol)),
    ...otherTokens.sort((a, b) => a.value.symbol.localeCompare(b.value.symbol))
  ];
}
