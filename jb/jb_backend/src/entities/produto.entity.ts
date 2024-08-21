import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProdutoInterface } from '../interfaces/produtoInterface';
import UnidadeMedida from './unidadeMedida.entity';
import ProducaoMalharia from './producaoMalharia.entity';
import DetalheProducaoDublagem from './detalheProducaoDublagem.entity';
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
  @ManyToOne(() => UnidadeMedida)
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

  @JoinColumn({ name: "idProduto" })
  @OneToMany(() => DetalheProducaoDublagem, (detalheProducaoDublagem) =>
    detalheProducaoDublagem.produto, { cascade: true })
  producaoDublagens: DetalheProducaoDublagem[]

  @JoinColumn({ name: "idProduto" })
  @OneToMany(() => DetalheProgramacao, (detalheProgramacao) =>
    detalheProgramacao.produto, { cascade: true })
  detalheProgramacoes: DetalheProgramacao[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}