import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { GrupoUsuarioInterface } from '../../interfaces/sistema/grupoInterface';

@Entity({ name: 'gruposusuaroios' })
export class GrupoUsuario implements GrupoUsuarioInterface {

  @PrimaryColumn()
  @JoinColumn({ name: 'idGrupo' })
  @ManyToOne(() => GrupoUsuario)
  idGrupo: number;

  @PrimaryColumn()
  @JoinColumn({ name: 'idUsuario' })
  @ManyToOne(() => GrupoUsuario)
  idUsuario: number;

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

}