import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AadharVerify from './public/pages/AadharVerify';
import Wallet from './public/pages/Wallet';
import ProtectedRoute from './public/pages/ProtectedRoute';
import ForgotPassword from './public/pages/ForgotPassword';
import { Toaster } from 'react-hot-toast';
import About from './public/pages/About';



// Lazy-loaded components
const PublicLayout = lazy(() => import('./public/PublicLayout'));
const Login = lazy(() => import('./public/pages/Login'));
const Home = lazy(() => import('./public/component/Home'));
const DashboardHome = lazy(() => import('./public/pages/DashboardHome'));
const Profile = lazy(() => import('./public/pages/Profile'));
const UserDetails = lazy(() => import('./public/pages/UserDetails'));
const Register = lazy(() => import('./public/pages/Register'));
const DashboardFirst = lazy(() => import('./public/pages/DashboardFirst'));

const App = () => {
  // const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotPass" element={<ForgotPassword />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route index element={<DashboardHome />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="userdetails" element={<UserDetails />} />
                    <Route path="DashboardFirst" element={<DashboardFirst />} />
                    <Route path="AadharVerify" element={<AadharVerify />} />
                    <Route path="wallet" element={<Wallet />} />
                    <Route path="about" element={<About />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
export default App;
