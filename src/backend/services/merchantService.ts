/**
 * Merchant Search Service
 * Geospatial PostGIS Radius Search (ST_DWithin), Halal Status Filtering,
 * Category Filtering, and Multi-Criteria Sorting.
 */

import { db, MerchantProfile, calculateHaversineDistanceKm } from '../db/index.js';

export interface SearchMerchantQuery {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  category?: string;
  halalStatus?: 'verified_jakim' | 'self_declared' | 'non_halal';
  sortBy?: 'distance' | 'rating' | 'delivery_time';
}

export interface MerchantSearchResult extends MerchantProfile {
  distance_km: number;
}

export async function searchMerchants(query: SearchMerchantQuery): Promise<MerchantSearchResult[]> {
  const radiusKm = query.radiusKm || 10; // Default 10km radius
  const userLat = query.latitude || 3.1466; // KL default
  const userLon = query.longitude || 101.7115;

  let results: MerchantSearchResult[] = [];

  for (const merchant of db.merchantProfiles) {
    // 1. Calculate Geospatial Distance (Simulating PostGIS ST_Distance)
    const distKm = calculateHaversineDistanceKm(
      userLat,
      userLon,
      merchant.latitude,
      merchant.longitude
    );

    // 2. PostGIS ST_DWithin Radius Filter
    if (distKm > radiusKm) {
      continue;
    }

    // 3. Halal Status Filter
    if (query.halalStatus && merchant.halal_status !== query.halalStatus) {
      continue;
    }

    // 4. Category Filter
    if (query.category && !merchant.cuisine_category.toLowerCase().includes(query.category.toLowerCase())) {
      continue;
    }

    results.push({
      ...merchant,
      distance_km: distKm,
    });
  }

  // 5. Sorting
  const sortBy = query.sortBy || 'distance';
  results.sort((a, b) => {
    if (sortBy === 'distance') {
      return a.distance_km - b.distance_km;
    } else if (sortBy === 'rating') {
      return b.avg_rating - a.avg_rating;
    } else if (sortBy === 'delivery_time') {
      return a.avg_prep_time_mins - b.avg_prep_time_mins;
    }
    return 0;
  });

  return results;
}
