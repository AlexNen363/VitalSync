const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { Medicine, Prescription, Reminder } = require('../models/pharmacist-models');

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 1 : Manage Medicine Inventory
// ─────────────────────────────────────────────────────────────────────────────

// Get all medicines in inventory
const getAllMedicines = async (req, res, next) => {
    console.log("GET request — all medicines");

    let medicines;
    try {
        medicines = await Medicine.find({ IsActive: true });
    } catch (err) {
    return res.status(500).json({
        message: 'Fetching medicines failed, please try again'
    });
}

    res.status(200).json({
        medicines: medicines.map(m => m.toObject({ getters: true }))
    });
};

// Get a single medicine by ID
const getMedicineById = async (req, res, next) => {
    console.log("GET request — medicine by ID");

    const medicineId = req.params.medicineid;

    let medicine;
    try {
        medicine = await Medicine.findById(medicineId);
    } catch (err) {
    return res.status(500).json({
        message: 'Fetching medicines failed, please try again'
    });
}

    if (!medicine) {
    return res.status(404).json({
        message: 'Could not find a medicine for the given ID'
    });
}

    res.status(200).json({ medicine: medicine.toObject({ getters: true }) });
};

// Add a new medicine to inventory
const addMedicine = async (req, res, next) => {
    console.log("POST request — add medicine");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(422).json({
        message: errors.array()[0].msg
    });
}

    const {
        MedicineCode,
        MedicineName,
        Category,
        StockQuantity,
        Unit,
        ExpiryDate,
        ReorderLevel
    } = req.body;

    const newMedicine = new Medicine({
        MedicineCode,
        MedicineName,
        Category,
        StockQuantity,
        Unit,
        ExpiryDate,
        ReorderLevel,
        IsActive: true
    });

    try {
        await newMedicine.save();
    } catch (err) {
    return res.status(500).json({
        message: 'Adding medicine failed, please try again'
    });
}

    res.status(201).json({
        message:  'Medicine added to inventory successfully',
        medicine: newMedicine.toObject({ getters: true })
    });
};

// Soft-delete (deactivate) a medicine
const deleteMedicine = async (req, res, next) => {
    console.log("DELETE request — deactivate medicine");

    const medicineId = req.params.medicineid;

    let medicine;
    try {
        medicine = await Medicine.findById(medicineId);
    } catch (err) {
    return res.status(500).json({
        message: 'Fetching medicines failed, please try again'
    });
}

    if (!medicine) {
    return res.status(404).json({
        message: 'Could not find a medicine for the given ID'
    });
}

    medicine.IsActive = false;

    try {
        await medicine.save();
    } catch (err) {
    return res.status(500).json({
        message: 'Deleting medicine failed, please try again'
    });
}

    res.status(200).json({ message: 'Medicine removed from inventory successfully' });
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 2 : Update Medicine Stock
// ─────────────────────────────────────────────────────────────────────────────

// Update medicine details or reorder level
const updateMedicine = async (req, res, next) => {
    console.log("PUT request — update medicine details");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(422).json({
        message: errors.array()[0].msg
    });
}

    const medicineId = req.params.medicineid;

    let medicine;
    try {
        medicine = await Medicine.findById(medicineId);
    } catch (err) {
    return res.status(500).json({
        message: 'Fetching medicines failed, please try again'
    });
}

    if (!medicine) {
    return res.status(404).json({
        message: 'Could not find a medicine for the given ID'
    });
}

    if (req.body.MedicineName)  medicine.MedicineName  = req.body.MedicineName;
    if (req.body.Category)      medicine.Category      = req.body.Category;
    if (req.body.Unit)          medicine.Unit          = req.body.Unit;
    if (req.body.ExpiryDate)    medicine.ExpiryDate    = req.body.ExpiryDate;
    if (req.body.ReorderLevel !== undefined) medicine.ReorderLevel = req.body.ReorderLevel;

    try {
        await medicine.save();
    } catch (err) {
    return res.status(500).json({
        message: 'Updating medicine failed, please try again'
    });
}

    res.status(200).json({
        message:  'Medicine updated successfully',
        medicine: medicine.toObject({ getters: true })
    });
};

// Update only the stock quantity (restock / adjustment)
const updateMedicineStock = async (req, res, next) => {
    console.log("PATCH request — update medicine stock");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(422).json({
        message: errors.array()[0].msg
    });
}

    const medicineId = req.params.medicineid;

    let medicine;
    try {
        medicine = await Medicine.findById(medicineId);
    } catch (err) {
    return res.status(500).json({
        message: 'Fetching medicine failed, please try again'
    });
}

    if (!medicine) {
    return res.status(404).json({
        message: 'Could not find a medicine for the given ID'
    });
}

    const { AdjustmentType, Quantity } = req.body;
    // AdjustmentType: "ADD" to restock, "SUBTRACT" to manually deduct

    if (AdjustmentType === 'ADD') {
        medicine.StockQuantity += parseInt(Quantity);
    } else if (AdjustmentType === 'SUBTRACT') {
        if (medicine.StockQuantity < parseInt(Quantity)) {
    return res.status(400).json({
        message: 'Insufficient stock for the requested deduction'
    });
}
        medicine.StockQuantity -= parseInt(Quantity);
    } else {
        return res.status(422).json({
    message: 'AdjustmentType must be ADD or SUBTRACT'
});
    }

    try {
        await medicine.save();
    } catch (err) {
    return res.status(500).json({
        message: 'Updating stock failed, please try again'
    });
}

    res.status(200).json({
        message:       'Medicine stock updated successfully',
        MedicineName:  medicine.MedicineName,
        StockQuantity: medicine.StockQuantity
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 3 : Dispense Medicines
// ─────────────────────────────────────────────────────────────────────────────

// Review a prescription before dispensing
const getPrescriptionById = async (req, res, next) => {
    console.log("GET request — review prescription");

    const prescriptionId = req.params.prescriptionid;

    let prescription;
    try {
        prescription = await Prescription.findById(prescriptionId);
    } catch (err) {
    return res.status(500).json({
        message: 'Fetching prescription failed, please try again'
    });
}

    if (!prescription) {
    return res.status(404).json({
        message: 'Could not find a prescription for the given ID'
    });
}

    res.status(200).json({ prescription: prescription.toObject({ getters: true }) });
};

// Dispense medicines and update inventory atomically
const dispenseMedicines = async (req, res, next) => {
    console.log("POST request — dispense medicines");

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
    return res.status(422).json({
        message: errors.array()[0].msg
    });
}

    const prescriptionId = req.params.prescriptionid;

    let prescription;
    try {
        prescription = await Prescription.findById(prescriptionId);
    } catch (err) {
    return res.status(500).json({
        message: 'Fetching prescription failed, please try again'
    });
}

    if (!prescription) {
    return res.status(404).json({
        message: 'Could not find a prescription for the given ID'
    });
}

    if (prescription.IsDispensed) {
    return res.status(400).json({
        message: 'Medicines for this prescription have already been dispensed'
    });
}

    // Validate all stock levels before touching anything
    const medicineRecords = [];
    const shortages       = [];

    for (const med of prescription.Medicines) {
        let inventoryItem;
        try {
            inventoryItem = await Medicine.findById(med.MedicineId);
        } catch (err) {
    return res.status(500).json({
        message: 'Fetching medicine inventory failed, please try again'
    });
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

    // Abort entirely if any shortage — no partial dispense allowed
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

        return res.status(200).json({
            message:        'Medicines dispensed successfully and inventory updated',
            PrescriptionId: prescriptionId,
            DispensedItems: dispensedItems
        });

    } catch (err) {
    await sess.abortTransaction();

    return res.status(500).json({
        message: 'Dispensing medicines failed, please try again'
    });
} finally {
        sess.endSession();
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 4 : Schedule Medicine Reminders
// ─────────────────────────────────────────────────────────────────────────────

// Create a reminder schedule for a prescription
const createMedicineReminder = async (req, res, next) => {
    console.log("POST request — create medicine reminder");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(422).json({
        message: errors.array()[0].msg
    });
}

    const prescriptionId = req.params.prescriptionid;

    let prescription;
    try {
        prescription = await Prescription.findById(prescriptionId);
    } catch (err) {
    return res.status(500).json({
        message: 'Fetching prescription failed, please try again'
    });
}

    if (!prescription) {
    return res.status(404).json({
        message: 'Could not find a prescription for the given ID'
    });
}

    const { MedicineName, Dosage, Times, StartDate, DurationDays } = req.body;

    // Auto-calculate EndDate from StartDate + DurationDays
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
    return res.status(500).json({
        message: 'Creating reminder failed, please try again'
    });
}

    return res.status(201).json({
        message:  'Medicine reminder schedule created successfully',
        Reminder: newReminder.toObject({ getters: true })
    });
};

// Get all reminders for a prescription
const getRemindersByPrescription = async (req, res, next) => {
    console.log("GET request — reminders by prescription");

    const prescriptionId = req.params.prescriptionid;

    let reminders;
    try {
        reminders = await Reminder.find({ PrescriptionId: prescriptionId });
    } catch (err) {
        return res.status(500).json({
            message: 'Fetching reminders failed, please try again'
        });
    }

    return res.status(200).json({
        Reminders: reminders.map(r => r.toObject({ getters: true }))
    });
};

// Update or deactivate a reminder
const updateReminder = async (req, res, next) => {
    console.log("PUT request — update reminder");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(422).json({
        message: errors.array()[0].msg
    });
}

    const reminderId = req.params.reminderid;

    let reminder;
    try {
        reminder = await Reminder.findById(reminderId);
    } catch (err) {
    return res.status(500).json({
        message: 'Fetching reminders failed, please try again'
    });
}

    if (!reminder) {
    return res.status(404).json({
        message: 'Could not find a reminder for the given ID'
    });
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
    return res.status(500).json({
        message: 'Updating reminder failed, please try again'
    });
}

    return res.status(200).json({
        message:  'Reminder updated successfully',
        Reminder: reminder.toObject({ getters: true })
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// FUNCTION 5 : Monitor Medicine Availability
// ─────────────────────────────────────────────────────────────────────────────

// Get medicines with stock at or below reorder level
const getLowStockMedicines = async (req, res, next) => {
    console.log("GET request — low stock medicines");

    let medicines;
    try {
        medicines = await Medicine.find({
            IsActive: true,
            $expr: { $lte: ["$StockQuantity", "$ReorderLevel"] }
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Fetching low stock medicines failed, please try again'
        });
    }

    return res.status(200).json({
        message: `${medicines.length} medicine(s) at or below reorder level`,
        medicines: medicines.map(m => m.toObject({ getters: true }))
    });
};

// Check availability of all medicines in a specific prescription
const checkMedicineAvailability = async (req, res, next) => {
    console.log("GET request — check availability for prescription");

    const prescriptionId = req.params.prescriptionid;

    let prescription;
    try {
        prescription = await Prescription.findById(prescriptionId);
    } catch (err) {
    return res.status(500).json({
        message: 'Fetching prescription failed, please try again'
    });
}

    if (!prescription) {
    return res.status(404).json({
        message: 'Could not find a prescription for the given ID'
    });
}

    const availabilityReport = [];

    for (const med of prescription.Medicines) {
        let inventoryItem;
        try {
            inventoryItem = await Medicine.findById(med.MedicineId);
        } catch (err) {
    return res.status(500).json({
        message: 'Checking inventory failed, please try again'
    });
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

// Get medicines expiring within the next N days
const getExpiringMedicines = async (req, res, next) => {
    console.log("GET request — expiring medicines");

    const days = parseInt(req.query.days) || 30;
    const today = new Date();
    const limit = new Date();
    limit.setDate(today.getDate() + days);

    let medicines;

    try {
        medicines = await Medicine.find({
            IsActive: true,
            ExpiryDate: {
                $gte: today,
                $lte: limit
            }
        }).sort({ ExpiryDate: 1 });
    } catch (err) {
        return res.status(500).json({
            message: 'Fetching expiring medicines failed, please try again'
        });
    }

    if (!medicines || medicines.length === 0) {
        return res.status(404).json({
            message: 'No expiring medicines found'
        });
    }

    res.status(200).json({
        message: `${medicines.length} medicine(s) expiring within ${days} days`,
        medicines: medicines.map(medicine =>
            medicine.toObject({ getters: true })
        )
    });
};

// ─── Exports ──────────────────────────────────────────────────────────────────

exports.getAllMedicines            = getAllMedicines;
exports.getMedicineById           = getMedicineById;
exports.addMedicine               = addMedicine;
exports.updateMedicine            = updateMedicine;
exports.deleteMedicine            = deleteMedicine;
exports.updateMedicineStock       = updateMedicineStock;
exports.getPrescriptionById       = getPrescriptionById;
exports.dispenseMedicines         = dispenseMedicines;
exports.createMedicineReminder    = createMedicineReminder;
exports.getRemindersByPrescription = getRemindersByPrescription;
exports.updateReminder            = updateReminder;
exports.getLowStockMedicines      = getLowStockMedicines;
exports.checkMedicineAvailability = checkMedicineAvailability;
exports.getExpiringMedicines      = getExpiringMedicines;