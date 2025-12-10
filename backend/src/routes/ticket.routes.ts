import { Router } from 'express';
import { listTickets, getTicket, createTicket, updateTicket, addComment } from '../controllers/ticket.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, listTickets);
router.get('/:id', authenticateToken, getTicket);
router.post('/', authenticateToken, createTicket);
router.put('/:id', authenticateToken, requireRole(['TECH', 'ADMIN']), updateTicket);
router.post('/:id/comments', authenticateToken, addComment);

export default router;
