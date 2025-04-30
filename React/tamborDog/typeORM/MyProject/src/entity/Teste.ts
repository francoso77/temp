import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'teste' })
export class Jacare {

  @PrimaryGeneratedColumn()
  idTeste: number

  @Column({
    length: 30,
    nullable: false,
  })
  nome: string

}