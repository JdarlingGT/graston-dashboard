// src/pages/EventsPage.js

import React from 'react';
import { Typography, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEvents } from '../hooks/useApi';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Event Name', width: 350 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'price', headerName: 'Price ($)', type: 'number', width: 120 },
  { field: 'total_sales', headerName: 'Total Sales', type: 'number', width: 150 },
  { field: 'date_created', headerName: 'Date Created', width: 180,
    valueFormatter: (params) => new Date(params.value).toLocaleString(),
  },
];

export default function EventsPage() {
  const { data: events, isLoading, isError } = useEvents();

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Failed to load events.</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>Training Events</Typography>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={events || []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    </>
  );
}
