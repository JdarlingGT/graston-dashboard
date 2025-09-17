// src/pages/CEUCompliancePage.js
import React, { useState } from 'react';
import {
  Typography, CircularProgress, Alert, Box, Button, Card, CardContent, CardHeader,
  Avatar, Chip, Grid, TextField, InputAdornment, MenuItem, Select, FormControl, InputLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  School as SchoolIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useCEUCompliance } from '../hooks/useApi';

const complianceStatus = {
  compliant: { color: 'success', icon: CheckIcon, label: 'Compliant' },
  'needs-renewal': { color: 'warning', icon: WarningIcon, label: 'Needs Renewal' },
  'non-compliant': { color: 'error', icon: ErrorIcon, label: 'Non-Compliant' }
};

const stateOptions = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function CEUCompliancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [professionFilter, setProfessionFilter] = useState('');

  const { data: ceuData, isLoading, isError, error } = useCEUCompliance({
    ...(stateFilter && { state: stateFilter }),
    ...(professionFilter && { profession: professionFilter })
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (isError) return <Alert severity="error">Failed to load CEU compliance data: {error?.message}</Alert>;

  const practitioners = ceuData?.practitioners || [];
  const filteredPractitioners = practitioners.filter(practitioner =>
    practitioner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    practitioner.license_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    practitioner.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPractitioners = practitioners.length;
  const compliantCount = practitioners.filter(p => p.compliance_status === 'compliant').length;
  const needsRenewalCount = practitioners.filter(p => p.compliance_status === 'needs-renewal').length;
  const nonCompliantCount = practitioners.filter(p => p.compliance_status === 'non-compliant').length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              CEU Compliance Tracker
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Monitor continuing education requirements and compliance status
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            size="large"
          >
            Export Report
          </Button>
        </Box>

        {/* Overview Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><SchoolIcon /></Avatar>}
                title={<Typography variant="h4">{totalPractitioners}</Typography>}
                subheader="Total Practitioners"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'success.main' }}><CheckIcon /></Avatar>}
                title={<Typography variant="h4">{compliantCount}</Typography>}
                subheader="Compliant"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'warning.main' }}><WarningIcon /></Avatar>}
                title={<Typography variant="h4">{needsRenewalCount}</Typography>}
                subheader="Needs Renewal"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'error.main' }}><ErrorIcon /></Avatar>}
                title={<Typography variant="h4">{nonCompliantCount}</Typography>}
                subheader="Non-Compliant"
              />
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search practitioners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>State</InputLabel>
                <Select
                  value={stateFilter}
                  label="State"
                  onChange={(e) => setStateFilter(e.target.value)}
                >
                  <MenuItem value="">All States</MenuItem>
                  {stateOptions.map(state => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Profession</InputLabel>
                <Select
                  value={professionFilter}
                  label="Profession"
                  onChange={(e) => setProfessionFilter(e.target.value)}
                >
                  <MenuItem value="">All Professions</MenuItem>
                  <MenuItem value="PT">Physical Therapist</MenuItem>
                  <MenuItem value="OT">Occupational Therapist</MenuItem>
                  <MenuItem value="ATC">Athletic Trainer</MenuItem>
                  <MenuItem value="DC">Chiropractor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Practitioners Table */}
      <Card>
        <CardHeader
          title={
            <Typography variant="h5">Practitioners List ({filteredPractitioners.length})</Typography>
          }
        />
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>License #</strong></TableCell>
                  <TableCell><strong>State</strong></TableCell>
                  <TableCell><strong>Profession</strong></TableCell>
                  <TableCell><strong>CEU Hours</strong></TableCell>
                  <TableCell><strong>Required</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Expires</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPractitioners.map((practitioner) => {
                  const StatusIcon = complianceStatus[practitioner.compliance_status]?.icon || CheckIcon;
                  const statusColor = complianceStatus[practitioner.compliance_status]?.color || 'default';
                  const statusLabel = complianceStatus[practitioner.compliance_status]?.label || 'Unknown';

                  return (
                    <TableRow key={practitioner.id} hover>
                      <TableCell>{practitioner.name}</TableCell>
                      <TableCell>{practitioner.license_number}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon sx={{ mr: 1, color: 'action.active' }} />
                          {practitioner.state}
                        </Box>
                      </TableCell>
                      <TableCell>{practitioner.profession}</TableCell>
                      <TableCell>{practitioner.ceu_hours_completed || 0}</TableCell>
                      <TableCell>{practitioner.ceu_hours_required || 0}</TableCell>
                      <TableCell>
                        <Chip
                          icon={<StatusIcon />}
                          label={statusLabel}
                          color={statusColor}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {practitioner.license_expiration ?
                          new Date(practitioner.license_expiration).toLocaleDateString() :
                          'N/A'
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
