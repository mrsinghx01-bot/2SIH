"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./routes/index"));
const database_1 = require("./config/database");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Initialize Store
(0, database_1.getDatabaseStore)();
// Middleware
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Static documents folder
app.use('/storage', express_1.default.static(path_1.default.resolve(__dirname, '../../storage')));
// API Routes
app.use('/api', index_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'HEALTHY',
        system: 'National Land Acquisition & Management System',
        timestamp: new Date().toISOString()
    });
});
app.listen(PORT, () => {
    console.log(`\n=============================================================`);
    console.log(`🇮🇳 National Land Acquisition & Management System - Backend API`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 REST API active at http://localhost:${PORT}/api`);
    console.log(`=============================================================\n`);
});
exports.default = app;
