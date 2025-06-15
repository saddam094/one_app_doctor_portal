import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Header from "./components/header/header.js";
import Dashboard from "./pages/navbar_screens/dashboard/dashboard.js";
import Patients from "./pages/navbar_screens/patients/Patient.js";
// import Eproducts from "./pages/navbar_screens/e_products/e_products.js";
// import Services from "./pages/navbar_screens/services/services.js";
// import Doctor from "./pages/navbar_screens/doctor/doctor.js";
// import P5 from "./pages/navbar_screens/p5/p5.js";
// import Cab from "./pages/navbar_screens/cab/cab.js";
// import Leisure from "./pages/navbar_screens/leisure/leisure.js";
// import RealState from "./pages/navbar_screens/real_state/real_state.js";
import DoctorLogin from "./doctor_login.js";

/// update page
// import EcomUpdate from "./pages/updates/ecom_update/ecom_update.js";
// import EcomUpdateProduct from "./pages/updates/ecom_product_update/ecom_product_update.js";
// import ServiceManUpdate from "./pages/updates/service_update/service_update.js";
// import DoctorUpdate from "./pages/updates/doctor_update/doctor_update.js";

/// add Page
// import EcomAddMember from "./pages/add/ecom_add_shop/ecom_add_shop.js";
// import EcomAddProduct from "./pages/add/ecom_add_product/ecom_add_product.js";
// import AddServiceMan from "./pages/add/add_service_man/add_service_man.js";
// import AddDoctor from "./pages/add/add_doctor/add_doctor.js";

/// manage Category
// import ManageServicesCategory from "./pages/manage_category/services_category/manage_services_category.js";
// import ManageDoctorsCategory from "./pages/manage_category/doctors_category/manage_doctors_category.js";



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

// 🚀 Block Small Screen Devices (Mobile)
function isMobileScreen() {
  return window.innerWidth < 1024;
}

function BlockedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-700 text-center px-5">
      <h1 className="text-2xl font-bold">Access Denied</h1>
      <p className="mt-2">This application is not available on small screens. Please use a desktop or larger device.</p>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true"; // Persist login
  });

  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsBlocked(isMobileScreen());
    };

    // Check screen size initially
    checkScreenSize();

    // Listen for window resize events
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Update localStorage when authentication state changes
  useEffect(() => {
    localStorage.setItem("isAuthenticated", isAuthenticated);
  }, [isAuthenticated]);

  if (isBlocked) {
    return <BlockedPage />;
  }

  return (
    <Router>
      {isAuthenticated && <Header setIsAuthenticated={setIsAuthenticated} />}

      {isAuthenticated && (
        <div className="flex h-40 items-center px-10 border-b-2 bg-white border-slate-300 justify-between pt-20">
          <nav>
            <ul className="flex space-x-10">
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
            {/* <Route path="/e-products" element={<Eproducts />} />
            <Route path="/services" element={<Services />} />
            <Route path="/doctor" element={<Doctor />} />
            <Route path="/cab" element={<Cab />} />
            <Route path="/leisure" element={<Leisure />} />
            <Route path="/real-state" element={<RealState />} />
            <Route path="/ecom_update" element={<EcomUpdate />} />
            <Route path="/ecom_add_member" element={<EcomAddMember />} />
            <Route path="/ecom_product_update" element={<EcomUpdateProduct />} />
            <Route path="/ecom_add_product" element={<EcomAddProduct />} />
            <Route path="/service_man_update" element={<ServiceManUpdate />} />
            <Route path="/add_service_man" element={<AddServiceMan />} />
            <Route path="/doctor_update" element={<DoctorUpdate />} />
            <Route path="/add_doctor" element={<AddDoctor />} />
            <Route path="/p5" element={<P5 />} />
            <Route path="/manage_service_category" element={<ManageServicesCategory />} />
            <Route path="/manage_doctor_category" element={<ManageDoctorsCategory />} /> */}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/doctor_login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;