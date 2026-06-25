
const BASE_URL = "http://localhost:5000/api/doctor";

// ======================
// APPOINTMENTS
// ======================

// Doctor views appointments assigned to them
export const getAppointments = async () => {
  const res = await fetch(`${BASE_URL}/appointments`);
  return await res.json();
};

// Doctor updates appointment status
export const updateStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/appointments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return await res.json();
};

// ======================
// PATIENTS
// ======================

// View patient records
export const getPatients = async () => {
  const res = await fetch("http://localhost:5000/patients");
  return await res.json();
};

// ======================
// CONSULTATIONS
// ======================

// Save consultation notes
export const saveConsultation = async (consultation) => {
  const res = await fetch(`${BASE_URL}/consultations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(consultation),
  });

  return await res.json();
};

// Get patient consultation history
export const getPatientHistory = async (patientId) => {
  const res = await fetch(`${BASE_URL}/history/${patientId}`);

  return await res.json();
};

// ======================
// LAB TESTS
// ======================

// Doctor requests lab tests
export const requestLabTest = async (labTest) => {
  const res = await fetch(`${BASE_URL}/labtests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(labTest),
  });

  return await res.json();
};

// ======================
// PRESCRIPTIONS
// ======================

// Doctor creates prescriptions
export const createPrescription = async (prescription) => {
  const res = await fetch(`${BASE_URL}/prescriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prescription),
  });

  return await res.json();
};

