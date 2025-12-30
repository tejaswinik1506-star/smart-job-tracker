import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toast } from './components/ui/Toast';
import { LoadingSkeleton } from './components/ui/LoadingSkeleton';
import { useAppStore } from './store/useAppStore';
import { ROUTES } from './utils/constants';

// Lazy load pages
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Applications = lazy(() => import('./pages/Applications').then(m => ({ default: m.Applications })));
const ResumeAnalyzer = lazy(() => import('./pages/ResumeAnalyzer').then(m => ({ default: m.ResumeAnalyzer })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <LoadingSkeleton className="h-12 w-48 mx-auto" />
      <LoadingSkeleton className="h-8 w-64 mx-auto" />
    </div>
  </div>
);

function App() {
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    // Apply dark mode class on mount
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Toast />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />

          {/* Protected routes with layout */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.APPLICATIONS}
            element={
              <ProtectedRoute>
                <Layout>
                  <Applications />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.RESUME_ANALYZER}
            element={
              <ProtectedRoute>
                <Layout>
                  <ResumeAnalyzer />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
