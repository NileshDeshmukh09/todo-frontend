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
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Notes as NotesIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import TodoFormMUI from "./TodoFormMUI";
import { useUsers } from "../../context/UserContext";

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
  const { users } = useUsers();

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
          <Paper
            key={todo.id}
            sx={{ mb: 1, p: 2, borderRadius: 2, boxShadow: 3 }}
          >
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
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecoration: todo?.completed ? "line-through" : "none",
                      color: todo?.completed
                        ? "text.secondary"
                        : "text.primary",
                      fontWeight: "bold",
                    }}
                  >
                    {todo.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {todo.description}
                    </Typography>
                    {todo.tags.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        {todo.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    )}
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      {todo.assignedUsers.length > 0 && (
                        <Tooltip
                          title={
                            <Box
                              sx={{
                                p: 1,
                                textAlign: "left",
                                backgroundColor: "white",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.primary"
                                fontWeight="bold"
                              >
                                Assigned Users:
                              </Typography>
                              {todo.assignedUsers.map((user, index) => (
                                <Typography
                                  key={index}
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ display: "block" }}
                                >
                                  {index + 1}. {user}
                                </Typography>
                              ))}
                            </Box>
                          }
                          arrow
                          placement="top"
                          PopperProps={{
                            modifiers: [
                              {
                                name: "preventOverflow",
                                options: {
                                  boundary: "window",
                                },
                              },
                            ],
                          }}
                          sx={{
                            "& .MuiTooltip-tooltip": {
                              backgroundColor: "white",
                              color: "black", // Change text color if needed
                              boxShadow: 2, // Optional: Add shadow for better visibility
                            },
                            "& .MuiTooltip-arrow": {
                              color: "white", // Ensure the arrow matches the tooltip background
                            },
                          }}
                        >
                          <Chip
                            icon={<PeopleIcon />}
                            label={`${todo.assignedUsers.length} Assigned`}
                            size="small"
                            sx={{ cursor: "pointer", fontWeight: "bold" }}
                          />
                        </Tooltip>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        Created: {format(new Date(todo.createdAt), "PPp")}
                      </Typography>
                    </Box>
                  </>
                }
              />

              <ListItemSecondaryAction>
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
                <Tooltip title={"View Notes"}>
                  <IconButton onClick={() => toggleNotes(todo._id)}>
                    <NotesIcon
                      color={expandedNotes[todo._id] ? "primary" : "action"}
                    />
                  </IconButton>
                </Tooltip>
                {/* <Tooltip title={"Edit"}> */}
                <IconButton
                  edge="end"
                  onClick={() => handleEditClick(todo)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                {/* </Tooltip> */}
                <Tooltip title={"Delete"}>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteClick(todo)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
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
      <Dialog open={open} maxWidth="md"onClose={handleClose} disableEscapeKeyDown>
        <TodoFormMUI userList={users} onSubmit={onEdit} initialValues={selectedTodo}/>
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
