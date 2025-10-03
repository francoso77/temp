// notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { NotificationInterface } from '../../interfaces/sistema/notificationInterface';
import { Usuario } from './usuario.entity';

@Entity('notifications')
export class Notification implements NotificationInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['warning', 'info', 'success'] })
  color: 'warning' | 'info' | 'success';

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ type: 'enum', enum: ['vendedor', 'gerenciador', 'produtor'] })
  type: 'vendedor' | 'gerenciador' | 'produtor';

  @Column({ default: false })
  read: boolean; // ✅ controle de leitura

  // ✅ Usar JSON para armazenar objetos/detalhes adicionais
  @Column({ type: 'json', nullable: true })
  details: any;

  @Column()
  idUsuario: number;

  @JoinColumn({ name: 'idUsuario' })
  @ManyToOne(() => Usuario)
  usuario: Usuario

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createdAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updatedAt: Date

}
