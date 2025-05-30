import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { CategoryInterface } from '../interfaces/category';

@Entity({ name: 'categorys' })
export default class Category implements CategoryInterface {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ length: 80 })
  @Index()
  name: string;

  @Column()
  type: 'Receita' | 'Despesa';

  @Column()
  color: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}