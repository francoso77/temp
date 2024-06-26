import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { DetalheTinturariaInterface } from '../interfaces/tinturariaInterface';
import Tinturaria from './tinturaria.entity';
import ProducaoMalharia from './producaoMalharia.entity';

@Entity({ name: 'detalhetinturarias' })
export default class DetalheTinturaria implements DetalheTinturariaInterface {

  @PrimaryGeneratedColumn()
  idDetalheTinturaria: number;

  @PrimaryColumn()
  idTinturaria: number;

  @ManyToOne(() => Tinturaria, tinturaria => tinturaria.detalheTinturarias)
  tinturaria: Tinturaria;

  @Column()
  idPeca: number;

  @JoinColumn({ name: 'idPeca' })
  @ManyToOne(() => ProducaoMalharia, (produtoMalharia) => produtoMalharia.detalheTinturarias)
  peca: ProducaoMalharia

}
