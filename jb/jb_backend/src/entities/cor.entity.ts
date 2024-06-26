import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CorInterface } from '../interfaces/corInteface';
import DetalheEntrada from './detalheEntrada.entity';
import Estoque from './estoque.entity';
import DetalheEstrutura from './detalheEstrutura.entity';
import DetalheProgramacao from './detalheProgramacao.entity';

@Entity({ name: 'cores' })
export default class Cor implements CorInterface {

  @PrimaryGeneratedColumn()
  idCor: number

  @Column({ length: 35 })
  nome: string

  @OneToMany(() => DetalheEntrada, (detalheEntrada) => detalheEntrada.cor)
  corDetalheEntradas: DetalheEntrada[]

  @OneToMany(() => DetalheEstrutura, (detalheEstrutura) => detalheEstrutura.cor)
  corDetalheEstruturas: DetalheEstrutura[]

  @OneToMany(() => DetalheProgramacao, (detalheProgramacao) => detalheProgramacao.cor)
  corDetalheProgramacoes: DetalheProgramacao[]

  @OneToMany(() => Estoque, (estoque) => estoque.cor)
  corEstoques: Estoque[]
}