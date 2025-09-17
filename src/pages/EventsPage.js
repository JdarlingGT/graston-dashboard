// src/pages/EventsPage.js

import React, { useState } from 'react';
import { Typography, CircularProgress, Alert, Box, Button, Card, CardContent, CardHeader, Avatar, Chip, Grid, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Event as EventIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useEvents } from '../hooks/useApi';

export default function EventsPage() {
  const navigate = useNavigate();
  const { data: events, isLoading, isError } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Filter events based on search term
  React.useEffect(() => {
    if (events) {
      const filtered = events.filter(event =>
        event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [events, searchTerm]);

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}/roster`);
  };

  const handleEditEvent = (eventId) => {
    // Open WooCommerce edit page in new tab
    window.open(`https://grastontechnique.com/wp-admin/post.php?post=${eventId}&action=edit`, '_blank');
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      )
    },
    {
      field: 'name',
      headerName: 'Event Name',
      width: 300,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EventIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="body2" fontWeight="medium">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'publish' ? 'success' : 'default'}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MoneyIcon sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="body2">${params.value || '0'}</Typography>
        </Box>
      )
    },
    {
      field: 'total_sales',
      headerName: 'Sales',
      width: 100,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PeopleIcon sx={{ mr: 1, color: 'info.main' }} />
          <Typography variant="body2">{params.value || '0'}</Typography>
        </Box>
      )
    },
    {
      field: 'date_created',
      headerName: 'Created',
      width: 150,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
          <Typography variant="body2">
            {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
          </Typography>
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleViewEvent(params.row.id)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Event">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => handleEditEvent(params.row.id)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) return <Alert severity="error">Failed to load events.</Alert>;

  const totalEvents = events?.length || 0;
  const activeEvents = events?.filter(event => event.status === 'publish').length || 0;
  const totalRevenue = events?.reduce((sum, event) => sum + (parseFloat(event.price || 0) * (event.total_sales || 0)), 0) || 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Training Events Management
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Comprehensive event overview and management dashboard
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<EventIcon />}
            size="large"
            onClick={() => window.open('https://grastontechnique.com/wp-admin/post-new.php?post_type=product', '_blank')}
          >
            Create New Event
          </Button>
        </Box>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><EventIcon /></Avatar>}
                title={<Typography variant="h4">{totalEvents}</Typography>}
                subheader="Total Events"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'success.main' }}><PeopleIcon /></Avatar>}
                title={<Typography variant="h4">{activeEvents}</Typography>}
                subheader="Active Events"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'warning.main' }}><MoneyIcon /></Avatar>}
                title={<Typography variant="h4">${totalRevenue.toLocaleString()}</Typography>}
                subheader="Total Revenue"
              />
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Events Table */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Events List</Typography>
              <TextField
                size="small"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 250 }}
              />
            </Box>
          }
        />
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredEvents}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              onRowClick={(params) => handleViewEvent(params.row.id)}
              sx={{
                border: 0,
                cursor: 'pointer',
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid',
                  borderBottomColor: 'divider',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'background.paper',
                  borderBottom: '2px solid',
                  borderBottomColor: 'primary.main',
                },
                '& .MuiDataGrid-row:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
