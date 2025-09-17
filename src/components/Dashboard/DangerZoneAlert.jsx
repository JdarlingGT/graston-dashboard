// src/components/Dashboard/DangerZoneAlert.jsx
import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

export default function DangerZoneAlert({ event, instrumentData }) {
  const alerts = [];

  // Return null if data isn't ready
  if (!event || !instrumentData) return null;

  // Rule 1: Low Instrument Conversion Rate (from spec)
  const conversionThreshold = event.min_conversion_rate || 30; // Defaulting to 30%
  if (instrumentData.conversion_rate < conversionThreshold) {
    alerts.push({
      severity: 'error',
      title: 'Low Instrument Conversion',
      message: `Only ${instrumentData.conversion_rate}% of attendees have purchased instruments, falling below the ${conversionThreshold}% target.`
    });
  }

  // Rule 2: Missing Instructor Assignment (add ACF fields for this)
  if (!event.assigned_instructor) {
    alerts.push({
      severity: 'warning',
      title: 'Missing Instructor',
      message: 'This event does not have an instructor assigned yet.'
    });
  }

  // Rule 3: Inventory Alert (Example logic from spec)
  const instrumentStock = 10; // This should be fetched via another hook in a real app
  if (instrumentData.instrument_purchasers > instrumentStock) {
      alerts.push({
          severity: 'error',
          title: 'Potential Inventory Shortfall',
          message: `${instrumentData.instrument_purchasers} sets have been sold, but only ${instrumentStock} are in stock.`
      })
  }


  if (alerts.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      {alerts.map((alert, index) => (
        <Alert key={index} severity={alert.severity} icon={<WarningIcon />} sx={{ mb: 1 }}>
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.message}
        </Alert>
      ))}
    </Box>
  );
}
