export interface UserInterface {
  id?: string;
  name: string;
  email: string;
  password: string;
  whatsapp: string;
  isActive: boolean;
  tentativasLogin: number;
  resetToken: string;
  resetTokenExpires: Date;
  termsAccepted: boolean;
  termsAcceptedAt: Date;
  profilePicture: string;
}
export interface UserSectionInterface {
  id?: string;
  userId: string;
  token: string;
  isActive: boolean;
}