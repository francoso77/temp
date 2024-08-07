import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProdutoInterface } from '../interfaces/produtoInterface';
import Estrutura from './estrutura.entity';
import Pedido from './pedido.entity';
import DetalhePedido from './detalhePedido.entity';
import DetalheEntrada from './detalheEntrada.entity';
import UnidadeMedida from './unidadeMedida.entity';
import ProducaoMalharia from './producaoMalharia.entity';
import DetalheProducaoDublagem from './detalheProducaoDublagem.entity';
import Estoque from './estoque.entity';
import DetalheProgramacao from './detalheProgramacao.entity';
import { TipoProdutoType } from '../types/tipoProdutoypes';

@Entity({ name: 'produtos' })
export default class Produto implements ProdutoInterface {

  @PrimaryGeneratedColumn()
  idProduto: number

  @Column({ length: 80 })
  nome: string

  @Column()
  idUnidade: number

  @JoinColumn({ name: 'idUnidade' })
  @ManyToOne(() => UnidadeMedida, (unidadeMedida) => unidadeMedida.produtos)
  unidadeMedida: UnidadeMedida

  @Column({ nullable: true, length: 10 })
  localizacao: string

  @Column({ nullable: true, type: 'float', precision: 4 })
  largura: number

  @Column({ nullable: true, type: 'float', precision: 4 })
  gm2: number

  @Column({ nullable: false })
  ativo: boolean

  @Column()
  tipoProduto: TipoProdutoType

  @OneToMany(() => DetalheProducaoDublagem, (detalheProducaoDublagem) =>
    detalheProducaoDublagem.produto, { cascade: true, eager: true })
  producaoDublagens: DetalheProducaoDublagem[]

  @OneToMany(() => Estrutura, (estrutura) =>
    estrutura.produto, { cascade: true, eager: true })
  estruturas: Estrutura[]

  @OneToMany(() => DetalhePedido, (detalhePedido) =>
    detalhePedido.produto, { cascade: true, eager: true })
  pedidos: Pedido[]

  @OneToMany(() => DetalheEntrada, (entrada) =>
    entrada.produto, { cascade: true, eager: true })
  entradas: DetalheEntrada[]

  @OneToMany(() => ProducaoMalharia, (producaoMalharia) =>
    producaoMalharia.produto, { cascade: true, eager: true })
  producaoMalharias: ProducaoMalharia[]

  @OneToMany(() => Estoque, (estoque) =>
    estoque.produto, { cascade: true, eager: true })
  estoques: Estoque[]

  @OneToMany(() => DetalheProgramacao, (detalheProgramacao) =>
    detalheProgramacao.produto, { cascade: true, eager: true })
  detalheProgramacoes: DetalheProgramacao[]
}