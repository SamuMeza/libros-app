import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOrder, getClientOrders, getClientOrderDetail } from '@/lib/actions/orders';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('orders server actions (TDD)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should fail when user is not authenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('No session') }),
        },
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const result = await createOrder({
        shipping_address: {
          full_name: 'Ana García',
          cedula: 'V-19876543',
          phone: '04121234567',
          state: 'Miranda',
          city: 'Los Teques',
          address: 'Calle Real Casa 5',
          reference: 'Frente al parque',
        },
        shipping_method: 'mrw',
        payment_method: 'pago_movil',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('iniciar sesión');
    });

    it('should fail when cart is empty', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'usr-123' } }, error: null }),
        },
        from: vi.fn((table: string) => {
          if (table === 'cart_items') {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockResolvedValue({ data: [], error: null }),
            };
          }
          return {};
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

      const result = await createOrder({
        shipping_address: {
          full_name: 'Ana García',
          cedula: 'V-19876543',
          phone: '04121234567',
          state: 'Miranda',
          city: 'Los Teques',
          address: 'Calle Real Casa 5',
          reference: 'Frente al parque',
        },
        shipping_method: 'mrw',
        payment_method: 'pago_movil',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('carrito');
    });
  });
});
