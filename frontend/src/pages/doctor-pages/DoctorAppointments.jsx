import { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    time: "",
    status: "Pending",
  });

  // ======================
  // GET APPOINTMENTS
  // ======================
  const [appointments, setAppointments] = useState([]);
const [loading, setLoading] = useState(true);

const fetchAppointments = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/doctor/appointments");

    const data = await res.json();

    setAppointments(data);
    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
};
  useEffect(() => {
    fetchAppointments();
  }, []);

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ======================
  // SUBMIT FORM (POST)
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/doctor/appointments",
        form
      );

      setForm({ name: "", age: "", time: "", status: "Pending" });
      fetchAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Doctor Appointments</h2>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          name="name"
          placeholder="Patient Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
        />

        <input
          name="time"
          placeholder="Time (e.g. 10:00 AM)"
          value={form.time}
          onChange={handleChange}
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Completed</option>
        </select>

        <button type="submit">Add</button>
      </form>

      {/* ================= LIST ================= */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((a) => (
            <tr key={a._id}>
              <td>{a.name}</td>
              <td>{a.age}</td>
              <td>{a.time}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}