import { Column, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Cao from './cao.entity';
import { RacaInterface } from '../interfaces/racaInterface';

@Entity({ name: 'racas' })
export default class Raca implements RacaInterface {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  idRaca: string;

  @Column({ length: 35 })
  nome: string

  @OneToMany(() => Cao, (cao) => cao.raca)
  caes: Cao[]

}