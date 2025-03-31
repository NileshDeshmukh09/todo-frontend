import React from "react";
import {
  Paper,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import TodoExport from "./TodoExport";

const TodoFiltersMUI = ({
  filters,
  onFilterChange,
  onSearch,
  onClear,
  isLoading,
  users,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, name === "assignedUsers" ? (Array.isArray(value) ? value : [value]) : value);
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 4,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* First Row */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search..."
            name="search"
            value={filters.search}
            onChange={handleChange}
            onKeyPress={(e) => e.key === "Enter" && onSearch()}
            disabled={isLoading}
            variant="outlined"
            sx={{ borderRadius: 3, backgroundColor: "white", boxShadow: 1 }}
            InputProps={{
              endAdornment: (
                <Tooltip title="Search">
                  <IconButton
                    onClick={onSearch}
                    disabled={isLoading}
                    sx={{ color: "primary.main", transition: "0.3s", "&:hover": { color: "primary.dark" } }}
                  >
                    {isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                  </IconButton>
                </Tooltip>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={filters.priority}
              onChange={handleChange}
              label="Priority"
              disabled={isLoading}
              sx={{ borderRadius: 3, backgroundColor: "white", boxShadow: 1 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="completed"
              value={filters?.completed}
              onChange={handleChange}
              label="Status"
              disabled={isLoading}
              sx={{ borderRadius: 3, backgroundColor: "white", boxShadow: 1 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="false">Active</MenuItem>
              <MenuItem value="true">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Second Row */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>"Assigned Users"</InputLabel>
            <Select
              name="assignedUsers"
              multiple
              value={filters.assignedUsers || []} 
              onChange={handleChange}
              disabled={isLoading}
              sx={{ borderRadius: 3, backgroundColor: "white", boxShadow: 1 }}
              renderValue={(selected) =>
                users
                  .filter((user) => selected.includes(user.username))
                  .map((user) => user.username)
                  .join(", ")
              }
            >
              <MenuItem value="">All</MenuItem>
              {users?.map((user) => (
                <MenuItem key={user.username} value={user.username}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
              label="Sort By"
              disabled={isLoading}
              sx={{ borderRadius: 3, backgroundColor: "white", boxShadow: 1 }}
            >
              <MenuItem value="createdAt:desc">Newest First</MenuItem>
              <MenuItem value="createdAt:asc">Oldest First</MenuItem>
              <MenuItem value="priority:desc">Priority (High to Low)</MenuItem>
              <MenuItem value="priority:asc">Priority (Low to High)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "flex-end",
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          color="error"
          startIcon={<ClearIcon />}
          onClick={onClear}
          disabled={isLoading}
          sx={{
            textTransform: "none",
            borderRadius: 3,
            px: 3,
            fontWeight: "bold",
            boxShadow: "0px 4px 6px rgba(255, 0, 0, 0.2)",
          }}
        >
          Clear Filters
        </Button>
        <TodoExport />
      </Box>
    </Paper>
  );
};

export default TodoFiltersMUI;