// src/pages/AttendeesPage.js

import React, { useState } from 'react';
import {
  Typography, CircularProgress, Alert, Box, Button, Card, CardContent, CardHeader,
  Avatar, Chip, Grid, TextField, InputAdornment, IconButton, Drawer,
  List, ListItem, ListItemText, LinearProgress, Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  ShoppingCart as ShoppingCartIcon,
  Message as MessageIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useFluentCRMSubscribers, useLearnDashUserProgress, useWooOrders } from '../hooks/useApi';

export default function AttendeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

  const { data: attendeesData, isLoading: attendeesLoading, isError: attendeesError } = useFluentCRMSubscribers({
    per_page: 100
  });

  const { data: progressData } = useLearnDashUserProgress(selectedAttendee?.id);
  const { data: ordersData } = useWooOrders({
    customer: selectedAttendee?.id,
    per_page: 50
  });

  const handleViewProfile = (attendee) => {
    setSelectedAttendee(attendee);
    setProfileDrawerOpen(true);
  };

  const handleSendMessage = (attendee) => {
    // Implement messaging functionality
    console.log('Send message to:', attendee);
  };

  const handleCloseProfile = () => {
    setProfileDrawerOpen(false);
    setSelectedAttendee(null);
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
      field: 'display_name',
      headerName: 'Name',
      width: 200,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {params.value?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="body2" fontWeight="medium">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'user_email',
      headerName: 'Email',
      width: 250,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 140,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
          <Typography variant="body2">{params.value || 'N/A'}</Typography>
        </Box>
      )
    },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 200,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {params.value?.slice(0, 2).map((tag, index) => (
            <Chip
              key={index}
              label={tag.title}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          ))}
          {params.value?.length > 2 && (
            <Chip
              label={`+${params.value.length - 2}`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Box>
      )
    },
    {
      field: 'last_activity',
      headerName: 'Last Activity',
      width: 150,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleDateString() : 'Never'}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderHeader: (params) => (
        <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View Profile">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleViewProfile(params.row)}
            >
              <PersonIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Send Message">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => handleSendMessage(params.row)}
            >
              <MessageIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (attendeesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (attendeesError) return <Alert severity="error">Failed to load attendees data.</Alert>;

  const attendees = attendeesData?.subscribers || [];
  const filteredAttendees = attendees.filter(attendee =>
    attendee.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.tags?.some(tag => tag.title?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalAttendees = attendees.length;
  const activeAttendees = attendees.filter(a => a.status === 'subscribed').length;
  const engagedAttendees = attendees.filter(a => a.last_activity &&
    new Date(a.last_activity) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Attendee Management Center
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Comprehensive attendee profiles with progress tracking and engagement analytics
            </Typography>
          </Box>
        </Box>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><PersonIcon /></Avatar>}
                title={<Typography variant="h4">{totalAttendees}</Typography>}
                subheader="Total Attendees"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'success.main' }}><CheckCircleIcon /></Avatar>}
                title={<Typography variant="h4">{activeAttendees}</Typography>}
                subheader="Active Subscribers"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'info.main' }}><ScheduleIcon /></Avatar>}
                title={<Typography variant="h4">{engagedAttendees}</Typography>}
                subheader="Recently Active (30 days)"
              />
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Attendees Table */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Attendees List ({filteredAttendees.length})</Typography>
              <TextField
                size="small"
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 300 }}
              />
            </Box>
          }
        />
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredAttendees}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              onRowClick={(params) => handleViewProfile(params.row)}
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

      {/* Attendee Profile Drawer */}
      <Drawer
        anchor="right"
        open={profileDrawerOpen}
        onClose={handleCloseProfile}
        sx={{ '& .MuiDrawer-paper': { width: 400 } }}
      >
        {selectedAttendee && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Attendee Profile</Typography>
              <IconButton onClick={handleCloseProfile}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Basic Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, width: 60, height: 60, bgcolor: 'primary.main' }}>
                    {selectedAttendee.display_name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedAttendee.display_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAttendee.user_email}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1">{selectedAttendee.phone || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Chip
                      label={selectedAttendee.status}
                      color={selectedAttendee.status === 'subscribed' ? 'success' : 'default'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Last Activity</Typography>
                    <Typography variant="body1">
                      {selectedAttendee.last_activity ?
                        new Date(selectedAttendee.last_activity).toLocaleDateString() :
                        'Never'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Location</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ mr: 1, fontSize: 16, color: 'action.active' }} />
                      <Typography variant="body1">{selectedAttendee.city || 'N/A'}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Tags */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Tags</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedAttendee.tags?.map((tag, index) => (
                      <Chip key={index} label={tag.title} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* LearnDash Progress */}
            <Card sx={{ mb: 3 }}>
              <CardHeader
                avatar={<SchoolIcon />}
                title="Course Progress"
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                {progressData?.courses?.map((course, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium">{course.title}</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress_percentage || 0}
                      sx={{ mt: 1, mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {course.progress_percentage || 0}% Complete
                    </Typography>
                  </Box>
                )) || (
                  <Typography variant="body2" color="text.secondary">
                    No course progress data available
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Order History */}
            <Card sx={{ mb: 3 }}>
              <CardHeader
                avatar={<ShoppingCartIcon />}
                title="Order History"
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent>
                <List dense>
                  {ordersData?.slice(0, 5).map((order, index) => (
                    <ListItem key={index} divider={index < ordersData.length - 1}>
                      <ListItemText
                        primary={`Order #${order.id}`}
                        secondary={
                          <Box>
                            <Typography variant="caption">
                              {new Date(order.date_created).toLocaleDateString()} • ${order.total}
                            </Typography>
                            <Chip
                              label={order.status}
                              size="small"
                              color={order.status === 'wc-completed' ? 'success' : 'default'}
                              sx={{ ml: 1, fontSize: '0.7rem' }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  )) || (
                    <Typography variant="body2" color="text.secondary">
                      No order history available
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<MessageIcon />}
                onClick={() => handleSendMessage(selectedAttendee)}
                fullWidth
              >
                Send Message
              </Button>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => window.open(`https://grastontechnique.com/wp-admin/admin.php?page=fluentcrm&action=edit&subscriber=${selectedAttendee.id}`, '_blank')}
                fullWidth
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
