import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Racas } from './Racas';
import { Atletas } from './Atletas';

@Entity()
export class Caes {

  @PrimaryGeneratedColumn()
  idCao: number

  @Column({
    length: 60,
  })
  nome: string

  @Column({
    type: 'date'
  })
  dataNascimento: Date

  @Column()
  porte: number

  @Column()
  ativo: boolean

  @ManyToOne(() => Atletas)
  @JoinColumn()
  idAtleta: Atletas

  @ManyToOne(() => Racas)
  @JoinColumn()
  idRaca: Racas
}