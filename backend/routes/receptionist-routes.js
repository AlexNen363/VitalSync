const express = require("express");

const router = express.Router();

const {
    registerPatient,
    searchPatient,
    bookAppointment,
    generateBill,
    requestAmbulance,
    getAppointments,
    updateAppointmentStatus
} = require("../controller/receptionist-controller");
// ======================
// PATIENT ROUTES
// ======================

router.post("/registerPatient", registerPatient);

router.get("/searchPatient", searchPatient);

// ======================
// APPOINTMENT ROUTES
// ======================

router.post("/bookAppointment", bookAppointment);
router.get("/appointments", getAppointments);
router.patch(
    "/appointments/:id/status",
    updateAppointmentStatus
);

// ======================
// BILLING ROUTES
// ======================

router.post("/generateBill", generateBill);

// ======================
// AMBULANCE ROUTES
// ======================

router.post("/requestAmbulance", requestAmbulance);

module.exports = router;