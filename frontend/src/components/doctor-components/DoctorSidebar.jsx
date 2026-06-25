export default function DoctorSidebar({ setPage }) {
  return (
    <div
      style={{
        width: 220,
        background: "#1f2937",
        color: "#fff",
        padding: 20,
      }}
    >
      <h1>👨‍⚕️ Doctor Panel</h1>

      <button
        onClick={() => setPage("dashboard")}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        Dashboard
      </button>

      <button
        onClick={() => setPage("appointments")}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        Appointments
      </button>

      <button
        onClick={() => setPage("patients")}
        style={{
          width: "100%",
          padding: "10px",
        }}
      >
        Patients
      </button>
    </div>
  );
}