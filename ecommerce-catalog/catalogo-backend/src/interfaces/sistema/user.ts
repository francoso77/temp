export interface UserInterface {
  id?: string;
  nome: string;
  email: string;
  cnpj: string;
  password: string;
  whatsapp: string;
  isActive: boolean;
  tentativasLogin: number;
  resetToken: string;
  resetTokenExpires: Date;
}
export interface UserSectionInterface {
  id?: string;
  userId: string;
  token: string;
  isActive: boolean;
}