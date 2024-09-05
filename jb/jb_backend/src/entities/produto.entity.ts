import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ProdutoInterface } from '../interfaces/produtoInterface';
import UnidadeMedida from './unidadeMedida.entity';
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

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAD: Date
}