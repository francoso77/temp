import { Autocomplete, Container, Dialog, Grid, IconButton, InputLabel, Paper, Select, Tooltip } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface';
import Condicional from '../../Componentes/Condicional/Condicional';
import ClsValidacao from '../../Utils/ClsValidacao';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import ClsCrud from '../../Utils/ClsCrudApi';
import DataTable, { DataTableCabecalhoInterface, Order } from '../../Componentes/DataTable';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DeleteIcon from '@mui/icons-material/Delete';
import InputText from '../../Componentes/InputText';
import ShowText from '../../Componentes/ShowText';
import ComboBox from '../../Componentes/ComboBox';
import { DetalheEstruturaInterface, EstruturaInterface } from '../../../../jb_backend/src/interfaces/estruturaInterface';
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface';
import { CorInterface } from '../../../../jb_backend/src/interfaces/corInteface';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Text from '../../Componentes/Text';
import InputSelect from '../../Componentes/Select';



interface PropsInterface {
  rsEstrutura: EstruturaInterface
}

type createDetalheEstrutura = z.infer<typeof schemaDetalheEstrutura>

const schemaDetalheEstrutura = z.object({
  idEstrutura: z.number(),
  detalhe: z.array(z.object({
    idProduto: z.number(),
    idCor: z.number(),
    qtd: z
      .number()
      .nonnegative('Quantidade deve ser maior que zero'),
  }))
})
export default function DetalheEstrutura({ rsEstrutura }: PropsInterface) {

  const { register, handleSubmit, formState: { errors }, control } = useForm<createDetalheEstrutura>({
    resolver: zodResolver(schemaDetalheEstrutura),
  })

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'detalhe',
  })

  function createDetalheEstrutura(data: any) {

    console.log(data)

  }
  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const ResetDados: DetalheEstruturaInterface = {
    idEstrutura: rsEstrutura.idEstrutura as number,
    idProduto: 0,
    idCor: 0,
    qtd: 0,
  }

  interface PesquisaInterface {
    nome: string
  }

  const [open, setOpen] = useState(true);
  const [selectedValue, setSelectedValue] = useState('');

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.incluindo })
  const [rsPesquisa, setRsPesquisa] = useState<Array<DetalheEstruturaInterface>>([])
  const [nomeProduto, setNomeProduto] = useState<PesquisaInterface>({ nome: '' })
  const [erros, setErros] = useState({})
  const [detalheEstrutura, setDetalheEstrutura] = useState<DetalheEstruturaInterface>(ResetDados)
  const [rsCor, setRsCor] = useState<Array<CorInterface>>([])
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([])
  // const [pesquisa, setPesquisa] = useState<PesquisaInterface>({ nome: '' })
  // const [order, setOrder] = useState<Order>('asc');
  // const [orderBy, setOrderBy] = useState<keyof any>('nome');
  const dadosTabela: Array<DetalheEstruturaInterface> = [];

  // const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
  //   {
  //     cabecalho: 'Produto',
  //     alinhamento: 'left',
  //     campo: 'nomeProduto'
  //   },
  //   {
  //     cabecalho: 'Cor',
  //     alinhamento: 'left',
  //     campo: 'nomeCor'
  //   },
  //   {
  //     cabecalho: 'Qtd',
  //     alinhamento: 'left',
  //     campo: 'qtd'
  //   },
  // ]

  // const handleRequestSort = (
  //   event: React.MouseEvent<unknown>,
  //   property: keyof any,
  // ) => {
  //   const isAsc = orderBy === property && order === 'asc';
  //   setOrder(isAsc ? 'desc' : 'asc');
  //   setOrderBy(property);
  // };

  // const pesquisarID = (id: string | number): Promise<DetalheEstruturaInterface> => {
  //   return clsCrud
  //     .pesquisar({
  //       entidade: "DetalheEstrutura",
  //       criterio: {
  //         idDetalheEstrutura: id,
  //       },
  //     })
  //     .then((rs: Array<DetalheEstruturaInterface>) => {
  //       return rs[0]
  //     })
  // }

  // const onEditar = (id: string | number) => {
  //   pesquisarID(id).then((rs) => {
  //     setDetalheEstrutura(rs)
  //     setLocalState({ action: actionTypes.editando })
  //   })
  // }
  // const onExcluir = (id: string | number) => {
  //   pesquisarID(id).then((rs) => {
  //     setDetalheEstrutura(rs)
  //     setLocalState({ action: actionTypes.excluindo })
  //   })
  // }
  // const btIncluir = () => {
  //   setDetalheEstrutura(ResetDados)
  //   setLocalState({ action: actionTypes.incluindo })
  // }
  const btCancelar = () => {
    setErros({})
    setDetalheEstrutura(ResetDados)
    setLocalState({ action: actionTypes.pesquisando })
  }

  const AdicionarDados = () => {
    append({ idProduto: 0, idCor: 0, qtd: 0 })
  }

  const recebeDados = () => {


    dadosTabela.push(detalheEstrutura)
    console.log(dadosTabela)
    setRsPesquisa(dadosTabela)

  }

  const validarDados = (): boolean => {
    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    retorno = validaCampo.naoVazio('idProduto', detalheEstrutura, erros, retorno, 'Escolha um produto')
    retorno = validaCampo.naoVazio('idCor', detalheEstrutura, erros, retorno, 'Escolha uma cor')
    retorno = validaCampo.naoVazio('qtd', detalheEstrutura, erros, retorno, 'A quantidade deve ser maior que 0')
    setErros(erros)
    return retorno
  }

  const btConfirmar = () => {

    if (validarDados()) {

      if (localState.action === actionTypes.incluindo || localState.action === actionTypes.editando) {
        clsCrud.incluir({
          entidade: "DetalheEstrutura",
          criterio: detalheEstrutura,
          localState: localState.action,
          cb: () => btPesquisar(),
          setMensagemState: setMensagemState
        })
          .then((rs) => {
            if (rs.ok) {
              setLocalState({ action: actionTypes.pesquisando })
            } else {
              setMensagemState({
                titulo: 'Erro...',
                exibir: true,
                mensagem: 'Erro no cadastro - Consulte Suporte',
                tipo: MensagemTipo.Error,
                exibirBotao: true,
                cb: null
              })
            }
          })
      } else if (localState.action === actionTypes.excluindo) {
        clsCrud.excluir({
          entidade: "DetalheEstrutura",
          criterio: {
            idDetalheEstrutura: detalheEstrutura.idDetalheEstrutura
          },
          cb: () => btPesquisar(),
          setMensagemState: setMensagemState
        })
          .then((rs) => {
            if (rs.ok) {
              setLocalState({ action: actionTypes.pesquisando })
            } else {
              setMensagemState({
                titulo: 'Erro...',
                exibir: true,
                mensagem: 'Erro no cadastro - Consulte Suporte',
                tipo: MensagemTipo.Error,
                exibirBotao: true,
                cb: null
              })
            }
          })
      }
    }
  }

  const btPesquisar = () => {
    const query = `
    SELECT
        de.*,
        p.nome AS nomeProduto,
        c.nome AS nomeCor
    FROM
        detalheestruturas de
    INNER JOIN
        estruturas e ON e.idEstrutura = de.idEstrutura
    INNER JOIN
        produtos p ON p.idProduto = de.idProduto
    INNER JOIN
        cores c ON c.idCor = de.idCor
    WHERE
        de.idEstrutura = ${rsEstrutura.idEstrutura};
    `;
    clsCrud
      .query({
        entidade: "Estrutura",
        sql: query,
        msg: 'Pesquisando Estruturas ...',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        setRsPesquisa(rs)
      })
  }

  const BuscarDados = () => {

    let query: string = `
    SELECT
        e.*,
        p.nome AS nomeProduto
    FROM
        estruturas e
    INNER JOIN
        produtos p ON p.idProduto = e.idProduto
    WHERE
        e.idEstrutura = ${rsEstrutura.idEstrutura};
    `;

    clsCrud
      .query({
        entidade: "Estrutura",
        sql: query,
        msg: '',
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        setNomeProduto({ nome: rs[0].nomeProduto })
      })

    query = `
      SELECT
          p.*
      FROM
          produtos p
      INNER JOIN
          tipoprodutos t ON t.idTipoProduto = p.idTipoProduto
      WHERE
          t.estrutura = true;
      `;
    clsCrud
      .query({
        entidade: "Produto",
        sql: query,
        msg: '',
        setMensagemState: setMensagemState
      })
      .then((rsProdutos: Array<ProdutoInterface>) => {
        setRsProduto(rsProdutos)
      })

    clsCrud
      .pesquisar({
        entidade: "Cor",
      })
      .then((rsCores: Array<CorInterface>) => {
        setRsCor(rsCores)
      })
  }

  const irpara = useNavigate()
  const btFechar = () => {
    irpara('/Estrutura')
    setLocalState({ action: actionTypes.pesquisando })

    setLayoutState({
      titulo: 'Cadasto de Estruturas',
      tituloAnterior: 'Composição de Estrutura',
      pathTitulo: '/Estrutura',
      pathTituloAnterior: '/DetalheEstrutura'
    })
  }

  useEffect(() => {
    BuscarDados()
    setLayoutState({
      titulo: 'Composição de Estrutura',
      tituloAnterior: 'Cadasto de Estruturas',
      pathTitulo: '/DetalheEstrutura',
      pathTituloAnterior: '/Estrutura'
    })
  }, [])

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>

          <Grid item xs={4}>
            <ShowText
              titulo="Estrutura do produto"
              descricao={nomeProduto.nome} />
          </Grid>
          <Grid item xs={4}>
            <ShowText
              titulo="Qtd Base"
              descricao={rsEstrutura.qtdBase.toString()} />
          </Grid>
          <Grid item xs={4} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>

          <Grid item xs={12} sm={12} sx={{ mt: 2 }}>

            <Tooltip title={'Confirmar'}>
              <IconButton
                color="secondary"
                sx={{ mt: 3, ml: 2 }}
                onClick={() => AdicionarDados()}
              >
                <AddCircleIcon sx={{ fontSize: 25 }} />
              </IconButton>
            </Tooltip>
          </Grid>
          {fields.map((field, index) => {
            return (
              <>
                <Grid key={field.id} item xs={12} sm={4} sx={{ mt: 2 }}>
                  <ComboBox
                    opcoes={rsProduto}
                    campoDescricao="nome"
                    campoID="idProduto"
                    dados={detalheEstrutura}
                    mensagemPadraoCampoEmBranco="Escolha um produto"
                    field="idProduto"
                    label="Produtos"
                    erros={erros}
                    setState={setDetalheEstrutura}
                    {...register(`detalhe.${index}.idProduto`)}
                  />
                  {/* {errors.idProduto && <span>{errors.idProduto.message}</span>} */}
                </Grid>
                <Grid item xs={12} sm={4} sx={{ mt: 2 }}>

                  <InputSelect
                    label=''
                    dados={detalheEstrutura}
                    field={'idCor'}
                    nomeCampoChaveOpcoes='idCor'
                    nomeCampoDescricaoOpcoes='nome'
                    erros={erros}
                    opcoes={rsCor}
                    setState={setDetalheEstrutura}
                    {...register(`detalhe.${index}.idCor`)}
                  />

                  {/* {errors.idCor && <span>{errors.idCor.message}</span>} */}

                </Grid>
                <Grid item xs={3} md={2} sx={{ mt: 2.5, pl: { md: 2 } }}>
                  <input
                    type='number'
                    disabled={localState.action === 'excluindo' ? true : false}
                    {...register(`detalhe.${index}.qtd`)}
                  />
                  {/* {errors.qtd && <span>{errors.qtd.message}</span>} */}

                </Grid>

              </>
            )
          })}


        </Grid>
      </Paper >
    </Container >
  )
}