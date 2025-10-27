// notificacao.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { StatusType } from '../interfaces/types/status'

@Entity({ name: "notificacoes" })
export class Notificacao {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ length: 255 })
  message: string

  @Column({})
  type: StatusType

  @Column({ nullable: true })
  link?: string

  @Column()
  destinatarioId: string

  @Column({
    type: "enum",
    enum: ["vendedor", "cliente"],
  })
  destinatarioTipo: "vendedor" | "cliente"

  @Column({ nullable: true })
  pedidoClienteId?: number

  @Column({ nullable: true })
  pedidoVendedorId?: number

  @Column({ nullable: true })
  vendedorWhatsapp?: string

  @Column({ default: false })
  read: boolean

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
