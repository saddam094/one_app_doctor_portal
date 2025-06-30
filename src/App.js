import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Header from "./components/header/header.js";
import Dashboard from "./pages/navbar_screens/dashboard/dashboard.js";
import Patients from "./pages/navbar_screens/patients/Patient.js";
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
          </>
        ) : (
          <Route path="*" element={<Navigate to="/doctor_login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;

// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
// import { Menu, X } from "lucide-react"; // optional: install lucide-react for icons
// import Header from "./components/header/header.js";
// import Dashboard from "./pages/navbar_screens/dashboard/dashboard.js";
// import Patients from "./pages/navbar_screens/patients/Patient.js";
// import DoctorLogin from "./doctor_login.js";

// function NavLink({ to, children, onClick }) {
//   const location = useLocation();
//   const isActive = location.pathname === to;

//   return (
//     <li onClick={onClick}>
//       <Link
//         to={to}
//         className={`block px-3 py-2 rounded-md ${isActive ? "bg-black text-white" : "text-slate-500 hover:text-black"}`}
//       >
//         {children}
//       </Link>
//     </li>
//   );
// }

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(() => {
//     return localStorage.getItem("isAuthenticated") === "true";
//   });

//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   useEffect(() => {
//     localStorage.setItem("isAuthenticated", isAuthenticated);
//   }, [isAuthenticated]);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const closeMenu = () => setIsMenuOpen(false);

//   return (
//     <Router>
//       {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} />}

//       {isAuthenticated && (
//         <div className="border-b-2 border-slate-300 bg-white pt-20">
//           <div className="flex items-center justify-between px-6 py-4">
//             <h1 className="text-xl font-bold text-slate-700">Doctor Portal</h1>

//             {/* Hamburger Button (visible on mobile) */}
//             <button className="md:hidden" onClick={toggleMenu}>
//               {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>

//             {/* Nav Links (desktop) */}
//             <ul className="hidden md:flex space-x-10">
//               <NavLink to="/">Dashboard</NavLink>
//               <NavLink to="/patients">Patients</NavLink>
//             </ul>
//           </div>

//           {/* Nav Links (mobile dropdown) */}
//           {isMenuOpen && (
//             <ul className="md:hidden px-6 pb-4 space-y-2 bg-white border-t">
//               <NavLink to="/" onClick={closeMenu}>Dashboard</NavLink>
//               <NavLink to="/patients" onClick={closeMenu}>Patients</NavLink>
//             </ul>
//           )}
//         </div>
//       )}

//       <Routes>
//         <Route
//           path="/doctor_login"
//           element={
//             isAuthenticated
//               ? <Navigate to="/" replace />
//               : <DoctorLogin setIsAuthenticated={setIsAuthenticated} />
//           }
//         />

//         {isAuthenticated ? (
//           <>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/patients" element={<Patients />} />
//           </>
//         ) : (
//           <Route path="*" element={<Navigate to="/doctor_login" replace />} />
//         )}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
