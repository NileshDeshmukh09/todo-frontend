import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useFormPersistence = (formId, initialValues = {}) => {
  const [values, setValues] = useLocalStorage(`form_${formId}`, initialValues);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSubmit = (onSubmit) => {
    return async (values) => {
      try {
        await onSubmit(values);
        setIsDirty(false);
      } catch (error) {
        throw error;
      }
    };
  };

  const resetForm = () => {
    setValues(initialValues);
    setIsDirty(false);
  };

  const clearForm = () => {
    setValues({});
    setIsDirty(false);
  };

  return {
    values,
    isDirty,
    handleChange,
    handleSubmit,
    resetForm,
    clearForm,
  };
};

export const useFormPersistenceWithAutoSave = (formId, initialValues = {}, autoSaveInterval = 5000) => {
  const [values, setValues] = useLocalStorage(`form_${formId}`, initialValues);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    let timeoutId;

    if (isDirty) {
      timeoutId = setTimeout(() => {
        setIsSaving(true);
        // Simulate auto-save
        setTimeout(() => {
          setIsSaving(false);
          setIsDirty(false);
          setLastSaved(new Date());
        }, 1000);
      }, autoSaveInterval);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isDirty, autoSaveInterval]);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleSubmit = (onSubmit) => {
    return async (values) => {
      try {
        setIsSaving(true);
        await onSubmit(values);
        setIsDirty(false);
        setLastSaved(new Date());
      } catch (error) {
        throw error;
      } finally {
        setIsSaving(false);
      }
    };
  };

  const resetForm = () => {
    setValues(initialValues);
    setIsDirty(false);
    setLastSaved(null);
  };

  const clearForm = () => {
    setValues({});
    setIsDirty(false);
    setLastSaved(null);
  };

  return {
    values,
    isDirty,
    isSaving,
    lastSaved,
    handleChange,
    handleSubmit,
    resetForm,
    clearForm,
  };
};

export const useFormPersistenceWithVersion = (formId, initialValues = {}, version = '1.0.0') => {
  const [formData, setFormData] = useLocalStorage(`form_${formId}`, {
    version,
    values: initialValues,
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (formData.version !== version) {
      setFormData({
        version,
        values: initialValues,
      });
    }
  }, [version, initialValues, formData.version]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      values: { ...prev.values, [name]: value },
    }));
    setIsDirty(true);
  };

  const handleSubmit = (onSubmit) => {
    return async (values) => {
      try {
        await onSubmit(values);
        setIsDirty(false);
      } catch (error) {
        throw error;
      }
    };
  };

  const resetForm = () => {
    setFormData({
      version,
      values: initialValues,
    });
    setIsDirty(false);
  };

  const clearForm = () => {
    setFormData({
      version,
      values: {},
    });
    setIsDirty(false);
  };

  return {
    values: formData.values,
    isDirty,
    handleChange,
    handleSubmit,
    resetForm,
    clearForm,
  };
}; 