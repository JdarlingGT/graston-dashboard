// src/pages/EventDetailPage.js

import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Alert, Paper, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEventRoster } from '../hooks/useApi';

const getStatusChipColor = (color) => {
  switch (color) {
    case 'red': return 'error';
    case 'orange': return 'warning';
    case 'green': return 'success';
    default: return 'default';
  }
};

const columns = [
  { field: 'display_name', headerName: 'Name', width: 200 },
  { field: 'user_email', headerName: 'Email', width: 250 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  {
    field: 'preCourseStatus',
    headerName: 'Pre-Course Status',
    width: 180,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={getStatusChipColor(params.row.preCourseStatusColor)}
        size="small"
      />
    ),
  },
  {
    field: 'hasPurchasedInstruments',
    headerName: 'Instruments',
    width: 120,
    renderCell: (params) => (
      <Typography color={params.value ? 'success.main' : 'error.main'}>
        {params.value ? 'Yes' : 'No'}
      </Typography>
    ),
  },
  // Add more columns for license_number, billing_state, tags, etc.
];

export default function EventDetailPage() {
  const { eventId } = useParams(); // Get the event ID from the URL
  const { data: roster, isLoading, isError, error } = useEventRoster(eventId);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">{error.message}</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Student Roster for Event #{eventId}
      </Typography>
      <Paper style={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={roster || []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          // The DataGrid component has built-in filtering and sorting!
        />
      </Paper>
    </>
  );
}
