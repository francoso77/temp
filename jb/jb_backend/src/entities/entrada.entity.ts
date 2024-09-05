import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
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

  @JoinColumn({ name: 'idPessoa_fornecedor' })
  @ManyToOne(() => Pessoa)
  fornecedor: Pessoa

  @JoinColumn({ name: 'idEntrada' })
  @OneToMany(() => DetalheEntrada,
    detalheEntrada => detalheEntrada.entrada, { cascade: true })
  detalheEntradas: DetalheEntrada[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAD: Date
}