import { useEffect, useState } from "react";
import { getAppointments } from "../../api/receptionist-api/appointmentApi";

const AppointmentTable = () => {

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getAppointments();
                setAppointments(data.appointments);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAppointments();
    }, []);

    console.log("APPOINTMENT TABLE RENDERED");
console.log("APPOINTMENTS:", appointments);
    return (
        <div>
            <h2>Appointments</h2>

            <table border="1">
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Specialization</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <tr key={appointment._id}>
                                <td>{appointment.patientName}</td>
                                <td>{appointment.doctorName}</td>
                                <td>{appointment.specialization}</td>
                                <td>{appointment.appointmentDate}</td>
                                <td>{appointment.appointmentTime}</td>
                                <td>{appointment.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">
                                No Appointments Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AppointmentTable;