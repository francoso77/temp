import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PisoTypes } from '../types/PisoTypes';
import Inscricao from './inscricao.entity';
import Campeonato from './campeonato.entity';
import { ProvaInterface } from '../interfaces/provaInterface';
import { StatusProvaType } from '../types/ProvaTypes';

@Entity({ name: 'provas' })
export default class Prova implements ProvaInterface {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  idProva: string;

  @Column({ length: 60 })
  nomeProva: string

  @Column({ length: 100 })
  endereco: string

  @Column()
  numero: number

  @Column({ length: 60 })
  bairro: string

  @Column({ length: 60 })
  cidade: string

  @Column({ length: 2 })
  uf: string

  @Column({ length: 10 })
  cep: string

  @Column({ length: 10 })
  lat: string

  @Column({ length: 10 })
  long: string

  @Column({ type: 'varchar', length: 10 })
  tipoPiso: PisoTypes

  @Column({ type: 'timestamp' })
  dataHoraProva: Date;

  @Column({ type: 'float', precision: 2 })
  valorProva: number

  @Column({ type: 'float', precision: 2, scale: 2 })
  valorProvaAte12: number

  @Column({
    length: 15,
    nullable: true,
  })
  telefone: string

  @Column({
    length: 15,
    nullable: true,
  })
  whatsapp: string

  @Column({
    length: 255,
    nullable: true,
  })
  email: string

  @Column({ type: "text" })
  termoAceite: string;

  @Column({ length: 2 })
  status: StatusProvaType;

  @Column({ default: false })
  foto: boolean;

  @OneToMany(() => Inscricao, (inscricao) => inscricao.prova)
  inscricoes: Inscricao[]

  @Column({ length: 36, nullable: true })
  idCampeonato: string | null

  @JoinColumn({ name: 'idCampeonato' })
  @ManyToOne(() => Campeonato, (campeonato) => campeonato.provas)
  campeonato: Campeonato
}