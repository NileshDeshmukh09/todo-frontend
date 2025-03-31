import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';
import { useForm } from '../../hooks/useForm';

const TodoFormMUI = ({ userList , onSubmit, initialValues = {}, isSubmitting = false }) => {
  const [users, setUsers] = useState(userList);
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      title: '',
      description: '',
      priority: 'medium',
      completed: false,
      tags: initialValues?.tags || [],
      assignedUsers: initialValues?.assignedUsers || [],      
      ...initialValues
    },
    validationRules: {
      title: ['required', 'min:2'],
      description: ['required'],
      priority: ['required']
    },
    onSubmit: async (formValues) => {
      const payload = {
        title: formValues?.title,
        description: formValues?.description,
        priority: formValues?.priority.toLowerCase(),
        completed: Boolean(formValues?.completed),
        tags: formValues?.tags,
        assignedUsers: formValues?.assignedUsers // Include assigned users in the payload
      };

      if(formValues._id){
        payload._id = formValues._id;
      }
      debugger;
      await onSubmit(payload);
    }
  });

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {initialValues._id ? 'Edit Todo' : 'Create New Todo'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={values?.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={4}
            disabled={isSubmitting}
          />

          <FormControl fullWidth error={!!errors.priority}>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={values.priority}
              onChange={handleChange}
              label="Priority"
              disabled={isSubmitting}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
            {errors.priority && (
              <Typography color="error" variant="caption">
                {errors.priority}
              </Typography>
            )}
          </FormControl>

          {/* Tags Field */}
          <TextField
            fullWidth
            label="Tags (comma separated)"
            name="tags"
            value={values.tags?.join(', ')}
            onChange={(e) => {
              const tags = e.target.value?.split(',').map(tag => tag.trim());
              handleChange({ target: { name: 'tags', value: tags } });
            }}
            disabled={isSubmitting}
          />

          {/* Assigned Users Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Assigned Users</InputLabel>
            <Select
              name="assignedUsers"
              value={values.assignedUsers}
              onChange={handleChange}
              multiple
              disabled={isSubmitting}
              label="Assigned Users"
            >
              {users?.map((user) => (
                <MenuItem key={user.username} value={user.username}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                name="completed"
                checked={values.completed}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            }
            label="Completed"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              initialValues._id ? 'Update Todo' : 'Create Todo'
            )}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default TodoFormMUI;
