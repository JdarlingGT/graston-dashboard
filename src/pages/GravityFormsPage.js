// src/pages/GravityFormsPage.js

import React from 'react';
import { Typography, CircularProgress, Alert, Grid, Card, CardContent, CardHeader, List, ListItem, ListItemText, Chip } from '@mui/material';
import { useGravityForms, useGravityFormsEntriesSummary } from '../hooks/useApi';

export default function GravityFormsPage() {
  const { data: forms, isLoading: formsLoading, isError: formsError } = useGravityForms();
  const { data: entriesSummary, isLoading: summaryLoading, isError: summaryError } = useGravityFormsEntriesSummary();

  if (formsLoading || summaryLoading) return <CircularProgress />;
  if (formsError || summaryError) return <Alert severity="error">Error loading Gravity Forms data</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>Gravity Forms Management</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Forms" />
            <CardContent>
              <List>
                {forms?.map((form) => (
                  <ListItem key={form.id}>
                    <ListItemText
                      primary={form.title}
                      secondary={`ID: ${form.id} | Entries: ${form.entries?.length || 0}`}
                    />
                    <Chip label={form.is_active ? 'Active' : 'Inactive'} color={form.is_active ? 'success' : 'default'} size="small" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Entries Summary" />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Entries: {entriesSummary?.total_count || 0}
              </Typography>
              <List>
                {entriesSummary?.forms?.map((formSummary) => (
                  <ListItem key={formSummary.id}>
                    <ListItemText
                      primary={formSummary.title}
                      secondary={`Entries: ${formSummary.entry_count}`}
                    />
                    <Chip label={`${formSummary.entry_count} entries`} color="secondary" size="small" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
