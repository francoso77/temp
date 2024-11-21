import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import Estrutura from './estrutura.entity';
import Produto from './produto.entity';
import { DetalheEstruturaInterface } from '../interfaces/estruturaInterface';
import Cor from './cor.entity';

@Entity({ name: 'detalheestruturas' })
export default class DetalheEstrutura implements DetalheEstruturaInterface {

  @PrimaryGeneratedColumn()
  idDetalheEstrutura: number;

  @Column()
  idEstrutura: number;

  @JoinColumn({ name: 'idEstrutura' })
  @ManyToOne(() => Estrutura, estrutura => estrutura.detalheEstruturas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete'
  })
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

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}
