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
  @ManyToOne(() => Tinturaria, (tinturaria) => tinturaria.detalheTinturarias)
  tinturaria: Tinturaria;

  // @ManyToOne(() => Tinturaria, tinturaria => tinturaria.detalheTinturarias, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  //   orphanedRowAction: 'delete'
  // })
  // tinturaria: Tinturaria;

  @Column()
  idMalharia: number;

  @JoinColumn({ name: 'idMalharia' })
  @ManyToOne(() => ProducaoMalharia)
  malharia: ProducaoMalharia

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}
