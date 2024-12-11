import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { GrupoUsuarioInterface } from '../../interfaces/sistema/grupoInterface';
import { Grupo } from './grupo.entity';
import { Usuario } from './usuario.entity';

@Entity({ name: 'gruposusuarios' })
export class GrupoUsuario implements GrupoUsuarioInterface {

  @PrimaryColumn()
  @JoinColumn({ name: 'idGrupo' })
  @ManyToOne(() => Grupo)
  idGrupo: number;

  @PrimaryColumn()
  @JoinColumn({ name: 'idUsuario' })
  @ManyToOne(() => Usuario)
  idUsuario: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

}