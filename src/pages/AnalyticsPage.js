// src/pages/AnalyticsPage.js

import React from 'react';
import { Typography, CircularProgress, Alert, Paper, Grid } from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useOrders } from '../hooks/useApi';

const processOrderData = (orders) => {
  const revenueByDate = orders.reduce((acc, order) => {
    const date = new Date(order.date_created).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + parseFloat(order.total);
    return acc;
  }, {});

  const sortedRevenue = Object.entries(revenueByDate)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .map(([date, revenue]) => ({ date, revenue }));

  const revenueByProduct = orders.flatMap(order => order.line_items).reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + parseFloat(item.total);
    return acc;
  }, {});

  const sortedProducts = Object.entries(revenueByProduct)
    .sort(([, revenueA], [, revenueB]) => revenueB - revenueA)
    .slice(0, 10) // Top 10 products
    .map(([name, revenue]) => ({ name, revenue }));

  return { sortedRevenue, sortedProducts };
};

export default function AnalyticsPage() {
  const { data: orders, isLoading, isError } = useOrders();

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Failed to load analytics data.</Alert>;

  const chartData = orders ? processOrderData(orders) : { sortedRevenue: [], sortedProducts: [] };

  return (
    <>
      <Typography variant="h4" gutterBottom>Reporting & Analytics</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>Enrollment Revenue Over Time</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={chartData.sortedRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>Revenue by Event (Top 10)</Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={chartData.sortedProducts} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" />
                 <XAxis type="number" />
                 <YAxis type="category" dataKey="name" width={300} />
                 <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                 <Legend />
                 <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
