import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api"
});


// =======================
// JWT INTERCEPTOR
// =======================

// Add JWT token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// =======================
// AUTH APIs
// =======================

// Login
export const loginStaff = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

// Register
export const registerStaff = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};


// =======================
// STAFF APIs
// =======================

// Get all staff
export const getAllStaff = async (page = 1) => {
    const response = await api.get(`/staff?page=${page}`);
    return response.data;
};

// Get staff by ID
export const getStaffById = async (id) => {
    const response = await api.get(`/staff/${id}`);
    return response.data;
};

// Create staff (doctor/receptionist/etc)
export const createStaff = async (data) => {
    const response = await api.post("/staff", data);
    return response.data;
};

// Update staff
export const updateStaff = async (id, data) => {
    const response = await api.put(`/staff/${id}`, data);
    return response.data;
};

// Deactivate staff
export const deactivateStaff = async (id) => {
    const response = await api.patch(`/staff/${id}/deactivate`);
    return response.data;
};

// Activate staff
export const activateStaff = async (id) => {
    const response = await api.patch(`/staff/${id}/activate`);
    return response.data;
};


// =======================
// DOCTOR APIs
// =======================

// Get all doctors
export const getDoctors = async () => {
    const response = await api.get("/doctors");
    return response.data;
};


// =======================
// AMBULANCE APIs
// =======================

// Create ambulance
export const createAmbulance = async (data) => {
    const response = await api.post("/ambulance", data);
    return response.data;
};

// Get all ambulances
export const getAmbulances = async () => {
    const response = await api.get("/ambulance");
    return response.data;
};

// Get ambulance by ID
export const getAmbulanceById = async (id) => {
    const response = await api.get(`/ambulance/${id}`);
    return response.data;
};

// Update ambulance
export const updateAmbulance = async (id, data) => {
    const response = await api.put(`/ambulance/${id}`, data);
    return response.data;
};

// Deactivate ambulance
export const deactivateAmbulance = async (id) => {
    const response = await api.patch(`/ambulance/${id}/deactivate`);
    return response.data;
};

// Activate ambulance
export const activateAmbulance = async (id) => {
    const response = await api.patch(`/ambulance/${id}/activate`);
    return response.data;
};