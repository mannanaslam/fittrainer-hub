import { useState, useCallback } from 'react';
import { validateForm, ValidationRules, ValidationErrors } from '@/utils/validation';

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

interface UseFormReturn<T> {
  values: T;
  errors: ValidationErrors<T>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  handleChange: (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: any) => void;
  resetForm: () => void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({} as ValidationErrors<T>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(() => {
    if (!validationRules) return {} as ValidationErrors<T>;
    return validateForm(values, validationRules);
  }, [values, validationRules]);

  const handleChange = useCallback(
    (field: keyof T) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
      if (validationRules) {
        const newErrors = validate();
        setErrors(newErrors);
      }
    },
    [validate]
  );

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      if (validationRules) {
        const newErrors = validate();
        setErrors(newErrors);
      }
    },
    [validate]
  );

  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (validationRules) {
        const newErrors = validate();
        setErrors(newErrors);
      }
    },
    [validate]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        if (validationRules) {
          const newErrors = validate();
          setErrors(newErrors);
          if (Object.keys(newErrors).length > 0) {
            return;
          }
        }

        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({} as ValidationErrors<T>);
    setTouched({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
  };
}

// Example usage:
// const { values, errors, handleChange, handleBlur, handleSubmit } = useForm({
//   initialValues: { email: '', password: '' },
//   validationRules: {
//     email: [required(), email()],
//     password: [required(), minLength(8)],
//   },
//   onSubmit: async (values) => {
//     await signIn(values.email, values.password);
//   },
// }); 