import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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

  @JoinColumn({ name: 'idUnidade' })
  @OneToMany(() => Produto, (produto) =>
    produto.unidadeMedida, { cascade: true })
  produtos: Produto[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}