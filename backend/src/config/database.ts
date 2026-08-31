import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { generateSeedData, SeedDataset } from '../scripts/seed-demo-data/seed-demo-data';

let prismaInstance: PrismaClient | null = null;
let inMemoryStore: SeedDataset | null = null;

function getStorageFilePath(): string {
  const rootStorage = path.resolve(process.cwd(), 'storage');
  if (!fs.existsSync(rootStorage)) {
    try {
      fs.mkdirSync(rootStorage, { recursive: true });
    } catch (e) {
      // fallback
    }
  }
  return path.join(rootStorage, 'db_store.json');
}

export function saveDatabaseStore(): void {
  try {
    if (!inMemoryStore) return;
    const filePath = getStorageFilePath();
    fs.writeFileSync(filePath, JSON.stringify(inMemoryStore, null, 2), 'utf8');
  } catch (err) {
    console.error('⚠️ Failed to persist database store to disk:', err);
  }
}

export function getDatabaseStore(): SeedDataset {
  if (!inMemoryStore) {
    const filePath = getStorageFilePath();
    if (fs.existsSync(filePath)) {
      try {
        console.log('🔄 Loading Persistent Master Data from storage/db_store.json...');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        inMemoryStore = JSON.parse(fileContent) as SeedDataset;
        console.log(`✅ Loaded persistent store with ${inMemoryStore.projects?.length || 0} projects and ${inMemoryStore.acquisitionCases?.length || 0} cases.`);
      } catch (err) {
        console.error('⚠️ Could not parse existing db_store.json, regenerating fresh seed data...', err);
        inMemoryStore = generateSeedData();
        saveDatabaseStore();
      }
    } else {
      console.log('🔄 Initializing Fresh Master Data & Application Seed Store...');
      inMemoryStore = generateSeedData();
      saveDatabaseStore();
    }
  }
  return inMemoryStore;
}

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}
