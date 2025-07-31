import { Body, Controller, Post } from "@nestjs/common"
import { AppDataSource } from '../data-source'
import Account from '../entity/account'
import Transaction from '../entity/transaction';


@Controller()
export class OutController {


  @Post("alterarPadrao")
  async alterarPadrao(
    @Body("idUsuario") idUsuario: string
  ): Promise<{ success: boolean; affected?: number; error?: any }> {
    try {
      const result = await AppDataSource
        .getRepository(Account)
        .update(
          { isDefault: true, userId: idUsuario },
          { isDefault: false }
        );

      return { success: true, affected: result.affected };
    } catch (error) {
      return { success: false, error };
    }
  }

  @Post('selecaoTransacoes')
  async selecaoTransacoes(
    @Body('setor') setor?: string,
    @Body('categoria') categoria?: string,
    @Body('conta') conta?: string,
    @Body('dtInicial') dtInicial?: string,
    @Body('dtFinal') dtFinal?: string,
    @Body('idUsuario') idUsuario?: string,
    @Body('tipo') tipo?: string,
    @Body('empresa') empresa?: string,
    @Body('descricao') descricao?: string
  ): Promise<any[]> {

    const query = AppDataSource.getRepository(Transaction)
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.account', 'account')
      .leftJoinAndSelect('t.category', 'category')
      .leftJoinAndSelect('t.company', 'company')
      .leftJoinAndSelect('t.sector', 'sector')
      .select([
        't.id',
        't.date',
        't.amount',
        't.description',
        't.userId',
        't.qtd',
        'category.id',
        'category.name',
        'category.color',
        'category.type',
        'account.id',
        'account.name',
        'account.initialBalance',
        'company.id',
        'company.name',
        'sector.id',
        'sector.name'
      ])
      .orderBy('t.date', 'ASC')
      .addOrderBy('t.description', 'ASC');

    if (dtInicial && dtFinal) {
      query.andWhere('t.date BETWEEN :start AND :end', {
        start: dtInicial,
        end: dtFinal,
      });
    }

    if (empresa) {
      query.andWhere('company.id = :empresaParam', { empresaParam: empresa });
    }

    if (tipo) {
      query.andWhere('category.type = :tipoParam', { tipoParam: tipo });
    }

    if (setor) {
      query.andWhere('t.sectorId = :setorParam', { setorParam: setor });
    }

    if (categoria) {
      query.andWhere('t.categoryId = :categoriaParam', { categoriaParam: categoria });
    }

    if (conta) {
      query.andWhere('t.accountId = :contaParam', { contaParam: conta });
    }

    if (idUsuario) {
      query.andWhere('t.userId = :idUsuarioParam', { idUsuarioParam: idUsuario });
    }

    if (descricao) {
      query.andWhere('LOWER(t.description) LIKE :descricaoParam', {
        descricaoParam: `%${descricao.toLowerCase()}%`,
      });
    }

    const transacoes = await query.getMany();

    if (transacoes.length === 0 && conta) {
      const accountRepo = AppDataSource.getRepository('Account');
      const account = await accountRepo.findOne({
        where: { id: conta },
        select: ['id', 'name', 'initialBalance'],
      });

      if (account) {
        return [{
          id: null,
          date: null,
          amount: null,
          description: 'Sem transações no período',
          category: { name: null, color: null, type: null },
          company: { name: null },
          sector: { name: null },
          account: {
            name: account.name,
            initialBalance: account.initialBalance,
          },
        }];
      }
    }

    return transacoes;
  }

}

