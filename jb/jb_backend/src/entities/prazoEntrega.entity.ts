import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PrazoEntregaInterface } from '../interfaces/prazoEntregaInterface';
import Pedido from './pedido.entity';

@Entity({ name: 'prazoentregas' })
export default class PrazoEntrega implements PrazoEntregaInterface {

  @PrimaryGeneratedColumn()
  idPrazoEntrega: number

  @Column({ length: 35 })
  @Index()
  nome: string

  @Column({ length: 35 })
  dias: string

  @JoinColumn({ name: 'idPrazoEntrega' })
  @OneToMany(() => Pedido, (pedido) =>
    pedido.prazoEntrega, { cascade: true })
  pedidos: Pedido[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}