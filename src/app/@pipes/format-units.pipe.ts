import {Pipe, PipeTransform} from '@angular/core';
import {BigNumber} from 'ethers';
import {formatUnits} from 'ethers/lib/utils';
import {FormatUnitsPipeStyleEnum} from '../@enums/format-units-pipe-style.enum';
import {EthereumUtils} from "../@utils/ethereum-utils";

@Pipe({
  name: 'formatUnits'
})
/** Returns a string with a formatted value in wei
 @param arg[0], the size "name", it will change the number of decimals returned on the string
 @param arg[1], the cryptocurrency amount of decimals, by default we use 1 ether = 18 decimals
 @return string the human readable representation in wei.
**/
export class FormatUnitsPipe implements PipeTransform {
  constructor() {}
  transform(value: BigNumber, ...args: unknown[]) {
    const size = args[0];
    // Decimals are 18 by Default
    const decimals: number = args[1] != null ? Number(args[1]) : 18;
    switch (size) {
      // Full, all decimals
      case FormatUnitsPipeStyleEnum.ALL_DECIMALS:
        return formatUnits(value, decimals);
      // Large 12 decimals
      case FormatUnitsPipeStyleEnum.TWELVE_DECIMALS:
        return EthereumUtils.formatAndTruncate(value, decimals, 6);
      // Medium 6 decimals
      case FormatUnitsPipeStyleEnum.SIX_DECIMALS:
        return EthereumUtils.formatAndTruncate(value, decimals, 6);
      // Tiny 1 decimal
      case FormatUnitsPipeStyleEnum.ONE_DECIMAL:
        return EthereumUtils.formatAndTruncate(value, decimals, 1);
      // Short, decimal pipe default
      case FormatUnitsPipeStyleEnum.FOUR_DECIMALS:
      default:
        return EthereumUtils.formatAndTruncate(value, decimals, 4);
    }
  }
}
