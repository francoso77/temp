/* eslint-disable */
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function useUser() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return { user };
}
