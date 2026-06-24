import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import ReceptionistDashboard from "./pages/receptionist-pages/ReceptionistDashboard";
import Patients from "./pages/receptionist-pages/Patients";
import Appointments from "./pages/receptionist-pages/Appointments";
import CheckIn from "./pages/receptionist-pages/CheckIn";
import Billing from "./pages/receptionist-pages/Billing";
import DoctorAvailability from "./pages/receptionist-pages/DoctorAvailability";
import RequestAmbulance from "./pages/receptionist-pages/RequestAmbulance";
import ReceptionistProfile from "./pages/receptionist-pages/ReceptionistProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<h1>Login Page</h1>} />

        {/* Receptionist */}
        <Route path="/receptionist" element={<ReceptionistDashboard />} />
        <Route path="/receptionist/patients" element={<Patients />} />
        <Route path="/receptionist/appointments" element={<Appointments />} />
        <Route path="/receptionist/checkin" element={<CheckIn />} />
        <Route path="/receptionist/billing" element={<Billing />} />
        <Route path="/receptionist/doctors" element={<DoctorAvailability />} />
        <Route path="/receptionist/ambulance" element={<RequestAmbulance />} />
        <Route path="/receptionist/profile" element={<ReceptionistProfile />} />

        {/* Other Roles */}
        <Route path="/admin" element={<h1>Admin Dashboard</h1>} />
        <Route path="/doctor" element={<h1>Doctor Dashboard</h1>} />
        <Route path="/labtech" element={<h1>Lab Technician Dashboard</h1>} />
        <Route path="/pharmacist" element={<h1>Pharmacist Dashboard</h1>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;