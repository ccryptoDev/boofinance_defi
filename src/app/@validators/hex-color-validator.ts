import {AbstractControl, ValidationErrors} from "@angular/forms";

export function HexColorValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(control.value)) {
      return null;
    } else {
      return {
        invalidHexColor: {
          value: control.value
        }
      }
    }
  }
}
