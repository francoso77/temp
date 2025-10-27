import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index, PrimaryColumn } from 'typeorm';
import { DetalhePedidoInterface } from '../interfaces/pedido';
import Pedido from './pedido';
import Produto from './produto';


@Entity({ name: 'detalhepedidos' })
@Index('IDX_PEDIDO', ['idPedido'])
@Index('IDX_PRODUTO', ['idProduto'])
@Index('IDX_PEDIDO_PRODUTO', ['idPedido', 'idProduto'])
export default class DetalhePedido implements DetalhePedidoInterface {

  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column()
  idPedido: string

  @ManyToOne(() => Pedido, pedido => pedido.itens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'idPedido' })
  pedido: Pedido

  @Column()
  idProduto: string

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto)
  produto: Produto

  @Column({ type: 'float', scale: 2 })
  quantidade: number

  @Column({ type: 'float', scale: 2, default: 0 })
  preco: number

  @Column({ type: 'float', scale: 2, default: 0 })
  subtotal: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}
