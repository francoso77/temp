import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import Produto from './produto.entity';
import { DetalhePedidoInterface } from '../interfaces/pedidoInterface';
import { StatusPedidoItemTypes } from '../types/statusPedidoItemTypes';
import Pedido from './pedido.entity';

@Entity({ name: 'detalhepedidos' })
export default class DetalhePedido implements DetalhePedidoInterface {

  @PrimaryGeneratedColumn()
  idDetalhePedido: number;

  @PrimaryColumn()
  idPedido: number;

  @ManyToOne(() => Pedido, pedido => pedido.detalhesPedido)
  pedido: Pedido;

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto, (produto) => produto.pedidos)
  produto: Produto

  @Column({ type: 'float', precision: 2 })
  qtdPedida: number

  @Column({ type: 'float', precision: 2 })
  vrUnitario: number

  @Column({ type: 'float', precision: 2 })
  qtdAtendida: number

  @Column()
  statusItem: StatusPedidoItemTypes;
}
