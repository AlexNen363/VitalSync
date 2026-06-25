import axios from "axios";

const BASE_URL = "http://localhost:5000/api/lab";

export const getTests = async () => {
  const res = await axios.get(`${BASE_URL}/tests`);
  return res.data;
};

export const updateTestStatus = async (id, status) => {
  const res = await axios.put(`${BASE_URL}/tests/${id}`, { status });
  return res.data;
};

export const uploadResult = async (id, result) => {
  const res = await axios.put(`${BASE_URL}/tests/${id}/result`, { result });
  return res.data;
};