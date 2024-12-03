import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DetalheProgramacaoInterface } from '../interfaces/programacaoInterface';
import Programacao from './programacao.entity';
import Produto from './produto.entity';
import Cor from './cor.entity';

@Entity({ name: 'detalheprogramacoes' })
export default class DetalheProgramacao implements DetalheProgramacaoInterface {

  @PrimaryGeneratedColumn()
  idDetalheProgramacao: number;

  @Column()
  idProgramacao: number;

  @JoinColumn({ name: 'idProgramacao' })
  @ManyToOne(() => Programacao, programacao => programacao.detalheProgramacoes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  programacao: Programacao

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto)
  produto: Produto

  @Column()
  idCor: number;

  @JoinColumn({ name: 'idCor' })
  @ManyToOne(() => Cor)
  cor: Cor

  @Column({ type: 'float', precision: 4 })
  peso: number

  @Column({ type: 'float', precision: 4 })
  gm2: number

  @Column({ type: 'float', precision: 4 })
  largura: number

  @Column({ type: 'int' })
  qtdPeca: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}
