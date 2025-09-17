// src/pages/EventDetailPage.js

import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Alert, Paper, Box, Button, Modal, Link } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEventRoster } from '../hooks/useApi';
import { usePusherSubscription } from '../hooks/usePusher';
import SingleEnrollmentForm from '../components/forms/SingleEnrollmentForm';

const columns = [
    { field: 'first_name', headerName: 'First Name', width: 150 },
    { field: 'last_name', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
        field: 'id',
        headerName: 'Actions',
        width: 150,
        renderCell: (params) => (
            <Button
              component={Link}
              href={`https://grastontechnique.com/wp-admin/admin.php?page=fluentcrm&action=edit&subscriber=${params.value}`}
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
          Student Roster for Event #{eventId}
        </Typography>
        <Button variant="contained" onClick={handleOpenModal}>Add Participant</Button>
      </Box>

      <Paper style={{ height: 650, width: '100%', marginTop: 2 }}>
        <DataGrid
          rows={rosterData || []}
          columns={columns}
          getRowId={(row) => row.email}
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
