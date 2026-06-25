import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAppointments } from "../../api/doctor-api/doctor-api";

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getAppointments();
      const found = data.find((p) => p._id === id);
      setPatient(found);
    };

    load();
  }, [id]);

  if (!patient) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Loading patient...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>🧾 Patient EMR Profile</h2>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 15,
          borderRadius: 10,
          maxWidth: 400,
          marginTop: 20,
        }}
      >
        <img
          src={`https://ui-avatars.com/api/?name=${patient.name}&background=2563eb&color=fff`}
          alt="patient"
          style={{ width: 80, borderRadius: "50%" }}
        />

        <h3>{patient.name}</h3>
        <p><b>Age:</b> {patient.age}</p>
        <p><b>Time:</b> {patient.time}</p>
        <p><b>Status:</b> {patient.status}</p>

        <hr />

        <h4>🦠 Disease</h4>
        <p>General Checkup / Fever</p>

        <h4>📜 History</h4>
        <ul>
          <li>Consultation - 20 June</li>
          <li>Follow-up - 10 June</li>
          <li>Routine checkup - 28 May</li>
        </ul>
      </div>
    </div>
  );
}