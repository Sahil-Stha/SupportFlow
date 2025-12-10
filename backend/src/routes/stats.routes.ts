import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/overview', async (req, res) => {
    try {
        const totalTickets = await prisma.ticket.count();
        const openTickets = await prisma.ticket.count({
            where: { status: { not: 'CLOSED' } }
        });
        const resolvedTickets = await prisma.ticket.count({
            where: { status: 'RESOLVED' }
        });
        const totalAssets = await prisma.asset.count();

        // Tickets by priority
        const ticketsByPriority = await prisma.ticket.groupBy({
            by: ['priority'],
            _count: {
                priority: true
            }
        });

        // Tickets by status
        const ticketsByStatusRaw = await prisma.ticket.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });
        const ticketsByStatus = ticketsByStatusRaw.map(item => ({
            name: item.status,
            value: item._count.status
        }));

        // Assets by status
        const assetsByStatusRaw = await prisma.asset.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });
        const assetsByStatus = assetsByStatusRaw.map(item => ({
            name: item.status,
            value: item._count.status
        }));

        res.json({
            totalTickets,
            openTickets,
            resolvedTickets,
            totalAssets,
            ticketsByPriority,
            ticketsByStatus,
            assetsByStatus
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

export default router;
