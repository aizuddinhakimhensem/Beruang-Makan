/**
 * Merchant Search Controller
 * Radius search using PostGIS ST_DWithin logic, Halal filtering, and sorting.
 */

import { Request, Response } from 'express';
import { searchMerchants } from '../services/merchantService.js';

/**
 * GET /api/merchants/search
 */
export async function handleSearchMerchants(req: Request, res: Response) {
  try {
    const lat = parseFloat(req.query.lat as string) || 3.1466;
    const lon = parseFloat(req.query.lon as string) || 101.7115;
    const radius = parseFloat(req.query.radius as string) || 10;
    const category = (req.query.category as string) || undefined;
    const halalStatus = (req.query.halalStatus as any) || undefined;
    const sortBy = (req.query.sortBy as any) || 'distance';

    const results = await searchMerchants({
      latitude: lat,
      longitude: lon,
      radiusKm: radius,
      category,
      halalStatus,
      sortBy,
    });

    return res.status(200).json({
      success: true,
      query: { lat, lon, radiusKm: radius, category, halalStatus, sortBy },
      count: results.length,
      merchants: results,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
