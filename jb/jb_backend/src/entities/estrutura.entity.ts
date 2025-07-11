import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EstruturaInterface } from '../interfaces/estruturaInterface';
import Produto from './produto.entity';
import DetalheEstrutura from './detalheEstrutura.entity';

@Entity({ name: 'estruturas' })
@Index('IDX_ESTRUTURA_PRODUTO', ['idProduto'])
export default class Estrutura implements EstruturaInterface {

  @PrimaryGeneratedColumn()
  idEstrutura: number

  @Column()
  idProduto: number

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto)
  produto: Produto

  @JoinColumn({ name: 'idEstrutura' })
  @OneToMany(() => DetalheEstrutura,
    detalheEstrutura => detalheEstrutura.estrutura, { cascade: true })
  detalheEstruturas: DetalheEstrutura[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}