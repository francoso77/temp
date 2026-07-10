import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import ProducaoMalharia from './producaoMalharia.entity';
import { DetalheTinInterface } from '../interfaces/tinInterface';
import Tin from './tin.entity';

@Entity({ name: 'detalhetins' })
export default class DetalheTin implements DetalheTinInterface {
  @PrimaryGeneratedColumn()
  idDetalheTinturaria: number;

  @Column()
  idTinturaria: number;

  @JoinColumn({ name: 'idTinturaria' })
  @ManyToOne(() => Tin, (tin) => tin.detalheTins)
  tinturaria: Tin;

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
