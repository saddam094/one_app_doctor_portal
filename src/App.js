import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Header from "./components/header/header.js";
import Dashboard from "./pages/navbar_screens/dashboard/dashboard.js";
import Patients from "./pages/navbar_screens/patients/Patient.js";
import RegisterPatient from "./pages/navbar_screens/register_patient/register_patient.js";
import DoctorLogin from "./doctor_login.js";


function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`px-3 py-1 rounded-md ${isActive ? "bg-black text-white" : "text-slate-500 hover:text-black"}`}
      >
        {children}
      </Link>
    </li>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // // Update localStorage when authentication state changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} />}

      {/* {isAuthenticated && (
        <div className="flex h-40 items-center px-4 md:px-10 border-b-2 bg-white border-slate-300 justify-between pt-20">
          <nav>
            <ul className="flex space-x-2 md:space-x-10">
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/patients">Patients</NavLink>
            </ul>
          </nav>
        </div>
      )} */}

      {isAuthenticated && (
        <div className="hidden md:flex h-40 w-full items-center px-10 border-b-2 bg-white border-slate-300 justify-between pt-20">
          <nav>
            <ul className="flex space-x-2 md:space-x-10">
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/patients">Patients</NavLink>
              <NavLink to="/register_patient">Register Patient</NavLink>
            </ul>
          </nav>
        </div>
      )}


      <Routes>
        <Route
          path="/doctor_login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <DoctorLogin setIsAuthenticated={setIsAuthenticated} />}
        />

        {isAuthenticated ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/register_patient" element={<RegisterPatient />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/doctor_login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;