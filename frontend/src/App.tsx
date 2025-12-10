import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Layout from './components/Layout';
import TicketList from './pages/Tickets/TicketList';
import CreateTicket from './pages/Tickets/CreateTicket';
import TicketDetails from './pages/Tickets/TicketDetails';
import AssetList from './pages/Assets/AssetList';
import AssetDetails from './pages/Assets/AssetDetails';

import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SocketProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<TicketList />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tickets/new" element={<CreateTicket />} />
              <Route path="tickets/:id" element={<TicketDetails />} />
              <Route path="assets" element={<AssetList />} />
              <Route path="assets/:id" element={<AssetDetails />} />
            </Route>
          </Routes>
        </Router>
      </SocketProvider>
    </ThemeProvider>
  );
};

export default App;
