import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { User } from './sistema/user';
import { SectorInterface } from '../interfaces/sector';

@Index(['name'], { unique: true })
@Entity({ name: 'sectors' })
export default class Sector implements SectorInterface {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ length: 60 })
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