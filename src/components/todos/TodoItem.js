import React, { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import { useNotification } from '../../hooks/useNotification';
import { formatDate, getPriorityColor, getPriorityLabel, truncateText } from '../../utils/helpers';
import { SUCCESS_MESSAGES } from '../../utils/constants';

const TodoItem = ({ todo, onDelete, onEdit }) => {
  const { updateTodo, addNote } = useTodos();
  const { success } = useNotification();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNote, setNewNote] = useState('');

  const handleStatusChange = async () => {
    try {
      await updateTodo(todo._id, { completed: !todo.completed });
      success(SUCCESS_MESSAGES.TODO_UPDATED);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await addNote(todo._id, { content: newNote });
      setNewNote('');
      success(SUCCESS_MESSAGES.NOTE_ADDED);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  return (
    <li className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleStatusChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                todo.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'
              }`}>
                {todo.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {truncateText(todo.description)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className="px-2 py-1 text-xs font-medium rounded-full"
              style={{ backgroundColor: getPriorityColor(todo.priority) + '20', color: getPriorityColor(todo.priority) }}
            >
              {getPriorityLabel(todo.priority)}
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <svg
                className={`h-5 w-5 transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={() => onEdit(todo)}
              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(todo._id)}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-800">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Description</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{todo.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Due Date</h4>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(todo.dueDate)}
              </p>
            </div>

            {todo.tags && todo.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Tags</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {todo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notes</h4>
              <div className="mt-2 space-y-2">
                {todo.notes?.map((note) => (
                  <div
                    key={note._id}
                    className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 p-2 rounded"
                  >
                    {note.content}
                  </div>
                ))}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default TodoItem; 