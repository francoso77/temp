import { Body, Controller, Post } from "@nestjs/common"
import { AppDataSource } from '../data-source'
import Account from '../entity/account'
import Transaction from '../entity/transaction';


@Controller()
export class OutController {


  @Post("alterarPadrao")
  async alterarPadrao(): Promise<{ success: boolean; affected?: number; error?: any }> {
    try {
      const result = await AppDataSource
        .getRepository(Account)
        .update({ isDefault: true }, { isDefault: false });

      return { success: true, affected: result.affected };
    } catch (error) {
      return { success: false, error };
    }
  }

  @Post('selecaoTransacoes')
  async selecaoTransacoes(
    @Body('tipo') tipo?: { idTipoTransactionType: string; descricao: string },
    @Body('setor') setor?: { id: string; descricao: string },
    @Body('categoria') categoria?: string,
    @Body('conta') conta?: string,
    @Body('dtInicial') dtInicial?: string,
    @Body('dtFinal') dtFinal?: string,
  ): Promise<any[]> {

    const tipoValor = tipo?.descricao;
    const setorValor = setor?.descricao;

    const query = AppDataSource.getRepository(Transaction)
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.account', 'account')
      .leftJoinAndSelect('t.category', 'category')
      .leftJoinAndSelect('t.company', 'company')
      .select([
        't.id',
        't.date',
        't.amount',
        't.setor',
        't.type',
        't.description',
        'category.id',
        'category.name',
        'category.color',
        'account.id',
        'account.name',
        'company.id',
        'company.name',
        'account.initialBalance',
      ]);

    if (dtInicial && dtFinal) {
      query.andWhere('t.date BETWEEN :start AND :end', {
        start: dtInicial,
        end: dtFinal,
      });
    }

    if (setorValor) {
      query.andWhere('t.setor = :setorParam', { setorParam: setorValor });
    }

    if (tipoValor) {
      query.andWhere('t.type = :tipoParam', { tipoParam: tipoValor });
    }

    if (categoria) {
      query.andWhere('t.categoryId = :categoriaParam', { categoriaParam: categoria });
    }

    if (conta) {
      query.andWhere('t.accountId = :contaParam', { contaParam: conta });
    }

    const transacoes = await query.getMany();

    // Se não houver transações, trazer pelo menos a conta com o saldo inicial
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
          setor: setorValor ?? null,
          type: tipoValor ?? null,
          description: 'Sem transações no período',
          category: { name: null, color: null },
          company: { name: null },
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

