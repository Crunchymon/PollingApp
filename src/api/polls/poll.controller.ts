 import { createPoll, readPoll, getMyPolls, deletePoll, updatePoll } from './poll.service';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const handleCreatePoll = asyncHandler(async (req: Request, res: Response) => {
    const { question, options, payload } = req.body;
    const newPoll = await createPoll(question, options, payload.id)
    const pollData = await readPoll(newPoll.id);
    res.status(201).json(pollData);
    return;
})
const handleReadPoll = asyncHandler(async (req: Request, res: Response) => {

    const { id } = req.params
    if (!id) {
        res.status(400).json({ message: "Poll ID is missing from the URL." });
        return;
    }
    const pollId = parseInt(id);
    if (isNaN(pollId)) {
        res.status(400).json({ message: "Invalid poll ID." });
        return;
    }

    const poll = await readPoll(pollId);
    if (poll == null) {
        res.status(404).json({ message: "Poll not found." });
        return;
    }

    res.status(200).json(poll)
    return;


})

const handleReadMyPoll = asyncHandler(async (req: Request, res: Response) => {
    const { payload } = req.body;
    const polls = await getMyPolls(payload.id);
    res.status(200).json({ "data": polls });
})

const handleDeletePoll = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { payload } = req.body;
    if (!id) {
        res.status(400).json({ message: "Poll ID is missing from the URL." });
        return;
    }
    const pollId = parseInt(id);
    const userId = payload.id;

    const deletedPoll = await deletePoll(userId, pollId);

    res.status(204).json();

})

const handleUpdatePoll = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.body.payload.id;
    const { question } = req.body;

    if (!id) {
        res.status(400).json({ message: "Poll ID is missing from the URL." });
        return;
    }

    const pollId = parseInt(id);

    const updatedPoll = await updatePoll(userId, pollId, question);

    res.status(200).json(updatedPoll);


});
export { handleCreatePoll, handleReadPoll, handleReadMyPoll, handleDeletePoll, handleUpdatePoll };
