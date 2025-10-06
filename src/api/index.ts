import {Router} from 'express';
import {pollRoutes} from './polls/poll.routes'

const apiRoutes = Router();
apiRoutes.use('/polls' , pollRoutes)

export {apiRoutes}