import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Pessoa from './pessoa.entity';
import { ProgramacaoInterface } from '../interfaces/programacaoInterface';
import Tinturaria from './tinturaria.entity';
import DetalheProgramacao from './detalheProgramacao.entity';

@Entity({ name: 'programacoes' })
export default class Programacao implements ProgramacaoInterface {

  @PrimaryGeneratedColumn()
  idProgramacao: number

  @Column({ length: 11 })
  @Index()
  notaFiscal: string

  @Column({ type: "datetime" })
  @Index()
  dataProgramacao: string;

  @Column({ nullable: true, length: 60 })
  msg: string

  @Column({ nullable: true })
  idTinturaria: number

  @JoinColumn({ name: 'idTinturaria' })
  @ManyToOne(() => Tinturaria)
  romaneio: Tinturaria

  @Column()
  idPessoa_cliente: number

  @JoinColumn({ name: 'idPessoa_cliente' })
  @ManyToOne(() => Pessoa)
  cliente: Pessoa

  @JoinColumn({ name: 'idProgramacao' })
  @OneToMany(() => DetalheProgramacao,
    detalheProgramacao => detalheProgramacao.programacao, { cascade: true })
  detalheProgramacoes: DetalheProgramacao[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date

}