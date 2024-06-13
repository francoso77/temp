import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Prova from './prova.entity';
import { CampeonatoInterface } from '../interfaces/campeonatoInterface';

@Entity({ name: 'campeonatos' })
export default class Campeonato implements CampeonatoInterface {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  idCampeonato: string;

  @Column({ length: 35 })
  nome: string

  @Column({ nullable: true })
  ativo: boolean

  @OneToMany(() => Prova, (prova) => prova.campeonato)
  provas: Prova[]
}