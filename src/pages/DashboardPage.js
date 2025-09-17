// src/pages/DashboardPage.js

import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { getDangerZoneStatus, getOrders, getAttendees } from '../api';

const getStatusChipColor = (status) => {
  switch (status) {
    case 'Danger': return 'error';
    case 'Watch': return 'warning';
    case 'Go': return 'success';
    default: return 'default';
  }
};

export default function DashboardPage() {
  const [dangerZone, setDangerZone] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, attendees: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dangerData, ordersData, attendeesData] = await Promise.all([
          getDangerZoneStatus(),
          getOrders(),
          getAttendees()
        ]);

        setDangerZone(dangerData);

        const totalRevenue = ordersData.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
        setStats({
          revenue: totalRevenue,
          orders: ordersData.length,
          attendees: attendeesData.subscribers?.length || 0
        });

      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
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
      <Typography variant="h4" gutterBottom>Command Center</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h4">${stats.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h4">{stats.orders.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Attendees</Typography>
            <Typography variant="h4">{stats.attendees.toLocaleString()}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>At-Risk Events</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event Title</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Days Until</TableCell>
              <TableCell align="center">Confirmed</TableCell>
              <TableCell align="center">Threshold</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dangerZone.map((event) => (
              <TableRow key={event.event_id}>
                <TableCell>{event.title}</TableCell>
                <TableCell align="center">
                  <Chip label={event.status} color={getStatusChipColor(event.status)} />
                </TableCell>
                <TableCell align="center">{event.daysUntil}</TableCell>
                <TableCell align="center">{event.combined}</TableCell>
                <TableCell align="center">{event.threshold}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
