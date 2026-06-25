const mongoose = require("mongoose");

// ======================
// CONSULTATION
// ======================
const consultationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },

  notes: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ======================
// LAB TEST
// ======================
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

// ======================
// PRESCRIPTION
// ======================
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

// ======================
// APPOINTMENT
// ======================
const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["Confirmed", "Pending", "Completed"],
    default: "Pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ======================
// MODELS
// ======================
const Consultation =
  mongoose.models.Consultation ||
  mongoose.model("Consultation", consultationSchema);

const LabTest =
  mongoose.models.LabTest ||
  mongoose.model("LabTest", labTestSchema);

const Prescription =
  mongoose.models.Prescription ||
  mongoose.model("Prescription", prescriptionSchema);

const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);

module.exports = {
  Consultation,
  LabTest,
  Prescription,
  Appointment,
};