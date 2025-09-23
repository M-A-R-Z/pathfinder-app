import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLandingPage from './frontend/UserLandingPage';
import UserLogin from './frontend/UserLogin';
import UserSignUp from './frontend/UserSignUp';
import UserForgotPassword from './frontend/UserForgotPassword';
import UserDashBoardHome from './frontend/UserDashBoardHome';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLandingPage />} />
      <Route path="/userlogin" element={<UserLogin />} />
      <Route path="/usersignup" element={<UserSignUp />} />
      <Route path="/userforgotpassword" element={<UserForgotPassword />} />
      <Route path="/userdashboardhome" element={<UserDashBoardHome />} />
    </Routes>
  );
}

export default App;
