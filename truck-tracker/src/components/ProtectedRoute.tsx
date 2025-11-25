import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';
import { MainLayout } from './layout/MainLayout';
import { Card } from './ui/Card';

type UserRole = 'admin' | 'dispatcher' | 'driver';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if allowedRoles is specified
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return (
        <MainLayout>
          <div className="p-8">
            <Card className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
              <p className="text-error-700 dark:text-error-400">{t('error.no_access')}</p>
            </Card>
          </div>
        </MainLayout>
      );
    }
  }

  return <>{children}</>;
};
