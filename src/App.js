import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserLandingPage from './frontend/UserLandingPage';
import UserLogin from './frontend/UserLogin';
import UserSignUp from './frontend/UserSignUp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLandingPage />} />
      <Route path="/userlogin" element={<UserLogin />} />
      <Route path="/usersignup" element={<UserSignUp />} />
    </Routes>
  );
}

export default App;
