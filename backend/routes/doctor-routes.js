const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const Doctor = require('../models/doctor-models');
const { v4: uuidv4 } = require('uuid');

// ===============================================
// GET ALL DOCTORS
// ===============================================
const getDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find().populate('DepartmentId');

        res.status(200).json({
            success: true,
            data: doctors
        });
    } catch (err) {
        console.log('GET DOCTORS ERROR:', err);
        return res.status(500).json({
            message: err.message,
            error: err
        });
    }
};

// ===============================================
// GET DOCTOR BY ID
// ===============================================
const getDoctorById = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({
            DoctorID: req.params.docid
        }).populate('DepartmentId');

        if (!doctor) {
            return res.status(404).json({
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });

    } catch (err) {
        console.log('GET DOCTOR ERROR:', err);
        return res.status(500).json({
            message: err.message,
            error: err
        });
    }
};

// ===============================================
// CREATE DOCTOR
// ===============================================
const createDoctor = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.array()[0].msg
        });
    }

    try {
        const {
            UserId,
            DoctorName,
            Specialization,
            Designation,
            DateOfJoining,
            DepartmentId,
            ContactNumber,
            AvailableDays,
            AvailableTimeSlots
        } = req.body;

        const doctor = new Doctor({
            UserId,
            DoctorID: uuidv4(),
            DoctorName,
            Specialization,
            Designation,
            DateOfJoining,
            DepartmentId,
            ContactNumber,
            AvailableDays: AvailableDays || [],
            AvailableTimeSlots: AvailableTimeSlots || [],
            IsActive: true
        });

        await doctor.save();

        res.status(201).json({
            success: true,
            message: 'Doctor added successfully',
            data: doctor
        });

    } catch (err) {
        console.log('CREATE DOCTOR ERROR:', err);
        return res.status(500).json({
            message: err.message,
            error: err
        });
    }
};

// ===============================================
// UPDATE DOCTOR
// ===============================================
const updateDoctor = async (req, res, next) => {

    try {
        const updatedDoctor = await Doctor.findOneAndUpdate(
            { DoctorID: req.params.docid },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedDoctor) {
            return res.status(404).json({
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
            data: updatedDoctor
        });

    } catch (err) {
        console.log('UPDATE DOCTOR ERROR:', err);
        return res.status(500).json({
            message: err.message,
            error: err
        });
    }
};

// ===============================================
// DELETE DOCTOR
// ===============================================
const deleteDoctor = async (req, res, next) => {

    try {
        const deletedDoctor = await Doctor.findOneAndDelete({
            DoctorID: req.params.docid
        });

        if (!deletedDoctor) {
            return res.status(404).json({
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor deleted successfully'
        });

    } catch (err) {
        console.log('DELETE DOCTOR ERROR:', err);
        return res.status(500).json({
            message: err.message,
            error: err
        });
    }
};

module.exports = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};