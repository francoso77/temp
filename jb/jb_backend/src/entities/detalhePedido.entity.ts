import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import Produto from './produto.entity';
import { DetalhePedidoInterface } from '../interfaces/pedidoInterface';
import { StatusPedidoItemType } from '../types/statusPedidoItemTypes';
import Pedido from './pedido.entity';

@Entity({ name: 'detalhepedidos' })
export default class DetalhePedido implements DetalhePedidoInterface {

  @PrimaryGeneratedColumn()
  idDetalhePedido: number;

  @Column()
  idPedido: number;

  @JoinColumn({ name: 'idPedido' })
  @ManyToOne(() => Pedido, pedido => pedido.detalhePedidos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  pedido: Pedido;

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto)
  produto: Produto

  @Column({ type: 'float', precision: 4 })
  qtdPedida: number

  @Column({ type: 'float', precision: 4 })
  vrUnitario: number

  @Column({ type: 'float', precision: 4 })
  qtdAtendida: number

  @Column()
  statusItem: StatusPedidoItemType

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}
