import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioPermissaoInterface } from '../../interfaces/sistema/usuarioInterface';
import { Usuario } from './usuario.entity';
import { Modulo } from './modulo.entity';
import { ModuloPermissao } from './moduloPermissao.entity';

@Entity({ name: 'usuariospermissoes' })
export class UsuarioPermissao implements UsuarioPermissaoInterface {
  @PrimaryGeneratedColumn()
  idUsuarioPermissao: number;

  @JoinColumn({ name: 'idUsuario' })
  @ManyToOne(() => Usuario)
  idUsuario: number;

  // @JoinColumn({ name: 'idModulo' })
  // @ManyToOne(() => Modulo)
  // idModulo: number;

  @JoinColumn({ name: 'idModuloPermissao' })
  @ManyToOne(() => ModuloPermissao)
  idModuloPermissao: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date;

}