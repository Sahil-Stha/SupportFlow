import { Router } from 'express';
import { listAssets, getAsset, createAsset, updateAsset, getAssetHistory } from '../controllers/asset.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, listAssets);
router.get('/:id', authenticateToken, getAsset);
router.post('/', authenticateToken, requireRole(['ADMIN']), createAsset);
router.put('/:id', authenticateToken, requireRole(['TECH', 'ADMIN']), updateAsset);
router.get('/:id/history', authenticateToken, getAssetHistory);

export default router;
