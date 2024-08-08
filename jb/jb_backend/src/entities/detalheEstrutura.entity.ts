import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @JoinColumn({ name: 'idEstrutura' })
  @ManyToOne(() => Estrutura, estrutura => estrutura.detalheEstruturas)
  estrutura: Estrutura;

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto)
  produto: Produto

  @Column({ nullable: true })
  idCor: number;

  @JoinColumn({ name: 'idCor' })
  @ManyToOne(() => Cor)
  cor: Cor

  @Column({ type: 'float', precision: 4 })
  qtd: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}
