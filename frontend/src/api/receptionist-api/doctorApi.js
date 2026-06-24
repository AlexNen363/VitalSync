import axios from "axios";

const API_URL = "http://localhost:5000";

export const getAvailableDoctors = async (token) => {
    return axios.get(
        `${API_URL}/availableDoctors`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};