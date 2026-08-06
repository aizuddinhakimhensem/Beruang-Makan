/**
 * Main Express + Vite Server Entry Point
 * BeruangMakan Monorepo Shared Backend
 * Customer App, Rider App, Merchant App, Admin CMS
 */

import express from 'express';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';

import authRoutes from './src/backend/routes/authRoutes.js';
import orderRoutes from './src/backend/routes/orderRoutes.js';
import merchantRoutes from './src/backend/routes/merchantRoutes.js';
import adminRoutes from './src/backend/routes/adminRoutes.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // JSON Body Parser & URL Encoded Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS Headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health Check Endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'BeruangMakan Shared Express Backend',
      version: '1.0.0',
      database: 'PostgreSQL 16 + PostGIS Ready',
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes Registration (MUST BE FIRST BEFORE VITE MIDDLEWARE)
  app.use('/api/auth', authRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/merchants', merchantRoutes);
  app.use('/api/admin', adminRoutes);

  // Vite Development / Production Static Server Setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BeruangMakan Backend] Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
