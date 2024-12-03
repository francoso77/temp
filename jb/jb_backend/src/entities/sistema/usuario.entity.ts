import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioInterface } from '../../interfaces/sistema/usuarioInterface';
import { UsuarioType } from '../../types/usuarioTypes';

@Entity({ name: 'usuarios' })
export class Usuario implements UsuarioInterface {
  @PrimaryGeneratedColumn()
  idUsuario: number

  @Column({ length: 50 })
  nome: string

  @Column({ length: 14 })
  cpf: string

  @Column({ nullable: true, length: 255 })
  @Index({ unique: true })
  email: string

  @Column({ length: 25 })
  senha: string

  @Column({ nullable: true })
  ativo: boolean

  @Column({ type: 'int', default: 0 })
  tentativasLogin: number

  @Column({ type: 'int', default: 0 })
  tipoUsuario: UsuarioType

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: "timestamp", nullable: true })
  resetTokenExpires: Date;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}