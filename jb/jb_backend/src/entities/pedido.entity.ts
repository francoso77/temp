import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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
  dataPedido: string;

  @Column({ nullable: true, length: 60 })
  observacao: string

  @Column()
  idPrazoEntrega: number

  @JoinColumn({ name: 'idPrazoEntrega' })
  @ManyToOne(() => PrazoEntrega, (prazoEntrega) => prazoEntrega.pedidos)
  prazoEntrega: PrazoEntrega

  @Column()
  idPessoa_cliente: number

  @JoinColumn({ name: 'idPessoa_cliente' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.clientePedidos)
  cliente: Pessoa

  @Column()
  idPessoa_vendedor: number

  @JoinColumn({ name: 'idPessoa_vendedor' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.vendedorPedidos)
  vendedor: Pessoa

  @OneToMany(() => DetalhePedido, detalhePedido => detalhePedido.pedido)
  detalhesPedido: DetalhePedido[]

  @Column({ length: 1 })
  statusPedido: StatusPedidoType

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}