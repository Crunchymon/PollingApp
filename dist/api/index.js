"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
const express_1 = require("express");
// import {pollRoutes} from './polls/poll.routes'
const auth_routes_1 = require("./auth/auth.routes");
const apiRoutes = (0, express_1.Router)();
exports.apiRoutes = apiRoutes;
// apiRoutes.use('/polls' , pollRoutes)
apiRoutes.use('/auth', auth_routes_1.authRoutes);
