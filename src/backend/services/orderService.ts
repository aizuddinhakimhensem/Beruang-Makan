/**
 * Order Module Service
 * Handles Stock Validation, Fee Calculation, Order Creation, State Machine Transitions,
 * Rider Assignment via Geospatial Distance, and History Queries.
 */

import { db, OrderRecord, calculateHaversineDistanceKm } from '../db/index.js';

export interface CreateOrderInput {
  customerId: string;
  merchantId: string;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
}

// State Machine Transition Rules
const VALID_TRANSITIONS: Record<OrderRecord['status'], OrderRecord['status'][]> = {
  pending: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['picked_up', 'cancelled'],
  picked_up: ['delivered', 'cancelled'],
  delivered: ['completed'],
  completed: [],
  cancelled: [],
};

/**
 * 1. Create Order
 */
export async function createOrder(input: CreateOrderInput): Promise<OrderRecord> {
  const merchant = db.merchantProfiles.find(m => m.id === input.merchantId);
  if (!merchant) {
    throw new Error('Merchant / Restoran tidak ditemui.');
  }

  if (!merchant.is_open) {
    throw new Error('Restoran ini sedang ditutup. Sila cuba lagi kemudian.');
  }

  // Validate Menu Items & Stock
  let subtotal = 0;
  const processedItems: OrderRecord['items'] = [];

  for (const itemInput of input.items) {
    const menuItem = db.menuItems.find(mi => mi.id === itemInput.menuItemId && mi.merchant_id === input.merchantId);
    if (!menuItem) {
      throw new Error(`Item menu ID ${itemInput.menuItemId} tidak dijumpai di restoran ini.`);
    }

    if (!menuItem.is_available || menuItem.stock_quantity < itemInput.quantity) {
      throw new Error(`Stok untuk "${menuItem.name}" tidak mencukupi (Tinggal: ${menuItem.stock_quantity}).`);
    }

    // Deduct Stock
    menuItem.stock_quantity -= itemInput.quantity;

    const itemSubtotal = menuItem.price * itemInput.quantity;
    subtotal += itemSubtotal;

    processedItems.push({
      menu_item_id: menuItem.id,
      quantity: itemInput.quantity,
      unit_price: menuItem.price,
      subtotal: itemSubtotal,
      name: menuItem.name,
    });
  }

  // Calculate Geospatial Distance & Delivery Fee (Base RM3.00 + RM1.00 per km)
  const distanceKm = calculateHaversineDistanceKm(
    merchant.latitude,
    merchant.longitude,
    input.deliveryLatitude,
    input.deliveryLongitude
  );

  const delivery_fee = Math.round((3.0 + distanceKm * 1.0) * 100) / 100;
  const discount_amount = 0.0;
  const total_amount = Math.round((subtotal + delivery_fee - discount_amount) * 100) / 100;

  const newOrder: OrderRecord = {
    id: `ord-${Date.now()}`,
    order_number: `BM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
    customer_id: input.customerId,
    merchant_id: input.merchantId,
    rider_id: null,
    status: 'pending',
    subtotal,
    delivery_fee,
    discount_amount,
    total_amount,
    delivery_address: input.deliveryAddress,
    delivery_latitude: input.deliveryLatitude,
    delivery_longitude: input.deliveryLongitude,
    created_at: new Date().toISOString(),
    items: processedItems,
  };

  db.orders.push(newOrder);
  return newOrder;
}

/**
 * 2. Update Order Status (State Machine Validation)
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderRecord['status'],
  cancellationReason?: string
): Promise<OrderRecord> {
  const order = db.orders.find(o => o.id === orderId);

  if (!order) {
    throw new Error('Pesanan tidak ditemui.');
  }

  const allowedNext = VALID_TRANSITIONS[order.status];
  if (!allowedNext.includes(newStatus)) {
    throw new Error(`Penukaran status dari '${order.status}' ke '${newStatus}' tidak sah dalam alur kerja pesanan.`);
  }

  order.status = newStatus;
  if (cancellationReason) {
    order.cancellation_reason = cancellationReason;
  }

  return order;
}

/**
 * 3. Assign Rider to Order (Geospatial Closest Available Rider Logic)
 */
export async function assignRiderToOrder(orderId: string): Promise<{ order: OrderRecord; assignedRider: any; distanceKm: number }> {
  const order = db.orders.find(o => o.id === orderId);
  if (!order) {
    throw new Error('Pesanan tidak ditemui.');
  }

  const merchant = db.merchantProfiles.find(m => m.id === order.merchant_id);
  if (!merchant) {
    throw new Error('Merchant tidak ditemui.');
  }

  // Find Online & Available Riders sorted by closest Haversine distance to Merchant
  const availableRiders = db.riderProfiles.filter(r => r.is_online && r.is_available);

  if (availableRiders.length === 0) {
    throw new Error('Tiada rider berdekatan yang tersedia pada masa ini.');
  }

  let closestRider = availableRiders[0];
  let minDistance = calculateHaversineDistanceKm(
    merchant.latitude,
    merchant.longitude,
    closestRider.latitude,
    closestRider.longitude
  );

  for (const rider of availableRiders) {
    const dist = calculateHaversineDistanceKm(
      merchant.latitude,
      merchant.longitude,
      rider.latitude,
      rider.longitude
    );
    if (dist < minDistance) {
      minDistance = dist;
      closestRider = rider;
    }
  }

  // Assign Rider
  order.rider_id = closestRider.id;
  closestRider.is_available = false; // Mark rider busy

  return {
    order,
    assignedRider: closestRider,
    distanceKm: minDistance,
  };
}

/**
 * 4. Get Customer Orders History
 */
export async function getCustomerOrderHistory(customerId: string): Promise<OrderRecord[]> {
  return db.orders.filter(o => o.customer_id === customerId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * 5. Get Merchant Orders History
 */
export async function getMerchantOrderHistory(merchantId: string): Promise<OrderRecord[]> {
  return db.orders.filter(o => o.merchant_id === merchantId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
