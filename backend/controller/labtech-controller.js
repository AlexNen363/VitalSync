const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const LabTest = require('../models/lab-test');

// UC-LAB-01 (Step 1): View all pending lab tests
const getPendingTests = async (req, res, next) => {
    let pendingTests;
    try {
        pendingTests = await LabTest.find({ Status: 'Pending' })
            .populate('PatientId', 'name')
            .populate('RequestedBy', 'name');
    } catch (err) {
        return next(new HttpError('Fetching pending tests failed, please try again', 500));
    }

    if (!pendingTests || pendingTests.length === 0) {
        return next(new HttpError('No pending tests found', 404));
    }

    res.status(200).json({
        pendingTests: pendingTests.map(t => t.toObject({ getters: true }))
    });
};

// UC-LAB-01 (Step 2 & 3): Perform test — assign technician and record results
const performLabTest = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError(errors.array()[0].msg, 422));
    }

    const testId = req.params.testid;
    const { TechnicianId, Results } = req.body;

    let labTest;
    try {
        labTest = await LabTest.findById(testId);
    } catch (err) {
        return next(new HttpError('Fetching test failed, please try again', 500));
    }

    if (!labTest) {
        return next(new HttpError('Could not find a lab test for the given ID', 404));
    }

    if (labTest.Status === 'Completed' || labTest.Status === 'Cancelled') {
        return next(new HttpError(`Test cannot be performed — current status is "${labTest.Status}"`, 400));
    }

    labTest.TechnicianId = TechnicianId;
    labTest.Results = Results;
    labTest.Status = 'Results Entered';

    try {
        await labTest.save();
    } catch (err) {
        return next(new HttpError('Performing lab test failed, please try again', 500));
    }

    res.status(200).json({
        message: 'Lab test performed and results recorded successfully',
        labTest: labTest.toObject({ getters: true })
    });
};

// UC-LAB-02 (Steps 1–4): Enter results and generate report
const generateLabReport = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return next(new HttpError(errors.array()[0].msg, 422));
    }

    const testId = req.params.testid;

    let labTest;
    try {
        labTest = await LabTest.findById(testId)
            .populate('PatientId')
            .populate('RequestedBy');
    } catch (err) {
        return next(new HttpError('Fetching test failed, please try again', 500));
    }

    if (!labTest) {
        return next(new HttpError('Could not find a lab test for the given ID', 404));
    }

    if (!labTest.Results || labTest.Results.size === 0) {
        return next(new HttpError('Cannot generate report: test results have not been entered yet', 400));
    }

    if (labTest.ReportGenerated) {
        return next(new HttpError('Report has already been generated for this test', 400));
    }

    labTest.ReportGenerated = true;
    labTest.ReportGeneratedAt = new Date();
    labTest.Status = 'Completed';

    try {
        await labTest.save();
    } catch (err) {
        return next(new HttpError('Generating report failed, please try again', 500));
    }

    // Report object accessible by doctor via PatientId reference
    const report = {
        TestID: labTest.TestID,
        TestType: labTest.TestType,
        Patient: labTest.PatientId,
        RequestedBy: labTest.RequestedBy,
        Results: Object.fromEntries(labTest.Results),
        ReportGeneratedAt: labTest.ReportGeneratedAt,
        Status: labTest.Status
    };

    res.status(200).json({
        message: 'Lab report generated and stored in patient records successfully',
        report: report
    });
};

exports.getPendingTests = getPendingTests;
exports.performLabTest = performLabTest;
exports.generateLabReport = generateLabReport;