import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserInterface } from '../../interfaces/sistema/user';

@Entity({ name: 'users' })
export class User implements UserInterface {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ length: 50 })
  name: string

  @Column({ nullable: true, length: 255 })
  @Index({ unique: true })
  email: string

  @Column({ length: 25 })
  password: string

  @Column({ nullable: true })
  isActive: boolean

  @Column({ type: 'int', default: 0 })
  tentativasLogin: number

  @Column({ default: false })
  termsAccepted: boolean

  @CreateDateColumn({ name: 'termsAcceptedAt', type: 'timestamp' })
  termsAcceptedAt: Date

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: "timestamp", nullable: true })
  resetTokenExpires: Date;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}