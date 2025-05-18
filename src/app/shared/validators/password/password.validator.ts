import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value || '';

        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const hasNumber = /\d/.test(value);
        const isValidLength = value.length >= 8 && value.length <= 20;

        if (!hasUpperCase || !hasLowerCase || !hasSpecialChar || !hasNumber || !isValidLength)
            return { invalidPassword: true };

        return null;
    }
}