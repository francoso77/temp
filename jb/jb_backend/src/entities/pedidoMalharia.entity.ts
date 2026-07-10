import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Pessoa from './pessoa.entity';
import { StatusType } from '../types/statusTypes';
import { DetalhePedidoMalhariaInterface, PedidoMalhariaInterface } from '../interfaces/pedidoMalhariaInterface';
import DetalhePedidoMalharia from './detalhePedidoMalharia.entity';

@Entity({ name: 'pedidomalharias' })
@Index('IDX_CLIENTE', ['idPessoa_cliente'])
@Index('IDX_FORNECEDOR', ['idPessoa_fornecedor'])
@Index('IDX_STATUS', ['statusPedido'])
@Index('IDX_STATUS_DATA', ['statusPedido', 'dataPedido'])
@Index('IDX_CLIENTE_STATUS', ['idPessoa_cliente', 'statusPedido'])
export default class PedidoMalharia implements PedidoMalhariaInterface {
  @PrimaryGeneratedColumn()
  idPedido: number

  @Column({ type: "datetime" })
  @Index()
  dataPedido: string

  @Column({ nullable: true, length: 60 })
  observacao: string

  @Column()
  idPessoa_cliente: number

  @JoinColumn({ name: 'idPessoa_cliente' })
  @ManyToOne(() => Pessoa)
  cliente: Pessoa

  @Column()
  idPessoa_fornecedor: number

  @JoinColumn({ name: 'idPessoa_fornecedor' })
  @ManyToOne(() => Pessoa)
  fornecedor: Pessoa

  @JoinColumn({ name: 'idPedido' })
  @OneToMany(() => DetalhePedidoMalharia,
    detalhePedido => detalhePedido.pedidoMalharia, { cascade: true })
  detalhePedidoMalharias: DetalhePedidoMalhariaInterface[]

  @Column({})
  statusPedido: StatusType

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}