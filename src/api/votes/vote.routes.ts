import { Router } from 'express';
import { validate, authenticate } from '../../utils/middleware';
import { handleCreateVotes , handleDeleteVote} from './vote.controller';
import { createVoteSchema } from './vote.schema';

const voteRoute = Router();


voteRoute.post('/', validate(createVoteSchema) ,authenticate, handleCreateVotes);
voteRoute.delete('/poll/:pollId' , authenticate , handleDeleteVote)

export { voteRoute };