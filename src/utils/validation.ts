export type ValidationRule<T> = {
  validate: (value: T, formValues?: Record<string, any>) => boolean;
  message: string;
};

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

export function validateForm<T extends Record<string, any>>(
  values: T,
  rules: ValidationRules<T>
): ValidationErrors<T> {
  const errors: ValidationErrors<T> = {};

  Object.keys(rules).forEach((key) => {
    const fieldRules = rules[key as keyof T];
    if (!fieldRules) return;

    const value = values[key as keyof T];
    const fieldErrors = fieldRules
      .filter((rule) => !rule.validate(value))
      .map((rule) => rule.message);

    if (fieldErrors.length > 0) {
      errors[key as keyof T] = fieldErrors[0];
    }
  });

  return errors;
}

// Common validation rules
export const required = (message = 'This field is required'): ValidationRule<any> => ({
  validate: (value) => value !== undefined && value !== null && value !== '',
  message,
});

export const email = (message = 'Invalid email address'): ValidationRule<string> => ({
  validate: (value) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value),
  message,
});

export const minLength = (length: number, message?: string): ValidationRule<string> => ({
  validate: (value) => value.length >= length,
  message: message || `Must be at least ${length} characters`,
});

export const maxLength = (length: number, message?: string): ValidationRule<string> => ({
  validate: (value) => value.length <= length,
  message: message || `Must be at most ${length} characters`,
});

export const pattern = (regex: RegExp, message: string): ValidationRule<string> => ({
  validate: (value) => regex.test(value),
  message,
});

export const match = (field: string, message?: string): ValidationRule<string> => ({
  validate: (value, formValues = {}) => value === formValues[field],
  message: message || 'Fields do not match',
});

// Example usage:
// const rules = {
//   email: [required(), email()],
//   password: [required(), minLength(8)],
//   confirmPassword: [required(), match('password')],
// };
// const errors = validateForm(values, rules); 