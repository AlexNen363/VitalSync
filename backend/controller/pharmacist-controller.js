const Pharmacist = require('../models/pharmacist-models');

// Get all medicines in inventory
const getInventory = async (req, res, next) => {
    try {
        const pharmacists = await Pharmacist.find();

        res.status(200).json({
            success: true,
            data: pharmacists
        });
    } catch (err) {
        next(err);
    }
};

// Update medicine stock
const updateStock = async (req, res, next) => {
    const { pharmacistId, medicineId } = req.params;
    const { stockQuantity } = req.body;

    try {
        const pharmacist = await Pharmacist.findById(pharmacistId);

        if (!pharmacist) {
            return res.status(404).json({
                success: false,
                message: "Pharmacist not found"
            });
        }

        const medicine = pharmacist.Medicines.find(
            med => med.MedicineId === medicineId
        );

        if (!medicine) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found"
            });
        }

        medicine.StockQuantity = stockQuantity;

        await pharmacist.save();

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            data: medicine
        });

    } catch (err) {
        next(err);
    }
};

// Dispense medicine
const dispenseMedicine = async (req, res, next) => {
    const { pharmacistId, prescriptionId } = req.params;

    try {
        const pharmacist = await Pharmacist.findById(pharmacistId);

        if (!pharmacist) {
            return res.status(404).json({
                success: false,
                message: "Pharmacist not found"
            });
        }

        const prescription = pharmacist.Prescriptions.find(
            p => p.PrescriptionId === prescriptionId
        );

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found"
            });
        }

        prescription.IsDispensed = true;

        await pharmacist.save();

        res.status(200).json({
            success: true,
            message: "Medicine dispensed successfully",
            data: prescription
        });

    } catch (err) {
        next(err);
    }
};

// Schedule reminder
const scheduleReminder = async (req, res, next) => {
    const { pharmacistId } = req.params;

    try {
        const pharmacist = await Pharmacist.findById(pharmacistId);

        if (!pharmacist) {
            return res.status(404).json({
                success: false,
                message: "Pharmacist not found"
            });
        }

        pharmacist.Reminders.push(req.body);

        await pharmacist.save();

        res.status(201).json({
            success: true,
            message: "Reminder scheduled successfully",
            data: pharmacist.Reminders
        });

    } catch (err) {
        next(err);
    }
};

// Check medicine availability
const checkMedicineAvailability = async (req, res, next) => {
    try {
        const pharmacists = await Pharmacist.find();

        const availableMedicines = [];

        pharmacists.forEach(pharmacist => {
            pharmacist.Medicines.forEach(medicine => {
                if (medicine.StockQuantity > 0) {
                    availableMedicines.push(medicine);
                }
            });
        });

        res.status(200).json({
            success: true,
            data: availableMedicines
        });

    } catch (err) {
        next(err);
    }
};

exports.getInventory = getInventory;
exports.updateStock = updateStock;
exports.dispenseMedicine = dispenseMedicine;
exports.scheduleReminder = scheduleReminder;
exports.checkMedicineAvailability = checkMedicineAvailability;