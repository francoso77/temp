import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({ name: 'Atletas' })
export class Atletas {

  @PrimaryGeneratedColumn()
  idAtleta: number

  @Column({
    length: 60,
  })
  nome: string

  @Column({
    length: 14,
  })
  cpf: string

  @Column({
    type: 'date'
  })
  dataNascimento: string

  @Column({
    length: 15,
  })
  telefone: string

  @Column({
    length: 15,
  })
  whatsapp: string

  @Column({
    length: 100,
  })
  email: string

  @Column({
    length: 25,
  })
  senha: string

  @Column()
  ativo: boolean
}