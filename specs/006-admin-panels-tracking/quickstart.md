# Quickstart: Panel Administrativo y Tracking

**Feature**: 006-admin-panels-tracking
**Date**: 2026-08-27
**Purpose**: Validation scenarios for end-to-end testing

## Prerequisites

1. Next.js application running locally
2. Supabase project configured
3. Test users created:
   - Admin HL: `admin_hl@test.com` (role: admin_hl)
   - Admin KC: `admin_kc@test.com` (role: admin_kc)
   - Customer: `customer@test.com` (role: customer)
4. Test data:
   - At least 1 order with pending payment (HL brand)
   - At least 1 order with pending payment (KC brand)
   - At least 1 order in 'preparing' state

---

## Scenario 1: Payment Verification Flow

**Objective**: Admin can verify a payment and update order status

### Steps

1. Login as `admin_hl@test.com`
2. Navigate to `/pagos`
3. Verify table shows pending payments
4. Click on proof thumbnail
5. Verify modal opens with high-resolution image
6. Click "Aprobar" button
7. Confirm action in dialog
8. Verify payment status changes to "verified"
9. Verify sub-order status changes to "payment_verified"
10. Verify email notification sent (check logs)

### Expected Outcomes

- ✅ Payment status: `verified`
- ✅ Sub-order status: `payment_verified`
- ✅ Email notification logged

---

## Scenario 2: Payment Rejection Flow

**Objective**: Admin can reject a payment with reason

### Steps

1. Login as `admin_kc@test.com`
2. Navigate to `/pagos`
3. Click on proof thumbnail
4. Click "Rechazar" button
5. Enter rejection reason in textarea
6. Confirm action
7. Verify payment status changes to "rejected"
8. Verify sub-order stays in "pending_payment"

### Expected Outcomes

- ✅ Payment status: `rejected`
- ✅ Payment notes: rejection reason
- ✅ Sub-order status: `pending_payment` (unchanged)

---

## Scenario 3: Order Management with Tracking

**Objective**: Admin can manage orders and add tracking notes

### Steps

1. Login as `admin_hl@test.com`
2. Navigate to `/pedidos`
3. Click on a sub-order row
4. Verify drawer opens with tabs
5. Click "Productos" tab
6. Verify items list displayed
7. Click "Envío" tab
8. Verify shipping details displayed
9. Add tracking note:
   - Location: "Maracaibo"
   - Note: "Paquete en tránsito"
10. Submit tracking note
11. Update order status to "shipped"
12. Verify status updated
13. Verify email notification sent

### Expected Outcomes

- ✅ Drawer opens with 4 tabs
- ✅ Tracking note created with timestamp
- ✅ Order status: `shipped`
- ✅ Email notification logged

---

## Scenario 4: Invalid State Transition

**Objective**: System blocks invalid state transitions

### Steps

1. Login as `admin_hl@test.com`
2. Navigate to `/pedidos`
3. Find an order in "delivered" state
4. Attempt to change status to "pending_payment"
5. Verify error message displayed
6. Verify status unchanged

### Expected Outcomes

- ✅ Error message: "No se puede volver a un estado anterior"
- ✅ Order status: `delivered` (unchanged)

---

## Scenario 5: Client Order History

**Objective**: Client can view order history with timeline

### Steps

1. Login as `customer@test.com`
2. Navigate to `/pedidos`
3. Verify orders list displayed
4. Click on an order
5. Verify timeline vertical displayed
6. Verify HL and KC sub-orders separated
7. Verify order details (items, payments, shipping)

### Expected Outcomes

- ✅ Orders list sorted by date (descending)
- ✅ Timeline shows states for each brand
- ✅ Order details complete

---

## Scenario 6: Sidebar Navigation by Role

**Objective**: Sidebar shows correct items per role

### Steps

1. Login as `admin_hl@test.com`
2. Verify sidebar shows: Dashboard, Libros, Pedidos (HL), Pagos (HL), Solicitudes
3. Login as `admin_kc@test.com`
4. Verify sidebar shows: Dashboard, Productos, Pedidos (KC), Pagos (KC)
5. Login as superadmin
6. Verify sidebar shows all items including Reportes, Gestión de usuarios

### Expected Outcomes

- ✅ Admin HL: 5 items (HL-specific)
- ✅ Admin KC: 4 items (KC-specific)
- ✅ Superadmin: 8 items (all)

---

## Scenario 7: Pagination

**Objective**: Tables paginate correctly with 20 records per page

### Steps

1. Login as admin
2. Navigate to `/pagos`
3. Verify 20 records per page (if enough data)
4. Navigate to page 2
5. Verify next 20 records loaded
6. Verify page indicator shows current page

### Expected Outcomes

- ✅ 20 records per page
- ✅ Pagination controls functional
- ✅ Page indicator accurate

---

## Scenario 8: Empty States

**Objective**: Empty states display correctly

### Steps

1. Login as customer with no orders
2. Navigate to `/pedidos`
3. Verify empty state displayed
4. Verify link to catalog

### Expected Outcomes

- ✅ Empty state message displayed
- ✅ Link to catalog functional

---

## Validation Commands

```bash
# Run unit tests
bun test

# Run type check
bun run typecheck

# Run lint
bun run lint

# Start development server
bun run dev

# Access admin panel
# http://localhost:3000/pagos
# http://localhost:3000/pedidos

# Access client orders
# http://localhost:3000/pedidos (as customer)
```

## Success Criteria Verification

| Criteria | Metric | Verification |
|----------|--------|--------------|
| SC-001 | < 2min payment verification | Time scenario 1 execution |
| SC-002 | < 1min order update | Time scenario 3 execution |
| SC-003 | < 5s page load | Measure page load time |
| SC-004 | 95% accuracy | Track error rate |
| SC-005 | 100% invalid transitions blocked | Scenario 4 pass rate |
| SC-006 | 100% sidebar correct | Scenario 6 pass rate |
