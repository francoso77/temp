import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EstoqueInterface } from '../interfaces/estoqueInterface';
import Pessoa from './pessoa.entity';
import Produto from './produto.entity';
import Cor from './cor.entity';

@Entity({ name: 'estoques' })
@Index('IDX_ESTOQUE_PRODUTO', ['idProduto'])
@Index('IDX_ESTOQUE_FORNECEDOR', ['idPessoa_fornecedor'])
@Index('IDX_ESTOQUE_COR', ['idCor'])
@Index('IDX_ESTOQUE_UNICO', ['idProduto', 'idCor', 'idPessoa_fornecedor'], { unique: true }) // opcional, se 1 estoque por combinação
export default class Estoque implements EstoqueInterface {

  @PrimaryGeneratedColumn()
  idEstoque: number

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto)
  produto: Produto

  @Column()
  idPessoa_fornecedor: number

  @JoinColumn({ name: 'idPessoa_fornecedor' })
  @ManyToOne(() => Pessoa)
  fornecedor: Pessoa

  @Column({ type: 'float', precision: 4 })
  qtd: number

  @Column({ nullable: true })
  idCor: number | null;

  @JoinColumn({ name: 'idCor' })
  @ManyToOne(() => Cor)
  cor: Cor

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}