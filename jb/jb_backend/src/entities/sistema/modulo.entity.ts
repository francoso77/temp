import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { ModuloInterface } from '../../interfaces/sistema/moduloInterface';
import { ModuloPermissao } from './moduloPermissao.entity';

@Entity({ name: 'modulos' })
@Unique(['modulo'])
export class Modulo implements ModuloInterface {
  @PrimaryGeneratedColumn()
  idModulo: number;

  @Column({ length: 255, nullable: false })
  modulo: string;

  @OneToMany(() => ModuloPermissao, (moduloPermissao) => moduloPermissao.modulo)
  moduloPermissoes: ModuloPermissao[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

}