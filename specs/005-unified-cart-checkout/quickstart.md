# Quickstart Validation: Carrito Unificado y Checkout

**Date**: 2026-08-27

## Prerequisites

1. Supabase project configured
2. Database tables created (cart_items, orders, sub_orders, order_items, payments, payment_schedules)
3. Environment variables set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Cloudinary configured for file uploads

## Validation Scenarios

### Scenario 1: Add Items to Cart

**Steps**:
1. Navigate to `/libros`
2. Click "Agregar al carrito" on a book
3. Navigate to `/kamcat`
4. Click "Agregar al carrito" on a product
5. Navigate to `/carrito`

**Expected**:
- Cart shows both items
- Items separated by brand badges (HL / KC)
- Subtotals calculated correctly per brand
- Total general displayed

---

### Scenario 2: Modify Cart Items

**Steps**:
1. In `/carrito`, click "+" on a book quantity
2. Click "x" to remove a product

**Expected**:
- Book quantity increases by 1
- Book subtotal updates
- Total general updates
- Product removed from cart

---

### Scenario 3: Checkout Flow - Shipping

**Steps**:
1. Click "Proceder al checkout →"
2. Fill in shipping form (name, cédula, phone, state, city, address, reference)
3. Select "MRW" as shipping method

**Expected**:
- Form validates required fields
- Shipping cost calculated and displayed
- "Siguiente →" button enabled

---

### Scenario 4: Checkout Flow - Payment (Pago Móvil)

**Steps**:
1. Click "Siguiente →" to go to payment step
2. Select "Pago Móvil"
3. Verify bank data and VES amount displayed

**Expected**:
- Bank data shown (bank, phone, cédula)
- Amount in VES calculated correctly (USD × exchange rate)
- "Siguiente →" button enabled

---

### Scenario 5: Checkout Flow - Payment (Binance)

**Steps**:
1. Select "Binance (USDT)"
2. Verify discount applied

**Expected**:
- "5% de Descuento aplicado" badge shown
- Wallet address displayed (TRC-20/BEP-20)
- Copy button functional
- Amount in USDT shown (total - 5% discount)

---

### Scenario 6: Checkout Flow - Payment (Plan de Pagos)

**Steps**:
1. Select "Plan de Pagos" (only available if books in cart)
2. Select "3 cuotas"
3. Verify installment table

**Expected**:
- Table shows 3 installments
- Each installment amount = total / 3
- Dates are fortnightly (every 15 days)
- Warning: "El despacho se realiza una vez completada la totalidad de las cuotas"

---

### Scenario 7: Checkout Flow - Confirmation

**Steps**:
1. Click "Siguiente →" to go to confirmation step
2. Upload payment proof (JPG/PNG/PDF, max 5MB)
3. Enter reference number
4. Click "Completar pedido"

**Expected**:
- File preview shown
- Reference number validated
- Order created successfully
- Redirect to `/pedidos/[orderId]`

---

### Scenario 8: Order Creation with Sub-Orders

**Steps**:
1. Complete checkout with books and KamCat products
2. Check database for order creation

**Expected**:
- Master order created with unique order_number
- Sub-order for HL created with HL items
- Sub-order for KC created with KC items
- Order items created for each sub-order
- Payment schedules created if installments selected
- Cart cleared

---

### Scenario 9: Empty Cart State

**Steps**:
1. Remove all items from cart
2. Navigate to `/carrito`

**Expected**:
- Empty state shown
- Links to `/libros` and `/kamcat` displayed

---

### Scenario 10: Payment Verification (Admin)

**Steps**:
1. Login as admin
2. Navigate to admin panel
3. Find pending payment
4. Click "Verificar" and set status to "verified"

**Expected**:
- Payment status updated to "verified"
- Order status updated to "payment_verified"
- Verification timestamp recorded
