// import {Router} from 'express';
// import { handleCreatePoll, handleReadPoll, handleUpdatePoll } from './poll.controller';
// import { validate } from '../../utils/middleware';
// import { createPollSchema } from './poll.schema';

// const pollRoutes = Router();


// pollRoutes.post('/' , validate(createPollSchema) ,handleCreatePoll);
// pollRoutes.get('/:id' , handleReadPoll);
// pollRoutes.post('/options/:optionId/vote' , handleUpdatePoll);

// export {pollRoutes}