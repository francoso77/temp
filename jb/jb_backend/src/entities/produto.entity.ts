import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProdutoInterface } from '../interfaces/produtoInterface';
import TipoProduto from './tipoProduto.entity';
import Estrutura from './estrutura.entity';
import Pedido from './pedido.entity';
import DetalhePedido from './detalhePedido.entity';
import DetalheEntrada from './detalheEntrada.entity';
import UnidadeMedida from './unidadeMedida.entity';
import ProducaoMalharia from './producaoMalharia.entity';
import DetalheProducaoDublagem from './detalheProducaoDublagem.entity';
import Estoque from './estoque.entity';
import DetalheProgramacao from './detalheProgramacao.entity';

@Entity({ name: 'produtos' })
export default class Produto implements ProdutoInterface {

  @PrimaryGeneratedColumn()
  idProduto: number

  @Column({ length: 80 })
  nome: string

  @Column()
  idUnidade: number

  @JoinColumn({ name: 'unidade' })
  @ManyToOne(() => UnidadeMedida, (unidadeMedida) => unidadeMedida.produtos)
  unidadeMedida: UnidadeMedida

  @Column({ nullable: true, length: 10 })
  localizacao: string

  @Column({ nullable: true, type: 'float', precision: 2 })
  largura: number

  @Column({ nullable: true, type: 'float', precision: 2 })
  gm2: number

  @Column({ nullable: false })
  ativo: boolean

  @Column()
  idTipoProduto: number

  @JoinColumn({ name: 'tipoProduto' })
  @ManyToOne(() => TipoProduto, (tipoProduto) => tipoProduto.produtos)
  tipoProduto: TipoProduto

  @OneToMany(() => DetalheProducaoDublagem, (detalheProducaoDublagem) => detalheProducaoDublagem.produto)
  producaoDublagens: DetalheProducaoDublagem[]

  @OneToMany(() => Estrutura, (estrutura) => estrutura.produto)
  estruturas: Estrutura[]

  @OneToMany(() => DetalhePedido, (detalhePedido) => detalhePedido.produto)
  pedidos: Pedido[]

  @OneToMany(() => DetalheEntrada, (entrada) => entrada.produto)
  entradas: DetalheEntrada[]

  @OneToMany(() => ProducaoMalharia, (producaoMalharia) => producaoMalharia.produto)
  producaoMalharias: ProducaoMalharia[]

  @OneToMany(() => Estoque, (estoque) => estoque.produto)
  estoques: Estoque[]

  @OneToMany(() => DetalheProgramacao, (detalheProgramacao) => detalheProgramacao.produto)
  detalheProgramacoes: DetalheProgramacao[]
}