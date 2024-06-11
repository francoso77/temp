import { Column, Entity, Generated, PrimaryGeneratedColumn } from 'typeorm';
import { UserInterface } from '../interfaces/userInterface';

@Entity()
export class User implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  idUser: string;

  @Column({ length: 14 })
  cpf: string

  @Column({
    length: 15,
    nullable: true,
  })
  whatsapp: string

  @Column({ length: 255 })
  email: string

  @Column({ length: 25 })
  senha: string

  @Column({ nullable: true })
  ativo: boolean
}