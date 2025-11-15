"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = require("./api");
const middleware_1 = require("./utils/middleware");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use((0, cors_1.default)(corsOptions));
app.use('/api', api_1.apiRoutes);
// console.log("hello");
// 404 handler - must be after all routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Error handler - must be last, after all middleware and routes
app.use(middleware_1.errorHandler);
app.listen(PORT, () => {
    logger_1.default.info(`Server started successfully`, { port: PORT, environment: process.env.NODE_ENV || 'development' });
});
