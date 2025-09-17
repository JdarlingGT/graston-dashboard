// src/components/forms/SingleEnrollmentForm.jsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useSingleEnrollment } from '../../hooks/useApi';

export default function SingleEnrollmentForm({ eventId, onFormSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { mutate, isPending, error } = useSingleEnrollment();

  const onSubmit = (data) => {
    mutate({ ...data, eventId }, {
      onSuccess: () => {
        onFormSubmit(data);
      }
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        Add Participant to Event #{eventId}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error.message}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        label="First Name"
        autoFocus
        {...register("first_name", { required: "First name is required" })}
        error={!!errors.first_name}
        helperText={errors.first_name?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Last Name"
        {...register("last_name", { required: "Last name is required" })}
        error={!!errors.last_name}
        helperText={errors.last_name?.message}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email Address"
        type="email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address"
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={onCancel}
            disabled={isPending}
        >
            Cancel
        </Button>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isPending}
        >
            {isPending ? <CircularProgress size={24} /> : 'Enroll Participant'}
        </Button>
      </Box>
    </Box>
  );
}
