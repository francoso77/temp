import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Atleta from './atleta.entity';
import Raca from './raca.entity';
import Categoria from './categoria.entity';
import Inscricao from './inscricao.entity';
import { CaoInterface } from '../interfaces/caoInterface';

@Entity({ name: 'caes' })
export default class Cao implements CaoInterface {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  idCao: string;

  @Column({ length: 60 })
  nome: string

  @Column({ type: 'date' })
  dataNascimento: string

  @Column({ nullable: false })
  ativo: boolean

  @Column({
    nullable: true,
    length: 155
  })
  avatar: string

  @Column({ length: 36 })
  idAtleta: string

  @JoinColumn({ name: 'idAtleta' })
  @ManyToOne(() => Atleta, (atleta) => atleta.caes)
  atleta: Atleta

  @Column({ length: 36 })
  idRaca: string

  @JoinColumn({ name: 'idRaca' })
  @ManyToOne(() => Raca, (raca) => raca.caes)
  raca: Raca

  @Column({ length: 36 })
  idCategoria: string

  @JoinColumn({ name: 'idCategoria' })
  @ManyToOne(() => Categoria, (categoria) => categoria.caes)
  categoria: Categoria

  @OneToMany(() => Inscricao, (inscricao) => inscricao.cao)
  inscricoes: Inscricao[]
}