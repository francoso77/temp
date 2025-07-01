import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { TransactionInterface } from '../interfaces/transaction';
import Category from './category';
import Account from './account';
import Company from './company';
import { User } from './sistema/user';
import Sector from './sector';

@Index(['date', 'description'])
@Entity({ name: 'transactions' })
export default class Transaction implements TransactionInterface {

  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ length: 100 })
  description: string;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  qtd: number;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  price: number

  @Column()
  sectorId: string;

  @JoinColumn({ name: 'sectorId' })
  @ManyToOne(() => Sector)
  sector: Sector

  @Column()
  categoryId: string;

  @JoinColumn({ name: 'categoryId' })
  @ManyToOne(() => Category)
  category: Category

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

  @Column({ nullable: false })
  userId: string

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User)
  user: User
}