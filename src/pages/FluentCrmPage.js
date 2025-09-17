// src/pages/FluentCrmPage.js

import React from 'react';
import { Typography, CircularProgress, Alert, Grid, Card, CardContent, CardHeader, List, ListItem, ListItemText, Chip, Button } from '@mui/material';
import { useFluentCrmCampaigns, useAttendees } from '../hooks/useApi';

export default function FluentCrmPage() {
  const { data: campaigns, isLoading: campaignsLoading, isError: campaignsError } = useFluentCrmCampaigns();
  const { data: subscribers, isLoading: subscribersLoading, isError: subscribersError } = useAttendees();

  if (campaignsLoading || subscribersLoading) return <CircularProgress />;
  if (campaignsError || subscribersError) return <Alert severity="error">Error loading FluentCRM data</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>FluentCRM Marketing Management</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Email Campaigns" />
            <CardContent>
              <List>
                {campaigns?.map((campaign) => (
                  <ListItem key={campaign.id}>
                    <ListItemText
                      primary={campaign.title}
                      secondary={`Status: ${campaign.status} | Recipients: ${campaign.recipient_count}`}
                    />
                    <Chip label={campaign.status} color={campaign.status === 'active' ? 'success' : 'default'} size="small" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Subscriber Overview" />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Subscribers: {subscribers?.length || 0}
              </Typography>
              <List>
                {subscribers?.slice(0, 10).map((subscriber) => (
                  <ListItem key={subscriber.id}>
                    <ListItemText
                      primary={`${subscriber.first_name} ${subscriber.last_name}`}
                      secondary={subscriber.email}
                    />
                    <Chip label={subscriber.status} color="primary" size="small" />
                  </ListItem>
                ))}
              </List>
              {subscribers?.length > 10 && (
                <Button variant="outlined" fullWidth>
                  View All Subscribers
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
