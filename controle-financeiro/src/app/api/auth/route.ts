import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, senha } = await request.json();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    return NextResponse.json({ erro: 'Credenciais inválidas' }, { status: 401 });
  }

  return NextResponse.json({ sucesso: true });
}
