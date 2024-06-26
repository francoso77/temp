import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Pessoa from './pessoa.entity';
import { TinturariaInterface } from '../interfaces/tinturariaInterface';
import DetalheTinturaria from './detalheTinturaria.entity';
import ProducaoMalharia from './producaoMalharia.entity';
import Programacao from './programacao.entity';

@Entity({ name: 'tinturarias' })
export default class Tinturaria implements TinturariaInterface {

  @PrimaryGeneratedColumn()
  idTinturaria: number

  @Column({ type: "datetime" })
  dataTinturaria: string;

  @Column()
  idPessoa_cliente: number

  @JoinColumn({ name: 'idPessoaCliente' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.clienteTinturarias)
  cliente: Pessoa

  @Column()
  idPessoa_fornecedor: number

  @JoinColumn({ name: 'idPessoaFornecedor' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.fornecedorTinturarias)
  fornecedor: Pessoa

  @OneToMany(() => DetalheTinturaria, detalheTinturaria => detalheTinturaria.tinturaria)
  detalheTinturarias: DetalheTinturaria[];

  @OneToMany(() => ProducaoMalharia, ProducaoMalharia => ProducaoMalharia.tinturaria)
  producaoMalharias: ProducaoMalharia[];

  @OneToMany(() => Programacao, programacao => programacao.tinturaria)
  programacoes: Programacao[];

}