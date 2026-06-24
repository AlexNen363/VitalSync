import api from "./api";

export const generateBill = async (billData) => {
    const response = await api.post(
        "/generateBill",
        billData
    );

    return response.data;
};

export const getBills = async () => {
    const response = await api.get("/bills");

    return response.data;
};