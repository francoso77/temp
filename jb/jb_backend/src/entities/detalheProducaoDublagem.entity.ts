import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import ProducaoDublagem from './producaoDublagem.entity';
import { DetalheProducaoDublagemInterface } from '../interfaces/producaoDublagemInterface';
import Produto from './produto.entity';
import DetalhePeca from './detalhePeca.entity';

@Entity({ name: 'detalheproducaodublagens' })
export default class DetalheProducaoDublagem implements DetalheProducaoDublagemInterface {

  @PrimaryGeneratedColumn()
  idDetalheProducaoDublagem: number

  @Column()
  idDublagem: number

  @Column({ type: 'float', precision: 4 })
  metrosTotal: number

  @Column({ type: 'int', precision: 0 })
  pecasTotal: number

  @Column()
  idProduto: number

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto)
  produto: Produto

  @JoinColumn({ name: 'idDublagem' })
  @ManyToOne(() => ProducaoDublagem, producaoDublagem => producaoDublagem.detalheProducaoDublagens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  producaoDublagem: ProducaoDublagem

  @JoinColumn({ name: 'idDetalheProducaoDublagem' })
  @OneToMany(() => DetalhePeca,
    detalhePeca => detalhePeca.detalheProducaoDublagem, { cascade: true })
  detalhePecas: DetalhePeca[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}
