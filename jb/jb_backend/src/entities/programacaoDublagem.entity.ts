import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import DetalheProgramacaoDublagem from './detalheProgramacaoDublagem.entity';
import { DetalheProgramacaoDublagemInterface, ProgramacaoDublagemInterface } from '../interfaces/programacaoDublagemInterface';

@Entity({ name: 'programacaodublagens' })
export default class ProgramacaoDublagem implements ProgramacaoDublagemInterface {

  @PrimaryGeneratedColumn()
  idProgramacaoDublagem: number

  @Column({ type: "datetime" })
  dataProgramacao: string

  @Column({ type: 'float', precision: 4 })
  qtdCola: number

  @Column({ type: 'float', precision: 4 })
  qtdFilme: number

  @JoinColumn({ name: 'idProgramacaoDublagem' })
  @OneToMany(() => DetalheProgramacaoDublagem,
    detalheProgramacaoDublagem => detalheProgramacaoDublagem.programacaoDublagem, { cascade: true })
  detalheProgramacaoDublagens: DetalheProgramacaoDublagem[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}