import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function ForbiddenCharacterValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (/^[a-zA-Z0-9]*$/.test(control.value)) {
      return null;
    } else {
      return {
        forbiddenCharacters: {
          value: control.value
        }
      }
    }
  }
}
