// src/pages/WooCommercePage.js

import React from 'react';
import { Typography, CircularProgress, Alert, Grid, Card, CardContent, CardHeader, List, ListItem, ListItemText, Chip, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useWooCustomers, useWooCategories, useWooCoupons, useWooSalesReports, useWooTopSellers, useOrders } from '../hooks/useApi';

export default function WooCommercePage() {
  const { data: customers, isLoading: customersLoading, isError: customersError } = useWooCustomers();
  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useWooCategories();
  const { data: coupons, isLoading: couponsLoading, isError: couponsError } = useWooCoupons();
  const { data: salesReports, isLoading: salesLoading, isError: salesError } = useWooSalesReports();
  const { data: topSellers, isLoading: topSellersLoading, isError: topSellersError } = useWooTopSellers();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  if (customersLoading || categoriesLoading || couponsLoading || salesLoading || topSellersLoading || ordersLoading) {
    return <CircularProgress />;
  }

  if (customersError || categoriesError || couponsError || salesError || topSellersError) {
    return <Alert severity="error">Error loading WooCommerce data</Alert>;
  }

  // Calculate some metrics
  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total || 0), 0) || 0;
  const totalOrders = orders?.length || 0;
  const totalCustomers = customers?.length || 0;

  return (
    <>
      <Typography variant="h4" gutterBottom>WooCommerce E-Commerce Management</Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Total Revenue" />
            <CardContent>
              <Typography variant="h4">${totalRevenue.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Total Orders" />
            <CardContent>
              <Typography variant="h4">{totalOrders.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardHeader title="Total Customers" />
            <CardContent>
              <Typography variant="h4">{totalCustomers.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Customers */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recent Customers" />
            <CardContent>
              <List>
                {customers?.slice(0, 5).map((customer) => (
                  <ListItem key={customer.id}>
                    <ListItemText
                      primary={`${customer.first_name} ${customer.last_name}`}
                      secondary={`${customer.email} | Orders: ${customer.orders_count}`}
                    />
                    <Chip label={`$${customer.total_spent}`} color="primary" size="small" />
                  </ListItem>
                ))}
              </List>
              <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                View All Customers
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Categories */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Product Categories" />
            <CardContent>
              <List>
                {categories?.map((category) => (
                  <ListItem key={category.id}>
                    <ListItemText
                      primary={category.name}
                      secondary={`Products: ${category.count}`}
                    />
                    <Chip label={category.display} color="secondary" size="small" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Coupons */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Active Coupons" />
            <CardContent>
              <List>
                {coupons?.slice(0, 5).map((coupon) => (
                  <ListItem key={coupon.id}>
                    <ListItemText
                      primary={coupon.code}
                      secondary={`Discount: ${coupon.discount_type} - ${coupon.amount}`}
                    />
                    <Chip label={coupon.usage_count} color="info" size="small" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Sellers */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Top Selling Products" />
            <CardContent>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topSellers?.slice(0, 5).map((product) => (
                      <TableRow key={product.product_id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell align="right">{product.quantity}</TableCell>
                        <TableCell align="right">${product.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sales Reports */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Sales Reports" />
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell align="right">Orders</TableCell>
                      <TableCell align="right">Gross Sales</TableCell>
                      <TableCell align="right">Net Sales</TableCell>
                      <TableCell align="right">Average Order</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {salesReports?.map((report) => (
                      <TableRow key={report.date}>
                        <TableCell>{report.date}</TableCell>
                        <TableCell align="right">{report.orders}</TableCell>
                        <TableCell align="right">${report.gross_sales}</TableCell>
                        <TableCell align="right">${report.net_sales}</TableCell>
                        <TableCell align="right">${report.average_order_value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
