import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function commentValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    return null;
  };
}