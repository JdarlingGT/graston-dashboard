// src/pages/OrdersPage.js
import React, { useState } from 'react';
import {
  Typography, CircularProgress, Alert, Box, Button, Card, CardContent, CardHeader,
  Avatar, Chip, Grid, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useWooOrders } from '../hooks/useApi';

const statusColors = {
  'wc-completed': 'success',
  'wc-processing': 'info',
  'wc-on-hold': 'warning',
  'wc-cancelled': 'error',
  'wc-refunded': 'error',
  'wc-failed': 'error'
};

const statusLabels = {
  'wc-completed': 'Completed',
  'wc-processing': 'Processing',
  'wc-on-hold': 'On Hold',
  'wc-cancelled': 'Cancelled',
  'wc-refunded': 'Refunded',
  'wc-failed': 'Failed'
};

const columns = [
  {
    field: 'id',
    headerName: 'Order ID',
    width: 100,
    renderHeader: (params) => (
      <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
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
        label={statusLabels[params.value] || params.value}
        color={statusColors[params.value] || 'default'}
        size="small"
        variant="outlined"
      />
    )
  },
  {
    field: 'total',
    headerName: 'Total',
    width: 120,
    renderHeader: (params) => (
      <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
    ),
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <MoneyIcon sx={{ mr: 1, color: 'success.main' }} />
        <Typography variant="body2">${params.value}</Typography>
      </Box>
    )
  },
  {
    field: 'date_created',
    headerName: 'Date Created',
    width: 150,
    renderHeader: (params) => (
      <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
    ),
    renderCell: (params) => (
      <Typography variant="body2">
        {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
      </Typography>
    )
  },
  {
    field: 'customer_id',
    headerName: 'Customer ID',
    width: 120,
    renderHeader: (params) => (
      <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
    )
  },
  {
    field: 'payment_method_title',
    headerName: 'Payment Method',
    width: 150,
    renderHeader: (params) => (
      <Typography variant="subtitle2" fontWeight="bold">{params.colDef.headerName}</Typography>
    )
  }
];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  const { data: orders, isLoading, isError, error } = useWooOrders({
    per_page: 100,
    ...(statusFilter && { status: statusFilter })
  });

  // Filter orders based on search term
  React.useEffect(() => {
    if (orders) {
      const filtered = orders.filter(order =>
        order.id.toString().includes(searchTerm.toLowerCase()) ||
        order.customer_id?.toString().includes(searchTerm.toLowerCase()) ||
        order.total?.toString().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [orders, searchTerm]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) return <Alert severity="error">Failed to load orders: {error?.message}</Alert>;

  const totalOrders = orders?.length || 0;
  const completedOrders = orders?.filter(order => order.status === 'wc-completed').length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) || 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Orders & Transactions
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Comprehensive order management and transaction tracking
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            size="large"
          >
            Export Orders
          </Button>
        </Box>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><CartIcon /></Avatar>}
                title={<Typography variant="h4">{totalOrders}</Typography>}
                subheader="Total Orders"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'success.main' }}><CheckIcon /></Avatar>}
                title={<Typography variant="h4">{completedOrders}</Typography>}
                subheader="Completed Orders"
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

      {/* Orders Table */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Orders List</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="wc-completed">Completed</MenuItem>
                    <MenuItem value="wc-processing">Processing</MenuItem>
                    <MenuItem value="wc-on-hold">On Hold</MenuItem>
                    <MenuItem value="wc-cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  placeholder="Search orders..."
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
            </Box>
          }
        />
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={filteredOrders}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              sx={{
                border: 0,
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid',
                  borderBottomColor: 'divider',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'background.paper',
                  borderBottom: '2px solid',
                  borderBottomColor: 'primary.main',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
