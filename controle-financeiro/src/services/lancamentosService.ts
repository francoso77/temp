import { supabase } from "@/lib/supabaseClient";
import { Lancamento } from "@/types/Lancamento";

export const buscarLancamentos = async (user_id: string) => {
  const { data, error } = await supabase
    .from('lancamentos')
    .select('*')
    .eq('user_id', user_id)
    .order('data', { ascending: false });
  if (error) return [];
  return data;
};

export const salvarLancamento = async (lancamento: Lancamento) => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Usuário não autenticado ou erro ao obter usuário:", error);
    return;
  }

  const userId = user.id;

  if (lancamento.id) {
    return await supabase
      .from('lancamentos')
      .update({ ...lancamento, user_id: userId }) // garantir que user_id sempre esteja certo
      .eq('id', lancamento.id);
  } else {
    return await supabase
      .from('lancamentos')
      .insert({ ...lancamento, user_id: userId });
  }
};

export const excluirLancamento = async (id: string) => {
  return await supabase.from('lancamentos').delete().eq('id', id);
};
