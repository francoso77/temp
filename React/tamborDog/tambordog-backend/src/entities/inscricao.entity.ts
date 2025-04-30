import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Atleta from './atleta.entity';
import Cao from './cao.entity';
import Categoria from './categoria.entity';
import Prova from './prova.entity';
import { InscricaoTypes } from '../types/InscricaoTypes';
import Sumula from './sumula.entity';
import { InscricaoInterface } from '../interfaces/inscricaoInterface';

@Entity({ name: 'inscricoes' })
export default class Inscricao implements InscricaoInterface {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  idInscricao: string;

  // @PrimaryColumn({ type: 'uuid', length: 36 })
  // idAtleta: string;

  // @PrimaryColumn({ type: 'uuid', length: 36 })
  // idCao: string;

  @Column({ length: 36 })
  idAtleta: string

  @JoinColumn({ name: 'idAtleta' })
  @ManyToOne(() => Atleta, (atleta) => atleta.inscricoes)
  atleta: Atleta

  @Column({ length: 36 })
  idCao: string

  @JoinColumn({ name: 'idCao' })
  @ManyToOne(() => Cao, (cao) => cao.inscricoes)
  cao: Cao

  @Column({ length: 36 })
  idCategoria: string

  @JoinColumn({ name: 'idCategoria' })
  @ManyToOne(() => Categoria, (categoria) => categoria.inscricoes)
  categoria: Categoria

  @Column({ length: 36 })
  idProva: string

  @JoinColumn({ name: 'idProva' })
  @ManyToOne(() => Prova, (prova) => prova.inscricoes)
  prova: Prova

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number

  @Column({ type: 'enum', enum: InscricaoTypes })
  statusInscricao: InscricaoTypes

  @OneToOne(() => Sumula, sumula => sumula.inscricao)
  @JoinColumn({ name: 'idSumula' })
  sumula: Sumula


}