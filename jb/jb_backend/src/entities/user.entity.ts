import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserInterface } from '../interfaces/userInterface';

@Entity({ name: 'users' })
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  idUser: number

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

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}