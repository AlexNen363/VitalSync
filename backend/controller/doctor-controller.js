const {
  Consultation,
  LabTest,
  Prescription,
} = require("../models/doctor-models");

// ======================
// GET PATIENT HISTORY
// ======================
const getPatientHistory = async (req, res) => {
  try {
    const history = await Consultation.find({
      patientId: req.params.patientId,
    });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================
// SAVE CONSULTATION
// ======================
const addConsultation = async (req, res) => {
  try {
    const consultation = new Consultation(req.body);

    await consultation.save();

    res.status(201).json({
      success: true,
      consultation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================
// REQUEST LAB TEST
// ======================
const requestLabTest = async (req, res) => {
  try {
    const labTest = new LabTest(req.body);

    await labTest.save();

    res.status(201).json({
      success: true,
      labTest,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================
// CREATE PRESCRIPTION
// ======================
const createPrescription = async (req, res) => {
  try {
    const prescription = new Prescription(req.body);

    await prescription.save();

    res.status(201).json({
      success: true,
      prescription,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getPatientHistory,
  addConsultation,
  requestLabTest,
  createPrescription,
};