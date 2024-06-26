import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Pessoa from './pessoa.entity';
import { ProgramacaoInterface } from '../interfaces/programacaoInterface';
import Tinturaria from './tinturaria.entity';
import DetalheProgramacao from './detalheProgramacao.entity';

@Entity({ name: 'programacoes' })
export default class Programacao implements ProgramacaoInterface {

  @PrimaryGeneratedColumn()
  idProgramacao: number

  @Column({ length: 11 })
  notaFiscal: string

  @Column({ type: "datetime" })
  dataProgramacao: string;

  @Column({ nullable: true, length: 60 })
  msg: string

  @Column({ nullable: true })
  idTinturaria: number

  @JoinColumn({ name: 'idTinturaria' })
  @ManyToOne(() => Tinturaria, (tinturaria) => tinturaria.programacoes)
  tinturaria: Tinturaria

  @Column()
  idPessoa_cliente: number

  @JoinColumn({ name: 'idPessoaCliente' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.clienteProgramacoes)
  cliente: Pessoa

  @OneToMany(() => DetalheProgramacao, detalheProgramacao => detalheProgramacao.programacao)
  detalheProgramacoes: DetalheProgramacao[];

}