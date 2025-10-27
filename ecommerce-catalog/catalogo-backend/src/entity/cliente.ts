import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Length } from 'class-validator';
import { ClienteInterface } from '../interfaces/cliente';
import { User } from './sistema/user';

@Index(['email', 'nome', 'cnpj', 'telefone'], { unique: true })
@Entity({ name: 'clientes' })
export default class Cliente implements ClienteInterface {
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ length: 100, nullable: false })
  nome: string;

  @Column()
  @Index()
  @Length(14, 18, { message: 'O campo doc deve ter entre 14 e 18 caracteres.' })
  cnpj: string;

  @Column({ nullable: false, length: 15 })
  @Index()
  telefone: string

  @Column({ nullable: false, length: 255 })
  @Index()
  email: string

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: "datetime" })
  dataCadastro: string

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

  @Column({ nullable: false })
  idVendedor: string

  @JoinColumn({ name: 'idVendedor' })
  @ManyToOne(() => User)
  vendedor: User
}