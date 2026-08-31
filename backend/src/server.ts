import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './routes/index';
import { getDatabaseStore } from './config/database';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Store
getDatabaseStore();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'x-user-state', 'x-user-district']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static documents folder
app.use('/storage', express.static(path.resolve(__dirname, '../../storage')));

// API Routes
app.use('/api', apiRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'National Land Acquisition & Management System',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend assets in production
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Fallback index.html for React Router SPA
app.get(/^(?!\/api|\/storage|\/health).*$/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🇮🇳 National Land Acquisition & Management System - Production Server`);
  console.log(`🚀 Exposing App & API on http://localhost:${PORT}`);
  console.log(`=============================================================\n`);
});

export default app;
