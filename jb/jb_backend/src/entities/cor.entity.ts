import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CorInterface } from '../interfaces/corInteface';
import DetalheProgramacao from './detalheProgramacao.entity';

@Entity({ name: 'cores' })
export default class Cor implements CorInterface {

  @PrimaryGeneratedColumn()
  idCor: number

  @Column({ length: 35 })
  nome: string

  @JoinColumn({ name: "idCor" })
  @OneToMany(() => DetalheProgramacao, (detalheProgramacao) =>
    detalheProgramacao.cor, { cascade: true })
  corDetalheProgramacoes: DetalheProgramacao[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date;
}