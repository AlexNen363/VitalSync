import { useState } from "react";
import Sidebar from "../../components/receptionist-components/Sidebar";
import Navbar from "../../components/receptionist-components/Navbar";
import BillTable from "../../components/receptionist-components/BillTable";

import { generateBill }
from "../../api/receptionist-api/billingApi";

const Billing = () => {

    const [formData, setFormData] = useState({
        patientName: "",
        doctorName: "",
        consultationFee: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGenerateBill = async () => {
        try {
            const result =
                await generateBill(formData);

            alert(result.message);

            window.location.reload();

        } catch (error) {
            console.log(error);
            alert("Failed to Generate Bill");
        }
    };

    return (
        <div>
            <Sidebar />

            <div>
                <Navbar />

                <h1>Billing Management</h1>

                <div>
                    <h2>Generate Bill</h2>

                    <input
                        type="text"
                        name="patientName"
                        placeholder="Patient Name"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="doctorName"
                        placeholder="Doctor Name"
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="consultationFee"
                        placeholder="Consultation Fee"
                        onChange={handleChange}
                    />

                    <button
                        onClick={handleGenerateBill}
                    >
                        Generate Bill
                    </button>
                </div>

                <hr />

                <BillTable />
            </div>
        </div>
    );
};

export default Billing;