import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Collapse,
  Divider,
  Button,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

const TodoListMUI = ({
  todos,
  onEdit,
  onDelete,
  onToggleComplete,
  isLoading,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});

  const toggleNotes = (id) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditClick = (todo) => {
    setSelectedTodo(todo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTodo(null);
  };

  const handleSubmit = () => {
    if (selectedTodo) {
      onEdit(selectedTodo);
      handleClose();
    }
  };

  const handleDeleteClick = (todo) => {
    setSelectedTodo(todo);
    setOpenDelete(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTodo) {
      onDelete(selectedTodo._id);
    }
    setOpenDelete(false);
    setSelectedTodo(null);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!todos?.length) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No todos found. Create one to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <List>
        {todos.map((todo) => (
          <Paper key={todo.id} sx={{ mb: 1 }}>
            <ListItem>
              <IconButton
                edge="start"
                onClick={() => onToggleComplete(todo._id, !todo.completed)}
                color={todo?.completed ? "success" : "default"}
              >
                {todo?.completed ? <CheckCircleIcon /> : <UncheckedIcon />}
              </IconButton>

              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        textDecoration: todo?.completed
                          ? "line-through"
                          : "none",
                        color: todo?.completed
                          ? "text.secondary"
                          : "text.primary",
                      }}
                    >
                      {todo.title}
                    </Typography>
                    <Chip
                      label={todo.priority}
                      size="small"
                      color={
                        todo.priority === "high"
                          ? "error"
                          : todo.priority === "medium"
                          ? "warning"
                          : "success"
                      }
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: "block", mb: 1 }}
                    >
                      {todo.description}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.secondary"
                    >
                      Created: {format(new Date(todo.createdAt), "PPp")}
                    </Typography>
                  </>
                }
              />

              <ListItemSecondaryAction>
                <IconButton onClick={() => toggleNotes(todo._id)}>
                  <NotesIcon
                    color={expandedNotes[todo._id] ? "primary" : "action"}
                  />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleEditClick(todo)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  edge="end"
                  onClick={() => handleDeleteClick(todo)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Collapse in={expandedNotes[todo._id]} timeout="auto" unmountOnExit>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="subtitle2">Notes:</Typography>
                {todo.notes.length > 0 ? (
                  todo.notes.map((note, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      color="text.secondary"
                    >
                      - {note.content} (
                      {format(new Date(note.createdAt), "PPp")})
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No notes available.
                  </Typography>
                )}
              </Box>
            </Collapse>
          </Paper>
        ))}
      </List>

      {/* Edit Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={selectedTodo?.title || ""}
            onChange={(e) =>
              setSelectedTodo({ ...selectedTodo, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={selectedTodo?.description || ""}
            onChange={(e) =>
              setSelectedTodo({ ...selectedTodo, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedTodo?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TodoListMUI;
