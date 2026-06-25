const express = require('express');
const router  = express.Router();
const { check } = require('express-validator');
const pharmacistController = require('../controllers/pharmacist-controller');

// ─────────────────────────────────────────────────────────────────────────────
// ✅ MONITOR ROUTES — must come BEFORE /:medicineid routes
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/medicines/monitor/low-stock',
    pharmacistController.getLowStockMedicines
);

router.get(
    '/medicines/monitor/expiring',
    pharmacistController.getExpiringMedicines
);

// ─────────────────────────────────────────────────────────────────────────────
// MEDICINE INVENTORY ROUTES
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/medicines',
    pharmacistController.getAllMedicines
);

router.get(
    '/medicines/:medicineid',       // ✅ comes AFTER /monitor routes
    pharmacistController.getMedicineById
);

router.post(
    '/medicines',
    [
        check('MedicineCode').notEmpty().withMessage('Medicine code is required'),
        check('MedicineName').notEmpty().withMessage('Medicine name is required'),
        check('Category').notEmpty().withMessage('Category is required'),
        check('StockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be 0 or more'),
        check('Unit').notEmpty().withMessage('Unit is required'),
        check('ExpiryDate').isISO8601().withMessage('A valid expiry date is required'),
        check('ReorderLevel').optional().isInt({ min: 0 }).withMessage('Reorder level must be 0 or more')
    ],
    pharmacistController.addMedicine
);

router.put(
    '/medicines/:medicineid',
    [
        check('MedicineName').optional().notEmpty().withMessage('Medicine name cannot be empty'),
        check('Category').optional().notEmpty().withMessage('Category cannot be empty'),
        check('ExpiryDate').optional().isISO8601().withMessage('A valid expiry date is required'),
        check('ReorderLevel').optional().isInt({ min: 0 }).withMessage('Reorder level must be 0 or more')
    ],
    pharmacistController.updateMedicine
);

router.delete(
    '/medicines/:medicineid',
    pharmacistController.deleteMedicine
);

router.patch(
    '/medicines/:medicineid/stock',
    [
        check('AdjustmentType')
            .notEmpty()
            .isIn(['ADD', 'SUBTRACT'])
            .withMessage('AdjustmentType must be ADD or SUBTRACT'),
        check('Quantity')
            .isInt({ min: 1 })
            .withMessage('Quantity must be at least 1')
    ],
    pharmacistController.updateMedicineStock
);

// ─────────────────────────────────────────────────────────────────────────────
// DISPENSE ROUTES
// ─────────────────────────────────────────────────────────────────────────────

router.get(
    '/prescription/:prescriptionid',
    pharmacistController.getPrescriptionById
);

router.get(
    '/prescription/:prescriptionid/availability',
    pharmacistController.checkMedicineAvailability
);

router.post(
    '/prescription/:prescriptionid/dispense',
    [
        check('PharmacistId').notEmpty().withMessage('Pharmacist ID is required')
    ],
    pharmacistController.dispenseMedicines
);

// ─────────────────────────────────────────────────────────────────────────────
// REMINDER ROUTES
// ─────────────────────────────────────────────────────────────────────────────

router.post(
    '/prescription/:prescriptionid/reminders',
    [
        check('MedicineName').notEmpty().withMessage('Medicine name is required'),
        check('Dosage').notEmpty().withMessage('Dosage is required'),
        check('Times').isArray({ min: 1 }).withMessage('At least one reminder time is required'),
        check('StartDate').isISO8601().withMessage('A valid start date is required (YYYY-MM-DD)'),
        check('DurationDays').isInt({ min: 1 }).withMessage('Duration must be at least 1 day')
    ],
    pharmacistController.createMedicineReminder
);

router.get(
    '/prescription/:prescriptionid/reminders',
    pharmacistController.getRemindersByPrescription
);

router.put(
    '/reminders/:reminderid',
    [
        check('DurationDays').optional().isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
        check('Times').optional().isArray({ min: 1 }).withMessage('At least one reminder time is required'),
        check('IsActive').optional().isBoolean().withMessage('IsActive must be true or false')
    ],
    pharmacistController.updateReminder
);

module.exports = router;