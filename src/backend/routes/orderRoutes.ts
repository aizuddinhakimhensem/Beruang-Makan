/**
 * Order Module Express Routes
 * /api/orders
 */

import { Router } from 'express';
import {
  handleCreateOrder,
  handleUpdateOrderStatus,
  handleAssignRider,
  handleGetCustomerOrders,
  handleGetMerchantOrders,
} from '../controllers/orderController.js';
import { authenticateJwt, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

// Create Order (Customer role allowed)
router.post('/', authenticateJwt, authorizeRoles('customer', 'admin'), handleCreateOrder);

// Update Order Status (Merchant, Rider, Admin allowed)
router.patch('/:id/status', authenticateJwt, authorizeRoles('merchant', 'rider', 'admin'), handleUpdateOrderStatus);

// Assign Rider via Geospatial Logic
router.post('/:id/assign-rider', authenticateJwt, authorizeRoles('merchant', 'admin'), handleAssignRider);

// Order History
router.get('/customer', authenticateJwt, authorizeRoles('customer', 'admin'), handleGetCustomerOrders);
router.get('/merchant', authenticateJwt, authorizeRoles('merchant', 'admin'), handleGetMerchantOrders);

export default router;
