import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { CompanyInterface } from '../interfaces/company';
import { User } from './sistema/user';

@Index(['name'], { unique: true })
@Entity({ name: 'companies' })
export default class Company implements CompanyInterface {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ length: 100 })
  name: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

  @Column({ nullable: true })
  userId: string

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User)
  user: User
}