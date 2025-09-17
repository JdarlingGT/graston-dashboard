// src/pages/AttendeesPage.js

import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAttendees } from '../api';

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
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAttendees();
        setAttendees(data.subscribers || []); // Data is nested under 'subscribers' key
      } catch (err) {
        setError('Failed to load attendees.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

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
