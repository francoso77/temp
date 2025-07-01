import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { AccountInterface } from '../interfaces/account';
import { User } from './sistema/user';

@Index(['name'])
@Entity('accounts')
export default class Account implements AccountInterface {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column()
  type: 'corrente' | 'poupanca' | 'investimento' | 'credito' | 'dinheiro' | 'outros'

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  initialBalance: number;

  @Column()
  color: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

  @Column({ nullable: false })
  userId: string

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User)
  user: User
}