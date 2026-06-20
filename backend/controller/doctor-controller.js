const Appointment = require("../models/Appointment");
const Consultation = require("../models/Consultation");
const LabTest = require("../models/LabTest");
const Prescription = require("../models/Prescription");

// View Scheduled Appointments
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      status: "Scheduled",
    })
      .populate("patientId")
      .populate("doctorId");

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Review Patient Medical History
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

// Record Consultation Notes
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

// Request Laboratory Tests
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

// Create Prescription
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
  getAppointments,
  getPatientHistory,
  addConsultation,
  requestLabTest,
  createPrescription,
};