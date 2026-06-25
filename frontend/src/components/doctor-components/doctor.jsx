import { useNavigate } from "react-router-dom";

export const DoctorSidebar = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#1f2937",
      color: "white",
      padding: "20px"
    }}>
      <h2>👨‍⚕️ Doctor</h2>

      <button onClick={() => navigate("/doctor")}>Dashboard</button>
      <button onClick={() => navigate("/doctor/appointments")}>Appointments</button>
      <button onClick={() => navigate("/doctor/patients")}>Patients</button>
    </div>
  );
};

export const DoctorHeader = () => {
  return (
    <div style={{
      padding: "15px",
      borderBottom: "1px solid #ddd"
    }}>
      <h3>Doctor Panel 🏥</h3>
    </div>
  );
};