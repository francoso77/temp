import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { CompanyInterface } from '../interfaces/company';

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
}