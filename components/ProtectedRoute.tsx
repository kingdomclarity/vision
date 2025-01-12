import React from 'react';
import { useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Temporarily allow all access
  return <>{children}</>;
}