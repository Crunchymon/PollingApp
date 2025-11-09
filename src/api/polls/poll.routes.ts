import {Router} from 'express';
import { handleCreatePoll, handleReadPoll, handleUpdatePoll } from './poll.controller';
import { validate , authenticate} from '../../utils/middleware';
import { createPollSchema } from './poll.schema';

const pollRoutes = Router();

pollRoutes.post('/' , validate(createPollSchema) , authenticate ,handleCreatePoll);
// pollRoutes.get('/' , authenticate , handleReadMyPoll);
pollRoutes.get('/:id' ,handleReadPoll);
// pollRoutes.post('/options/:optionId/vote' , handleUpdatePoll);

export {pollRoutes}