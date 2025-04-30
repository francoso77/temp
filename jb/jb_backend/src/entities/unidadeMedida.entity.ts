import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UnidadeMedidaInterface } from '../interfaces/unidadeMedidaInteface';
import Produto from './produto.entity';

@Entity({ name: 'unidademedidas' })
export default class UnidadeMedida implements UnidadeMedidaInterface {

  @PrimaryGeneratedColumn()
  idUnidade: number

  @Column({ length: 2 })
  @Index({ unique: true })
  sigla: string

  @Column({ length: 35 })
  @Index({ unique: true })
  nome: string

  @JoinColumn({ name: 'idUnidade' })
  @OneToMany(() => Produto, (produto) =>
    produto.unidadeMedida, { cascade: true })
  produtos: Produto[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}