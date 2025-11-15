import {Router} from 'express';
import { handleCreatePoll, handleReadPoll,  handleReadMyPoll , handleDeletePoll} from './poll.controller';
import { validate , authenticate} from '../../utils/middleware';
import { createPollSchema } from './poll.schema';

const pollRoutes = Router();

pollRoutes.post('/' , validate(createPollSchema) , authenticate ,handleCreatePoll);
pollRoutes.get('/' , authenticate , handleReadMyPoll);
pollRoutes.get('/:id' ,handleReadPoll);
pollRoutes.delete('/:id' , authenticate, handleDeletePoll);


export {pollRoutes}