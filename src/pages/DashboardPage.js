// src/pages/DashboardPage.js
import React from 'react';
import { Typography, Grid, Paper, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { useDangerZoneStatus, useOrders, useEvents } from '../hooks/useApi';

const getStatusChipColor = (status) => {
  switch (status) {
    case 'Danger': return 'error';
    case 'Watch': return 'warning';
    case 'Go': return 'success';
    default: return 'default';
  }
};

const StatsCard = ({ title, value, isLoading }) => (
    <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">
            {isLoading ? <CircularProgress size={24} /> : value}
        </Typography>
    </Paper>
);

export default function DashboardPage() {
  const { data: dangerZone, isLoading: isLoadingDanger, isError: isErrorDanger, error: errorDanger } = useDangerZoneStatus();
  const { data: orders, isLoading: isLoadingOrders } = useOrders();
  const { data: events, isLoading: isLoadingEvents } = useEvents();

  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) || 0;

  if (isErrorDanger) return <Alert severity="error">{errorDanger.message}</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>Command Center</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
            <StatsCard title="Total Revenue" value={`$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`} isLoading={isLoadingOrders} />
        </Grid>
        <Grid item xs={12} md={4}>
            <StatsCard title="Total Orders" value={orders?.length.toLocaleString() || '...'} isLoading={isLoadingOrders} />
        </Grid>
        <Grid item xs={12} md={4}>
            <StatsCard title="Active Events" value={events?.length.toLocaleString() || '...'} isLoading={isLoadingEvents} />
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
            {isLoadingDanger ? (
                <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
            ) : (
                dangerZone?.map((event) => (
                  <TableRow key={event.event_id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell align="center">
                      <Chip label={event.status} color={getStatusChipColor(event.status)} />
                    </TableCell>
                    <TableCell align="center">{event.daysUntil}</TableCell>
                    <TableCell align="center">{event.combined}</TableCell>
                    <TableCell align="center">{event.threshold}</TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
