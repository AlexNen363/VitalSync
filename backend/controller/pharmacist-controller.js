const HttpError      = require('../models/http-error');
const { validationResult } = require('express-validator');
const mongoose       = require('mongoose');
const Prescription   = require('../models/prescription');
const Medicine       = require('../models/medicine');
const Reminder       = require('../models/reminder');

// ─────────────────────────────────────────────────────────────────────────────
// UC-PHARM-01 : Dispense Medicines
// ─────────────────────────────────────────────────────────────────────────────

// Step 1 — Pharmacist reviews prescription
const getPrescriptionById = async (req, res, next) => {

    const prescriptionId = req.params.prescriptionid;

    let prescription;
    try {
        prescription = await Prescription.findById(prescriptionId);
    } catch (err) {
        return next(new HttpError('Fetching prescription failed, please try again', 500));
    }

    if (!prescription) {
        return next(new HttpError('Could not find a prescription for the given ID', 404));
    }

    res.status(200).json({ prescription: prescription.toObject({ getters: true }) });
};

// Step 2 — Pharmacist checks medicine availability
const checkMedicineAvailability = async (req, res, next) => {

    const prescriptionId = req.params.prescriptionid;

    let prescription;
    try {
        prescription = await Prescription.findById(prescriptionId);
    } catch (err) {
        return next(new HttpError('Fetching prescription failed, please try again', 500));
    }

    if (!prescription) {
        return next(new HttpError('Could not find a prescription for the given ID', 404));
    }

    const availabilityReport = [];

    for (const med of prescription.Medicines) {

        let inventoryItem;
        try {
            inventoryItem = await Medicine.findById(med.MedicineId);
        } catch (err) {
            return next(new HttpError('Checking inventory failed, please try again', 500));
        }

        const isAvailable = inventoryItem && inventoryItem.StockQuantity >= med.Quantity;

        availabilityReport.push({
            MedicineId:   med.MedicineId,
            MedicineName: med.MedicineName,
            RequiredQty:  med.Quantity,
            AvailableQty: inventoryItem ? inventoryItem.StockQuantity : 0,
            IsAvailable:  isAvailable,
            Shortfall:    isAvailable
                            ? 0
                            : med.Quantity - (inventoryItem ? inventoryItem.StockQuantity : 0)
        });
    }

    const allAvailable = availabilityReport.every(item => item.IsAvailable);

    res.status(200).json({
        PrescriptionId:        prescriptionId,
        AllMedicinesAvailable: allAvailable,
        AvailabilityReport:    availabilityReport
    });
};

// Steps 3 & 4 — Dispense medicines and update inventory
const dispenseMedicines = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(errors.array()[0].msg, 422));
    }

    const prescriptionId = req.params.prescriptionid;

    let prescription;
    try {
        prescription = await Prescription.findById(prescriptionId);
    } catch (err) {
        return next(new HttpError('Fetching prescription failed, please try again', 500));
    }

    if (!prescription) {
        return next(new HttpError('Could not find a prescription for the given ID', 404));
    }

    if (prescription.IsDispensed) {
        return next(new HttpError('Medicines for this prescription have already been dispensed', 400));
    }

    // Fetch all medicine records and check for shortages before touching stock
    const medicineRecords = [];
    const shortages       = [];

    for (const med of prescription.Medicines) {

        let inventoryItem;
        try {
            inventoryItem = await Medicine.findById(med.MedicineId);
        } catch (err) {
            return next(new HttpError('Fetching medicine inventory failed, please try again', 500));
        }

        if (!inventoryItem || inventoryItem.StockQuantity < med.Quantity) {
            shortages.push({
                MedicineName: med.MedicineName,
                RequiredQty:  med.Quantity,
                AvailableQty: inventoryItem ? inventoryItem.StockQuantity : 0
            });
        } else {
            medicineRecords.push({ inventoryItem, requiredQty: med.Quantity });
        }
    }

    // Abort entirely if any shortage — no partial dispense
    if (shortages.length > 0) {
        return res.status(400).json({
            message:   'Insufficient stock for one or more medicines. Dispensing aborted.',
            Shortages: shortages
        });
    }

    // All stock confirmed — deduct and save inside a transaction
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        const dispensedItems = [];

        for (const { inventoryItem, requiredQty } of medicineRecords) {
            inventoryItem.StockQuantity -= requiredQty;
            await inventoryItem.save({ session: sess });

            dispensedItems.push({
                MedicineId:        inventoryItem._id,
                MedicineName:      inventoryItem.MedicineName,
                DispensedQuantity: requiredQty,
                RemainingStock:    inventoryItem.StockQuantity
            });
        }

        prescription.IsDispensed   = true;
        prescription.DispensedDate = new Date();
        prescription.DispensedBy   = req.body.PharmacistId;
        await prescription.save({ session: sess });

        await sess.commitTransaction();

        res.status(200).json({
            message:        'Medicines dispensed successfully and inventory updated',
            PrescriptionId: prescriptionId,
            DispensedItems: dispensedItems
        });

    } catch (err) {
        await sess.abortTransaction();
        return next(new HttpError('Dispensing medicines failed, please try again', 500));
    } finally {
        sess.endSession();
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// UC-PHARM-02 : Configure Medicine Reminder
// ─────────────────────────────────────────────────────────────────────────────

// Steps 1–3 — Enter medicine details + dosage timing + duration → create schedule
const createMedicineReminder = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(errors.array()[0].msg, 422));
    }

    const prescriptionId = req.params.prescriptionid;

    let prescription;
    try {
        prescription = await Prescription.findById(prescriptionId);
    } catch (err) {
        return next(new HttpError('Fetching prescription failed, please try again', 500));
    }

    if (!prescription) {
        return next(new HttpError('Could not find a prescription for the given ID', 404));
    }

    const { MedicineName, Dosage, Times, StartDate, DurationDays } = req.body;

    // Derive EndDate from StartDate + DurationDays
    const start = new Date(StartDate);
    const end   = new Date(start);
    end.setDate(end.getDate() + parseInt(DurationDays) - 1);

    const newReminder = new Reminder({
        PrescriptionId: prescriptionId,
        PatientId:      prescription.PatientId,
        PatientName:    prescription.PatientName,
        MedicineName,
        Dosage,
        Times,
        StartDate:    start,
        EndDate:      end,
        DurationDays: parseInt(DurationDays),
        IsActive:     true
    });

    try {
        await newReminder.save();
    } catch (err) {
        return next(new HttpError('Creating reminder failed, please try again', 500));
    }

    res.status(201).json({
        message:  'Medicine reminder schedule created successfully',
        Reminder: newReminder.toObject({ getters: true })
    });
};

// Get all reminders for a prescription
const getRemindersByPrescription = async (req, res, next) => {

    const prescriptionId = req.params.prescriptionid;

    let reminders;
    try {
        reminders = await Reminder.find({ PrescriptionId: prescriptionId });
    } catch (err) {
        return next(new HttpError('Fetching reminders failed, please try again', 500));
    }

    res.status(200).json({
        Reminders: reminders.map(r => r.toObject({ getters: true }))
    });
};

// Update or deactivate a reminder
const updateReminder = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError(errors.array()[0].msg, 422));
    }

    const reminderId = req.params.reminderid;

    let reminder;
    try {
        reminder = await Reminder.findById(reminderId);
    } catch (err) {
        return next(new HttpError('Fetching reminder failed, please try again', 500));
    }

    if (!reminder) {
        return next(new HttpError('Could not find a reminder for the given ID', 404));
    }

    if (req.body.MedicineName) reminder.MedicineName = req.body.MedicineName;
    if (req.body.Dosage)       reminder.Dosage       = req.body.Dosage;
    if (req.body.Times)        reminder.Times        = req.body.Times;

    if (req.body.DurationDays) {
        const start = new Date(reminder.StartDate);
        const end   = new Date(start);
        end.setDate(end.getDate() + parseInt(req.body.DurationDays) - 1);
        reminder.DurationDays = parseInt(req.body.DurationDays);
        reminder.EndDate      = end;
    }

    if (typeof req.body.IsActive === 'boolean') {
        reminder.IsActive = req.body.IsActive;
    }

    try {
        await reminder.save();
    } catch (err) {
        return next(new HttpError('Updating reminder failed, please try again', 500));
    }

    res.status(200).json({
        message:  'Reminder updated successfully',
        Reminder: reminder.toObject({ getters: true })
    });
};

exports.getPrescriptionById        = getPrescriptionById;
exports.checkMedicineAvailability  = checkMedicineAvailability;
exports.dispenseMedicines          = dispenseMedicines;
exports.createMedicineReminder     = createMedicineReminder;
exports.getRemindersByPrescription = getRemindersByPrescription;
exports.updateReminder             = updateReminder;