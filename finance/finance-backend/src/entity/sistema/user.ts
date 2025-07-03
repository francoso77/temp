import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserInterface } from '../../interfaces/sistema/user';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
export class User implements UserInterface {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ length: 50 })
  name: string

  @Column({ nullable: true, length: 255 })
  @Index({ unique: true })
  email: string

  @Column({ length: 255 })
  password: string

  @Column({ length: 15, nullable: true, })
  whatsapp: string

  @Column({ nullable: true })
  isActive: boolean

  @Column({ type: 'int', default: 0 })
  tentativasLogin: number

  @Column({ default: false })
  termsAccepted: boolean

  @CreateDateColumn({ name: 'termsAcceptedAt', type: 'timestamp' })
  termsAcceptedAt: Date

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: "timestamp", nullable: true })
  resetTokenExpires: Date;

  @Column({ nullable: true, length: 255 })
  profilePicture: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

  // Hash automático da senha antes de inserir ou atualizar
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

}