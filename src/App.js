import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLandingPage from './frontend/UserLandingPage';
import UserLogin from './frontend/UserLogin';
import UserSignUp from './frontend/UserSignUp';
import UserForgotPassword from './frontend/UserForgotPassword';
import UserDashboardHome from './frontend/UserDashBoardHome';
import UserDashboardAssessment from './frontend/UserDashboardAssessment';
import UserDashboardTakeAssessment from './frontend/UserDashboardTakeAssessment';
import UserDashboardCourses from './frontend/UserDashboardCourses';
import UserDashboardCareers from './frontend/UserDashboardCareers';
import UserDashboardProfile from './frontend/UserDashboardProfile';
import UserDashboardSettings from './frontend/UserDashboardSettings';
import UserDashboardStatistics from './frontend/UserDashboardStatistics';
import ProtectedRoute from './frontend/component/ProtectedRoute';
import UserDashboardAssessmentCopy from './frontend/UserDashboardAssessment copy';
import UserDashBoardHomeCopy from './frontend/UserDashBoardHome copy';
import UserDashboardStatisticsCopy from './frontend/UserDashboardStatistics copy';
import UserDashboardTakeAssessmentCopy from './frontend/UserDashboardTakeAssessment copy';
import UserSignUpCopy from './frontend/UserSignUp copy';
import UserLoginCopy from './frontend/UserLogin copy';

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
      <Route path="/userdashboardcourses" element={<ProtectedRoute><UserDashboardCourses /></ProtectedRoute>} />
      <Route path="/userdashboardcareers" element={<ProtectedRoute><UserDashboardCareers /></ProtectedRoute>} />
      <Route path="/userdashboardprofile" element={<ProtectedRoute><UserDashboardProfile /></ProtectedRoute>} />
      <Route path="/userdashboardsettings" element={<ProtectedRoute><UserDashboardSettings /></ProtectedRoute>} />
      <Route path="/userdashboardstatistics" element={<ProtectedRoute><UserDashboardStatistics /></ProtectedRoute>} />
      <Route path="/userlogincopy" element={<UserLoginCopy />} />
      <Route path="/usersignupcopy" element={<UserSignUpCopy />} />
      <Route path="/userdashboardhomecopy" element={<UserDashBoardHomeCopy />} />
      <Route path="/userdashboardassessmentcopy" element={<UserDashboardAssessmentCopy />} />
      <Route path="/userdashboardtakeassessmentcopy" element={<UserDashboardTakeAssessmentCopy />} />
      <Route path="/userdashboardstatisticscopy" element={<UserDashboardStatisticsCopy />} />
      
    </Routes>
  );
}

export default App;