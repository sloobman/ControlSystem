
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './layout/Layout';
import { LoginForm } from './features/auth/LoginForm';
import { RegisterForm } from './features/auth/RegisterForm';
import { Dashboard } from './pages/Dashboard';
import { DefectsList } from './features/defects/DefectsList';
import { CreateDefect } from './features/defects/CreateDefect';
import { DefectDetails } from './features/defects/DefectDetails';
import { Users } from './pages/Users';
import { Reports } from './pages/Reports';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const setTheme = useThemeStore((state) => state.setTheme);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    initAuth();
    setTheme(theme);
  }, [initAuth, setTheme, theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/defects"
            element={
              <ProtectedRoute>
                <Layout>
                  <DefectsList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/defects/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <CreateDefect />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/defects/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <DefectDetails />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
