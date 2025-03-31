import React, { createContext, useContext, useState, useCallback } from "react";
import { UsersAPI } from "../services/api";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await UsersAPI.getAllUsers()
      setUsers(response);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch Users");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        fetchUsers
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
