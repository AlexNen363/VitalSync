
import "./DoctorDashboard.css";
import { useEffect, useState } from "react";
import {
  getAppointments,
  updateStatus,
  saveConsultation,
  createPrescription,
  requestLabTest,
} from "../../api/doctor-api/doctor-api";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState("dashboard");
const [history, setHistory] = useState([]);
  

  const [theme, setTheme] = useState("light");
  const [doctorStatus, setDoctorStatus] = useState("Online");

  // ✅ MODAL STATE
  const [selectedPatient, setSelectedPatient] = useState(null);
const [medicine, setMedicine] = useState("");
const [labTest, setLabTest] = useState("");
const [consultationNotes, setConsultationNotes] = useState("");
  // LOAD DATA
  const loadAppointments = async () => {
  const data = await getAppointments();

  console.log("Appointments:", data);

  setAppointments(Array.isArray(data) ? data : []);
};
  useEffect(() => {
    loadAppointments();

    const interval = setInterval(() => {
      loadAppointments();
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  // STATUS UPDATE
 const changeStatus = async (id) => {
  await updateStatus(id, "Completed");
  loadAppointments();
};
const saveNotes = async () => {
  try {
    await saveConsultation({
      patientId: selectedPatient._id,
      notes: consultationNotes,
    });

    alert("Consultation notes saved");
    setConsultationNotes("");
  } catch (err) {
    alert("Failed to save notes");
  }
};

const savePrescriptionData = async () => {
  try {
    await createPrescription({
      patientId: selectedPatient._id,
      medicines: [
        {
          medicineName: medicine,
          dosage: "",
          frequency: "",
          duration: "",
        },
      ],
    });

    alert("Prescription saved");
    setMedicine("");
  } catch (err) {
    alert("Failed to save prescription");
  }
};

const orderLab = async () => {
  try {
    await requestLabTest({
      patientId: selectedPatient._id,
      testName: labTest,
    });

    alert("Lab test ordered");
    setLabTest("");
  } catch (err) {
    alert("Failed to order test");
  }
};

  // OPEN MODAL
  const openPatient = async (patient) => {
  setSelectedPatient(patient);

  try {
    const data = await getPatientHistory(patient._id);

    if (data.success) {
      setHistory(data.history);
    } else {
      setHistory([]);
    }
  } catch (err) {
    console.log(err);
    setHistory([]);
  }
};
  const closePatient = () => {
    setSelectedPatient(null);
  };

  // STATS
  const total = appointments.length;

  const pending = appointments.filter(
    (a) => a.status?.toLowerCase() === "pending"
  ).length;

  const completed = appointments.filter(
    (a) => a.status?.toLowerCase() === "completed"
  ).length;

  const cancelled = appointments.filter(
    (a) => a.status?.toLowerCase() === "cancelled"
  ).length;

  const nextPatient = appointments.find(
    (a) => a.status?.toLowerCase() === "pending"
  );

  return (
    <div className={`dashboard-container ${theme}`}>

      {/* SIDEBAR */}
      <div className="sidebar">
        <h1 className="logo">🏥 MediCare</h1>

        <button
          className={`nav-btn ${page === "dashboard" ? "active" : ""}`}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={`nav-btn ${page === "appointments" ? "active" : ""}`}
          onClick={() => setPage("appointments")}
        >
          Appointments
        </button>

        <button
          className={`nav-btn ${page === "patients" ? "active" : ""}`}
          onClick={() => setPage("patients")}
        >
          Patients
        </button>
      </div>

      {/* MAIN */}
      <div className="main-content">

        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <h2>Doctor Dashboard</h2>
            <p>Clinical Management System</p>
          </div>

          <div className="top-actions">
            <button
              className="status-toggle"
              onClick={() =>
                setDoctorStatus(doctorStatus === "Online" ? "Busy" : "Online")
              }
            >
              {doctorStatus}
            </button>

            <button
              className="theme-toggle"
              onClick={() =>
                setTheme(theme === "light" ? "dark" : "light")
              }
            >
              Theme
            </button>
          </div>
        </div>

        <div className="content">

          {/* DASHBOARD */}
          {page === "dashboard" && (
            <>
              <h1 className="page-title">Dashboard</h1>

              <div className="cards">
                <div className="card">Total: {total}</div>
                <div className="card">Pending: {pending}</div>
                <div className="card">Completed: {completed}</div>
                <div className="card">Cancelled: {cancelled}</div>
              </div>

              <div className="next-section">
                <h2>⏱ Next Patient</h2>

                {nextPatient ? (
                  <div className="next-card">
                   <h3>{nextPatient.patientName}</h3>
<p>Doctor: {nextPatient.doctorName}</p>
<p>Department: {nextPatient.specialization}</p>
<p>Date: {nextPatient.appointmentDate}</p>
                    <p>Status: {nextPatient.status}</p>
                  </div>
                ) : (
                  <div className="next-card">
                    No pending patients 🎉
                  </div>
                )}
              </div>
            </>
          )}

          {/* APPOINTMENTS */}
          {page === "appointments" && (
            <>
              <h1 className="page-title">Appointments</h1>

            

                  

              <div className="table-card">
                <table>
                  <thead>
                    <tr>
                     <th>Patient</th>
<th>Department</th>
<th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
  {appointments.map((a) => (
    <tr key={a._id}>
      <td
        onClick={() => openPatient(a)}
        style={{
          cursor: "pointer",
          color: "#2563eb",
          fontWeight: "600",
        }}
      >
        {a.patientName}
      </td>

      <td>{a.specialization}</td>
      <td>{a.appointmentDate}</td>
      <td>{a.status}</td>

      <td>
        <button
          className="status-btn"
          onClick={() => changeStatus(a._id)}
        >
          Done
        </button>
      </td>
    </tr>
  ))}
</tbody>
                </table>
              </div>
            </>
          )}

          {/* PATIENTS */}
          {page === "patients" && (
            <>
              <h1 className="page-title">Patients</h1>

              <div className="table-card">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a._id}>
                        <td>{a.patientName}</td>
<td>{a.specialization}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </div>

   {/* PATIENT DETAILS MODAL */}
{selectedPatient && (
  <div className="modal-overlay" onClick={closePatient}>
    <div
  style={{
    background:"#2563eb",
    color:"white",
    padding:"15px",
    borderRadius:"12px",
    marginBottom:"20px"
  }}
>
  <h2>{selectedPatient.patientName}</h2>
<p>
  Doctor: {selectedPatient.doctorName} | Status: {selectedPatient.status}
</p>
</div>
    <div
      className="modal-box"
      onClick={(e) => e.stopPropagation()}
      style={{ width: "650px", maxWidth: "95%" }}
    >
      <h2>👨‍⚕️ Patient Details</h2>

     <p><b>Patient:</b> {selectedPatient.patientName}</p>
<p><b>Doctor:</b> {selectedPatient.doctorName}</p>
<p><b>Department:</b> {selectedPatient.specialization}</p>
<p><b>Date:</b> {selectedPatient.appointmentDate}</p>
<p><b>Status:</b> {selectedPatient.status}</p>

      <hr />
      <h3>📋 Medical History</h3>

<p>• Previous Visit: 12/06/2026</p>
<p>• Diagnosis: Viral Fever</p>
<p>• Medication: Paracetamol</p>
<p>• Allergies: None</p>

<hr />
<h3>📝 Consultation Notes</h3>

<textarea
  rows="4"
  style={{
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "10px",
  }}
  placeholder="Enter consultation notes..."
  value={consultationNotes}
  onChange={(e) => setConsultationNotes(e.target.value)}
/>

<button
  className="status-btn"
  onClick={async () => {
  const response = await saveConsultation({
    patientId: selectedPatient._id,
    notes: consultationNotes,
  });

  if (response.success) {
    alert("Consultation saved successfully");

    const historyData = await getPatientHistory(
      selectedPatient._id
    );

    setHistory(historyData.history);
<h3>📖 Previous Consultations</h3>

{history.length === 0 ? (
  <p>No previous consultations found.</p>
) : (
  history.map((item) => (
    <div
      key={item._id}
      style={{
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "10px",
      }}
    >
      <p>{item.notes}</p>

      <small>
        {new Date(item.createdAt).toLocaleString()}
      </small>
    </div>
  ))
)}
    setConsultationNotes("");
  }
}}
>
  Save Notes
</button>

<hr style={{ marginTop: "20px" }} />

      <h3>💊 Prescription</h3>

      <textarea
        rows="4"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px",
        }}
        placeholder="Paracetamol 500mg twice daily"
        value={medicine}
        onChange={(e) => setMedicine(e.target.value)}
      />

      <button
        className="status-btn"
        onClick={() =>
          alert(`Prescription saved for ${selectedPatient.name}`)
        }
      >
        Save Prescription
      </button>

      <hr style={{ marginTop: "20px" }} />

      <h3>🧪 Lab Test Request</h3>

      <textarea
        rows="3"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px",
        }}
        placeholder="CBC, Blood Sugar, Urine Test"
        value={labTest}
        onChange={(e) => setLabTest(e.target.value)}
      />

      <button
        className="add-btn"
        onClick={() =>
          alert(`Lab Test Ordered for ${selectedPatient.name}`)
        }
      >
        Order Test
      </button>

      <br />
      <br />

      <button className="close-btn" onClick={closePatient}>
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}