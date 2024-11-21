import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GrupoPermissaoInterface } from '../../interfaces/sistema/grupoInterface';
import { Grupo } from './grupo.entity';
import { ModuloPermissao } from './moduloPermissao.entity';

@Entity({ name: 'grupospermissoes' })
export class GrupoPermissao implements GrupoPermissaoInterface {
  @PrimaryGeneratedColumn()
  idGrupoPermissao: number

  @JoinColumn({ name: 'idGrupo' })
  @ManyToOne(() => Grupo)
  idGrupo: number

  // @JoinColumn({ name: 'idModulo' })
  // @ManyToOne(() => Modulo)
  // idModulo: number

  @JoinColumn({ name: 'idModuloPermissao' })
  @ManyToOne(() => ModuloPermissao)
  idModuloPermissao: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

}