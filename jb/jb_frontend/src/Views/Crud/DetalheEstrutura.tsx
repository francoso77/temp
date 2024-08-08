import { Box, Dialog, Grid, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
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
import { TipoProdutoType } from '../../types/tipoProdutoypes';


interface PropsInterface {
  rsMaster: EstruturaInterface
  setRsMaster: React.Dispatch<React.SetStateAction<EstruturaInterface>>,
}

interface DetalheInterface {
  idEstrutura: null,
  idProduto: 0,
  nomeProduto: '',
  idCor: null,
  nomeCor: '',
  qtd: 0,
}

export default function DetalheEstrutura({ rsMaster, setRsMaster }: PropsInterface) {

  const validaCampo: ClsValidacao = new ClsValidacao()
  const clsCrud = new ClsCrud()

  const ResetDados: DetalheEstruturaInterface = {
    idEstrutura: null,
    idProduto: 0,
    idCor: null,
    qtd: 0,
  }


  const [open, setOpen] = useState(false);
  const { setMensagemState } = useContext(GlobalContext) as GlobalContextInterface;
  const { setLayoutState } = useContext(GlobalContext) as GlobalContextInterface;
  const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pesquisando });
  const [erros, setErros] = useState({});
  const [detalheEstrutura, setDetalheEstrutura] = useState<DetalheEstruturaInterface>(ResetDados);
  const [rsCor, setRsCor] = useState<Array<CorInterface>>([]);
  const [rsProduto, setRsProduto] = useState<Array<ProdutoInterface>>([]);
  const [rsDetalhe, setRsDetalhe] = useState<Array<any>>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof any>('nome');
  const [tipo, setTipo] = useState<TipoProdutoType>()
  const fieldRefs = useRef<(HTMLDivElement | null)[]>([]);
  let query: string = ''
  let nomeProduto: string = ''
  let nomeCor: string = ''

  const cabecalhoForm: Array<DataTableCabecalhoInterface> = [
    {
      cabecalho: 'Produto',
      alinhamento: 'left',
      campo: 'nomeProduto',
      // format: (_v, rs: any) => rs.produto.nome
    },
    {
      cabecalho: 'Cor',
      alinhamento: 'left',
      campo: 'nomeCor',
      // format: (_v, rs: any) => rs.idCor === null ? 'sem cor' : rs.cor.nome
    },
    {
      cabecalho: 'Qtd',
      alinhamento: 'left',
      campo: 'qtd'
    },
  ]

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof any,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const validarDados = (): boolean => {

    let retorno: boolean = true
    let erros: { [key: string]: string } = {}

    if (detalheEstrutura.idCor) {
      retorno = validaCampo.naoVazio('idCor', detalheEstrutura, erros, retorno, 'Escolha uma cor')
    }
    retorno = validaCampo.naoVazio('idProduto', detalheEstrutura, erros, retorno, 'Escolha um produto')
    retorno = validaCampo.naoVazio('qtd', detalheEstrutura, erros, retorno, 'Valor maior que 0')
    setErros(erros)
    return retorno
  }

  const pesquisarID = (id: string | number): Promise<DetalheEstruturaInterface> => {
    return clsCrud
      .pesquisar({
        entidade: "DetalheEstrutura",
        criterio: {
          idDetalheEstrutura: id,
        },
      })
      .then((rs: Array<DetalheEstruturaInterface>) => {
        return rs[0]
      })
  }

  const onEditar = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setDetalheEstrutura(rs)
      setLocalState({ action: actionTypes.editando })
    })
  }
  const onExcluir = (id: string | number) => {
    pesquisarID(id).then((rs) => {
      setDetalheEstrutura(rs)
      setLocalState({ action: actionTypes.excluindo })
    })
  }
  const btIncluir = () => {
    if (rsMaster.idProduto !== 0 && rsMaster.idUnidade !== 0 && rsMaster.qtdBase !== 0) {
      setOpen(true)
      BuscarDados()
      setDetalheEstrutura(ResetDados)
      setLocalState({ action: actionTypes.incluindo })
    } else {
      setMensagemState({
        titulo: 'Atenção',
        exibir: true,
        mensagem: 'Informe os dados do Produto base!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }
  }
  const btCancelar = () => {
    setOpen(false)
    // setErros({})
    // setDetalheEstrutura(ResetDados)
    // setLocalState({ action: actionTypes.pesquisando })
  }

  const pegaTipo = () => {
    let auxTipo: number | undefined = rsProduto.
      find(produto => produto.idProduto === detalheEstrutura.idProduto)?.tipoProduto;
    setTipo(auxTipo)
  }

  const btPulaCampo = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'Enter') {
      const nextField = fieldRefs.current[index];
      if (nextField) {
        const input = nextField.querySelector('input');
        if (input) {
          input.focus();
        }
      }
    }
  }

  const podeIncluirDetalhe = () => {
    const indice = rsMaster.detalheEstruturas.findIndex(
      (i) => i.idProduto === detalheEstrutura.idProduto
    )

    if (indice >= 0) {
      setMensagemState({
        titulo: 'Aviso',
        exibir: true,
        mensagem: 'Produto já cadastrado!',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
    }

    return indice < 0;

  }

  const testaSoma = (): boolean => {
    let somaQtd = 0.0
    rsMaster.detalheEstruturas.forEach((i) => somaQtd = somaQtd + i.qtd)
    somaQtd = somaQtd + detalheEstrutura.qtd

    if (somaQtd > rsMaster.qtdBase) {
      setMensagemState({
        titulo: 'Aviso',
        exibir: true,
        mensagem: 'A soma das quantidades informadas é de '.concat(somaQtd.toLocaleString()).concat('! A soma das quantidades deve ser menor ou igual a Qtd Base.'),
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      })
      return false;
    } else {
      return true;
    }
  }
  const btConfirmar = () => {

    if (validarDados() && podeIncluirDetalhe() && testaSoma()) {
      // setRsMaster({
      //   ...rsMaster, detalheEstruturas:
      //     [
      //       ...rsMaster.detalheEstruturas,
      //       {
      //         idEstrutura: detalheEstrutura.idEstrutura ? detalheEstrutura.idEstrutura : null,
      //         idProduto: detalheEstrutura.idProduto,
      //         idCor: detalheEstrutura.idCor,
      //         qtd: detalheEstrutura.qtd,
      //       }
      //     ]
      // })

      rsDetalhe.push({
        idEstrutura: detalheEstrutura.idEstrutura,
        idProduto: detalheEstrutura.idProduto,
        idCor: detalheEstrutura.idCor,
        qtd: detalheEstrutura.qtd,
      })
      console.log('entrou aqui')
      setOpen(false)
    }
  }

  const btPesquisar = () => {

    clsCrud
      .pesquisar({
        entidade: "DetalheEstrutura",
        relations: ["produto", "cor"],
        criterio: {
          idEstrutura: rsMaster.idEstrutura,
        },
        camposLike: ["idEstrutura"],
        setMensagemState: setMensagemState
      })
      .then((rs: Array<any>) => {
        let det: Array<DetalheInterface> = []
        rs.forEach((x) => {

          console.log('Produto: ', x.idProduto)
          console.log('Nome Produto: ', x.produto.nome)
          console.log('Cor: ', x.idCor)
          console.log('Nome Cor: ', x.cor.nome)
          console.log('Qtd: ', x.qtd)
          det.push({
            idEstrutura: x.idEstrutura,
            nomeProduto: x.produto.nome,
            idProduto: x.idProduto,
            idCor: x.idCor,
            nomeCor: x.idCor === null ? null : x.cor.nome,
            qtd: x.qtd,
          })

        })
        setRsDetalhe(det)
      })
    // query = `
    // SELECT 
    //     de.*,
    //     p.nome AS nomeProduto,
    //     c.nome AS nomeCor
    // FROM 
    //     detalheestruturas de
    // INNER JOIN 
    //     estruturas e ON e.idEstrutura = de.idEstrutura
    // INNER JOIN 
    //     produtos p ON p.idProduto = de.idProduto
    // INNER JOIN 
    //     cores c ON c.idCor = de.idCor
    // WHERE 
    //     de.idEstrutura = ${rsMaster.idEstrutura};
    // `;
    // clsCrud
    //   .query({
    //     entidade: "Estrutura",
    //     sql: query,
    //     msg: 'Pesquisando Estruturas ...',
    //     setMensagemState: setMensagemState
    //   })
    //   .then((rs: Array<any>) => {
    //     // setRsPesquisa(rs)
    //     setRsMaster(rs)
    //   })
  }

  const BuscarDados = () => {
    query = `
      SELECT 
          p.idProduto, p.nome, p.tipoProduto
      FROM 
          produtos p
      WHERE 
          p.idProduto <> ${rsMaster.idProduto}
      ORDER BY p.nome ASC;
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
    setOpen(false);
    irpara('/Estrutura')
    setLocalState({ action: actionTypes.pesquisando })
    // setEstruturaState({ action: actionTypes.pesquisando })
    setLayoutState({
      titulo: 'Estruturas de Produtos',
      tituloAnterior: 'Composição de estrutura',
      pathTitulo: '/Estrutura',
      pathTituloAnterior: '/DetalheEstrutura'
    })
  }

  useEffect(() => {
    btPesquisar()

  }, [])

  return (
    <>
      <Dialog open={open} sx={{
        width: '95%', // Ajuste esta porcentagem conforme necessário
        height: '80vh', // Ajuste esta altura conforme necessário
        maxWidth: 'none',
        maxHeight: 'none',
      }}>
        <Paper variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', m: 1, padding: 1.5 }}>
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Typography>
              Item da estrutura do produto
            </Typography>
          </Grid>
        </Paper>
        <Condicional condicao={localState.action !== 'pesquisando'}>
          <Paper variant="outlined" sx={{ padding: 1.5, m: 1 }}>
            <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item xs={12} sm={6} sx={{ mt: 2 }}>
                <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
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
                    onSelect={pegaTipo}
                    onKeyDown={
                      tipo === 10 ? (event) => btPulaCampo(event, 1)
                        : (event) => btPulaCampo(event, 2)
                    }
                    autoFocus
                  />
                </Box>
              </Grid>
              <Condicional condicao={[2, 3, 6, 10, 11].includes(tipo as number)}>
                <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
                  <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
                    <ComboBox
                      opcoes={rsCor}
                      campoDescricao="nome"
                      campoID="idCor"
                      dados={detalheEstrutura}
                      mensagemPadraoCampoEmBranco="Escolha uma cor"
                      field="idCor"
                      label="Cores"
                      erros={erros}
                      setState={setDetalheEstrutura}
                      onSelect={pegaTipo}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(event) => btPulaCampo(event, 2)}
                    />
                  </Box>
                </Grid>
              </Condicional>
              <Grid item xs={3} md={2} sx={{ mt: 2, pl: { md: 1 } }}>
                <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
                  <InputText
                    tipo='currency'
                    scale={2}
                    label="Qtd"
                    dados={detalheEstrutura}
                    field="qtd"
                    setState={setDetalheEstrutura}
                    disabled={localState.action === 'excluindo' ? true : false}
                    erros={erros}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(event: any) => btPulaCampo(event, 0)}
                  />
                </Box>
              </Grid>
              <Condicional condicao={localState.action !== 'pesquisando'}>
                <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
                  <Tooltip title={'Cancelar'}>
                    <IconButton
                      color="secondary"
                      sx={{ mt: 3, ml: 2 }}
                      onClick={() => btCancelar()}
                    >
                      <CancelRoundedIcon sx={{ fontSize: 50 }} />
                    </IconButton>
                  </Tooltip>
                  <Condicional condicao={['incluindo', 'editando'].includes(localState.action)}>
                    <Tooltip title={'Confirmar'}>
                      <IconButton
                        color="secondary"
                        sx={{ mt: 3, ml: 2 }}
                        onClick={() => btConfirmar()}
                      >
                        <CheckCircleRoundedIcon sx={{ fontSize: 50 }} />
                      </IconButton>
                    </Tooltip>
                  </Condicional>

                  <Condicional condicao={localState.action === 'excluindo'}>
                    <Tooltip title={'Excluir'}>
                      <IconButton
                        color="secondary"
                        sx={{ mt: 3, ml: 2 }}
                        onClick={() => btConfirmar()}
                      >
                        <DeleteIcon sx={{ fontSize: 60 }} />
                      </IconButton>
                    </Tooltip>
                  </Condicional>
                </Grid>
              </Condicional>
            </Grid>
          </Paper >
        </Condicional>
      </Dialog>
      <Paper sx={{ m: 0, p: 0 }}>
        <Grid item xs={12} sx={{ mb: 1, textAlign: 'center' }}>
          <Tooltip title={'Incluir'}>
            <IconButton
              color="secondary"
              sx={{ mt: -1, ml: { xs: 1, md: 0.5 } }}
              onClick={() => btIncluir()}
            >
              <AddCircleIcon sx={{ fontSize: 50 }} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={12}>
          <DataTable
            colunaSoma='qtd'
            temTotal={true}
            qtdColunas={2}
            cabecalho={cabecalhoForm}
            dados={rsDetalhe}
            // acoes={[
            //   {
            //     icone: "edit",
            //     onAcionador: (rs: DetalheEstruturaInterface) =>
            //       onEditar(rs.idDetalheEstrutura as number),
            //     toolTip: "Editar",
            //   },
            //   {
            //     icone: "delete",
            //     onAcionador: (rs: DetalheEstruturaInterface) =>
            //       onExcluir(rs.idDetalheEstrutura as number),
            //     toolTip: "Excluir",
            //   },
            // ]}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
        </Grid>
      </Paper>

    </>
  )
}