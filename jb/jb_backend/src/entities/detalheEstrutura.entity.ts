import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import Estrutura from './estrutura.entity';
import Produto from './produto.entity';
import { DetalheEstruturaInterface } from '../interfaces/estruturaInterface';
import Cor from './cor.entity';

@Entity({ name: 'detalheestruturas' })
export default class DetalheEstrutura implements DetalheEstruturaInterface {

  @PrimaryGeneratedColumn()
  idDetalheEstrutura: number;

  @PrimaryColumn()
  idEstrutura: number;

  @ManyToOne(() => Estrutura, estrutura => estrutura.detalheEstruturas)
  estrutura: Estrutura;

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto, (produto) => produto.estruturas)
  produto: Produto

  @Column()
  idCor: number;

  @JoinColumn({ name: 'idCor' })
  @ManyToOne(() => Cor, (cor) => cor.corDetalheEstruturas)
  cor: Cor

  @Column({ type: 'float', precision: 4 })
  qtd: number
}
