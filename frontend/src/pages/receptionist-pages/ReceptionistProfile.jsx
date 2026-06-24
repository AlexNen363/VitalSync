import Sidebar from "../../components/receptionist-components/Sidebar";
import Navbar from "../../components/receptionist-components/Navbar";

const ReceptionistProfile = () => {

    const name =
        localStorage.getItem("name");

    const email =
        localStorage.getItem("email");

    const role =
        localStorage.getItem("role");

    return (
        <div>
            <Sidebar />

            <div>
                <Navbar />

                <h1>My Profile</h1>

                <table border="1">
                    <tbody>

                        <tr>
                            <td>Name</td>
                            <td>{name}</td>
                        </tr>

                        <tr>
                            <td>Email</td>
                            <td>{email}</td>
                        </tr>

                        <tr>
                            <td>Role</td>
                            <td>{role}</td>
                        </tr>

                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default ReceptionistProfile;