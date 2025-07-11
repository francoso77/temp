import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CorInterface } from '../interfaces/corInteface';

@Entity({ name: 'cores' })
@Index('IDX_NIVEL', ['nivel']) // índice simples no nível
@Index('IDX_NIVEL_NOME', ['nivel', 'nome']) // índice composto
export default class Cor implements CorInterface {

  @PrimaryGeneratedColumn()
  idCor: number

  @Column({ length: 35 })
  @Index({ unique: true })
  nome: string

  @Column()
  nivel: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date;
}