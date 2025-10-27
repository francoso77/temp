import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { User } from './sistema/user';
import { ProdutoInterface } from '../interfaces/produto';
import Categoria from './categoria';


@Index(['nome', 'descricao'])
@Entity({ name: 'produtos' })
export default class Produto implements ProdutoInterface {

  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ length: 100 })
  nome: string;

  @Column({})
  descricao: string;

  @Column({})
  caracteristicas: string;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  preco: number

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  desconto: number;

  @Column({ nullable: true, length: 255 })
  imagem: string;

  @Column({ default: true })
  ativo: boolean

  @Column({ default: false })
  promocao: boolean;

  @Column({ type: 'int', default: 0 })
  maisVendido: number;

  @Column()
  idCategoria: string;

  @JoinColumn({ name: 'idCategoria' })
  @ManyToOne(() => Categoria)
  categoria: Categoria

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