import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import ticketRoutes from './routes/ticket.routes';
import assetRoutes from './routes/asset.routes';
import statsRoutes from './routes/stats.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);
app.use('/assets', assetRoutes);
app.use('/stats', statsRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
