import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PessoaInterface } from '../interfaces/pessoaInterface';
import { PessoaType } from '../types/pessoaTypes';
import { Length } from 'class-validator';
import ProducaoMalharia from './producaoMalharia.entity';
import Tinturaria from './tinturaria.entity';
import Estoque from './estoque.entity';
import Programacao from './programacao.entity';

@Entity({ name: 'pessoas' })
export default class Pessoa implements PessoaInterface {

  @PrimaryGeneratedColumn()
  idPessoa: number

  @Column({ length: 50 })
  nome: string

  @Column({ nullable: true, length: 25 })
  apelido: string

  @Column()
  @Length(14, 18, { message: 'O campo doc deve ter entre 14 e 18 caracteres.' })
  cpf_cnpj: string

  @Column({ nullable: true, length: 100 })
  endereco: string

  @Column({ nullable: true })
  numero: number

  @Column({ nullable: true, length: 60 })
  bairro: string

  @Column({ nullable: true, length: 60 })
  cidade: string

  @Column({ nullable: true, length: 2 })
  uf: string

  @Column({ nullable: true, length: 10 })
  cep: string

  @Column({ nullable: true, length: 15 })
  telefone: string

  @Column({ nullable: true, length: 15 })
  whatsapp: string

  @Column({ nullable: true, length: 255 })
  email: string

  @Column({ nullable: true })
  comissao: number

  @Column({ length: 1 })
  tipoPessoa: PessoaType;

  @Column()
  ativo: boolean

  @JoinColumn({ name: 'idPessoa_cliente' })
  @OneToMany(() => Tinturaria, (tinturaria) =>
    tinturaria.cliente, { cascade: true })
  clienteTinturarias: Tinturaria[]

  @JoinColumn({ name: 'idPessoa_cliente' })
  @OneToMany(() => Programacao, (programacao) =>
    programacao.cliente, { cascade: true })
  clienteProgramacoes: Programacao[]

  @JoinColumn({ name: 'idPessoa_fornecedor' })
  @OneToMany(() => Tinturaria, (tinturaria) =>
    tinturaria.fornecedor, { cascade: true })
  fornecedorTinturarias: Tinturaria[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}