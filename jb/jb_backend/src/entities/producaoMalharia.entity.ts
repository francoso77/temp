import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Pessoa from './pessoa.entity';
import { ProducaoMalhariaInterface } from '../interfaces/producaoMalhariaInterface';
import Maquina from './maquina.entity';
import Produto from './produto.entity';
import { TurnoType } from '../types/turnoTypes';
import Tinturaria from './tinturaria.entity';

@Entity({ name: 'producaomalharias' })
@Index('IDX_ID_PRODUTO', ['idProduto'])
@Index('IDX_ID_MAQUINA', ['idMaquina'])
@Index('IDX_ID_TECELAO', ['idPessoa_tecelao'])
@Index('IDX_ID_REVISADOR', ['idPessoa_revisador'])
@Index('IDX_FECHADO', ['fechado'])
@Index('IDX_ID_TINTURARIA', ['idTinturaria'])
@Index('IDX_DATA_MAQUINA_PRODUTO', ['dataProducao', 'idMaquina', 'idProduto'])
export default class ProducaoMalharia implements ProducaoMalhariaInterface {

  @PrimaryGeneratedColumn()
  idMalharia: number

  @Column()
  @Index()
  peca: string

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
  @Index()
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
  @Index()
  dataFechado: string;

  @Column({ nullable: true })
  idTinturaria: number

  @JoinColumn({ name: 'idTinturaria' })
  @ManyToOne(() => Tinturaria)
  tinturaria: Tinturaria

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}