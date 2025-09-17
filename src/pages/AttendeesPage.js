// src/pages/AttendeesPage.js

import React from 'react';
import { Typography, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useAttendees } from '../hooks/useApi';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'full_name', headerName: 'Full Name', width: 250,
    valueGetter: (params) => `${params.row.first_name || ''} ${params.row.last_name || ''}`
  },
  { field: 'email', headerName: 'Email', width: 300 },
  { field: 'status', headerName: 'Status', width: 120 },
  { field: 'created_at', headerName: 'Date Created', width: 180,
    valueFormatter: (params) => new Date(params.value).toLocaleString(),
  },
];

export default function AttendeesPage() {
  const { data: attendeesData, isLoading, isError } = useAttendees();

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Failed to load attendees.</Alert>;

  const attendees = attendeesData?.subscribers || [];

  return (
    <>
      <Typography variant="h4" gutterBottom>Attendees</Typography>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={attendees}
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
