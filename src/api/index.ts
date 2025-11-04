import {Router} from 'express';
// import {pollRoutes} from './polls/poll.routes'
import { authRoutes } from './auth/auth.routes';
const apiRoutes = Router();
// apiRoutes.use('/polls' , pollRoutes)
apiRoutes.use('/auth' , authRoutes)
export {apiRoutes}