import Sidebar from "../../components/receptionist-components/Sidebar";
import Navbar from "../../components/receptionist-components/Navbar";
import DoctorAvailabilityCard from "../../components/receptionist-components/DoctorAvailabilityCard";

const DoctorAvailability = () => {
    return (
        <div>
            <Sidebar />

            <div>
                <Navbar />

                <h1>Doctor Availability</h1>

                <div>
                    <h2>Filter by Specialization</h2>

                    <select>
                        <option>All</option>
                        <option>Cardiology</option>
                        <option>General Medicine</option>
                    </select>
                </div>

                <hr />

                <DoctorAvailabilityCard />
            </div>
        </div>
    );
};

export default DoctorAvailability;