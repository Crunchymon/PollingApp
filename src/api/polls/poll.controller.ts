import { createPoll, readPoll, updatePoll } from './poll.service';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

const handleCreatePoll = asyncHandler(async (req: Request, res: Response) => {
    const { pollQuestion, pollOptions } = req.body;
    const newPoll = await createPoll(pollQuestion, pollOptions)
    res.status(201).json(newPoll);
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
const handleUpdatePoll = asyncHandler(async (req: Request, res: Response) => {
   
        const { optionId } = req.params

        if (!optionId) {
            res.status(400).json({ message: "Option ID is missing from the URL." });
            return;
        }

        const optionId_parsed = parseInt(optionId);
        if (isNaN(optionId_parsed)) {
            res.status(400).json({ message: "Invalid option ID or poll ID." });
            return;
        }


        const updatedPoll = await updatePoll(optionId_parsed);
        if (updatedPoll === null) {
            res.status(404).json({ message: "Poll or option not found." });
            return;
        }
        res.status(200).json(updatedPoll)
        return;
   
})

export { handleCreatePoll, handleReadPoll, handleUpdatePoll }