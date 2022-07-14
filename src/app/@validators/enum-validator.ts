import {AbstractControl, ValidationErrors} from "@angular/forms";

export function EnumValidator(enumClass: any) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (Object.values(enumClass).includes(control.value)) {
      return null;
    } else {
      return {
        invalidEnum: {
          value: control.value
        }
      }
    }
  }
}
