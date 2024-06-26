import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Pessoa from './pessoa.entity';
import { EstoqueInterface } from '../interfaces/estoqueInterface';
import Produto from './produto.entity';
import Cor from './cor.entity';

@Entity({ name: 'estoques' })
export default class Estoque implements EstoqueInterface {

  @PrimaryGeneratedColumn()
  idEstoque: number

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto, (produto) => produto.estoques)
  produto: Produto

  @Column()
  idPessoa_Fornecedor: number

  @JoinColumn({ name: 'idPessoaFornecedor' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.fornecedorEstoques)
  fornecedor: Pessoa

  @Column({ type: 'float', precision: 2 })
  metro: number

  @Column()
  idCor: number;

  @JoinColumn({ name: 'idCor' })
  @ManyToOne(() => Cor, (cor) => cor.corEstoques)
  cor: Cor

}