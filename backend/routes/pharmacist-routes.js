const express = require('express');
const router  = express.Router();
const { check } = require('express-validator');
const pharmacistController = require('../controller/pharmacist-controller');

// ── UC-PHARM-01: Dispense Medicines ──────────────────────────────────────────

// Step 1 — Review prescription
router.get(
    '/prescription/:prescriptionid',
    pharmacistController.getPrescriptionById
);

// Step 2 — Check medicine availability
router.get(
    '/prescription/:prescriptionid/availability',
    pharmacistController.checkMedicineAvailability
);

// Steps 3 & 4 — Dispense medicines and update inventory
router.post(
    '/prescription/:prescriptionid/dispense',
    [
        check('PharmacistId')
            .notEmpty()
            .withMessage('Pharmacist ID is required')
    ],
    pharmacistController.dispenseMedicines
);

// ── UC-PHARM-02: Configure Medicine Reminder ─────────────────────────────────

// Create reminder — medicine details + dosage timing + duration
router.post(
    '/prescription/:prescriptionid/reminders',
    [
        check('MedicineName')
            .notEmpty()
            .withMessage('Medicine name is required'),

        check('Dosage')
            .notEmpty()
            .withMessage('Dosage is required'),

        check('Times')
            .isArray({ min: 1 })
            .withMessage('At least one reminder time is required'),

        check('StartDate')
            .notEmpty()
            .isISO8601()
            .withMessage('A valid start date is required (YYYY-MM-DD)'),

        check('DurationDays')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Duration must be at least 1 day')
    ],
    pharmacistController.createMedicineReminder
);

// Get all reminders for a prescription
router.get(
    '/prescription/:prescriptionid/reminders',
    pharmacistController.getRemindersByPrescription
);

// Update or deactivate a reminder
router.put(
    '/reminders/:reminderid',
    [
        check('DurationDays')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Duration must be at least 1 day'),

        check('Times')
            .optional()
            .isArray({ min: 1 })
            .withMessage('At least one reminder time is required'),

        check('IsActive')
            .optional()
            .isBoolean()
            .withMessage('IsActive must be true or false')
    ],
    pharmacistController.updateReminder
);

module.exports = router;