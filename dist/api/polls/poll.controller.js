"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdatePoll = exports.handleDeletePoll = exports.handleReadMyPoll = exports.handleReadPoll = exports.handleCreatePoll = void 0;
const poll_service_1 = require("./poll.service");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const handleCreatePoll = (0, express_async_handler_1.default)(async (req, res) => {
    const { question, options, payload } = req.body;
    const newPoll = await (0, poll_service_1.createPoll)(question, options, payload.id);
    const pollData = await (0, poll_service_1.readPoll)(newPoll.id);
    res.status(201).json(pollData);
    return;
});
exports.handleCreatePoll = handleCreatePoll;
const handleReadPoll = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ message: "Poll ID is missing from the URL." });
        return;
    }
    const pollId = parseInt(id);
    if (isNaN(pollId)) {
        res.status(400).json({ message: "Invalid poll ID." });
        return;
    }
    const poll = await (0, poll_service_1.readPoll)(pollId);
    if (poll == null) {
        res.status(404).json({ message: "Poll not found." });
        return;
    }
    res.status(200).json(poll);
    return;
});
exports.handleReadPoll = handleReadPoll;
const handleReadMyPoll = (0, express_async_handler_1.default)(async (req, res) => {
    const userId = req.body.payload.id; // Corrected to access id from payload
    const search = req.query.search;
    // Default values
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let sortBy = req.query.sortBy || 'createdAt';
    let order = req.query.order || 'desc';
    // Validation
    if (page < 1)
        page = 1;
    if (limit < 1)
        limit = 10;
    if (limit > 50)
        limit = 50; // Cap limit to prevent abuse
    const allowedSortFields = ['createdAt', 'updatedAt', 'question'];
    if (!allowedSortFields.includes(sortBy)) {
        res.status(400).json({ message: `Invalid sortBy field. Allowed fields: ${allowedSortFields.join(', ')}` });
        return;
    }
    const allowedOrderValues = ['asc', 'desc'];
    if (!allowedOrderValues.includes(order)) {
        res.status(400).json({ message: "Invalid order value. Allowed values: 'asc', 'desc'" });
        return;
    }
    const result = await (0, poll_service_1.getMyPolls)({
        userId,
        search,
        page,
        limit,
        sortBy: sortBy,
        order: order
    });
    res.status(200).json(result);
});
exports.handleReadMyPoll = handleReadMyPoll;
const handleDeletePoll = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { payload } = req.body;
    if (!id) {
        res.status(400).json({ message: "Poll ID is missing from the URL." });
        return;
    }
    const pollId = parseInt(id);
    const userId = payload.id;
    const deletedPoll = await (0, poll_service_1.deletePoll)(userId, pollId);
    res.status(204).json();
});
exports.handleDeletePoll = handleDeletePoll;
const handleUpdatePoll = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = req.body.payload.id;
    const { question } = req.body;
    if (!id) {
        res.status(400).json({ message: "Poll ID is missing from the URL." });
        return;
    }
    const pollId = parseInt(id);
    const updatedPoll = await (0, poll_service_1.updatePoll)(userId, pollId, question);
    res.status(200).json(updatedPoll);
});
exports.handleUpdatePoll = handleUpdatePoll;
