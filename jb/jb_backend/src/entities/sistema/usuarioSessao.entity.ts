import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioSessaoInterface } from '../../interfaces/sistema/usuarioInterface';
import { Usuario } from './usuario.entity';
import { UsuarioType } from '../../types/usuarioTypes';

@Entity({ name: 'usuariosessoes' })
export class UsuarioSessao implements UsuarioSessaoInterface {

  @PrimaryGeneratedColumn()
  idSessao: number;

  @JoinColumn({ name: 'idUsuario' })
  @ManyToOne(() => Usuario)
  @Column()
  idUsuario: number;

  @Column()
  token: string;

  @Column()
  ativo: boolean;

  @Column({ type: 'int', default: 0 })
  tipoUsuario: UsuarioType

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date;

}