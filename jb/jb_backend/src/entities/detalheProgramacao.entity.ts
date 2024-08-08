import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DetalheProgramacaoInterface } from '../interfaces/programacaoInterface';
import Programacao from './programacao.entity';
import Produto from './produto.entity';
import Cor from './cor.entity';

@Entity({ name: 'detalheprogramacoes' })
export default class DetalheProgramacao implements DetalheProgramacaoInterface {

  @PrimaryGeneratedColumn()
  idDetalheProgramacao: number;

  @PrimaryColumn()
  idProgramacao: number;

  @ManyToOne(() => Programacao, programacao => programacao.detalheProgramacoes)
  programacao: Programacao;

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto, (produto) => produto.detalheProgramacoes)
  produto: Produto

  @Column()
  idCor: number;

  @JoinColumn({ name: 'idCor' })
  @ManyToOne(() => Cor, (cor) => cor.corDetalheProgramacoes)
  cor: Cor

  @Column({ type: 'float', precision: 4 })
  peso: number

  @Column({ type: 'float', precision: 4 })
  gm2: number

  @Column({ type: 'float', precision: 4 })
  largura: number

  @Column({ type: 'int' })
  qtdPeca: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}
