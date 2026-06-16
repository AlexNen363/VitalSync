const express = require("express");

const router = express.Router();

const {
    checkAuth,
    checkRole
} = require("../middlewares/admin-middleware");

const {
    registerPatient,
    searchPatient,
    bookAppointment,
    generateBill,
    requestAmbulance,
    getAppointments,
    updateAppointmentStatus,
    getAvailableDoctors
} = require("../controller/receptionist-controller");
// ======================
// PATIENT ROUTES
// ======================

router.post(
    "/registerPatient",
    checkAuth,
    checkRole("Receptionist"),
    registerPatient
);

router.get(
    "/searchPatient",
    checkAuth,
    checkRole("Receptionist"),
    searchPatient
);

// ======================
// APPOINTMENT ROUTES
// ======================

router.post(
    "/bookAppointment",
    checkAuth,
    checkRole("Receptionist"),
    bookAppointment
);
router.get(
    "/appointments",
    checkAuth,
    checkRole("Receptionist"),
    getAppointments
);
router.patch(
    "/appointments/:id/status",
    checkAuth,
    checkRole("Receptionist"),
    updateAppointmentStatus
);
// ======================
// BILLING ROUTES
// ======================

router.post(
    "/generateBill",
    checkAuth,
    checkRole("Receptionist"),
    generateBill
);

// ======================
// AMBULANCE ROUTES
// ======================

router.post(
    "/requestAmbulance",
    checkAuth,
    checkRole("Receptionist"),
    requestAmbulance
);

// ======================
// DOCTOR AVAILABILITY
// ======================

router.get(
    "/availableDoctors",
    checkAuth,
    checkRole("Receptionist"),
    getAvailableDoctors
);

module.exports = router;