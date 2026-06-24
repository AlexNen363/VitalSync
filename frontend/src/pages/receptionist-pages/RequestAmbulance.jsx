import { useState } from "react";
import Sidebar from "../../components/receptionist-components/Sidebar";
import Navbar from "../../components/receptionist-components/Navbar";

import {
    requestAmbulance
} from "../../api/receptionist-api/ambulanceApi";

const RequestAmbulance = () => {

    const [formData, setFormData] = useState({
        patientName: "",
        pickupLocation: "",
        emergencyDetails: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRequest = async () => {

        try {

            const result =
                await requestAmbulance(formData);

            alert(result.message);

            console.log(result);

            setFormData({
                patientName: "",
                pickupLocation: "",
                emergencyDetails: ""
            });

        } catch (error) {

            console.log(error);

            alert(
                "Failed to send ambulance request"
            );
        }
    };

    return (
        <div>
            <Sidebar />

            <div>
                <Navbar />

                <h1>Request Ambulance</h1>

                <div>

                    <input
                        type="text"
                        name="patientName"
                        placeholder="Patient Name"
                        value={formData.patientName}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="pickupLocation"
                        placeholder="Pickup Location"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                    />

                    <textarea
                        name="emergencyDetails"
                        placeholder="Emergency Details"
                        value={formData.emergencyDetails}
                        onChange={handleChange}
                    />

                    <button
                        onClick={handleRequest}
                    >
                        Send Ambulance Request
                    </button>

                </div>
            </div>
        </div>
    );
};

export default RequestAmbulance;