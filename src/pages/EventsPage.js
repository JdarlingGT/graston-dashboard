// src/pages/EventsPage.js

import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getEvents } from '../api';

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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError('Failed to load events.');
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
      <Typography variant="h4" gutterBottom>Training Events</Typography>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={events}
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
