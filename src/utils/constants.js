export const API_BASE_URL = 'http://localhost:5000/api';

export const PRIORITIES = ['high', 'medium', 'low'];

export const ITEMS_PER_PAGE = 10;

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export const SORT_DIRECTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

export const FILTER_OPTIONS = {
  priority: PRIORITIES,
  status: ['completed', 'pending'],
  sortBy: SORT_OPTIONS,
  sortDirection: SORT_DIRECTIONS,
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  INVALID_CREDENTIALS: 'Invalid email or password',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in',
  REGISTER_SUCCESS: 'Successfully registered',
  LOGOUT_SUCCESS: 'Successfully logged out',
  TODO_CREATED: 'Todo created successfully',
  TODO_UPDATED: 'Todo updated successfully',
  TODO_DELETED: 'Todo deleted successfully',
  NOTE_ADDED: 'Note added successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
};

export const TOAST_DURATION = 3000;

export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_NOTE_LENGTH = 1000; 