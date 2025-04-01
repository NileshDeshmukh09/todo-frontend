import React from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Link,
  CircularProgress,
  Alert,
  List,
  ListItem
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { authAPI } from "../../services/api";

const LoginFormMUI = ({ onSubmit, isSubmitting = false, error = null }) => {
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validationRules: {
      email: ["required", "email"],
      password: ["required", "min:6"],
    },
    onSubmit: async (formValues) => {
      const payload = {
        email: formValues.email,
        password: formValues.password,
      };
      await onSubmit(payload);
    },
  });

  const dummyUsers = [
    { email: "user1@example.com", password: "ChangeMe123!" },
    { email: "user2@example.com", password: "ChangeMe123!" },
    { email: "admin@example.com", password: "ChangeMe123!" },
    {}
  ];

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isSubmitting}
            autoComplete="email"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isSubmitting}
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link component={RouterLink} to="/register" underline="hover">
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
    Dummy Users:
  </Typography>
  <List dense>
    {dummyUsers.map((user, index) => (
      <ListItem
        key={index}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: 1,
          borderBottom: index !== dummyUsers.length - 1 ? "1px solid #ddd" : "none",
        }}
      >
        <Typography variant="body2">
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body2">
          <strong>Password:</strong> {user.password}
        </Typography>
      </ListItem>
    ))}
  </List>
      </form>
    </Paper>
  );
};

export default LoginFormMUI;
