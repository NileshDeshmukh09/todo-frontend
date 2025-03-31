import { useState, useCallback, useEffect } from 'react';

export const useFieldDependencies = (dependencies) => {
  const [values, setValues] = useState({});
  const [dependentValues, setDependentValues] = useState({});

  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  useEffect(() => {
    const newDependentValues = {};
    Object.entries(dependencies).forEach(([field, rules]) => {
      const value = values[field];
      let dependentValue = value;

      if (rules.transform) {
        dependentValue = rules.transform(value, values);
      }

      if (rules.validate) {
        const isValid = rules.validate(value, values);
        if (!isValid) {
          dependentValue = rules.defaultValue || '';
        }
      }

      if (rules.compute) {
        dependentValue = rules.compute(value, values);
      }

      newDependentValues[field] = dependentValue;
    });

    setDependentValues(newDependentValues);
  }, [values, dependencies]);

  return {
    values,
    dependentValues,
    handleChange,
  };
};

export const useConditionalFields = (conditions) => {
  const [values, setValues] = useState({});
  const [visibleFields, setVisibleFields] = useState({});

  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  useEffect(() => {
    const newVisibleFields = {};
    Object.entries(conditions).forEach(([field, condition]) => {
      newVisibleFields[field] = condition(values);
    });

    setVisibleFields(newVisibleFields);
  }, [values, conditions]);

  return {
    values,
    visibleFields,
    handleChange,
  };
};

export const useFieldComputation = (computations) => {
  const [values, setValues] = useState({});
  const [computedValues, setComputedValues] = useState({});

  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  useEffect(() => {
    const newComputedValues = {};
    Object.entries(computations).forEach(([field, compute]) => {
      newComputedValues[field] = compute(values);
    });

    setComputedValues(newComputedValues);
  }, [values, computations]);

  return {
    values,
    computedValues,
    handleChange,
  };
};

export const useFieldValidation = (validationRules) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(true);

  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  useEffect(() => {
    const newErrors = {};
    let formIsValid = true;

    Object.entries(validationRules).forEach(([field, rules]) => {
      const value = values[field];
      const fieldErrors = [];

      rules.forEach((rule) => {
        if (rule.required && !value) {
          fieldErrors.push('This field is required');
          formIsValid = false;
        }

        if (rule.validate) {
          const error = rule.validate(value, values);
          if (error) {
            fieldErrors.push(error);
            formIsValid = false;
          }
        }

        if (rule.dependencies) {
          const dependencyValues = rule.dependencies.map((dep) => values[dep]);
          if (rule.validateDependencies(...dependencyValues)) {
            const error = rule.validate(value, values);
            if (error) {
              fieldErrors.push(error);
              formIsValid = false;
            }
          }
        }
      });

      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors;
      }
    });

    setErrors(newErrors);
    setIsValid(formIsValid);
  }, [values, validationRules]);

  return {
    values,
    errors,
    isValid,
    handleChange,
  };
};

export const useFieldTransformation = (transformations) => {
  const [values, setValues] = useState({});
  const [transformedValues, setTransformedValues] = useState({});

  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  useEffect(() => {
    const newTransformedValues = {};
    Object.entries(transformations).forEach(([field, transform]) => {
      newTransformedValues[field] = transform(values[field], values);
    });

    setTransformedValues(newTransformedValues);
  }, [values, transformations]);

  return {
    values,
    transformedValues,
    handleChange,
  };
}; 