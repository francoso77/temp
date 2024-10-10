import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import DetalheProducaoDublagem from './detalheProducaoDublagem.entity';
import { ProducaoDublagemInterface } from '../interfaces/producaoDublagemInterface';
import { TipoColagemType } from '../types/tipoColagemTypes';
import Pedido from './pedido.entity';

@Entity({ name: 'producaodublagens' })
export default class ProducaoDublagem implements ProducaoDublagemInterface {

  @PrimaryGeneratedColumn()
  idDublagem: number

  @Column({ type: "datetime" })
  dataProducao: string;

  @Column()
  tipoColagem: TipoColagemType;

  @Column()
  idPedido: number;

  @JoinColumn({ name: 'idPedido' })
  @ManyToOne(() => Pedido)
  pedido: Pedido

  @JoinColumn({ name: 'idDublagem' })
  @OneToMany(() => DetalheProducaoDublagem,
    detalheProducaoDublagem => detalheProducaoDublagem.producaoDublagem, { cascade: true })
  detalheProducaoDublagens: DetalheProducaoDublagem[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAD: Date
}