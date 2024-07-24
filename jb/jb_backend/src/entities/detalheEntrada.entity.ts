import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column()
  idCor: number;

  @JoinColumn({ name: 'idCor' })
  @ManyToOne(() => Cor, (cor) => cor.corDetalheEntradas)
  cor: Cor

  @Column({ type: 'float', precision: 4 })
  qtdPecas: number

  @Column({ type: 'float', precision: 4 })
  vrUnitario: number

  @Column({ type: 'float', precision: 4 })
  qtd: number

  @Column({ type: 'float', precision: 4 })
  metro: number

  @Column({ type: 'float', precision: 4 })
  gm2: number

  @Column()
  idPessoa_revisador: number

  @JoinColumn({ name: 'idPessoaRevisador' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.revisadorDetalheEntradas)
  revisador: Pessoa

  @Column()
  idTinturaria: number

  @JoinColumn({ name: 'idTinturaria' })
  @ManyToOne(() => Tinturaria, (tinturaria) => tinturaria.romaneioDetalheEntradas)
  romaneio: Tinturaria

  @Column({ type: 'float', precision: 4 })
  perdaMalharia: number

  @Column({ type: 'float', precision: 4 })
  perdaTinturaria: number
}
