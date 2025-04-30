import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GrupoInterface } from '../../interfaces/sistema/grupoInterface';

@Entity({ name: 'grupos' })
export class Grupo implements GrupoInterface {
  @PrimaryGeneratedColumn()
  idGrupo: number;

  @Column({ length: 50 })
  grupo: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

}