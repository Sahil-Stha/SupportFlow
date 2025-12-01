import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10);

    // Create Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@supportflow.com' },
        update: {},
        create: {
            email: 'admin@supportflow.com',
            firstName: 'Admin',
            lastName: 'User',
            passwordHash,
            role: 'ADMIN',
            department: 'IT',
        },
    });

    // Create Tech User
    const tech = await prisma.user.upsert({
        where: { email: 'tech@supportflow.com' },
        update: {},
        create: {
            email: 'tech@supportflow.com',
            firstName: 'Tech',
            lastName: 'Support',
            passwordHash,
            role: 'TECH',
            department: 'IT',
        },
    });

    // Create Regular User
    const user = await prisma.user.upsert({
        where: { email: 'user@supportflow.com' },
        update: {},
        create: {
            email: 'user@supportflow.com',
            firstName: 'Regular',
            lastName: 'User',
            passwordHash,
            role: 'USER',
            department: 'Sales',
        },
    });

    console.log({ admin, tech, user });

    // Create Assets
    const laptop = await prisma.asset.upsert({
        where: { assetTag: 'AST-001' },
        update: {},
        create: {
            assetTag: 'AST-001',
            brand: 'Dell',
            model: 'XPS 15',
            serialNumber: 'DXPS15-001',
            type: 'Laptop',
            status: 'IN_USE',
            location: 'HQ',
            purchaseDate: new Date('2023-01-15'),
            assignedToId: user.id,
        },
    });

    const monitor = await prisma.asset.upsert({
        where: { assetTag: 'AST-002' },
        update: {},
        create: {
            assetTag: 'AST-002',
            brand: 'LG',
            model: 'UltraFine 4K',
            serialNumber: 'LG4K-002',
            type: 'Monitor',
            status: 'IN_USE',
            location: 'HQ',
            purchaseDate: new Date('2023-02-20'),
            assignedToId: user.id,
        },
    });

    const printer = await prisma.asset.upsert({
        where: { assetTag: 'AST-003' },
        update: {},
        create: {
            assetTag: 'AST-003',
            brand: 'HP',
            model: 'LaserJet Pro',
            serialNumber: 'HPLJ-003',
            type: 'Printer',
            status: 'AVAILABLE',
            location: 'HQ',
            purchaseDate: new Date('2023-03-10'),
        },
    });

    console.log({ laptop, monitor, printer });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
