// src/components/Dashboard/InstrumentSalesWidget.jsx
import React from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, LinearProgress } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PeopleIcon from '@mui/icons-material/People';

const StatItem = ({ icon, title, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
    <Box sx={{ mr: 2, color: 'text.secondary' }}>{icon}</Box>
    <Box>
      <Typography variant="h6">{value}</Typography>
      <Typography variant="body2" color="text.secondary">{title}</Typography>
    </Box>
  </Box>
);

export default function InstrumentSalesWidget({ instrumentData, isLoading }) {
  if (isLoading) {
    return <CircularProgress />;
  }

  const {
    total_attendees = 0,
    instrument_purchasers = 0,
    conversion_rate = 0,
    revenue_instruments = 0
  } = instrumentData || {};

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Instrument Sales Summary</Typography>
        <Grid container spacing={3} sx={{ my: 2 }}>
          <Grid item xs={12} sm={6} md={3}><StatItem icon={<PeopleIcon />} title="Total Attendees" value={total_attendees} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatItem icon={<CheckCircleOutlineIcon color="success" />} title="Instrument Purchasers" value={instrument_purchasers} /></Grid>
          <Grid item xs={12} sm={6} md={3}><StatItem icon={<AttachMoneyIcon />} title="Instrument Revenue" value={`$${revenue_instruments.toLocaleString()}`} /></Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
            <Typography variant="body1">Conversion Rate: <strong>{conversion_rate}%</strong></Typography>
            <LinearProgress
                variant="determinate"
                value={conversion_rate}
                sx={{ height: 10, borderRadius: 5, mt: 1 }}
            />
        </Box>
      </CardContent>
    </Card>
  );
}
