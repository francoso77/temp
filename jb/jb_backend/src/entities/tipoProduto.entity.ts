import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Produto from './produto.entity';
import { TipoProdutoInterface } from '../interfaces/tipoProdutoInterface';

@Entity({ name: 'tipoprodutos' })
export default class TipoProduto implements TipoProdutoInterface {

  @PrimaryGeneratedColumn()
  idTipoProduto: number

  @Column({ length: 35 })
  nome: string

  @Column()
  estrutura: boolean

  @OneToMany(() => Produto, (produto) => produto.tipoProduto)
  produtos: Produto[]

}