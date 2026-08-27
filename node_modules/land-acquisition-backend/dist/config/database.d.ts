import { PrismaClient } from '@prisma/client';
import { SeedDataset } from '../scripts/seed-demo-data/seed-demo-data';
export declare function getDatabaseStore(): SeedDataset;
export declare function getPrismaClient(): PrismaClient;
