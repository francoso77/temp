import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { ModuloPermissaoInterface } from '../../interfaces/sistema/moduloInterface';
import { Modulo } from './modulo.entity';

@Entity({ name: 'modulospermissoes' })
@Unique(['idModulo', 'permissao'])
export class ModuloPermissao implements ModuloPermissaoInterface {

  @PrimaryGeneratedColumn()
  idModuloPermissao: number;

  @Column({ nullable: true })
  idModulo: number;

  @JoinColumn({ name: 'idModulo' })
  @ManyToOne(() => Modulo, (modulo) => modulo.moduloPermissoes)
  modulo: Modulo;

  @Column({ length: 255 })
  permissao: string;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

}