import { BrowserRouter, Routes, Route } from "react-router-dom";
import DoctorDashboard from "./pages/doctor-pages/DoctorDashboard";
import PatientDetails from "./pages/doctor-pages/PatientDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* DEFAULT REDIRECT */}
        <Route path="/" element={<DoctorDashboard />} />

        {/* DASHBOARD */}
        <Route path="/doctor" element={<DoctorDashboard />} />

        {/* PATIENT EMR PAGE */}
        <Route path="/patient/:id" element={<PatientDetails />} />

        {/* APPOINTMENTS PAGE (placeholder) */}
        <Route
          path="/doctor/appointments"
          element={<div>Appointments Page</div>}
        />

        {/* 404 fallback */}
        <Route path="*" element={<div>404 Page Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;