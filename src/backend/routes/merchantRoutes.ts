/**
 * Merchant Search Express Routes
 * /api/merchants
 */

import { Router } from 'express';
import { handleSearchMerchants } from '../controllers/merchantController.js';

const router = Router();

// Public Geospatial PostGIS Search Endpoint
router.get('/search', handleSearchMerchants);

export default router;
