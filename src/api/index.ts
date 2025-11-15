import {Router} from 'express';
import {pollRoutes} from './polls/poll.routes'
import { authRoutes } from './auth/auth.routes';
import { userRoutes } from './users/user.routes';
import { voteRoute } from './votes/vote.routes';
const apiRoutes = Router();

apiRoutes.use('/auth' , authRoutes)
apiRoutes.use('/users' , userRoutes)
apiRoutes.use('/polls' , pollRoutes)
apiRoutes.use('/votes', voteRoute)

export {apiRoutes}