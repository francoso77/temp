import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import Produto from './produto.entity';
import { DetalheEntradaInterface } from '../interfaces/entradaInterface';
import Entrada from './entrada.entity';
import Cor from './cor.entity';
import Pessoa from './pessoa.entity';
import Tinturaria from './tinturaria.entity';

@Entity({ name: 'detalheentradas' })
export default class DetalheEntrada implements DetalheEntradaInterface {

  @PrimaryGeneratedColumn()
  idDetalheEntrada: number;

  @PrimaryColumn()
  idEntrada: number;

  @ManyToOne(() => Entrada, entrada => entrada.detalheEntradas)
  entrada: Entrada;

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto, (produto) => produto.entradas)
  produto: Produto

  @Column({ nullable: true })
  idCor: number | null;

  @JoinColumn({ name: 'idCor' })
  @ManyToOne(() => Cor, (cor) => cor.corDetalheEntradas)
  cor: Cor

  @Column({ type: 'float', precision: 4, nullable: true })
  qtdPecas: number

  @Column({ type: 'float', precision: 4 })
  vrUnitario: number

  @Column({ type: 'float', precision: 4 })
  qtd: number

  @Column({ type: 'float', precision: 4, nullable: true })
  metro: number

  @Column({ type: 'float', precision: 4, nullable: true })
  gm2: number

  @Column({ nullable: true })
  idPessoa_revisador: number | null

  @JoinColumn({ name: 'idPessoa_revisador' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.revisadorDetalheEntradas)
  revisador: Pessoa

  @Column({ nullable: true })
  idTinturaria: number | null

  @JoinColumn({ name: 'idTinturaria' })
  @ManyToOne(() => Tinturaria, (tinturaria) => tinturaria.romaneioDetalheEntradas)
  romaneio: Tinturaria

  @Column({ type: 'float', precision: 4, nullable: true })
  perdaMalharia: number

  @Column({ type: 'float', precision: 4, nullable: true })
  perdaTinturaria: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}
