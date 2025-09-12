import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PessoaInterface } from '../interfaces/pessoaInterface';
import { PessoaType } from '../types/pessoaTypes';
import { Length } from 'class-validator';

@Entity({ name: 'pessoas' })
export default class Pessoa implements PessoaInterface {

  @PrimaryGeneratedColumn()
  idPessoa: number

  @Column({ length: 50 })
  @Index()
  nome: string

  @Column({ nullable: true, length: 25 })
  @Index()
  apelido: string

  @Column()
  @Index()
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
  @Index()
  whatsapp: string

  @Column({ nullable: true, length: 255 })
  @Index()
  email: string

  @Column({ nullable: true })
  comissao: number

  @Column({ length: 1 })
  tipoPessoa: PessoaType;

  @Column()
  ativo: boolean

  // @JoinColumn({ name: 'idPessoa_cliente' })
  // @OneToMany(() => Programacao, (programacao) =>
  //   programacao.cliente, { cascade: true })
  // clienteProgramacoes: Programacao[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}