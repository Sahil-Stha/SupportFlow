import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initSocket } from './socket';
import path from 'path';

import authRoutes from './routes/auth.routes';
import ticketRoutes from './routes/ticket.routes';
import assetRoutes from './routes/asset.routes';
import statsRoutes from './routes/stats.routes';
import aiRoutes from './routes/ai.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
const io = initSocket(httpServer);

// Middleware
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow serving images
}));
app.use(morgan('dev'));
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/tickets', ticketRoutes);
apiRouter.use('/assets', assetRoutes);
apiRouter.use('/stats', statsRoutes);
apiRouter.use('/ai', aiRoutes);

// Mount API router at both / and /api to handle Vercel rewrites and local dev
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start Server
// Start Server only if not running in Vercel (Vercel handles this)
if (process.env.NODE_ENV !== 'production') {
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
