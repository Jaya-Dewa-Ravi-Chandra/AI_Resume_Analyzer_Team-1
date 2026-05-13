import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./Components/Home";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Dashboard from "./Components/Dashboard";
import TrashBin from "./Components/TrashBin";
import ResumeOverview from "./Components/ResumeOverview";
import AdminProfile from "./Components/AdminProfile";

import { useAuth } from "./store/authStore";

const App = () => {
  const { checkAuth } = useAuth();

  // check authentication on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* USER */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trash" element={<TrashBin />} />
        <Route path="/resume/:id" element={<ResumeOverview />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
