import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const listTickets = async (req: Request, res: Response) => {
    try {
        const { status, priority, created_by, assigned_to } = req.query;

        const where: any = {};
        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (created_by) where.createdById = Number(created_by);
        if (assigned_to) where.assignedToId = Number(assigned_to);

        const tickets = await prisma.ticket.findMany({
            where,
            include: {
                createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
                assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
                asset: { select: { id: true, assetTag: true, type: true } },
            },
        });

        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getTicket = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const ticket = await prisma.ticket.findUnique({
            where: { id: Number(id) },
            include: {
                createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
                assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
                asset: { select: { id: true, assetTag: true, type: true } },
                comments: {
                    include: {
                        user: { select: { id: true, firstName: true, lastName: true } },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createTicket = async (req: Request, res: Response) => {
    try {
        const { title, description, priority, category, assetId } = req.body;
        const userId = (req as any).user.userId;

        const ticket = await prisma.ticket.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                category,
                createdById: userId,
                assetId: assetId ? Number(assetId) : null,
            },
        });

        res.status(201).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateTicket = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, priority, assignedToId, assetId } = req.body;

        const data: any = {};
        if (status) {
            data.status = status;
            if (status === 'RESOLVED' || status === 'CLOSED') {
                data.resolvedAt = new Date();
            }
        }
        if (priority) data.priority = priority;
        if (assignedToId) data.assignedToId = Number(assignedToId);
        if (assetId) data.assetId = Number(assetId);

        const ticket = await prisma.ticket.update({
            where: { id: Number(id) },
            data,
        });

        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const addComment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { comment, internalOnly } = req.body;
        const userId = (req as any).user.userId;

        const newComment = await prisma.ticketComment.create({
            data: {
                ticketId: Number(id),
                userId,
                comment,
                internalOnly: internalOnly || false,
            },
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteTicket = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const ticket = await prisma.ticket.findUnique({
            where: { id: Number(id) },
        });

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        if (ticket.status !== 'CLOSED') {
            return res.status(400).json({ error: 'Only closed tickets can be deleted' });
        }

        // Delete related comments first
        await prisma.ticketComment.deleteMany({
            where: { ticketId: Number(id) },
        });

        await prisma.ticket.delete({
            where: { id: Number(id) },
        });

        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
