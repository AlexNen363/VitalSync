const {
    Patient,
    Appointment,
    Bill,
    AmbulanceRequest
} = require("../models/receptionist-models");

// ======================
// REGISTER PATIENT
// ======================

const registerPatient = async (req, res) => {

    try {

        const {
            patientName,
            age,
            gender,
            phoneNumber,
            address
        } = req.body;

        const patient = new Patient({
            patientName,
            age,
            gender,
            phoneNumber,
            address
        });

        await patient.save();

        res.status(201).json({
            success: true,
            message: "Patient Registered Successfully",
            patient
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ======================
// SEARCH PATIENT
// ======================

const searchPatient = async (req, res) => {

    try {

        const patientName = req.query.patientName;

        const patients = await Patient.find({
            patientName: {
                $regex: patientName,
                $options: "i"
            }
        });

        res.status(200).json({
            success: true,
            patients
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ======================
// BOOK APPOINTMENT
// ======================

const bookAppointment = async (req, res) => {

    try {

        const {
            patientName,
            doctorName,
            specialization,
            appointmentDate,
            appointmentTime
        } = req.body;

        const appointment = new Appointment({
            patientName,
            doctorName,
            specialization,
            appointmentDate,
            appointmentTime
        });

        await appointment.save();

        res.status(201).json({
            success: true,
            message: "Appointment Booked Successfully",
            appointment
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ======================
// GENERATE BILL
// ======================

const generateBill = async (req, res) => {

    try {

        const {
            patientName,
            doctorName,
            consultationFee
        } = req.body;

        const bill = new Bill({
            patientName,
            doctorName,
            consultationFee
        });

        await bill.save();

        res.status(201).json({
            success: true,
            message: "Bill Generated Successfully",
            bill
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// ======================
// REQUEST AMBULANCE
// ======================

const requestAmbulance = async (req, res) => {

    try {

        const {
            patientName,
            pickupLocation,
            emergencyDetails
        } = req.body;

        const ambulanceRequest = new AmbulanceRequest({
            patientName,
            pickupLocation,
            emergencyDetails
        });

        await ambulanceRequest.save();

        res.status(201).json({
            success: true,
            message: "Ambulance Request Created Successfully",
            ambulanceRequest
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// ======================
// VIEW APPOINTMENTS
// ======================

const getAppointments = async (req, res) => {

    try {

        const appointments = await Appointment.find();

        res.status(200).json({
            success: true,
            appointments
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// ======================
// UPDATE APPOINTMENT STATUS
// ======================

const updateAppointmentStatus = async (req, res) => {

    try {

        const appointmentId = req.params.id;

        const { status } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Appointment Status Updated",
            appointment
        });

    }
    catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    registerPatient,
    searchPatient,
    bookAppointment,
    generateBill,
    requestAmbulance,
    getAppointments,
    updateAppointmentStatus
};