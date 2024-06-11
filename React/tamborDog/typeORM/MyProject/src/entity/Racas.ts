import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: 'Racas' })
export class Racas {

  @PrimaryGeneratedColumn()
  idRaca: number

  @Column({
    length: 60,
  })
  nome: string

}