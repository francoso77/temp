import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TinInterface } from '../interfaces/tinInterface';
import PedidoMalharia from './pedidoMalharia.entity';
import DetalheTin from './detalheTin.entity';

@Entity({ name: 'tins' })
export default class Tin implements TinInterface {

  @PrimaryGeneratedColumn()
  idTinturaria: number

  @Column({ type: "datetime" })
  @Index()
  dataTinturaria: string;

  @Column()
  idPedido_malharia: number

  @JoinColumn({ name: 'idPedido_malharia' })
  @ManyToOne(() => PedidoMalharia)
  pedidoMalharia: PedidoMalharia

  @Column({ type: 'boolean', default: false })
  programado: boolean

  @Column({ type: 'boolean', default: false })
  finalizado: boolean

  @OneToMany(() => DetalheTin, (detalheTin) => detalheTin.tinturaria)
  detalheTins: DetalheTin[]

  // @JoinColumn({ name: 'idTinturaria' })
  // @OneToMany(() => DetalheTinturaria,
  //   DetalheTinturaria => DetalheTinturaria.tinturaria, { cascade: true })
  // detalheTinturarias: DetalheTinturaria[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}