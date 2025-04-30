import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EstruturaInterface } from '../interfaces/estruturaInterface';
import Produto from './produto.entity';
import DetalheEstrutura from './detalheEstrutura.entity';
import UnidadeMedida from './unidadeMedida.entity';

@Entity({ name: 'estruturas' })
export default class Estrutura implements EstruturaInterface {

  @PrimaryGeneratedColumn()
  idEstrutura: number

  @Column()
  idUnidade: number

  @JoinColumn({ name: 'idUnidade' })
  @ManyToOne(() => UnidadeMedida)
  unidadeMedida: UnidadeMedida

  @Column({ type: 'float', precision: 2 })
  qtdBase: number

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