import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Produto from './produto.entity';
import { TipoProdutoInterface } from '../interfaces/tipoProdutoInterface';
import { TipoProdutoTypes } from '../types/tipoProdutoTypes';

@Entity({ name: 'tipoprodutos' })
export default class TipoProduto implements TipoProdutoInterface {

  @PrimaryGeneratedColumn()
  idTipoProduto: number

  @Column({ length: 35 })
  nome: string

  @Column()
  tipo: TipoProdutoTypes;

  @OneToMany(() => Produto, (produto) => produto.tipoProduto)
  produtos: Produto[]

}