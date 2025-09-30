import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLandingPage from './frontend/UserLandingPage';
import UserLogin from './frontend/UserLogin';
import UserSignUp from './frontend/UserSignUp';
import UserForgotPassword from './frontend/UserForgotPassword';
import UserDashboardHome from './frontend/UserDashBoardHome';
import UserDashboardAssessment from './frontend/UserDashboardAssessment';
import UserDashboardTakeAssessment from './frontend/UserDashboardTakeAssessment';
import ProtectedRoute from './frontend/component/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLandingPage />} />
      <Route path="/userlogin" element={<UserLogin />} />
      <Route path="/usersignup" element={<UserSignUp />} />
      <Route path="/userforgotpassword" element={<UserForgotPassword />} />
      <Route path="/userdashboardhome" element={<ProtectedRoute><UserDashboardHome /></ProtectedRoute>} />
      <Route path="/userdashboardassessment" element={<ProtectedRoute><UserDashboardAssessment /></ProtectedRoute>} />
      <Route path="/userdashboardtakeassessment" element={<ProtectedRoute><UserDashboardTakeAssessment /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
