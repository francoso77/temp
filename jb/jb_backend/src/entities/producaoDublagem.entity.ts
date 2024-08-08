import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import DetalheProducaoDublagem from './detalheProducaoDublagem.entity';
import { ProducaoDublagemInterface } from '../interfaces/producaoDublagemInterface';
import { TipoColagemType } from '../types/tipoColagemTypes';

@Entity({ name: 'producaodublagens' })
export default class ProducaoDublagem implements ProducaoDublagemInterface {

  @PrimaryGeneratedColumn()
  idDublagem: number

  @Column({ type: "datetime" })
  dataProducao: string;

  @Column()
  tipoColagem: TipoColagemType;

  @Column({ type: 'float', precision: 4 })
  qtdColagem: number

  @OneToMany(() => DetalheProducaoDublagem, detalheProducaoDublagem => detalheProducaoDublagem.ProducaoDublagem)
  detalheProducaoDublagens: DetalheProducaoDublagem[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}