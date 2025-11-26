import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FontSizeProvider } from './contexts/FontSizeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Trips } from './pages/Trips';
import { Drivers } from './pages/Drivers';
import { Vehicles } from './pages/Vehicles';
import { Routes as RoutesPage } from './pages/Routes';
import { Settings } from './pages/Settings';
import { Users } from './pages/Users';
import { DriverForm } from './pages/DriverForm';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

// Smart redirect based on user role
const RoleBasedRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Drivers go to trips, others go to dashboard
  if (user.role === 'driver') {
    return <Navigate to="/trips" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <FontSizeProvider>
        <LanguageProvider>
          <AuthProvider>
            <SidebarProvider>
            <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/driver-form" element={<DriverForm />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'dispatcher']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drivers"
            element={
              <ProtectedRoute allowedRoles={['admin', 'dispatcher']}>
                <Drivers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute allowedRoles={['admin', 'dispatcher']}>
                <Vehicles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routes"
            element={
              <ProtectedRoute allowedRoles={['admin', 'dispatcher']}>
                <RoutesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Users />
              </ProtectedRoute>
            }
          />

          {/* Redirect root based on user role */}
          <Route path="/" element={<RoleBasedRedirect />} />

          {/* 404 - redirect based on user role */}
          <Route path="*" element={<RoleBasedRedirect />} />
          </Routes>
            </SidebarProvider>
          </AuthProvider>
        </LanguageProvider>
        </FontSizeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
