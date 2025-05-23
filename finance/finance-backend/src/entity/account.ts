import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { AccountInterface } from '../interfaces/account';

@Index(['name'])
@Entity('accounts')
export default class Account implements AccountInterface {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column()
  name: string;

  @Column()
  type: 'checking' | 'savings' | 'investment' | 'credit' | 'cash' | 'other'

  @Column({ type: 'float', precision: 3 })
  initialBalance: number;

  @Column()
  currency: string;

  @Column()
  color: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}