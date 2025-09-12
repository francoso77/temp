import { Box, Card, CardActions, CardContent, CardHeader, Collapse, IconButton, IconButtonProps, Switch, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import ClsCrud from '../../Utils/ClsCrudApi';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { MensagemTipo } from '../../ContextoGlobal/MensagemState';
import { PermissaoInterface } from '../../Views/Usuario/UsuariosPermissoes';
import ClsApi from '../../Utils/ClsApi';
import { PermissoesTypeInterface, PermissoesTypes } from '../../types/permissoesTypes';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));
interface propsInterface {
  modulo: string;
  permissoes: Array<PermissaoInterface>;
}

export function CardPermissao({ modulo, permissoes }: propsInterface) {

  const [expanded, setExpanded] = useState(false);
  const clsCrud: ClsCrud = new ClsCrud()
  const clsApi: ClsApi = new ClsApi()
  const { setUsuarioState, usuarioState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  const [localPermissoes, setLocalPermissoes] = useState(permissoes);

  const handleExpandClick = () => { setExpanded(!expanded) };

  // Função para ativar/desativar permissão
  const togglePermissao = async (item: PermissaoInterface, novoValor: boolean) => {
    const dados = { idModuloPermissao: item.idModuloPermissao, idUsuario: item.idUsuario };

    try {
      let resultado;

      if (novoValor && !item.ativo) {
        // Incluir apenas se ainda não existir
        resultado = await clsCrud.incluir({ entidade: "UsuarioPermissao", criterio: dados, token: usuarioState.token });
      } else if (!novoValor && item.ativo) {
        // Excluir apenas se já existir
        resultado = await clsCrud.excluir({ entidade: "UsuarioPermissao", criterio: dados, token: usuarioState.token });
      } else {
        return; // Nada a fazer
      }

      if (!resultado.ok) {
        console.error(resultado);
        setMensagemState({
          titulo: 'Erro...',
          exibir: true,
          mensagem: `Não foi possível ${novoValor ? 'ativar' : 'desativar'} a permissão - Consulte Suporte`,
          tipo: MensagemTipo.Error,
          exibirBotao: true,
          cb: null
        });
        return;
      } else {

        // Atualiza estado global do menu
        clsApi.execute<PermissoesTypeInterface>({
          url: 'updatePermissoesUsuario',
          method: 'post',
          token: usuarioState.token
        })
      }

      // Atualiza estado local para refletir a mudança imediatamente
      setLocalPermissoes(prev =>
        prev.map(p =>
          p.idModuloPermissao === item.idModuloPermissao
            ? { ...p, ativo: novoValor }
            : p
        )
      );

    } catch (error) {
      console.error(error);
      setMensagemState({
        titulo: 'Erro...',
        exibir: true,
        mensagem: 'Ocorreu um erro ao atualizar a permissão',
        tipo: MensagemTipo.Error,
        exibirBotao: true,
        cb: null
      });
    }
  };

  useEffect(() => {
    setLocalPermissoes(permissoes);
  }, [permissoes]);

  return (
    <>
      <Card sx={{ mb: 1, mt: 1 }} >
        <CardHeader
          action={
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          }
          title={modulo}
          titleTypographyProps={{
            sx: {
              fontSize: '1rem', // diminui o tamanho da fonte
              fontWeight: 500,  // opcional, ajusta a espessura
            },
          }}
          sx={{
            padding: '3px 5px', // diminui os espaçamentos internos do CardHeader
          }}
        />

        <CardActions disableSpacing>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {localPermissoes.map((item, index) => (
              <CardContent key={index}>
                <Box sx={{ display: "flex", alignItems: "left", bgcolor: "#f5f5f5", ml: 10 }}>
                  <Typography sx={{ fontSize: 15 }}>
                    {item.permissao}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Switch
                    sx={{ ml: 15 }}
                    checked={Boolean(item.ativo)}
                    color="primary"
                    size="small"
                    onChange={async (event) => togglePermissao(item, event.target.checked)}
                  />
                </Box>
              </CardContent>
            ))}
          </Collapse>
        </CardActions>
      </Card>
    </>
  );
}