import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PerdaMalhariaInterface } from '../interfaces/perdaMalhariaInterface';
import Produto from './produto.entity';
import Pessoa from './pessoa.entity';
import Maquina from './maquina.entity';

@Entity({ name: 'perdasmalharia' })
export default class PerdaMalharia implements PerdaMalhariaInterface {

  @PrimaryGeneratedColumn()
  idPerdaMalharia: number

  @Column({ type: "datetime" })
  @Index()
  dataPerda: string

  @Column()
  idMaquina: number

  @JoinColumn({ name: 'idMaquina' })
  @ManyToOne(() => Maquina)
  maquina: Maquina

  @Column()
  idProduto: number

  @JoinColumn({ name: 'idProduto' })
  @ManyToOne(() => Produto)
  produto: Produto

  @Column()
  idPessoa_tecelao: number

  @JoinColumn({ name: 'idPessoa_tecelao' })
  @ManyToOne(() => Pessoa)
  tecelao: Pessoa

  @Column({ type: 'float', precision: 4 })
  qtd: number

  @CreateDateColumn({ name: 'createdAt', type: 'timestamp', nullable: false })
  createAt: Date

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamp', nullable: false })
  updateAt: Date
}