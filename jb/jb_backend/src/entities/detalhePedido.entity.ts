import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import Produto from './produto.entity';
import { DetalhePedidoInterface } from '../interfaces/pedidoInterface';
import Pedido from './pedido.entity';
import Cor from './cor.entity';
import { StatusPedidoItemType } from '../types/statusPedidoItemTypes';

@Entity({ name: 'detalhepedidos' })
@Index('IDX_PEDIDO', ['idPedido'])
@Index('IDX_PRODUTO', ['idProduto'])
@Index('IDX_COR', ['idCor'])
@Index('IDX_STATUS_ITEM', ['statusItem'])
@Index('IDX_PEDIDO_PRODUTO', ['idPedido', 'idProduto'])
@Index('IDX_PRODUTO_STATUS', ['idProduto', 'statusItem'])
export default class DetalhePedido implements DetalhePedidoInterface {

  @PrimaryGeneratedColumn()
  idDetalhePedido: number

  @Column()
  idPedido: number

  @JoinColumn({ name: 'idPedido' })
  @ManyToOne(() => Pedido, pedido => pedido.detalhePedidos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  pedido: Pedido

  @Column()
  idProduto: number

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto)
  produto: Produto

  @Column({ nullable: true })
  idCor: number | null

  @JoinColumn({ name: 'idCor' })
  @ManyToOne(() => Cor)
  cor: Cor

  @Column({ type: 'float', precision: 4 })
  qtdPedida: number

  @Column({ type: 'float', precision: 4 })
  vrUnitario: number

  @Column({ type: 'float', precision: 4 })
  qtdAtendida: number

  @Column()
  statusItem: StatusPedidoItemType

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}
