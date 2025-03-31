import { useState, useEffect } from 'react';
import { todoAPI } from '../services/api';
import { useNotification } from './useNotification';

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    search: '',
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const { showNotification } = useNotification();

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoAPI.getAllTodos({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      setTodos(response.todos);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch todos');
      showNotification(err.message || 'Failed to fetch todos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [pagination?.page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (sortBy, sortDirection) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy || prev.sortBy,
      sortDirection: sortDirection || prev.sortDirection,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleStatusChange = async (id, completed) => {
    try {
      await todoAPI.updateTodo(id, { completed });
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, completed } : todo
        )
      );
      showNotification('Todo status updated successfully', 'success');
    } catch (err) {
      showNotification(err.message || 'Failed to update todo status', 'error');
      throw err;
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
      showNotification('Todo deleted successfully', 'success');
    } catch (err) {
      showNotification(err.message || 'Failed to delete todo', 'error');
      throw err;
    }
  };

  const exportTodos = async () => {
    try {
      const response = await todoAPI.exportTodos(filters);
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'todos.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification('Todos exported successfully', 'success');
    } catch (err) {
      showNotification(err.message || 'Failed to export todos', 'error');
      throw err;
    }
  };

  return {
    todos,
    loading,
    error,
    filters,
    pagination,
    handleFilterChange,
    handleSortChange,
    handlePageChange,
    handleStatusChange,
    handleDeleteTodo,
    exportTodos,
  };
}; 