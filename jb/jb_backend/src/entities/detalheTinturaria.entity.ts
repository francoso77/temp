import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DetalheTinturariaInterface } from '../interfaces/tinturariaInterface';
import Tinturaria from './tinturaria.entity';
import ProducaoMalharia from './producaoMalharia.entity';

@Entity({ name: 'detalhetinturarias' })
export default class DetalheTinturaria implements DetalheTinturariaInterface {

  @PrimaryGeneratedColumn()
  idDetalheTinturaria: number;

  @PrimaryColumn()
  idTinturaria: number;

  @ManyToOne(() => Tinturaria, tinturaria => tinturaria.detalheTinturarias)
  tinturaria: Tinturaria;

  @Column()
  idPeca: number;

  @JoinColumn({ name: 'idPeca' })
  @ManyToOne(() => ProducaoMalharia)
  peca: ProducaoMalharia

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}
