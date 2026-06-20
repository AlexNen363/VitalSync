const mongoose = require("mongoose");

// Consultation Schema
const consultationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Lab Test Schema
const labTestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  testName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
});

// Prescription Schema
const prescriptionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  medicines: [
    {
      medicineName: String,
      dosage: String,
      frequency: String,
      duration: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Models
const Consultation =
  mongoose.models.Consultation ||
  mongoose.model("Consultation", consultationSchema);

const LabTest =
  mongoose.models.LabTest ||
  mongoose.model("LabTest", labTestSchema);

const Prescription =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", prescriptionSchema);

module.exports = {
  Consultation,
  LabTest,
  Prescription,
};