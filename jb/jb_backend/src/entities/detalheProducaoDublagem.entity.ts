import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import ProducaoDublagem from './producaoDublagem.entity';
import { DetalheProducaoDublagemInterface } from '../interfaces/producaoDublagemInterface';

@Entity({ name: 'detalheproducaodublagens' })
export default class DetalheProducaoDublagem implements DetalheProducaoDublagemInterface {

  @PrimaryGeneratedColumn()
  idDetalheProducaoDublagem: number;

  @Column()
  idDublagem: number;

  @JoinColumn({ name: 'idDublagem' })
  @ManyToOne(() => ProducaoDublagem, producaoDublagem => producaoDublagem.detalheProducaoDublagens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  producaoDublagem: ProducaoDublagem

  @Column({ type: 'float', precision: 4 })
  metros: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAD: Date
}
