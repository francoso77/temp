import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PrazoEntregaInterface } from '../interfaces/prazoEntregaInterface';
import Pedido from './pedido.entity';

@Entity({ name: 'prazoentregas' })
export default class PrazoEntrega implements PrazoEntregaInterface {

  @PrimaryGeneratedColumn()
  idPrazoEntrega: number

  @Column({ length: 35 })
  nome: string

  @Column({ length: 35 })
  dias: string

  @OneToMany(() => Pedido, (pedido) => pedido.prazoEntrega)
  pedidos: Pedido[]

}