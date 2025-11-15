"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteVote = exports.handleCreateVotes = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const vote_service_1 = require("./vote.service");
const poll_service_1 = require("../polls/poll.service");
const handleCreateVotes = (0, express_async_handler_1.default)(async (req, res) => {
    const { pollId, optionId, payload } = req.body;
    const createdVote = await (0, vote_service_1.createVote)(pollId, optionId, payload.id);
    const updatedPoll = await (0, poll_service_1.readPoll)(createdVote.pollId);
    res.status(200).json(updatedPoll);
});
exports.handleCreateVotes = handleCreateVotes;
const handleDeleteVote = (0, express_async_handler_1.default)(async (req, res) => {
    const pollId = req.params.pollId;
    if (!pollId) {
        res.status(400).json({ "message": "Invalid PollID" });
        return;
    }
    const { payload } = req.body;
    await (0, vote_service_1.deleteVote)(parseInt(pollId), payload.id);
    const updatedPoll = await (0, poll_service_1.readPoll)(parseInt(pollId));
    res.status(200).json(updatedPoll);
});
exports.handleDeleteVote = handleDeleteVote;
