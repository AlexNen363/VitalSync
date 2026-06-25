const express = require("express");
const router = express.Router();

const { Appointment } = require("../models/doctor-models");

const {
  getPatientHistory,
  addConsultation,
  requestLabTest,
  createPrescription,
} = require("../controller/doctor-controller");

// ======================
// APPOINTMENTS
// ======================

// GET ALL APPOINTMENTS
router.get("/appointments", async (req, res) => {
  try {
    const data = await Appointment.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE APPOINTMENT
router.post("/appointments", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);

    await appointment.save();

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE STATUS
router.put("/appointments/:id", async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE APPOINTMENT
router.delete("/appointments/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Appointment deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ======================
// CONSULTATIONS
// ======================

router.post("/consultations", addConsultation);

// ======================
// LAB TESTS
// ======================

router.post("/labtests", requestLabTest);

// ======================
// PRESCRIPTIONS
// ======================

router.post("/prescriptions", createPrescription);

// ======================
// PATIENT HISTORY
// ======================

router.get("/history/:patientId", getPatientHistory);
// GET ALL APPOINTMENTS
router.get("/appointments", async (req, res) => {
  try {
    const data = await Appointment.find();

    console.log("Appointments from DB:", data);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;