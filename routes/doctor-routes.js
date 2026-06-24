const express = require("express");
const router = express.Router();

const {
    Appointment,
    Consultation,
    LabTest,
    Prescription
} = require("../models/doctor-models");


// ======================
// View Scheduled Appointments
// ======================
router.get("/appointments", async (req, res) => {
    try {
        const data = await Appointment.find({ status: "Scheduled" })
            .populate("patientId")
            .populate("doctorId");

        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ======================
// Review Patient Medical History
// ======================
router.get("/history/:patientId", async (req, res) => {
    try {
        const data = await Consultation.find({
            patientId: req.params.patientId
        });

        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ======================
// Record Consultation Notes
// ======================
router.post("/consultation", async (req, res) => {
    try {
        const data = new Consultation(req.body);
        await data.save();

        res.status(201).json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ======================
// Request Laboratory Tests
// ======================
router.post("/labtest", async (req, res) => {
    try {
        const data = new LabTest(req.body);
        await data.save();

        res.status(201).json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});


// ======================
// Create Prescription
// ======================
router.post("/prescription", async (req, res) => {
    try {
        const data = new Prescription(req.body);
        await data.save();

        res.status(201).json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;