import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DetalheProgramacaoDublagemInterface } from '../interfaces/programacaoDublagemInterface';
import Pedido from './pedido.entity';
import ProgramacaoDublagem from './programacaoDublagem.entity';

@Entity({ name: 'detalheprogramacaodublagens' })
export default class DetalheProgramacaoDublagem implements DetalheProgramacaoDublagemInterface {

  @PrimaryGeneratedColumn()
  idDetalheProgramacaoDublagem: number

  @Column()
  idProgramacaoDublagem: number

  @JoinColumn({ name: 'idProgramacaoDublagem' })
  @ManyToOne(() => ProgramacaoDublagem, programacaoDublagem => programacaoDublagem.detalheProgramacaoDublagens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  programacaoDublagem: ProgramacaoDublagem

  @Column()
  idPedido: number

  @JoinColumn({ name: 'idPedido' })
  @ManyToOne(() => Pedido)
  pedido: Pedido

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}
