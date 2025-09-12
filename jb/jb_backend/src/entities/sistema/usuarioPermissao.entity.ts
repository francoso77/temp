import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioPermissaoInterface } from '../../interfaces/sistema/usuarioInterface';
import { Usuario } from './usuario.entity';
import { ModuloPermissao } from './moduloPermissao.entity';

@Entity({ name: 'usuariospermissoes' })
export class UsuarioPermissao implements UsuarioPermissaoInterface {
  @PrimaryGeneratedColumn()
  idUsuarioPermissao: number;

  @Column({ nullable: true })
  idUsuario: number;

  @JoinColumn({ name: 'idUsuario' })
  @ManyToOne(() => Usuario)
  usuario: Usuario;

  @Column({ nullable: true })
  idModuloPermissao: number;

  @JoinColumn({ name: 'idModuloPermissao' })
  @ManyToOne(() => ModuloPermissao)
  moduloPermissao: ModuloPermissao;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date;

}