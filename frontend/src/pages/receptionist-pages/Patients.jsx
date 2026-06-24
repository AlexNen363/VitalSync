import { useState } from "react";
import Sidebar from "../../components/receptionist-components/Sidebar";
import { registerPatient } from "../../api/receptionist-api/patientApi";
import PatientTable from
"../../components/receptionist-components/PatientTable";

const Patients = () => {

    const [formData, setFormData] = useState({
        patientName: "",
        age: "",
        gender: "",
        phoneNumber: "",
        address: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await registerPatient(formData);

            alert(result.message);

            console.log(result);
        } catch (error) {
            console.error(error);
            alert("Registration Failed");
        }
    };

    return (
        <div>
            <Sidebar />

            <h1>Register Patient</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="patientName"
                    placeholder="Patient Name"
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    onChange={handleChange}
                />

                <select
                    name="gender"
                    onChange={handleChange}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    onChange={handleChange}
                />

                <button type="submit">
                    Register Patient
                </button>

            </form>
            <PatientTable />
        </div>
    );
};

export default Patients;