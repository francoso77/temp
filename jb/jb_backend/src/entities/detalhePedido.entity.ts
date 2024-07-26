import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import Produto from './produto.entity';
import { DetalhePedidoInterface } from '../interfaces/pedidoInterface';
import { StatusPedidoItemType } from '../types/statusPedidoItemTypes';
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

  @Column({ type: 'float', precision: 4 })
  qtdPedida: number

  @Column({ type: 'float', precision: 4 })
  vrUnitario: number

  @Column({ type: 'float', precision: 4 })
  qtdAtendida: number

  @Column()
  statusItem: StatusPedidoItemType;
}
