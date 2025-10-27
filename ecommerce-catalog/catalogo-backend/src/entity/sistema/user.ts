import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserInterface } from '../../interfaces/sistema/user';
import * as bcrypt from 'bcrypt';
import { Length } from 'class-validator';

@Entity({ name: 'users' })
export class User implements UserInterface {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ length: 100 })
  nome: string

  @Column({ nullable: true, length: 255 })
  @Index({ unique: true })
  email: string

  @Column({ length: 255 })
  password: string

  @Column({ length: 15, nullable: true, })
  whatsapp: string

  @Column()
  @Index()
  @Length(14, 18, { message: 'O campo doc deve ter entre 14 e 18 caracteres.' })
  cnpj: string;

  @Column({ nullable: true })
  isActive: boolean

  @Column({ type: 'int', default: 0 })
  tentativasLogin: number

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: "timestamp", nullable: true })
  resetTokenExpires: Date;


  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

  // Hash automático da senha antes de inserir ou atualizar
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password) return;

    // Evita re-hash se a senha já está com hash (bcrypt sempre começa com $2)
    if (this.password.startsWith('$2')) return;

    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }


}