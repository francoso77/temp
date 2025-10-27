import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { PedidoInterface } from '../interfaces/pedido';
import Cliente from './cliente';
import { User } from './sistema/user';
import { StatusType } from '../interfaces/types/status';
import DetalhePedido from './detalhePedido';

@Entity({ name: 'pedidos' })
@Index('IDX_CLIENTE', ['idCliente'])
@Index('IDX_VENDEDOR', ['idVendedor'])
@Index('IDX_STATUS', ['status'])
@Index('IDX_STATUS_DATA', ['status', 'data'])
@Index('IDX_CLIENTE_STATUS', ['idCliente', 'status'])
export default class Pedido implements PedidoInterface {

  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @Column({ length: 9, unique: true })
  numeroPedido: string

  @Column({ type: "datetime" })
  @Index()
  data: string

  @Column({ nullable: true, length: 60 })
  observacoes: string

  @Column()
  idCliente: string

  @JoinColumn({ name: 'idCliente' })
  @ManyToOne(() => Cliente)
  cliente: Cliente

  @Column()
  idVendedor: string

  @JoinColumn({ name: 'idVendedor' })
  @ManyToOne(() => User)
  vendedor: User

  @Column({ type: 'float', scale: 2, default: 0 })
  total: number

  @Column({ type: 'float', scale: 2, default: 0 })
  desconto: number

  @Column({ type: 'float', scale: 2, default: 0 })
  totalDescontado: number

  @OneToMany(() => DetalhePedido,
    detalhePedido => detalhePedido.pedido, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete'
  })
  itens: DetalhePedido[]

  @Column({})
  status: StatusType

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}