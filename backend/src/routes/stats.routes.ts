import { Router } from 'express';
import { getOverviewStats } from '../controllers/stats.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/overview', authenticateToken, requireRole(['TECH', 'ADMIN']), getOverviewStats);

export default router;
