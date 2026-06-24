import { useEffect, useState } from "react";
import { getBills } from "../../api/receptionist-api/billingApi";

const BillTable = () => {

    const [bills, setBills] = useState([]);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const data = await getBills();
                setBills(data.bills);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBills();
    }, []);

    return (
        <div>
            <h2>Generated Bills</h2>

            <table border="1">
                <thead>
                    <tr>
                        <th>Patient Name</th>
                        <th>Doctor Name</th>
                        <th>Consultation Fee</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {bills.length > 0 ? (
                        bills.map((bill) => (
                            <tr key={bill._id}>
                                <td>{bill.patientName}</td>
                                <td>{bill.doctorName}</td>
                                <td>₹{bill.consultationFee}</td>
                                <td>
                                    {new Date(
                                        bill.billDate
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">
                                No Bills Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BillTable;