import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioInterface } from '../../interfaces/sistema/usuarioInterface';

@Entity({ name: 'usuarios' })
export class Usuario implements UsuarioInterface {
  @PrimaryGeneratedColumn()
  idUsuario: number

  @Column({ length: 50 })
  nome: string

  @Column({ length: 14 })
  cpf: string

  @Column({ length: 25 })
  senha: string

  @Column({ nullable: true })
  ativo: boolean

  @Column({ type: 'int', default: 0 })
  tentativasLogin: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}