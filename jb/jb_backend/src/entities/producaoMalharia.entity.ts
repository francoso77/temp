import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Pessoa from './pessoa.entity';
import { ProducaoMalhariaInterface } from '../interfaces/producaoMalhariaInterface';
import Maquina from './maquina.entity';
import Produto from './produto.entity';
import { TurnoType } from '../types/turnoTypes';
import Tinturaria from './tinturaria.entity';

@Entity({ name: 'producaomalharia' })
export default class ProducaoMalharia implements ProducaoMalhariaInterface {

  @PrimaryGeneratedColumn()
  idMalharia: number

  @Column()
  peca: number

  @Column()
  idMaquina: number

  @JoinColumn({ name: 'idMaquina' })
  @ManyToOne(() => Maquina)
  maquina: Maquina

  @Column()
  idProduto: number;

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto)
  produto: Produto

  @Column({ type: "datetime" })
  dataProducao: string;

  @Column()
  turno: TurnoType;

  @Column({ type: 'float', precision: 4 })
  peso: number

  @Column({ nullable: true, length: 10 })
  localizacao: string

  @Column()
  idPessoa_revisador: number

  @JoinColumn({ name: 'idPessoa_revisador' })
  @ManyToOne(() => Pessoa)
  revisador: Pessoa

  @Column()
  idPessoa_tecelao: number

  @JoinColumn({ name: 'idPessoa_tecelao' })
  @ManyToOne(() => Pessoa)
  tecelao: Pessoa

  @Column({ nullable: true })
  fechado: boolean

  @Column({ nullable: true, type: "datetime" })
  dataFechado: string;

  @Column({ nullable: true })
  idTinturaria: number

  @JoinColumn({ name: 'idTinturaria' })
  @ManyToOne(() => Tinturaria)
  tinturaria: Tinturaria

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp' })
  createAD: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp' })
  updateAD: Date
}