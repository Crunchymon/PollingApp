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
    const userId = req.body.payload.id; // Corrected to access id from payload
    const search = req.query.search as string | undefined;

    // Default values
    let page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string) || 10;
    let sortBy = (req.query.sortBy as string) || 'createdAt';
    let order = (req.query.order as string) || 'desc';

    // Validation
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 50) limit = 50; // Cap limit to prevent abuse

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

    const result = await getMyPolls({
        userId,
        search,
        page,
        limit,
        sortBy: sortBy as 'createdAt' | 'updatedAt' | 'question',
        order: order as 'asc' | 'desc'
    });
    res.status(200).json(result);
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
