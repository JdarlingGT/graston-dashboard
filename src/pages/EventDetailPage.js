// src/pages/EventDetailPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Alert, Paper, Box, Button, Modal, Link, Grid, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { useEventRoster, useInstrumentData, useEvents } from '../hooks/useApi';
import { usePusherSubscription } from '../hooks/usePusher';
import SingleEnrollmentForm from '../components/forms/SingleEnrollmentForm';
import InstrumentSalesWidget from '../components/Dashboard/InstrumentSalesWidget';
import DangerZoneAlert from '../components/Dashboard/DangerZoneAlert';

const columns = [
    { field: 'display_name', headerName: 'Name', width: 200 },
    { field: 'user_email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150, sortable: false },
    {
      field: '_instrument_purchase_status',
      headerName: 'Instrument Status',
      width: 150,
      renderCell: (params) => {
        const hasInstrument = params.value === 'Yes';
        const tooltipTitle = hasInstrument ? `Order ID: ${params.row._instrument_order_id || 'N/A'}` : 'No instrument purchased';
        return (
          <Tooltip title={tooltipTitle}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {hasInstrument ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
              <Typography sx={{ ml: 1 }}>{hasInstrument ? 'Purchased' : 'Needed'}</Typography>
            </Box>
          </Tooltip>
        );
      },
    },
    { field: 'wpAdminEditUrl', headerName: 'Actions', width: 150, sortable: false, renderCell: (params) => (<Button component={Link} href={params.value} target="_blank" rel="noopener noreferrer" variant="outlined" size="small">Edit User</Button>)}
];

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
  width: 450, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 24, p: 4,
};

export default function EventDetailPage() {
  const { eventId } = useParams();

  const { data: rosterData, isLoading: isLoadingRoster, isError, error } = useEventRoster(eventId);
  const { data: instrumentData, isLoading: isLoadingInstruments } = useInstrumentData(eventId);
  const { data: events } = useEvents();
  const [openModal, setOpenModal] = React.useState(false);

  // Find the full event object to access its metadata (e.g., min_conversion_rate)
  const currentEvent = events?.find(e => e.id === parseInt(eventId, 10));

  usePusherSubscription(`event-roster-${eventId}`, 'student-enrolled', ['eventRoster', eventId]);
  usePusherSubscription(`event-instruments-${eventId}`, 'instrument-purchased', ['instrumentData', eventId]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  if (isLoadingRoster || isLoadingInstruments) return <CircularProgress />;
  if (isError) return <Alert severity="error">{error.message}</Alert>;

  // Merge instrument data into the main attendee list
  const attendeesWithInstrumentStatus = rosterData?.attendees?.map(attendee => {
      const purchaserInfo = instrumentData?.purchasers.find(p => p.user_id === attendee.id);
      return {
          ...attendee,
          _instrument_purchase_status: purchaserInfo ? 'Yes' : 'No',
          _instrument_order_id: purchaserInfo?.order_id,
          _instrument_voucher_used: purchaserInfo?.voucher,
      };
  }) || [];

  return (
    <>
      <DangerZoneAlert event={currentEvent} instrumentData={instrumentData} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>Event Command Center</Typography>
        <Button variant="contained" onClick={handleOpenModal}>Add Participant</Button>
      </Box>
      <Typography variant="h6" color="text.secondary" gutterBottom>{rosterData?.event?.title || `Event #${eventId}`}</Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <InstrumentSalesWidget instrumentData={instrumentData} isLoading={isLoadingInstruments} />
        </Grid>
        <Grid item xs={12}>
            <Paper style={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={attendeesWithInstrumentStatus}
                    columns={columns}
                    getRowId={(row) => row.id}
                />
            </Paper>
        </Grid>
      </Grid>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <SingleEnrollmentForm eventId={eventId} onFormSubmit={handleCloseModal} onCancel={handleCloseModal} />
        </Box>
      </Modal>
    </>
  );
}
