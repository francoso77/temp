import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../entities/sistema/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
  ) { }

  /**
   * Encontra um usuário pelo ID
   * @param idUsuario ID do usuário
   */
  async findById(id: number): Promise<Usuario> {
    const user = await this.userRepository.findOne({ where: { idUsuario: id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  /**
   * Encontra um usuário pelo e-mail
   * @param email Email do usuário
   */
  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  /**
   * Atualiza os dados de um usuário
   * @param id ID do usuário
   * @param updateData Dados para atualizar
   */
  async updateUser(id: number, updateData: Partial<Usuario>): Promise<Usuario> {
    const user = await this.findById(id);
    Object.assign(user, updateData);
    return await this.userRepository.save(user);
  }

  /**
   * Lista todos os usuários
   */
  async findAll(): Promise<Usuario[]> {
    return await this.userRepository.find();
  }

  /**
   * Cria um novo usuário
   * @param userData Dados do novo usuário
   */
  async createUser(userData: Partial<Usuario>): Promise<Usuario> {
    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
  }

  async findByResetToken(token: string): Promise<Usuario | null> {
    return await this.userRepository.findOne({ where: { resetToken: token } });
  }

}
