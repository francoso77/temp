import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const createTableIfNotExists = async () => {
      const { data: tables } = await supabase.rpc('pg_get_user_tables');
      const exists = tables?.some((t: any) => t === 'lancamentos');
      if (!exists) {
        await supabase.rpc('sql', {
          query: `
            create table if not exists lancamentos (
              id uuid primary key default uuid_generate_v4(),
              descricao text,
              tipo text,
              valor numeric,
              categoria text,
              data timestamp,
              user_id uuid references auth.users(id)
            );
          `
        });
      }
    };
    createTableIfNotExists();
  }, []);

  return <Component {...pageProps} />;
}
