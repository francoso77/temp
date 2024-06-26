import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UnidadeMedidaInterface } from '../interfaces/unidadeMedidaInteface';
import Produto from './produto.entity';

@Entity({ name: 'unidademedidas' })
export default class UnidadeMedida implements UnidadeMedidaInterface {

  @PrimaryGeneratedColumn()
  idUnidade: number

  @Column({ length: 2 })
  sigla: string

  @Column({ length: 35 })
  nome: string

  @OneToMany(() => Produto, (produto) => produto.unidadeMedida)
  produtos: Produto[]

}