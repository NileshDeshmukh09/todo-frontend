import React from 'react';
import { useTodos } from '../../hooks/useTodos';
import { Button, Tooltip, CircularProgress } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

const TodoExport = () => {
  const { exportTodos } = useTodos();
  const [loading, setLoading] = React.useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await exportTodos();
    } catch (error) {
      console.error('Failed to export todos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title="Export Todos as CSV">
      <Button
        onClick={handleExport}
        variant="contained"
        color="primary"
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
        disabled={loading}
        sx={{
          textTransform: 'none',
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        {loading ? 'Exporting...' : 'Export CSV'}
      </Button>
    </Tooltip>
  );
};

export default TodoExport;
