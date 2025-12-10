import { Router } from 'express';
import { listTickets, getTicket, createTicket, updateTicket, addComment, addAttachment, deleteTicket } from '../controllers/ticket.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', authenticateToken, listTickets);
router.get('/:id', authenticateToken, getTicket);
router.post('/', authenticateToken, createTicket);
router.put('/:id', authenticateToken, requireRole(['TECH', 'ADMIN']), updateTicket);
router.post('/:id/comments', authenticateToken, addComment);
router.post('/:id/attachments', authenticateToken, upload.single('file'), addAttachment);
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), deleteTicket);

export default router;
