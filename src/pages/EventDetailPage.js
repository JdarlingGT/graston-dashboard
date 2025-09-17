// src/pages/EventDetailPage.js

import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Alert, Paper, Chip, Box, Button, Modal, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEventRoster } from '../hooks/useApi';
import { usePusherSubscription } from '../hooks/usePusher';
import SingleEnrollmentForm from '../components/forms/SingleEnrollmentForm';

const getStatusChipColor = (color) => {
  switch (color) {
    case 'red': return 'error';
    case 'orange': return 'warning';
    case 'green': return 'success';
    default: return 'default';
  }
};

const columns = [
    { field: 'display_name', headerName: 'Name', width: 200 },
    { field: 'user_email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    {
      field: 'preCourseStatus',
      headerName: 'Pre-Course Status',
      width: 180,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusChipColor(params.row.preCourseStatusColor)}
          size="small"
        />
      ),
    },
    {
      field: 'hasPurchasedInstruments',
      headerName: 'Instruments',
      width: 120,
      renderCell: (params) => (
        <Typography color={params.value ? 'success.main' : 'error.main'}>
          {params.value ? 'Yes' : 'No'}
        </Typography>
      ),
    },
    {
        field: 'wpAdminEditUrl',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => (
            <Button
              component={Link}
              href={params.value}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
            >
              Edit User
            </Button>
        )
    },
];

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { data: rosterData, isLoading, isError, error } = useEventRoster(eventId);
  const [openModal, setOpenModal] = React.useState(false);

  // Subscribe to real-time roster updates via Pusher
  usePusherSubscription(
    `event-roster-${eventId}`,
    'student-enrolled',
    ['eventRoster', eventId]
  );

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">{error.message}</Alert>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Student Roster for Event #{rosterData?.event?.id || eventId}
        </Typography>
        <Button variant="contained" onClick={handleOpenModal}>Add Participant</Button>
      </Box>
      <Typography variant="h6" gutterBottom>{rosterData?.event?.title}</Typography>

      <Paper style={{ height: 650, width: '100%', marginTop: 2 }}>
        <DataGrid
          rows={rosterData?.attendees || []}
          columns={columns}
          getRowId={(row) => row.user_email}
        />
      </Paper>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <SingleEnrollmentForm
            eventId={eventId}
            onFormSubmit={handleCloseModal}
            onCancel={handleCloseModal}
          />
        </Box>
      </Modal>
    </>
  );
}
