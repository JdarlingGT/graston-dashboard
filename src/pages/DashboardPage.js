// src/pages/DashboardPage.js
import React from 'react';
import { Typography, Grid, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import { useDangerZoneStatus, useOrders, useAttendees, useWooCustomers } from '../hooks/useApi';

const getStatusChipColor = (status) => {
  switch (status) {
    case 'Danger': return 'error';
    case 'Watch': return 'warning';
    case 'Go': return 'success';
    default: return 'default';
  }
};

const StatsCard = ({ title, value, icon, color, isLoading }) => (
    <Card sx={{ height: '100%' }}>
        <CardHeader
            avatar={<Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>{icon}</Avatar>}
            title={<Typography variant="h4">{isLoading ? <CircularProgress size={28} /> : value}</Typography>}
            subheader={<Typography color="text.secondary">{title}</Typography>}
        />
    </Card>
);

export default function DashboardPage() {
  const { data: dangerZone, isLoading: isLoadingDanger, isError, error } = useDangerZoneStatus();
  const { data: orders, isLoading: isLoadingOrders } = useOrders();
  const { data: attendeesData, isLoading: isLoadingAttendees } = useAttendees();
  const { data: customersData, isLoading: isLoadingCustomers } = useWooCustomers();

  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) || 0;
  const totalAttendees = attendeesData?.subscribers?.length || 0;
  const totalCustomers = customersData?.length || 0;

  if (isError) return <Alert severity="error" sx={{ m: 2 }}>{error.message}</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>Command Center</Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Revenue" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0 })}`} icon={<MonetizationOnIcon />} color="success.main" isLoading={isLoadingOrders} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Orders" value={orders?.length.toLocaleString() ?? '...'} icon={<ShoppingCartIcon />} color="primary.main" isLoading={isLoadingOrders} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Attendees" value={totalAttendees.toLocaleString()} icon={<PeopleIcon />} color="secondary.main" isLoading={isLoadingAttendees} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard title="Total Customers" value={totalCustomers.toLocaleString()} icon={<PeopleIcon />} color="info.main" isLoading={isLoadingCustomers} />
        </Grid>
      </Grid>

      <Card>
        <CardHeader title="At-Risk Events" />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead><TableRow><TableCell>Event Title</TableCell><TableCell align="center">Status</TableCell><TableCell align="center">Days Until</TableCell><TableCell align="center">Confirmed</TableCell><TableCell align="center">Threshold</TableCell></TableRow></TableHead>
              <TableBody>
                {isLoadingDanger ? (
                  <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
                ) : (
                  dangerZone?.map((event) => (
                    <TableRow key={event.event_id} hover>
                      <TableCell>{event.title}</TableCell>
                      <TableCell align="center"><Chip label={event.status} color={getStatusChipColor(event.status)} size="small" /></TableCell>
                      <TableCell align="center">{event.daysUntil}</TableCell>
                      <TableCell align="center">{event.combined}</TableCell>
                      <TableCell align="center">{event.threshold}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
}
