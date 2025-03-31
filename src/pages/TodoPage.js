import React, { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import TodoListMUI from '../components/todos/TodoListMUI';
import TodoFormMUI from '../components/todos/TodoFormMUI';
import TodoFiltersMUI from '../components/todos/TodoFiltersMUI';
import { useTodos } from '../context/TodoContext';
import { useUsers } from '../context/UserContext';

const TodoPage = () => {
  const { todos, loading, error, fetchTodos, createTodo, updateTodo, deleteTodo } = useTodos();
  const { users , fetchUsers} = useUsers();
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    completed: '',
    sortBy: 'createdAt:desc',
  });

  useEffect( ()=> {
    fetchUsers()
  }, [fetchUsers]);
  useEffect(() => {
    const appliedFilters = {};
    if (filters.search) appliedFilters.search = filters.search;
    if (filters.priority) appliedFilters.priority = filters.priority;
    if (filters.completed) appliedFilters.completed = filters.completed;
    if (filters.sortBy) appliedFilters.sortBy = filters.sortBy;
    if (filters.assignedUsers) appliedFilters.assignedUsers = filters.assignedUsers?.join(",");

    fetchTodos(appliedFilters);
  }, [fetchTodos, filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      await updateTodo(id, { completed });
    } catch (err) {
    }
  };

  const handleCreateTodo = async (todoData) => {
    
    try {
      await createTodo(todoData);
    } catch (err) {
    }
  };

  const handleUpdateTodo = async (todo) => {
    debugger;
    try {
      await updateTodo(todo._id, todo);
    } catch (err) {
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
    } catch (err) {
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      priority: "",
      completed: "",
      sortBy: "createdAt:desc",
      assignedUsers:''
    });
  };

  return (
   
    <Container maxWidth="lg">
     
      <Typography variant="h4" component="h1" gutterBottom>
        My Todos
      </Typography>

      <TodoFiltersMUI
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
        isLoading={loading}
        users={users}
      />

      <TodoListMUI
        todos={todos}
        onEdit={handleUpdateTodo}
        onDelete={handleDeleteTodo}
        onToggleComplete={handleToggleComplete}
        isLoading={loading}
        error={error}
      />

<TodoFormMUI userList={users} onSubmit={handleCreateTodo} />
    </Container>
  );
};

export default TodoPage; 