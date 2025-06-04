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
  type: 'corrente' | 'poupanca' | 'investimento' | 'credito' | 'dinheiro' | 'outros'

  @Column({ type: 'float', precision: 2 })
  initialBalance: number;

  @Column()
  color: string;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}