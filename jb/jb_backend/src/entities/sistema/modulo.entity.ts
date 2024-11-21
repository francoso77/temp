import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ModuloInterface } from '../../interfaces/sistema/moduloInterface';

@Entity({ name: 'modulos' })
export class Modulo implements ModuloInterface {
  @PrimaryGeneratedColumn()
  idModulo: number;

  @Column({ length: 255 })
  modulo: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

}