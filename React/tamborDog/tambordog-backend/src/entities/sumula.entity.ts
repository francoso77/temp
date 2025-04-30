import { Column, Entity, Generated, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Inscricao from './inscricao.entity';
import { SumulaTypes } from '../types/SumulaTypes';
import { SumulaInterface } from '../interfaces/sumulaInterface';

@Entity({ name: 'sumulas' })
export default class Sumula implements SumulaInterface {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  idSumula: string;

  @Column({ length: 36 })
  idInscricao: string

  @OneToOne(() => Inscricao, inscricao => inscricao.sumula)
  inscricao: Inscricao;

  @Column({ type: 'timestamp' })
  tempoPista: Date

  @Column({ type: 'timestamp' })
  penalidade: Date

  @Column({ type: 'timestamp' })
  classificacao: Date

  @Column({ type: 'datetime' })
  dataHoraApuracao: Date

  @Column({ type: 'int' })
  ordemEntrada: number

  @Column({ type: 'enum', enum: SumulaTypes })
  statusSumula: SumulaTypes
}