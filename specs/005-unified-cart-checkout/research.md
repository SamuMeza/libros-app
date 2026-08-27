# Research: Carrito Unificado y Checkout

**Date**: 2026-08-27

## Decision 1: Persistencia del Carrito

**Decision**: Zustand + Supabase (hybrid approach)

**Rationale**: Zustand provides instant UI updates for quantity changes (sub-100ms requirement). Supabase persists cart for authenticated users across sessions. Sync on mount and after mutations.

**Alternatives considered**:
- Supabase only: Too slow for real-time calculations, network latency on every quantity change
- localStorage only: Not persistent across devices, lost on logout
- React Context: No persistence, lost on refresh

## Decision 2: Checkout State Management

**Decision**: URL-based state with search params (`/checkout?step=1`)

**Rationale**: Allows browser back/forward navigation, shareable links, and server-side rendering of each step. Zustand for form data between steps.

**Alternatives considered**:
- Single page with conditional rendering: No URL persistence, harder to debug
- Multi-page navigation: More complex routing, loses form state
- React Context: Lost on refresh, no URL persistence

## Decision 3: Order Number Generation

**Decision**: Database sequence with format `{BRANDS}-YYYY-NNNN`

**Rationale**: Sequential numbers are predictable for customers and admins. Supabase can use a database function to generate unique sequential numbers per year.

**Alternatives considered**:
- UUID: Not human-readable, hard to communicate
- Random numbers: Not sequential, harder to track
- Auto-increment: No year context, resets are confusing

## Decision 4: Shipping Cost Calculation

**Decision**: Weight-based with predefined rates per shipping company

**Rationale**: MRW and Zoom have weight-based tariff tables. Store rates in a configuration object (admin-configurable). Calculate total weight from cart items.

**Alternatives considered**:
- Flat rate: Less accurate for different product sizes
- Zone-based: More complex, requires address validation
- Free shipping: Only for orders above threshold (can be added later)

## Decision 5: Payment Plan Calculation

**Decision**: Admin-configurable installment amounts

**Rationale**: Admin sets total amount per installment based on order total. System divides equally and generates schedule with fortnightly dates (every 15 days from order creation).

**Alternatives considered**:
- Equal division: Less flexible for admin
- Interest-based: More complex, requires financial calculations
- Fixed schedule: Less adaptable to different order sizes

## Decision 6: File Upload Strategy

**Decision**: Cloudinary via Server Action with 5MB limit

**Rationale**: Cloudinary handles image optimization and storage. Server Action validates file type and size before upload. Store URL in payments table.

**Alternatives considered**:
- Supabase Storage: Less image optimization, more manual configuration
- Local storage: Not scalable, security concerns
- Direct upload: Bypasses server validation

## Decision 7: Exchange Rate Source

**Decision**: Admin-configurable fixed rate

**Rationale**: Simple to implement and maintain. Admin updates rate in panel when needed. No external API dependencies or rate limits.

**Alternatives considered**:
- External API: More automation, but adds complexity and failure points
- Manual calculation: Error-prone, not scalable
- Fixed rate with auto-update: More complex, requires API integration
