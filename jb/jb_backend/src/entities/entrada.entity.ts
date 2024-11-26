import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Pessoa from './pessoa.entity';
import { EntradaInterface } from '../interfaces/entradaInterface';
import DetalheEntrada from './detalheEntrada.entity';

@Entity({ name: 'entradas' })
export default class Entrada implements EntradaInterface {

  @PrimaryGeneratedColumn()
  idEntrada: number

  @Column({ length: 11 })
  @Index()
  notaFiscal: string

  @Column({ type: "datetime" })
  @Index()
  dataEmissao: string;

  @Column({ nullable: true, length: 60 })
  observacao: string

  @Column()
  idPessoa_fornecedor: number

  @JoinColumn({ name: 'idPessoa_fornecedor' })
  @ManyToOne(() => Pessoa)
  fornecedor: Pessoa

  @JoinColumn({ name: 'idEntrada' })
  @OneToMany(() => DetalheEntrada,
    detalheEntrada => detalheEntrada.entrada, { cascade: true })
  detalheEntradas: DetalheEntrada[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}