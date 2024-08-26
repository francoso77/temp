import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DetalheTinturariaInterface } from '../interfaces/tinturariaInterface';
import Tinturaria from './tinturaria.entity';
import ProducaoMalharia from './producaoMalharia.entity';

@Entity({ name: 'detalhetinturarias' })
export default class DetalheTinturaria implements DetalheTinturariaInterface {
  @PrimaryGeneratedColumn()
  idDetalheTinturaria: number;

  @Column()
  idTinturaria: number;

  @JoinColumn({ name: 'idTinturaria' })
  @ManyToOne(() => Tinturaria, tinturaria => tinturaria.detalheTinturarias, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  tinturaria: Tinturaria;

  @Column()
  idMalharia: number;

  @JoinColumn({ name: 'idMalharia' })
  @ManyToOne(() => ProducaoMalharia)
  peca: ProducaoMalharia

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}
