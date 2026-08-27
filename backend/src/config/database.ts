import { PrismaClient } from '@prisma/client';
import { generateSeedData, SeedDataset } from '../scripts/seed-demo-data/seed-demo-data';

let prismaInstance: PrismaClient | null = null;
let inMemoryStore: SeedDataset | null = null;

export function getDatabaseStore(): SeedDataset {
  if (!inMemoryStore) {
    console.log('🔄 Initializing Master Data & Application Seed Store...');
    inMemoryStore = generateSeedData();
  }
  return inMemoryStore;
}

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}
