import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppLayout from './components/layout/AppLayout';
import LoginForm from './components/LoginForm';
import BranchSelectionScreen from './components/BranchSelectionScreen';
import ProductsTable from './components/products/ProductsTable';
import UsersTable from './components/users/UsersTable';
import SettingsPage from './components/settings/SettingsPage';
import InventoryList from './components/inventory/InventoryList';
import AssetsTable from './components/assets/AssetsTable';
import AssetsInventoryList from './components/assets-inventory/AssetsInventoryList';
import Layout from './components/Layout';

// Configure QueryClient with proper error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      onError: (error) => {
        // Handle errors without trying to serialize the full error object
        console.error('Query Error:', error instanceof Error ? error.message : 'An error occurred');
      }
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation Error:', error instanceof Error ? error.message : 'An error occurred');
      }
    }
  }
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hasBranch = user.branches?.[0]?.id;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && !hasBranch) {
    return <Navigate to="/select-branch" />;
  }

  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/select-branch" element={<BranchSelectionScreen />} />
            <Route
              path="/products"
              element={
                <PrivateRoute>
                  <ProductsTable />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <UsersTable />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <PrivateRoute>
                  <InventoryList />
                </PrivateRoute>
              }
            />
            <Route
              path="/assets"
              element={
                <PrivateRoute>
                  <AssetsTable />
                </PrivateRoute>
              }
            />
            <Route
              path="/assets-inventory"
              element={
                <PrivateRoute>
                  <AssetsInventoryList />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/products" />} />
          </Routes>
        </BrowserRouter>
      </AppLayout>
    </QueryClientProvider>
  );
}

export default App;