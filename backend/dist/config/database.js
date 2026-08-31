"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDatabaseStore = saveDatabaseStore;
exports.getDatabaseStore = getDatabaseStore;
exports.getPrismaClient = getPrismaClient;
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const seed_demo_data_1 = require("../scripts/seed-demo-data/seed-demo-data");
let prismaInstance = null;
let inMemoryStore = null;
function getStorageFilePath() {
    const rootStorage = path_1.default.resolve(process.cwd(), 'storage');
    if (!fs_1.default.existsSync(rootStorage)) {
        try {
            fs_1.default.mkdirSync(rootStorage, { recursive: true });
        }
        catch (e) {
            // fallback
        }
    }
    return path_1.default.join(rootStorage, 'db_store.json');
}
function saveDatabaseStore() {
    try {
        if (!inMemoryStore)
            return;
        const filePath = getStorageFilePath();
        fs_1.default.writeFileSync(filePath, JSON.stringify(inMemoryStore, null, 2), 'utf8');
    }
    catch (err) {
        console.error('⚠️ Failed to persist database store to disk:', err);
    }
}
function getDatabaseStore() {
    if (!inMemoryStore) {
        const filePath = getStorageFilePath();
        if (fs_1.default.existsSync(filePath)) {
            try {
                console.log('🔄 Loading Persistent Master Data from storage/db_store.json...');
                const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
                inMemoryStore = JSON.parse(fileContent);
                console.log(`✅ Loaded persistent store with ${inMemoryStore.projects?.length || 0} projects and ${inMemoryStore.acquisitionCases?.length || 0} cases.`);
            }
            catch (err) {
                console.error('⚠️ Could not parse existing db_store.json, regenerating fresh seed data...', err);
                inMemoryStore = (0, seed_demo_data_1.generateSeedData)();
                saveDatabaseStore();
            }
        }
        else {
            console.log('🔄 Initializing Fresh Master Data & Application Seed Store...');
            inMemoryStore = (0, seed_demo_data_1.generateSeedData)();
            saveDatabaseStore();
        }
    }
    return inMemoryStore;
}
function getPrismaClient() {
    if (!prismaInstance) {
        prismaInstance = new client_1.PrismaClient();
    }
    return prismaInstance;
}
