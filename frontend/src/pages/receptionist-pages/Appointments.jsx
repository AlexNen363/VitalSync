import { useState } from "react";
import Sidebar from "../../components/receptionist-components/Sidebar";
import Navbar from "../../components/receptionist-components/Navbar";
import AppointmentTable from "../../components/receptionist-components/AppointmentTable";

import {
    bookAppointment,
    updateAppointmentStatus
} from "../../api/receptionist-api/appointmentApi";

const Appointments = () => {

    const [formData, setFormData] = useState({
        patientName: "",
        doctorName: "",
        specialization: "",
        appointmentDate: "",
        appointmentTime: ""
    });

    const [appointmentId, setAppointmentId] = useState("");
    const [status, setStatus] = useState("Checked In");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleBookAppointment = async () => {
        try {
            const result = await bookAppointment(formData);

            alert(result.message);

            console.log(result);

            setFormData({
                patientName: "",
                doctorName: "",
                specialization: "",
                appointmentDate: "",
                appointmentTime: ""
            });

            window.location.reload();

        } catch (error) {
            console.log(error);
            alert("Failed to book appointment");
        }
    };

    const handleUpdateStatus = async () => {
        try {
            const result = await updateAppointmentStatus(
                appointmentId,
                status
            );

            alert(result.message);

            console.log(result);

            window.location.reload();

        } catch (error) {
            console.log(error);
            alert("Failed to update status");
        }
    };

    return (
        <div>
            <Sidebar />

            <div>
                <Navbar />

                <h1>Appointment Management</h1>

                <div>
                    <h2>Book Appointment</h2>

                    <input
                        type="text"
                        name="patientName"
                        placeholder="Patient Name"
                        value={formData.patientName}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="doctorName"
                        placeholder="Doctor Name"
                        value={formData.doctorName}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="specialization"
                        placeholder="Specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                    />

                    <input
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                    />

                    <input
                        type="time"
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleChange}
                    />

                    <button onClick={handleBookAppointment}>
                        Book Appointment
                    </button>
                </div>

                <hr />

                <div>
                    <h2>Update Appointment Status</h2>

                    <input
                        type="text"
                        placeholder="Appointment ID"
                        value={appointmentId}
                        onChange={(e) =>
                            setAppointmentId(e.target.value)
                        }
                    />

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >
                        <option value="Checked In">
                            Checked In
                        </option>

                        <option value="Not Checked In">
                            Not Checked In
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>
                    </select>

                    <button onClick={handleUpdateStatus}>
                        Update Status
                    </button>
                </div>

                <hr />

                <AppointmentTable />
            </div>
        </div>
    );
};

export default Appointments;