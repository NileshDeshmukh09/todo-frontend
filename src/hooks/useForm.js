import { useState, useCallback } from 'react';

const validateField = (value, rules) => {
  if (!rules) return '';

  for (const rule of rules) {
    switch (rule) {
      case 'required':
        if (!value || value.trim() === '') {
          return 'This field is required';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'min:6':
        if (value.length < 6) {
          return 'Password must be at least 6 characters long';
        }
        break;
      case 'min:2':
        if (value.length < 2) {
          return 'This field must be at least 2 characters long';
        }
        break;
      case 'match:password':
        if (value !== document.getElementById('password')?.value) {
          return 'Passwords do not match';
        }
        break;
      default:
        if (rule.startsWith('min:')) {
          const minLength = parseInt(rule.split(':')[1]);
          if (value.length < minLength) {
            return `This field must be at least ${minLength} characters long`;
          }
        }
    }
  }

  return '';
};

export const useForm = ({ initialValues, validationRules, onSubmit }) => {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules || {}).forEach((field) => {
      const error = validateField(values[field], validationRules[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setIsSubmitting(true);
    try {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      await onSubmit(values);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    validateForm,
  };
}; 