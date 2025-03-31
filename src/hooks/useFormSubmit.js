import { useState, useCallback } from 'react';
import { ERROR_MESSAGES } from '../utils/constants';

export const useFormSubmit = (onSubmit, validationRules = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (values) => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      try {
        // Validate form if validation rules are provided
        if (Object.keys(validationRules).length > 0) {
          const isValid = validateForm(values);
          if (!isValid) {
            throw new Error('Please fix the validation errors');
          }
        }

        await onSubmit(values);
        setSuccess(true);
      } catch (err) {
        setError(err.message || ERROR_MESSAGES.SERVER_ERROR);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, validationRules]
  );

  const resetForm = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    isSubmitting,
    error,
    success,
    handleSubmit,
    resetForm,
  };
};

export const useFormSubmitWithRetry = (onSubmit, maxRetries = 3) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleSubmit = useCallback(
    async (values) => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      setRetryCount(0);

      while (retryCount < maxRetries) {
        try {
          await onSubmit(values);
          setSuccess(true);
          return;
        } catch (err) {
          setRetryCount((prev) => prev + 1);
          if (retryCount === maxRetries - 1) {
            setError(err.message || ERROR_MESSAGES.SERVER_ERROR);
          } else {
            // Wait before retrying (exponential backoff)
            await new Promise((resolve) =>
              setTimeout(resolve, Math.pow(2, retryCount) * 1000)
            );
          }
        }
      }
    },
    [onSubmit, maxRetries, retryCount]
  );

  const resetForm = useCallback(() => {
    setError(null);
    setSuccess(false);
    setRetryCount(0);
  }, []);

  return {
    isSubmitting,
    error,
    success,
    retryCount,
    handleSubmit,
    resetForm,
  };
};

export const useFormSubmitWithProgress = (onSubmit) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = useCallback(
    async (values) => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      setProgress(0);

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 500);

        await onSubmit(values);
        clearInterval(progressInterval);
        setProgress(100);
        setSuccess(true);
      } catch (err) {
        setError(err.message || ERROR_MESSAGES.SERVER_ERROR);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );

  const resetForm = useCallback(() => {
    setError(null);
    setSuccess(false);
    setProgress(0);
  }, []);

  return {
    isSubmitting,
    error,
    success,
    progress,
    handleSubmit,
    resetForm,
  };
};

export const useFormSubmitWithValidation = (onSubmit, validationRules) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = useCallback(
    (values) => {
      const errors = {};
      let isValid = true;

      Object.entries(validationRules).forEach(([field, rules]) => {
        const value = values[field];
        const fieldErrors = [];

        rules.forEach((rule) => {
          if (rule.required && !value) {
            fieldErrors.push(ERROR_MESSAGES.REQUIRED_FIELD);
            isValid = false;
          }

          if (rule.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            fieldErrors.push(ERROR_MESSAGES.INVALID_EMAIL);
            isValid = false;
          }

          if (rule.min && value.length < rule.min) {
            fieldErrors.push(`Minimum ${rule.min} characters required`);
            isValid = false;
          }

          if (rule.max && value.length > rule.max) {
            fieldErrors.push(`Maximum ${rule.max} characters allowed`);
            isValid = false;
          }

          if (rule.custom) {
            const customError = rule.custom(value);
            if (customError) {
              fieldErrors.push(customError);
              isValid = false;
            }
          }
        });

        if (fieldErrors.length > 0) {
          errors[field] = fieldErrors;
        }
      });

      setValidationErrors(errors);
      return isValid;
    },
    [validationRules]
  );

  const handleSubmit = useCallback(
    async (values) => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);
      setValidationErrors({});

      try {
        if (!validateForm(values)) {
          throw new Error('Please fix the validation errors');
        }

        await onSubmit(values);
        setSuccess(true);
      } catch (err) {
        setError(err.message || ERROR_MESSAGES.SERVER_ERROR);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit, validateForm]
  );

  const resetForm = useCallback(() => {
    setError(null);
    setSuccess(false);
    setValidationErrors({});
  }, []);

  return {
    isSubmitting,
    error,
    success,
    validationErrors,
    handleSubmit,
    resetForm,
  };
}; 