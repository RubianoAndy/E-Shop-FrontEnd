import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function productPriceDiscountValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const price = group.get('price')?.value;
    const discountPrice = group.get('discountPrice')?.value;
    if (price !== null && discountPrice !== null && discountPrice !== '' && discountPrice > 0 && Number(discountPrice) >= Number(price))
      return { discountGreaterOrEqual: true };
    
    return null;
  };
}
