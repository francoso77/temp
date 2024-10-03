import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioSessaoInterface } from '../../interfaces/sistema/usuarioInterface';

@Entity({ name: 'usuariosessoes' })
export class UsuarioSessao implements UsuarioSessaoInterface {

  @PrimaryGeneratedColumn()
  idSessao: number;

  @Column()
  idUsuario: number;

  @Column()
  token: string;

  @Column()
  ativo: boolean;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAD: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAD: Date;

}