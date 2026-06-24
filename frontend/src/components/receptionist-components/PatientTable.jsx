import { useEffect, useState } from "react";
import { getPatients } from "../../api/receptionist-api/patientApi";

const PatientTable = () => {

    const [patients, setPatients] = useState([]);

    useEffect(() => {
    const fetchPatients = async () => {
        try {
            const data = await getPatients();
            setPatients(data.patients);
        } catch (error) {
            console.log(error);
        }
    };

    fetchPatients();
}, []);

console.log("PATIENT TABLE RENDERED");
console.log("PATIENTS:", patients);

    return (
        <div>
            <h2>Patient Records</h2>

            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Address</th>
                    </tr>
                </thead>

                <tbody>
                    {patients.length > 0 ? (
                        patients.map((patient) => (
                            <tr key={patient._id}>
                                <td>{patient.patientName}</td>
                                <td>{patient.age}</td>
                                <td>{patient.gender}</td>
                                <td>{patient.phoneNumber}</td>
                                <td>{patient.address}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">
                                No Patients Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PatientTable;