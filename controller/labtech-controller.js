const { validationResult } = require('express-validator');
const LabTest = require('../models/labtech-models');

// View Lab Test Requests
const getPendingTests = async (req, res) => {
    try {
        const pendingTests = await LabTest.find({ Status: 'Pending' })
            .populate('PatientId', 'name')
            .populate('RequestedBy', 'name');

        if (!pendingTests.length) {
            return res.status(404).json({
                message: 'No pending lab tests found'
            });
        }

        res.status(200).json({
            pendingTests: pendingTests.map(test =>
                test.toObject({ getters: true })
            )
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch pending lab tests'
        });
    }
};

// Conduct Laboratory Test & Enter Results
const performLabTest = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.array()[0].msg
        });
    }

    const testId = req.params.testid;
    const { TechnicianId, Results } = req.body;

    try {
        const labTest = await LabTest.findById(testId);

        if (!labTest) {
            return res.status(404).json({
                message: 'Lab test not found'
            });
        }

        if (
            labTest.Status === 'Completed' ||
            labTest.Status === 'Cancelled'
        ) {
            return res.status(400).json({
                message: `Cannot perform test. Current status: ${labTest.Status}`
            });
        }

        labTest.TechnicianId = TechnicianId;
        labTest.Results = Results;
        labTest.Status = 'Results Entered';

        await labTest.save();

        res.status(200).json({
            message: 'Lab test completed and results entered successfully',
            labTest: labTest.toObject({ getters: true })
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to perform laboratory test'
        });
    }
};

// Generate Lab Report & Update Test Status
const generateLabReport = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.array()[0].msg
        });
    }

    const testId = req.params.testid;

    try {
        const labTest = await LabTest.findById(testId)
            .populate('PatientId')
            .populate('RequestedBy');

        if (!labTest) {
            return res.status(404).json({
                message: 'Lab test not found'
            });
        }

        if (!labTest.Results) {
            return res.status(400).json({
                message: 'Test results have not been entered yet'
            });
        }

        if (labTest.ReportGenerated) {
            return res.status(400).json({
                message: 'Report already generated'
            });
        }

        labTest.ReportGenerated = true;
        labTest.ReportGeneratedAt = new Date();
        labTest.Status = 'Completed';

        await labTest.save();

        const report = {
            TestID: labTest.TestID,
            TestType: labTest.TestType,
            Patient: labTest.PatientId,
            RequestedBy: labTest.RequestedBy,
            Results: labTest.Results,
            ReportGeneratedAt: labTest.ReportGeneratedAt,
            Status: labTest.Status
        };

        res.status(200).json({
            message: 'Lab report generated successfully',
            report
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to generate lab report'
        });
    }
};

// Update Test Status
const updateTestStatus = async (req, res) => {
    const testId = req.params.testid;
    const { Status } = req.body;

    try {
        const labTest = await LabTest.findById(testId);

        if (!labTest) {
            return res.status(404).json({
                message: 'Lab test not found'
            });
        }

        labTest.Status = Status;

        await labTest.save();

        res.status(200).json({
            message: 'Test status updated successfully',
            labTest: labTest.toObject({ getters: true })
        });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to update test status'
        });
    }
};

exports.getPendingTests = getPendingTests;
exports.performLabTest = performLabTest;
exports.generateLabReport = generateLabReport;
exports.updateTestStatus = updateTestStatus;