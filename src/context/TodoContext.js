import React, { createContext, useContext, useState, useCallback } from "react";
import { todoAPI } from "../services/api";

const TodoContext = createContext(null);

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await todoAPI.getAllTodos(filters);
      setTodos(response?.todos);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = async (todoData) => {
    debugger;
    setLoading(true);
    try {
      const response = await todoAPI.createTodo(todoData);
      setTodos((prev) => [...prev, response]);
      fetchTodos();
      setError(null);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create todo");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id, todoData) => {
    debugger;
    setLoading(true);
    try {
      const payload = {};
      if (todoData._id) payload._id = todoData._id;
      if (todoData.title) payload.title = todoData.title.trim();
      if (todoData.description) payload.description = todoData.description.trim();
      if (todoData.priority) payload.priority = todoData.priority.toLowerCase();
      if (todoData.completed !== undefined)
        payload.completed = Boolean(todoData.completed);
      if(todoData?.tags.length> 0 ) payload.tags = todoData.tags;
      if(todoData?.assignedUsers.length > 0 ) payload.assignedUsers = todoData.assignedUsers;

      const response = await todoAPI.updateTodo(id, payload);
      debugger;
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? response : todo))
      );
      fetchTodos();
      setError(null);
      return response.todos;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update todo");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await todoAPI.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      fetchTodos();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete todo");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        fetchTodos,
        createTodo,
        updateTodo,
        deleteTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};
