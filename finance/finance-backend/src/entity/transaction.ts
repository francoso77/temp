import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { TransactionInterface } from '../interfaces/transaction';
import Category from './category';
import Account from './account';
import Company from './company';

@Index(['date', 'description'])
@Entity({ name: 'transactions' })
export default class Transaction implements TransactionInterface {

  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ length: 100 })
  description: string;

  @Column({ type: 'float', precision: 3 })
  amount: number;

  @Column()
  type: 'Receita' | 'Despesa';

  @Column()
  setor: 'Dublagem' | 'Malharia';

  @Column()
  categoryId: string;

  @JoinColumn({ name: 'categoryId' })
  @ManyToOne(() => Category)
  categoria: Category

  @Column()
  accountId: string;

  @JoinColumn({ name: 'accountId' })
  @ManyToOne(() => Account)
  account: Account

  @Column()
  companyId: string;

  @JoinColumn({ name: 'companyId' })
  @ManyToOne(() => Company)
  company: Company

  @Column({ type: "datetime" })
  date: string

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}