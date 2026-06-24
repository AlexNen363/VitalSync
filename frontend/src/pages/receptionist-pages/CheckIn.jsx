import Sidebar from "../../components/receptionist-components/Sidebar";
import Navbar from "../../components/receptionist-components/Navbar";
import AppointmentTable from "../../components/receptionist-components/AppointmentTable";

const CheckIn = () => {
    return (
        <div>
            <Sidebar />

            <div>
                <Navbar />

                <h1>Patient Check-In</h1>

                <div>
                    <h2>Search Appointment</h2>

                    <input
                        type="text"
                        placeholder="Appointment ID"
                    />

                    <button>
                        Search
                    </button>
                </div>

                <hr />

                <div>
                    <h2>Check-In Actions</h2>

                    <button>
                        Mark Checked In
                    </button>

                    <button>
                        Mark Not Checked In
                    </button>
                </div>

                <hr />

                <div>
                    <h2>Today's Check-Ins</h2>

                    <AppointmentTable />
                </div>
            </div>
        </div>
    );
};

export default CheckIn;