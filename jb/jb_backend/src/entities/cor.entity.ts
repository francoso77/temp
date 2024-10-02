import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CorInterface } from '../interfaces/corInteface';

@Entity({ name: 'cores' })
export default class Cor implements CorInterface {

  @PrimaryGeneratedColumn()
  idCor: number

  @Column({ length: 35 })
  nome: string

  @Column()
  nivel: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAD: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAD: Date;
}