/**
 * Order Module Controllers
 * Handlers for Create Order, Status Updates, Rider Assignment, & History Queries
 */

import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import {
  createOrder,
  updateOrderStatus,
  assignRiderToOrder,
  getCustomerOrderHistory,
  getMerchantOrderHistory,
} from '../services/orderService.js';

/**
 * POST /api/orders
 * Create new order
 */
export async function handleCreateOrder(req: AuthenticatedRequest, res: Response) {
  try {
    const { merchantId, deliveryAddress, deliveryLatitude, deliveryLongitude, items } = req.body;
    const customerId = req.user?.id || 'cp-001';

    if (!merchantId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Sila berikan merchantId dan sekurang-kurangnya 1 item pesanan.',
      });
    }

    const order = await createOrder({
      customerId,
      merchantId,
      deliveryAddress: deliveryAddress || 'Bukit Bintang, Kuala Lumpur',
      deliveryLatitude: deliveryLatitude || 3.1466,
      deliveryLongitude: deliveryLongitude || 101.7115,
      items,
    });

    return res.status(201).json({
      success: true,
      message: 'Pesanan berjaya dicipta!',
      order,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

/**
 * PATCH /api/orders/:id/status
 * Update Order Status
 */
export async function handleUpdateOrderStatus(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status, cancellationReason } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status baru diperlukan.' });
    }

    const updatedOrder = await updateOrderStatus(id, status, cancellationReason);
    return res.status(200).json({
      success: true,
      message: `Status pesanan #${updatedOrder.order_number} ditukar ke '${status}'.`,
      order: updatedOrder,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/orders/:id/assign-rider
 * Assign closest rider via PostGIS / Haversine distance
 */
export async function handleAssignRider(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const result = await assignRiderToOrder(id);

    return res.status(200).json({
      success: true,
      message: `Rider ${result.assignedRider.full_name} (${result.assignedRider.vehicle_plate}) berjaya ditugaskan (Jarak: ${result.distanceKm} km).`,
      order: result.order,
      assignedRider: result.assignedRider,
      distanceKm: result.distanceKm,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

/**
 * GET /api/orders/customer
 */
export async function handleGetCustomerOrders(req: AuthenticatedRequest, res: Response) {
  try {
    const customerId = req.user?.id || 'cp-001';
    const orders = await getCustomerOrderHistory(customerId);
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * GET /api/orders/merchant
 */
export async function handleGetMerchantOrders(req: AuthenticatedRequest, res: Response) {
  try {
    const merchantId = (req.query.merchantId as string) || 'mp-001';
    const orders = await getMerchantOrderHistory(merchantId);
    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
