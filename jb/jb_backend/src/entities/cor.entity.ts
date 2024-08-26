import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CorInterface } from '../interfaces/corInteface';

@Entity({ name: 'cores' })
export default class Cor implements CorInterface {

  @PrimaryGeneratedColumn()
  idCor: number

  @Column({ length: 35 })
  nome: string

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date;
}