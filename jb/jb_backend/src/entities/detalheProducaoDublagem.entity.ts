import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import ProducaoDublagem from './producaoDublagem.entity';
import Produto from './produto.entity';
import { DetalheProducaoDublagemInterface } from '../interfaces/producaoDublagemInterface';

@Entity({ name: 'detalheproducaodublagens' })
export default class DetalheProducaoDublagem implements DetalheProducaoDublagemInterface {

  @PrimaryGeneratedColumn()
  idDetalheProducaoDublagem: number;

  @PrimaryColumn()
  idProducaoDublagem: number;

  @ManyToOne(() => ProducaoDublagem, producaoDublagem => producaoDublagem.detalheProducaoDublagens)
  ProducaoDublagem: ProducaoDublagem;

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto, (produto) => produto.producaoDublagens)
  produto: Produto

  @Column({ type: 'float', precision: 2 })
  metro: number

}
