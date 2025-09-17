// src/components/SidebarList.js

import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Events', icon: <EventIcon />, path: '/events' },
  { text: 'Attendees', icon: <PeopleIcon />, path: '/attendees' },
  { text: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
  { text: 'LearnDash', icon: <SchoolIcon />, path: '/learndash' },
  { text: 'FluentCRM', icon: <EmailIcon />, path: '/fluentcrm' },
  { text: 'Gravity Forms', icon: <AssignmentIcon />, path: '/gravityforms' },
  { text: 'WooCommerce', icon: <ShoppingCartIcon />, path: '/woocommerce' },
];

const SidebarList = () => (
  <>
    {menuItems.map((item) => (
      <ListItem key={item.text} disablePadding component={Link} to={item.path} sx={{ color: 'inherit', textDecoration: 'none' }}>
        <ListItemButton>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    ))}
  </>
);

export default SidebarList;
