import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PessoaInterface } from '../interfaces/pessoaInterface';
import { PessoaTypes } from '../types/pessoaTypes';
import { Length } from 'class-validator';
import Pedido from './pedido.entity';
import Entrada from './entrada.entity';
import DetalheEntrada from './detalheEntrada.entity';
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
  tipoPessoa: PessoaTypes;

  @Column()
  ativo: boolean

  @OneToMany(() => DetalheEntrada, (detalheEntrada) => detalheEntrada.revisador)
  revisadorDetalheEntradas: DetalheEntrada[]

  @OneToMany(() => ProducaoMalharia, (producaoMalharia) => producaoMalharia.revisador)
  revisadorProducaoMalharias: ProducaoMalharia[]

  @OneToMany(() => ProducaoMalharia, (producaoMalharia) => producaoMalharia.tecelao)
  tecelaoProducaoMalharias: ProducaoMalharia[]

  @OneToMany(() => Pedido, (pedido) => pedido.cliente)
  clientePedidos: Pedido[]

  @OneToMany(() => Pedido, (pedido) => pedido.vendedor)
  vendedorPedidos: Pedido[]

  @OneToMany(() => Entrada, (entrada) => entrada.fornecedor)
  fornecedorEntradas: Pedido[]

  @OneToMany(() => Tinturaria, (tinturaria) => tinturaria.cliente)
  clienteTinturarias: Tinturaria[]

  @OneToMany(() => Programacao, (programacao) => programacao.cliente)
  clienteProgramacoes: Programacao[]

  @OneToMany(() => Tinturaria, (tinturaria) => tinturaria.fornecedor)
  fornecedorTinturarias: Tinturaria[]

  @OneToMany(() => Estoque, (estoque) => estoque.fornecedor)
  fornecedorEstoques: Estoque[]
}