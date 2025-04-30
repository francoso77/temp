import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DetalhePecaInterface } from '../interfaces/producaoDublagemInterface';
import DetalheProducaoDublagem from './detalheProducaoDublagem.entity';

@Entity({ name: 'detalhepecas' })
export default class DetalhePeca implements DetalhePecaInterface {

  @PrimaryGeneratedColumn()
  idDetalhePeca: number;

  @Column()
  idDetalheProducaoDublagem: number;

  @Column({ type: 'float', precision: 4 })
  metros: number

  @JoinColumn({ name: 'idDetalheProducaoDublagem' })
  @ManyToOne(() => DetalheProducaoDublagem, detalheProducaoDublagem => detalheProducaoDublagem.detalhePecas, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  detalheProducaoDublagem: DetalheProducaoDublagem

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}
