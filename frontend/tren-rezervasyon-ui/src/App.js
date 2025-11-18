/**
 * Main App Component with Routing
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Layout from './layouts/Layout';
import Seferler from './pages/Seferler';
import Rezervasyonlar from './pages/Rezervasyonlar';
import Raporlar from './pages/Raporlar';
import Profil from './pages/Profil';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes with Sidebar layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="seferler" element={<Seferler />} />
            <Route path="rezervasyonlar" element={<Rezervasyonlar />} />
            <Route path="raporlar" element={<Raporlar />} />
            <Route path="profil" element={<Profil />} />
          </Route>

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
