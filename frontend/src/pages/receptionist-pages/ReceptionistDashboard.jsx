import Sidebar from "../../components/receptionist-components/Sidebar";
import Navbar from "../../components/receptionist-components/Navbar";
import StatsCards from "../../components/receptionist-components/StatsCards";
import QuickActions from "../../components/receptionist-components/QuickActions";
import AppointmentTable from "../../components/receptionist-components/AppointmentTable";
import DoctorAvailabilityCard from "../../components/receptionist-components/DoctorAvailabilityCard";
import EmergencyAmbulanceButton from "../../components/receptionist-components/EmergencyAmbulanceButton";

const ReceptionistDashboard = () => {
    return (
        <div>
            <Sidebar />

            <div>
                <Navbar />

                <StatsCards />

                <QuickActions />

                <AppointmentTable />

                <DoctorAvailabilityCard />

                <EmergencyAmbulanceButton />
            </div>
        </div>
    );
};

export default ReceptionistDashboard;