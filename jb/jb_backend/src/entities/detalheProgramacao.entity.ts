import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ type: 'float', precision: 2 })
  peso: number

  @Column({ type: 'float', precision: 2 })
  gm2: number

  @Column({ type: 'float', precision: 2 })
  largura: number

  @Column({ type: 'int' })
  qtdPeca: number
}
