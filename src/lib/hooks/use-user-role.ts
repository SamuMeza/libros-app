'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AdminRole } from '@/types/admin';

interface UseUserRoleReturn {
  role: AdminRole | null;
  isLoading: boolean;
  error: string | null;
}

export default function useUserRole(): UseUserRoleReturn {
  const [role, setRole] = useState<AdminRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setError('No autenticado');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          setError('Perfil no encontrado');
          return;
        }

        setRole(profile.role as AdminRole);
      } catch {
        setError('Error al obtener rol');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return { role, isLoading, error };
}
