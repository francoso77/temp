import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MaquinaInterface } from '../interfaces/maquinaInterface';
import ProducaoMalharia from './producaoMalharia.entity';

@Entity({ name: 'maquinas' })
export default class Maquina implements MaquinaInterface {

  @PrimaryGeneratedColumn()
  idMaquina: number

  @Column({ length: 35 })
  nome: string

  @Column({ length: 15 })
  marca: string

  @Column({ length: 15 })
  tipoTear: string

  @Column({ nullable: false })
  kitElastano: boolean

  @Column({ length: 15 })
  modelo: string

  @Column({ length: 15 })
  serie: string

  @Column()
  qtdAgulhas: number

  @Column()
  qtdAlimentadores: number

  @Column()
  diametro: number

  @Column()
  espessura: number

  @Column({ length: 15 })
  platina: string

  @Column({ length: 15 })
  correia: string

  @Column({ length: 15 })
  agulha: string

  @Column({ type: "datetime" })
  dataPreventiva: string;

  @Column({ nullable: false })
  ativo: boolean

  @OneToMany(() => ProducaoMalharia, (producaoMalharia) => producaoMalharia.maquina)
  ProducaoMalharias: ProducaoMalharia[]
}