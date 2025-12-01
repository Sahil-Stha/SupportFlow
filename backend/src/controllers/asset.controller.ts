import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const listAssets = async (req: Request, res: Response) => {
    try {
        const { status, type, location } = req.query;

        const where: any = {};
        if (status) where.status = status;
        if (type) where.type = type;
        if (location) where.location = { contains: location as string, mode: 'insensitive' };

        const assets = await prisma.asset.findMany({
            where,
            include: {
                assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
            },
        });

        res.json(assets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAsset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const asset = await prisma.asset.findUnique({
            where: { id: Number(id) },
            include: {
                assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
                tickets: {
                    select: { id: true, title: true, status: true, createdAt: true },
                    orderBy: { createdAt: 'desc' },
                },
                history: {
                    include: {
                        changedBy: { select: { id: true, firstName: true, lastName: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!asset) {
            return res.status(404).json({ error: 'Asset not found' });
        }

        res.json(asset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createAsset = async (req: Request, res: Response) => {
    try {
        const { assetTag, serialNumber, type, brand, model, status, location, purchaseDate, warrantyExpiry } = req.body;

        const existingAsset = await prisma.asset.findUnique({ where: { assetTag } });
        if (existingAsset) {
            return res.status(400).json({ error: 'Asset tag already exists' });
        }

        const asset = await prisma.asset.create({
            data: {
                assetTag,
                serialNumber,
                type,
                brand,
                model,
                status: status || 'IN_STOCK',
                location,
                purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
                warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : null,
            },
        });

        res.status(201).json(asset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateAsset = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, assignedToId, location, type, brand, model } = req.body;
        const userId = (req as any).user.userId;

        const currentAsset = await prisma.asset.findUnique({ where: { id: Number(id) } });
        if (!currentAsset) {
            return res.status(404).json({ error: 'Asset not found' });
        }

        const data: any = {};
        if (status) data.status = status;
        if (assignedToId !== undefined) data.assignedToId = assignedToId ? Number(assignedToId) : null;
        if (location) data.location = location;
        if (type) data.type = type;
        if (brand) data.brand = brand;
        if (model) data.model = model;

        const updatedAsset = await prisma.asset.update({
            where: { id: Number(id) },
            data,
        });

        // Create history entry
        // This is a simplified history tracking. Ideally, we'd compare fields.
        await prisma.assetHistory.create({
            data: {
                assetId: Number(id),
                changedById: userId,
                changeType: 'UPDATED_DETAILS', // Simplified
                oldValue: JSON.stringify(currentAsset),
                newValue: JSON.stringify(updatedAsset),
            },
        });

        res.json(updatedAsset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAssetHistory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const history = await prisma.assetHistory.findMany({
            where: { assetId: Number(id) },
            include: {
                changedBy: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
