import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PedidoInterface } from '../interfaces/pedidoInterface';
import { StatusPedidoType } from '../types/statusPedidoTypes';
import PrazoEntrega from './prazoEntrega.entity';
import DetalhePedido from './detalhePedido.entity';
import Pessoa from './pessoa.entity';

@Entity({ name: 'pedidos' })
export default class Pedido implements PedidoInterface {

  @PrimaryGeneratedColumn()
  idPedido: number

  @Column({ type: "datetime" })
  @Index()
  dataPedido: string

  @Column({ nullable: true, length: 60 })
  observacao: string

  @Column()
  idPrazoEntrega: number

  @JoinColumn({ name: 'idPrazoEntrega' })
  @ManyToOne(() => PrazoEntrega)
  prazoEntrega: PrazoEntrega

  @Column()
  idPessoa_cliente: number

  @JoinColumn({ name: 'idPessoa_cliente' })
  @ManyToOne(() => Pessoa)
  cliente: Pessoa

  @Column()
  idPessoa_vendedor: number

  @JoinColumn({ name: 'idPessoa_vendedor' })
  @ManyToOne(() => Pessoa)
  vendedor: Pessoa

  @JoinColumn({ name: 'idPedido' })
  @OneToMany(() => DetalhePedido,
    detalhePedido => detalhePedido.pedido, { cascade: true })
  detalhePedidos: DetalhePedido[]

  @Column({ length: 1 })
  statusPedido: StatusPedidoType

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}