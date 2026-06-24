import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div>
            <h2>VitalSync</h2>

            <ul>
                <li>
                    <Link to="/receptionist">Dashboard</Link>
                </li>

                <li>
                    <Link to="/receptionist/patients">Patients</Link>
                </li>

                <li>
                    <Link to="/receptionist/appointments">Appointments</Link>
                </li>

                <li>
                    <Link to="/receptionist/checkin">Check-In</Link>
                </li>

                <li>
                    <Link to="/receptionist/billing">Billing</Link>
                </li>

                <li>
                    <Link to="/receptionist/doctors">Doctor Availability</Link>
                </li>

                <li>
                    <Link to="/receptionist/ambulance">Request Ambulance</Link>
                </li>

                <li>
                    <Link to="/receptionist/profile">Profile</Link>
                </li>

                <li>Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;