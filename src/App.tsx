import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Events from './pages/Events';
import Attendees from './pages/Attendees';
import Certification from './pages/Certification';
import CEU from './pages/CEU';
import Analytics from './pages/Analytics';

function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6 overflow-auto flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="events" element={<Events />} />
        <Route path="attendees" element={<Attendees />} />
        <Route path="certification" element={<Certification />} />
        <Route path="ceu" element={<CEU />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;
