"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseStore = getDatabaseStore;
exports.getPrismaClient = getPrismaClient;
const client_1 = require("@prisma/client");
const seed_demo_data_1 = require("../../../scripts/seed-demo-data/seed-demo-data");
let prismaInstance = null;
let inMemoryStore = null;
function getDatabaseStore() {
    if (!inMemoryStore) {
        console.log('🔄 Initializing Master Data & Application Seed Store...');
        inMemoryStore = (0, seed_demo_data_1.generateSeedData)();
    }
    return inMemoryStore;
}
function getPrismaClient() {
    if (!prismaInstance) {
        prismaInstance = new client_1.PrismaClient();
    }
    return prismaInstance;
}
