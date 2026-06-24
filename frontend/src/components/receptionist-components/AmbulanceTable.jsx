import { useEffect, useState } from "react";
import {
    getAmbulanceRequests
} from "../../api/receptionist-api/ambulanceApi";

const AmbulanceTable = () => {

    const [requests, setRequests] =
        useState([]);

    useEffect(() => {

        const fetchRequests =
        async () => {

            const data =
            await getAmbulanceRequests();

            setRequests(data.requests);
        };

        fetchRequests();

    }, []);

    return (
        <table border="1">

            <thead>
                <tr>
                    <th>Patient</th>
                    <th>Pickup Location</th>
                    <th>Emergency</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>

                {requests.map((request) => (

                    <tr key={request._id}>
                        <td>{request.patientName}</td>

                        <td>
                            {request.pickupLocation}
                        </td>

                        <td>
                            {request.emergencyDetails}
                        </td>

                        <td>{request.status}</td>
                    </tr>

                ))}

            </tbody>

        </table>
    );
};

export default AmbulanceTable;