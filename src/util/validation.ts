export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }
  
  export function validate(validatableInput: Validatable) {
    const { value, required, minLength, maxLength, min, max } = validatableInput;
    let isValid = true;
    if (required && minLength != null) {
      isValid = isValid && value.toString().trim().length >= minLength;
    }
    if (minLength != null && typeof value === "string") {
      isValid = isValid && value.length >= minLength;
    }
    if (maxLength != null && typeof value === "string") {
      isValid = isValid && value.length <= maxLength;
    }
    if (min != null && typeof value === "number") {
      isValid = isValid && value >= min;
    }
    if (max != null && typeof value === "number") {
      isValid = isValid && value <= max;
    }
    return isValid;
  }