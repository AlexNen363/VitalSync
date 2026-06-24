import api from "./api";

export const requestAmbulance = async (
    ambulanceData
) => {
    const response = await api.post(
        "/requestAmbulance",
        ambulanceData
    );

    return response.data;
};

export const getAmbulanceRequests =
async () => {
    const response = await api.get(
        "/ambulanceRequests"
    );

    return response.data;
};