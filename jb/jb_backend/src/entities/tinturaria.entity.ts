import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Pessoa from './pessoa.entity';
import { TinturariaInterface } from '../interfaces/tinturariaInterface';
import DetalheTinturaria from './detalheTinturaria.entity';

@Entity({ name: 'tinturarias' })
export default class Tinturaria implements TinturariaInterface {

  @PrimaryGeneratedColumn()
  idTinturaria: number

  @Column({ type: "datetime" })
  @Index()
  dataTinturaria: string;

  @Column()
  idPessoa_cliente: number

  @JoinColumn({ name: 'idPessoa_cliente' })
  @ManyToOne(() => Pessoa)
  cliente: Pessoa

  @Column()
  idPessoa_fornecedor: number

  @JoinColumn({ name: 'idPessoa_fornecedor' })
  @ManyToOne(() => Pessoa)
  fornecedor: Pessoa

  @OneToMany(() => DetalheTinturaria, (detalheTinturaria) => detalheTinturaria.tinturaria)
  detalheTinturarias: DetalheTinturaria[]

  // @JoinColumn({ name: 'idTinturaria' })
  // @OneToMany(() => DetalheTinturaria,
  //   DetalheTinturaria => DetalheTinturaria.tinturaria, { cascade: true })
  // detalheTinturarias: DetalheTinturaria[]

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}