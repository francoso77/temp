import { useEffect, useRef, useState } from 'react'
import { ProdutoInterface } from '../../../../jb_backend/src/interfaces/produtoInterface'
import { CorInterface } from '../../../../jb_backend/src/interfaces/corInteface'
import { PessoaInterface } from '../../../../jb_backend/src/interfaces/pessoaInterface'
import ClsFormatacao from '../../Utils/ClsFormatacao'
import ClsApi from '../../Utils/ClsApi'
import ClsCrud from '../../Utils/ClsCrudApi'
import { Box, Grid, IconButton, Paper } from '@mui/material'
import ComboBox from '../../Componentes/ComboBox'
import InputText from '../../Componentes/InputText'
import CloseIcon from '@mui/icons-material/Close'


export const ConsultaEstoque = () => {

  const clsFormatacao = new ClsFormatacao()
  const clsApi = new ClsApi()
  const clsCrud = new ClsCrud()

  const fieldRefs = useRef<(HTMLDivElement | null)[]>([])

  const [rsProdutos, setRsProdutos] = useState<Array<ProdutoInterface>>([])
  const [rsCores, setRsCores] = useState<Array<CorInterface>>([])
  const [rsFornecedores, setRsFornecedores] = useState<Array<PessoaInterface>>([])
  const [rsPesquisa, setRsPesquisa] = useState<Array<any>>([])
  const [erros, setErros] = useState({})


  const BuscarDados = () => {

    clsCrud.pesquisar({
      entidade: 'Produto',
      campoOrder: ['nome'],
    })
      .then((rsProdutos: Array<ProdutoInterface>) => {
        setRsProdutos(rsProdutos)
      })

    clsCrud.pesquisar({
      entidade: 'Cor',
      campoOrder: ['nome'],
    })
      .then((rsCores: Array<CorInterface>) => {
        setRsCores(rsCores)
      })

    clsCrud.pesquisar({
      entidade: 'Pessoa',
      campoOrder: ['nome'],
    })
      .then((rsFornecedores: Array<PessoaInterface>) => {
        setRsFornecedores(rsFornecedores)
      })
  }

  const btFechar = () => {

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

  useEffect(() => {
    BuscarDados()
  })
  return (
    <div>
      <Paper variant="outlined" sx={{ padding: 0.5, m: 0.5 }}>
        <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Grid item xs={12} sx={{ textAlign: 'right', mt: 0, mr: -5, mb: -5 }}>
            <IconButton onClick={() => btFechar()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ mt: 0.5 }}>
            <Box ref={(el: any) => (fieldRefs.current[0] = el)}>
              <ComboBox
                opcoes={rsProdutos}
                campoDescricao="nome"
                campoID="idProduto"
                dados={producaoMalharia}
                mensagemPadraoCampoEmBranco=""
                field="idProduto"
                label="Produtos"
                erros={erros}
                setState={setProducaoMalharia}
                onFocus={(e) => e.target.select()}
                onKeyDown={(event) => btPulaCampo(event, 1)}
                tamanhoFonte={25}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mt: 0.5 }} >
            <Box ref={(el: any) => (fieldRefs.current[1] = el)}>
              <ComboBox
                opcoes={rsCores}
                campoDescricao="nome"
                campoID="idCor"
                dados={producaoMalharia}
                mensagemPadraoCampoEmBranco=""
                field="idCor"
                label="Cores"
                erros={erros}
                setState={setProducaoMalharia}
                onFocus={(e) => e.target.select()}
                onKeyDown={(event) => btPulaCampo(event, 2)}
                tamanhoFonte={25}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mt: 0.5 }} >
            <Box ref={(el: any) => (fieldRefs.current[2] = el)}>
              <ComboBox
                opcoes={TurnoTypes}
                campoDescricao="descricao"
                campoID="idTurno"
                dados={producaoMalharia}
                mensagemPadraoCampoEmBranco="Qual o turno"
                field="turno"
                label="Turno"
                erros={erros}
                setState={setProducaoMalharia}
                onFocus={(e) => e.target.select()}
                onKeyDown={(event) => btPulaCampo(event, 3)}
                tamanhoFonte={25}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ mt: 0.5 }}>
            <Box ref={(el: any) => (fieldRefs.current[3] = el)}>
              <ComboBox
                opcoes={rsFornecedores}
                campoDescricao="nome"
                campoID="idPessoa"
                dados={producaoMalharia}
                mensagemPadraoCampoEmBranco=""
                field="idPessoa_fornecedor"
                label="Fornecedor"
                erros={erros}
                setState={setProducaoMalharia}
                onFocus={(e) => e.target.select()}
                onKeyDown={(event: any) => btPulaCampo(event, 4)}
                tamanhoFonte={25}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 0.5 }}>
            <Box ref={(el: any) => (fieldRefs.current[5] = el)}>
              <InputText
                tipo='uppercase'
                label="Quantidade"
                dados={producaoMalharia}
                field="qtd"
                setState={setProducaoMalharia}
                erros={erros}
                onFocus={(e) => e.target.select()}
                onKeyDown={(event: any) => btPulaCampo(event, 7)}
                tamanhoFonte={25}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ mt: 0 }}>
            <Box ref={(el: any) => (fieldRefs.current[6] = el)}>
              <InputText
                type='tel'
                tipo="date"
                label="Data"
                posicaoLabel={'bottom'}
                dados={producaoMalharia}
                field="dataProducao"
                setState={setProducaoMalharia}
                erros={erros}
                onFocus={(e) => e.target.select()}
                onKeyDown={(event: any) => btPulaCampo(event, 7)}
                tamanhoFonte={40}
                textAlign={'center'}
                labelAlign={'center'}
                corFundo={'#cbdce9'}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3} sx={{ mt: 0 }}>
            <Box ref={(el: any) => (fieldRefs.current[7] = el)}>
              <InputText
                tipo='currency'
                scale={3}
                label="Peso"
                posicaoLabel={'bottom'}
                dados={producaoMalharia}
                field="peso"
                setState={setProducaoMalharia}
                erros={erros}
                onFocus={(e) => e.target.select()}
                onKeyDown={(event: any) => btPulaCampo(event, 8)}
                tamanhoFonte={40}
                textAlign={'center'}
                labelAlign={'center'}
                corFundo={'#cbdce9'}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ mt: 0 }}>
            <Box ref={(el: any) => (fieldRefs.current[8] = el)}>
              <InputText
                tipo='number'
                label="Peça"
                posicaoLabel={'bottom'}
                dados={producaoMalharia}
                field="peca"
                setState={setProducaoMalharia}
                disabled={true}
                erros={erros}
                onFocus={(e) => e.target.select()}
                tamanhoFonte={40}
                textAlign={'center'}
                labelAlign={'center'}
                corFundo={'#cbdce9'}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}