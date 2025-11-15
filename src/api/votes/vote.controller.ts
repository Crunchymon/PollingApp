import { Request, Response } from "express";
import asyncHandler from 'express-async-handler';
import { createVote, deleteVote } from "./vote.service";
import { readPoll } from "../polls/poll.service";

const handleCreateVotes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { pollId, optionId, payload } = req.body;
    const createdVote = await createVote(pollId, optionId, payload.id);
    const updatedPoll = await readPoll(createdVote.pollId);
    res.status(200).json(updatedPoll);
});

const handleDeleteVote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pollId = req.params.pollId;
    if (!pollId){
        res.status(400).json({"message" : "Invalid PollID"});
        return;
    }
    const { payload } = req.body;
    await deleteVote(parseInt(pollId), payload.id);
    const updatedPoll = await readPoll(parseInt(pollId));
    res.status(200).json(updatedPoll);
});

export { handleCreateVotes, handleDeleteVote }