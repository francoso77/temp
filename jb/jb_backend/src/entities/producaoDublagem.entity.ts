import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import DetalheProducaoDublagem from './detalheProducaoDublagem.entity';
import { ProducaoDublagemInterface } from '../interfaces/producaoDublagemInterface';
import { TipoColagemTypes } from '../types/tipoColagemTypes';

@Entity({ name: 'producaodublagens' })
export default class ProducaoDublagem implements ProducaoDublagemInterface {

  @PrimaryGeneratedColumn()
  idDublagem: number

  @Column({ type: "datetime" })
  dataProducao: string;

  @Column()
  tipoColagem: TipoColagemTypes;

  @Column({ type: 'float', precision: 2 })
  qtdColagem: number

  @OneToMany(() => DetalheProducaoDublagem, detalheProducaoDublagem => detalheProducaoDublagem.ProducaoDublagem)
  detalheProducaoDublagens: DetalheProducaoDublagem[];
}