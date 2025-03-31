import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useNotification } from '../hooks/useNotification';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { showNotification } = useNotification();

  const handleThemeToggle = () => {
    toggleTheme();
    showNotification(
      `Theme changed to ${theme === 'dark' ? 'light' : 'dark'} mode`,
      'success'
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Application Settings
        </h1>
        <div className="mt-6 space-y-6">
          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Theme Settings
            </h2>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="theme-toggle"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Dark Mode
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Toggle between light and dark theme
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={theme === 'dark'}
                  onClick={handleThemeToggle}
                  className={`${
                    theme === 'dark'
                      ? 'bg-indigo-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        theme === 'dark'
                          ? 'opacity-0 duration-100 ease-out'
                          : 'opacity-100 duration-200 ease-in'
                      } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                      aria-hidden="true"
                    >
                      <svg
                        className="h-3 w-3 text-gray-400"
                        fill="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M4 8a2 2 0 012-2h0a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2V8zM5 3a1 1 0 100-2 1 1 0 000 2zM10 8a1 1 0 11-2 0 1 1 0 012 0zM7 1a1 1 0 100 2h3a1 1 0 100-2H7zM4 11a1 1 0 011-1h3a1 1 0 110 2H5a1 1 0 01-1-1z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <span
                      className={`${
                        theme === 'dark'
                          ? 'opacity-100 duration-200 ease-in'
                          : 'opacity-0 duration-100 ease-out'
                      } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                      aria-hidden="true"
                    >
                      <svg
                        className="h-3 w-3 text-indigo-600"
                        fill="currentColor"
                        viewBox="0 0 12 12"
                      >
                        <path d="M6 8a2 2 0 100-4 2 2 0 000 4zM6 0a1 1 0 100 2 1 1 0 000-2zM6 10a1 1 0 100 2 1 1 0 000-2zM0 6a1 1 0 112 0 1 1 0 01-2 0zM10 6a1 1 0 112 0 1 1 0 01-2 0zM4.343 4.343a1 1 0 111.414 1.414 1 1 0 01-1.414-1.414zM4.343 9.657a1 1 0 111.414 1.414 1 1 0 01-1.414-1.414zM9.657 4.343a1 1 0 111.414 1.414 1 1 0 01-1.414-1.414zM9.657 9.657a1 1 0 111.414 1.414 1 1 0 01-1.414-1.414z" />
                      </svg>
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Notification Settings
            </h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="email-notifications"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email Notifications
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications for important updates
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={false}
                  className="bg-gray-200 dark:bg-gray-700 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0">
                    <span
                      className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                      aria-hidden="true"
                    >
                      <svg
                        className="h-3 w-3 text-gray-400"
                        fill="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M4 8a2 2 0 012-2h0a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2V8zM5 3a1 1 0 100-2 1 1 0 000 2zM10 8a1 1 0 11-2 0 1 1 0 012 0zM7 1a1 1 0 100 2h3a1 1 0 100-2H7zM4 11a1 1 0 011-1h3a1 1 0 110 2H5a1 1 0 01-1-1z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="push-notifications"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Push Notifications
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive push notifications for real-time updates
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={false}
                  className="bg-gray-200 dark:bg-gray-700 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0">
                    <span
                      className="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                      aria-hidden="true"
                    >
                      <svg
                        className="h-3 w-3 text-gray-400"
                        fill="none"
                        viewBox="0 0 12 12"
                      >
                        <path
                          d="M4 8a2 2 0 012-2h0a2 2 0 012 2v3a2 2 0 01-2 2H6a2 2 0 01-2-2V8zM5 3a1 1 0 100-2 1 1 0 000 2zM10 8a1 1 0 11-2 0 1 1 0 012 0zM7 1a1 1 0 100 2h3a1 1 0 100-2H7zM4 11a1 1 0 011-1h3a1 1 0 110 2H5a1 1 0 01-1-1z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Data Management
            </h2>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Export Data
              </button>
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 