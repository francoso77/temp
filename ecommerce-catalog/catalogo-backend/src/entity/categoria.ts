import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { CategoriaInterface } from '../interfaces/categoria';
import { User } from './sistema/user';

@Index(['idVendedor', 'nome'], { unique: true })
@Entity({ name: 'categorias' })
export default class Categoria implements CategoriaInterface {

  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ length: 80 })
  @Index()
  nome: string;

  @Column({})
  descricao: string;

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: "datetime" })
  dataCadastro: string

  @Column({ nullable: true })
  idVendedor: string

  @JoinColumn({ name: 'idVendedor' })
  @ManyToOne(() => User)
  vendedor: User

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

}