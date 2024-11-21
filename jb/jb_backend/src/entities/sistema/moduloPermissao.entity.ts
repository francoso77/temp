import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ModuloPermissaoInterface } from '../../interfaces/sistema/moduloInterface';
import { Modulo } from './modulo.entity';

@Entity({ name: 'modulospermissoes' })
export class ModuloPermissao implements ModuloPermissaoInterface {

  @PrimaryGeneratedColumn()
  idModuloPermissao: number;

  @JoinColumn({ name: 'idModulo' })
  @ManyToOne(() => Modulo)
  idModulo: number;

  @Column({ length: 255 })
  permissao: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

}