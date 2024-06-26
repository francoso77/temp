import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EstruturaInterface } from '../interfaces/estruturaInterface';
import Produto from './produto.entity';
import DetalheEstrutura from './detalheEstrutura.entity';

@Entity({ name: 'estruturas' })
export default class Estrutura implements EstruturaInterface {

  @PrimaryGeneratedColumn()
  idEstrutura: number

  @Column({ length: 2 })
  unidade: string

  @Column({ type: 'float', precision: 2 })
  qtdBase: number

  @Column()
  idProduto: number

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto, (produto) => produto.estruturas)
  produto: Produto

  @OneToMany(() => DetalheEstrutura, detalheEstrutura => detalheEstrutura.estrutura)
  detalheEstruturas: DetalheEstrutura[];
}