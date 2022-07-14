import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {EthereumUtils} from "../@utils/ethereum-utils";
import {parseEther} from "ethers/lib/utils";


export function EtherFormatValidator(allowEmpty = false, allowZeroValue = true): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if(allowEmpty && (control.value == '' || control.value == null)) {
      return null;
    }

    if (EthereumUtils.isValidEtherFormat(control.value)) {
      if (!allowZeroValue && parseEther(control.value).isZero()) {
        return {
          cannotBeZero: {
            value: control.value
          }
        }
      }
      return null;
    }
    return {
      invalidValue: {
        value: control.value
      }
    }
  };
}
