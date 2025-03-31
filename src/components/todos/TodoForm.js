import React from 'react';
import { useForm } from '../../hooks/useForm';
import { useTodos } from '../../context/TodoContext';
import { useNotification } from '../../hooks/useNotification';
import { PRIORITIES } from '../../utils/constants';
import { SUCCESS_MESSAGES } from '../../utils/constants';

const TodoForm = ({ todo, onClose }) => {
  const { createTodo, updateTodo } = useTodos();
  const { success } = useNotification();

  const initialValues = todo || {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: [],
    completed: false,
  };

  const validationRules = {
    title: ['required', { min: 3 }, { max: 100 }],
    description: ['required', { max: 500 }],
    priority: ['required'],
    dueDate: ['required'],
  };

  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
    initialValues,
    validationRules
  );

  const onSubmit = async (formValues) => {
    try {
      if (todo) {
        await updateTodo(todo._id, formValues);
        success(SUCCESS_MESSAGES.TODO_UPDATED);
      } else {
        await createTodo(formValues);
        success(SUCCESS_MESSAGES.TODO_CREATED);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={values.title}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.title
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={values.description}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.description
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Priority
        </label>
        <select
          name="priority"
          id="priority"
          value={values.priority}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.priority
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
        >
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </option>
          ))}
        </select>
        {errors.priority && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.priority}</p>
        )}
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Due Date
        </label>
        <input
          type="datetime-local"
          name="dueDate"
          id="dueDate"
          value={values.dueDate}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.dueDate
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate}</p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          name="tags"
          id="tags"
          value={values.tags.join(', ')}
          onChange={(e) => handleChange({ target: { name: 'tags', value: e.target.value.split(',').map(tag => tag.trim()) } })}
          className="mt-1 block w-full rounded-md shadow-sm sm:text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="completed"
          id="completed"
          checked={values?.completed}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600"
        />
        <label htmlFor="completed" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Mark as completed
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : todo ? 'Update Todo' : 'Create Todo'}
        </button>
      </div>
    </form>
  );
};

export default TodoForm; 