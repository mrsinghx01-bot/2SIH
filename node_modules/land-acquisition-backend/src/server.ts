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
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`🇮🇳 National Land Acquisition & Management System - Backend API`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 REST API active at http://localhost:${PORT}/api`);
  console.log(`=============================================================\n`);
});

export default app;
