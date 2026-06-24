import { useNavigate } from "react-router-dom";

const QuickActions = () => {

    const navigate = useNavigate();

    return (
        <div>
            <h2>Quick Actions</h2>

            <div>
                <button onClick={() => navigate("/receptionist/patients")}>
    👤 Register Patient
</button>

<button onClick={() => navigate("/receptionist/appointments")}>
    📅 Book Appointment
</button>

<button onClick={() => navigate("/receptionist/checkin")}>
    ✅ Check-In Patient
</button>

<button onClick={() => navigate("/receptionist/billing")}>
    💳 Generate Bill
</button>

<button onClick={() => navigate("/receptionist/ambulance")}>
    🚑 Request Ambulance
</button>
            </div>
        </div>
    );
};

export default QuickActions;