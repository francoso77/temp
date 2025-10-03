export interface NotificationInterface {
  id?: number;
  color: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  type: 'vendedor' | 'gerenciador' | 'produtor';
  details: any;
  read: boolean;
  idUsuario: number;
}
