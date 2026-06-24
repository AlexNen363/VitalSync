import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../../pages/admin-pages/LoginForm";

import { loginStaff } from "../../api/admin-api/admin-api";

const Login = () => {
    const navigate = useNavigate();

    const selectedRole = localStorage.getItem("selectedRole");
    const [formData, setFormData] = useState({
        Username: "",
        Password: ""
    });

    const changeHandler = (event) => {
        setFormData({
            ...formData,
            [event.target.name]:
                event.target.value
        });
    };

    const submitHandler = async (event) => {
        event.preventDefault();

        try {
            const response = await loginStaff({
                StaffUsername: formData.Username,
                StaffPassword: formData.Password
            });

            // Adjust according to backend response
            const loggedInRole = response.role;

            // Check selected role vs actual role
            if (loggedInRole !== selectedRole) {
                localStorage.removeItem("token");
                alert("Selected role does not match your account role.");
                return;
            }

            localStorage.setItem("token", response.token);
            localStorage.setItem("role", loggedInRole);
            localStorage.setItem("username", response.username);

            // Redirect to correct dashboard
            switch (loggedInRole) {
                case "Administrator":
                    navigate("/admin/dashboard");
                    break;

                case "Receptionist":
                    navigate("/receptionist/dashboard");
                    break;

                case "Doctor":
                    navigate("/doctor/dashboard");
                    break;

                case "Pharmacist":
                    navigate("/pharmacist/dashboard");
                    break;

                case "Lab Technician":
                    navigate("/labtech/dashboard");
                    break;

                default:
                    navigate("/");
            }

        } catch (error) {
            console.log("FULL ERROR:", error);
            console.log("RESPONSE:", error.response);
            console.log("DATA:", error.response?.data);

            alert("Login failed");
        }
    };

    return (
        <LoginForm
            formData={formData}
            changeHandler={changeHandler}
            submitHandler={submitHandler}
            selectedRole={selectedRole}
        />
    );
};

export default Login;