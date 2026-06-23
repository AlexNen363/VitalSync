<<<<<<< HEAD
=======
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const labTechnicianController = require('../controller/labtech-controller');

// UC-LAB-01: View pending tests
router.get('/tests/pending', labTechnicianController.getPendingTests);

// UC-LAB-01: Perform test and record results
router.patch(
    '/tests/:testid/perform',
    [
        check('TechnicianId').not().isEmpty().withMessage('Technician ID is required'),
        check('Results').not().isEmpty().withMessage('Results are required')
    ],
    labTechnicianController.performLabTest
);

// UC-LAB-02: Generate lab report
router.patch('/tests/:testid/report', labTechnicianController.generateLabReport);

module.exports = router;

>>>>>>> fec9259eabf998afec4e7780e027eccb520f092b
