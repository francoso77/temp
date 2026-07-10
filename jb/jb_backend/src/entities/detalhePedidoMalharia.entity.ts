import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import Produto from './produto.entity';
import { DetalhePedidoMalhariaInterface } from '../interfaces/pedidoMalhariaInterface';
import PedidoMalharia from './pedidoMalharia.entity';

@Entity({ name: 'detalhepedidomalharias' })
@Index('IDX_PEDIDO', ['idPedido'])
@Index('IDX_PRODUTO', ['idProduto'])
@Index('IDX_PEDIDO_PRODUTO', ['idPedido', 'idProduto'])
export default class DetalhePedidoMalharia implements DetalhePedidoMalhariaInterface {

  @PrimaryGeneratedColumn()
  idDetalhePedido: number

  @Column()
  idPedido: number

  @JoinColumn({ name: 'idPedido' })
  @ManyToOne(() => PedidoMalharia, pedido => pedido.detalhePedidoMalharias, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  pedidoMalharia: PedidoMalharia

  @Column()
  idProduto: number

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto)
  produto: Produto

  @Column({ type: 'float', precision: 4 })
  qtdPedida: number

  @Column({ type: 'float', precision: 4 })
  vrUnitario: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}
