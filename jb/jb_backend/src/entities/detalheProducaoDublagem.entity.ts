import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import ProducaoDublagem from './producaoDublagem.entity';
import Produto from './produto.entity';
import { DetalheProducaoDublagemInterface } from '../interfaces/producaoDublagemInterface';

@Entity({ name: 'detalheproducaodublagens' })
export default class DetalheProducaoDublagem implements DetalheProducaoDublagemInterface {

  @PrimaryGeneratedColumn()
  idDetalheProducaoDublagem: number;

  @PrimaryColumn()
  idProducaoDublagem: number;

  @ManyToOne(() => ProducaoDublagem)
  ProducaoDublagem: ProducaoDublagem;

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto)
  produto: Produto

  @Column({ type: 'float', precision: 4 })
  metro: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}
