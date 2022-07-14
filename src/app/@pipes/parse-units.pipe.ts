import {Pipe, PipeTransform} from '@angular/core';
import {parseUnits} from 'ethers/lib/utils';
import {BigNumber} from 'ethers';

@Pipe({
  name: 'parseUnits'
})
export class ParseUnitsPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): BigNumber {
    const decimals: number = args[0] != null ? Number(args[0]) : 18;
    return parseUnits(value, decimals);
  }
}
