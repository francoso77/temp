import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Pessoa from './pessoa.entity';
import { ProducaoMalhariaInterface } from '../interfaces/producaoMalhariaInterface';
import Maquina from './maquina.entity';
import Produto from './produto.entity';
import { TurnoType } from '../types/turnoTypes';
import DetalheTinturaria from './detalheTinturaria.entity';
import Tinturaria from './tinturaria.entity';

@Entity({ name: 'producaomalharia' })
export default class ProducaoMalharia implements ProducaoMalhariaInterface {

  @PrimaryGeneratedColumn()
  idPeca: number

  @Column()
  idMaquina: number

  @JoinColumn({ name: 'idMaquina' })
  @ManyToOne(() => Maquina, (maquina) => maquina.ProducaoMalharias)
  maquina: Maquina

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto, (produto) => produto.producaoMalharias)
  produto: Produto

  @Column({ type: "datetime" })
  dataProducao: string;

  @Column()
  turno: TurnoType;

  @Column({ type: 'float', precision: 4 })
  peso: number

  @Column({ nullable: true, length: 10 })
  localizacao: string

  @Column()
  idPessoa_revisador: number

  @JoinColumn({ name: 'idPessoa_revisador' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.revisadorProducaoMalharias)
  revisador: Pessoa

  @Column()
  idPessoa_tecelao: number

  @JoinColumn({ name: 'idPessoaTecelao' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.tecelaoProducaoMalharias)
  tecelao: Pessoa

  @Column({ nullable: true })
  fechado: boolean

  @Column({ nullable: true, type: "datetime" })
  dataFechado: string;

  @Column({ nullable: true })
  idTinturaria: number

  @JoinColumn({ name: 'idTinturaria' })
  @ManyToOne(() => Tinturaria, (tinturaria) => tinturaria.producaoMalharias)
  tinturaria: Tinturaria

  @OneToMany(() => DetalheTinturaria, (detalheTinturaria) => detalheTinturaria.peca)
  detalheTinturarias: DetalheTinturaria[]

}