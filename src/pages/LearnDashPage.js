// src/pages/LearnDashPage.js

import React from 'react';
import { Typography, CircularProgress, Alert, Grid, Card, CardContent, CardHeader, List, ListItem, ListItemText, Chip } from '@mui/material';
import { useLearnDashCourses, useLearnDashUsers } from '../hooks/useApi';

export default function LearnDashPage() {
  const { data: courses, isLoading: coursesLoading, isError: coursesError } = useLearnDashCourses();
  const { data: users, isLoading: usersLoading, isError: usersError } = useLearnDashUsers();

  if (coursesLoading || usersLoading) return <CircularProgress />;
  if (coursesError || usersError) return <Alert severity="error">Error loading LearnDash data</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>LearnDash Training Management</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Courses" />
            <CardContent>
              <List>
                {courses?.map((course) => (
                  <ListItem key={course.id}>
                    <ListItemText
                      primary={course.title?.rendered || course.title}
                      secondary={`ID: ${course.id}`}
                    />
                    <Chip label={course.status} color="primary" size="small" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Students" />
            <CardContent>
              <List>
                {users?.map((user) => (
                  <ListItem key={user.id}>
                    <ListItemText
                      primary={`${user.first_name} ${user.last_name}`}
                      secondary={user.email}
                    />
                    <Chip label={`Courses: ${user.enrolled_courses?.length || 0}`} color="secondary" size="small" />
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
