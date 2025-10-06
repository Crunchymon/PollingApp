import express from 'express';
import { apiRoutes } from './api';
import { errorHandler } from './utils/middleware';
import cors from 'cors';
const PORT = process.env.PORT || 8000;


const app = express();
app.use(express.json())
app.use(cors())
app.use('/api',apiRoutes);
app.use(errorHandler)
app.listen(PORT , ()=>{
    console.log(`server is listening on http://localhost:${PORT}`);
})