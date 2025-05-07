import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import UserLayout from './layouts/UserLayout';
import StoreLayout from './layouts/StoreLayout';

// User Pages
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Menu from './pages/user/Menu';
import Cart from './pages/user/Cart';
import Payment from './pages/user/Payment';
import OrderSuccess from './pages/user/OrderSuccess';
import UserOrders from './pages/user/UserOrders';
import Favorites from './pages/user/Favorites';

// Store Pages
import StoreLogin from './pages/store/StoreLogin';
import StoreOrders from './pages/store/StoreOrders';
import StoreMenu from './pages/store/StoreMenu';

// Protected Route Components
const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole?: string }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const { checkAuthStatus } = useAuth();
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* User Routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Menu />} />
        <Route path="menu" element={<Menu />} />
        <Route path="cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="payment" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
        <Route path="order-success/:orderId" element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute>
            <UserOrders />
          </ProtectedRoute>
        } />
        <Route path="favorites" element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Store Routes */}
      <Route path="/store/login" element={
        <PublicRoute>
          <StoreLogin />
        </PublicRoute>
      } />
      
      <Route path="/store" element={
        <ProtectedRoute requiredRole="staff">
          <StoreLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StoreOrders />} />
        <Route path="orders" element={<StoreOrders />} />
        <Route path="menu" element={<StoreMenu />} />
      </Route>
      
      {/* Catch all - 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;