import api from "./api";

export const registerPatient = async (patientData) => {
    const response = await api.post(
        "/registerPatient",
        patientData
    );

    return response.data;
};

export const searchPatient = async (name) => {
    const response = await api.get(
        `/searchPatient?patientName=${name}`
    );

    return response.data;
};

export const getPatients = async () => {
    const response = await api.get("/patients");
    return response.data;
};