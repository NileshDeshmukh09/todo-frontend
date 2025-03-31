import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {
          refreshToken
        });

        const { token } = response.data;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Response validation helper
const validateResponse = (response, schema) => {
  return response;
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    // Validate payload before sending
    if (!userData?.email || !userData?.password || !userData?.name) {
      throw new Error('All fields are required');
    }
    const response = await api.post('/auth/register', {
      username: userData.name.trim(),
      email: userData.email.trim(),
      password: userData.password
    });
    debugger;
    return response.data;
  },
  login: async (credentials) => {
    // Validate payload before sending
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Email and password are required');
    }
    const response = await api.post('/auth/login', {
      email: credentials.email.trim(),
      password: credentials.password
    });
    const { token, refreshToken } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
 
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return validateResponse(response.data);
  }
};

// Todo API
export const todoAPI = {
  getAllTodos: async (params = {}) => {
    // Clean up filter parameters
    const cleanParams = {};
    if (params.search) cleanParams.search = params.search.trim();
    if (params.priority) cleanParams.priority = params.priority.toLowerCase();
    if (params.completed !== undefined) cleanParams.completed = String(params.completed);
    if (params.sortBy) cleanParams.sortBy = params.sortBy;
    if (params.assignedUsers) cleanParams.assignedUsers = params.assignedUsers;


    const response = await api.get('/todos', { params: cleanParams });
    return validateResponse(response.data);
  },
  getTodo: async (id) => {
    const response = await api.get(`/todos/${id}`);
    return validateResponse(response.data);
  },
  createTodo: async (todoData) => {
    // Validate payload before sending
    if (!todoData?.title) {
      throw new Error('Title is required');
    }
    debugger;
   const payload =  {
      title: todoData?.title.trim(),
      description: todoData.description?.trim() || '',
      priority: todoData.priority || 'medium',
      completed: Boolean(todoData.completed)
    }

    if(todoData?.tags.length> 0 ) payload.tags = todoData.tags;
    if(todoData?.assignedUsers.length > 0 ) payload.assignedUsers = todoData.assignedUsers;
    const response = await api.post('/todos', payload);
    return response.data;
  },
  updateTodo: async (id, todoData) => {
    if (!id) {
      throw new Error('Todo ID is required');
    }
    // Only send fields that are actually being updated
    const payload = {};
    if (todoData.title !== undefined) payload.title = todoData.title.trim();
    if (todoData.description !== undefined) payload.description = todoData.description.trim();
    if (todoData.priority !== undefined) payload.priority = todoData.priority;
    if (todoData.completed !== undefined) payload.completed = Boolean(todoData.completed);
    if(todoData?.tags.length> 0 ) payload.tags = todoData.tags;
      if(todoData?.assignedUsers.length > 0 ) payload.assignedUsers = todoData.assignedUsers;

    const response = await api.put(`/todos/${id}`, payload);
    return response.data;
  },
  deleteTodo: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return validateResponse(response.data);
  },
  addNote: async (id, data) => {
    const response = await api.post(`/todos/${id}/notes`, data);
    return validateResponse(response.data);
  },
  exportTodos: async (params) => {
    const response = await api.get('/todos/export/csv', {
      params,
      responseType: 'blob'
    });
    return response.data;
  }
};

// users API
export const UsersAPI = {
  getAllUsers : async (params = {}) => {
    const response = await api.get("/users");
    return response.data;
  },
}

export default api; 