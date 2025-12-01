import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getOverviewStats = async (req: Request, res: Response) => {
    try {
        const totalTickets = await prisma.ticket.count();
        const openTickets = await prisma.ticket.count({
            where: {
                status: {
                    notIn: ['RESOLVED', 'CLOSED'],
                },
            },
        });

        const ticketsByStatus = await prisma.ticket.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });

        const ticketsByPriority = await prisma.ticket.groupBy({
            by: ['priority'],
            _count: {
                priority: true,
            },
        });

        const totalAssets = await prisma.asset.count();

        const assetsByStatus = await prisma.asset.groupBy({
            by: ['status'],
            _count: {
                status: true,
            },
        });

        res.json({
            totalTickets,
            openTickets,
            ticketsByStatus: ticketsByStatus.map((item) => ({ name: item.status, value: item._count.status })),
            ticketsByPriority: ticketsByPriority.map((item) => ({ name: item.priority, value: item._count.priority })),
            totalAssets,
            assetsByStatus: assetsByStatus.map((item) => ({ name: item.status, value: item._count.status })),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
