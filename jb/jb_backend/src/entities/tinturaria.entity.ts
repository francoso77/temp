import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Pessoa from './pessoa.entity';
import { TinturariaInterface } from '../interfaces/tinturariaInterface';
import DetalheTinturaria from './detalheTinturaria.entity';

@Entity({ name: 'tinturarias' })
export default class Tinturaria implements TinturariaInterface {

  @PrimaryGeneratedColumn()
  idTinturaria: number

  @Column({ type: "datetime" })
  dataTinturaria: string;

  @Column()
  idPessoa_cliente: number

  @JoinColumn({ name: 'idPessoa_cliente' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.clienteTinturarias)
  cliente: Pessoa

  @Column()
  idPessoa_fornecedor: number

  @JoinColumn({ name: 'idPessoa_fornecedor' })
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.fornecedorTinturarias)
  fornecedor: Pessoa

  @JoinColumn({ name: 'idTinturaria' })
  @OneToMany(() => DetalheTinturaria,
    DetalheTinturaria => DetalheTinturaria.tinturaria, { cascade: true })
  detalheTinturarias: DetalheTinturaria[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}