import {BigNumber} from "ethers";
import {formatUnits, parseEther} from "ethers/lib/utils";
import {BigNumberish} from "@ethersproject/bignumber";

export class EthereumUtils {
  static MaximumBigNumber = BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

  public static isValidEtherFormat(amount: string) {
    if (amount) {
      try {
        parseEther(amount);
        return true;
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
  }

  public static formatAndTruncate(value: BigNumberish, unitName: string | BigNumberish, maxDecimalDigits: number): string {
    let formattedValue = formatUnits(value, unitName);
    // Split integers from decimals
    if (formattedValue.includes('.')) {
      const parts = formattedValue.split('.');
      // Remove exceeding decimals
      formattedValue = parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
    }
    return formattedValue;
  }

  public static differenceBetweenBigNumbers(firstValue: BigNumber, secondValue: BigNumber): BigNumber {
    if (firstValue.eq(secondValue)) {
      return BigNumber.from(0);
    }
    if (firstValue.gt(secondValue)) {
      return firstValue.sub(secondValue);
    } else {
      return secondValue.sub(firstValue);
    }
  }
}
