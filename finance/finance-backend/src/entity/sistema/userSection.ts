import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user';
import { UserSectionInterface } from '../../interfaces/sistema/user';

@Entity({ name: 'usersectons' })
export class UserSection implements UserSectionInterface {

  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User)
  @Column()
  userId: string;

  @Column()
  token: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date;

}