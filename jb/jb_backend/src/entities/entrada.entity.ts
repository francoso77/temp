import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Pessoa from './pessoa.entity';
import { EntradaInterface } from '../interfaces/entradaInterface';
import DetalheEntrada from './detalheEntrada.entity';

@Entity({ name: 'entradas' })
export default class Entrada implements EntradaInterface {

  @PrimaryGeneratedColumn()
  idEntrada: number

  @Column({ length: 11 })
  notaFiscal: string

  @Column({ type: "datetime" })
  dataEmissao: string;

  @Column({ nullable: true, length: 60 })
  observacao: string

  @Column()
  idPessoa_fornecedor: number

  @JoinColumn({ name: 'idPessoaFornecedor' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.fornecedorEntradas)
  fornecedor: Pessoa

  @OneToMany(() => DetalheEntrada, detalheEntrada => detalheEntrada.entrada)
  detalheEntradas: DetalheEntrada[];

}