import React, { useContext, useEffect, useState } from "react";
import { Chip, Grid, Stack } from '@mui/material';
import CardEvento from './CardEvento';
import { useNavigate } from 'react-router-dom';
import { GlobalContext, GlobalContextInterface } from '../../ContextoGlobal/ContextoGlobal';
import { ProvaInterface } from '../../../../tambordog-backend/src/interfaces/provaInterface';
import ClsCrud from '../../Utils/ClsCrudApi';
import Inscricao from '../Inscricoes/Inscricoes';
import Condicional from '../../Componentes/Condicional/Condicional';

export default function EventosEmAberto() {
  return (
    <>
      Eventos em aberto
    </>
  )
  //   let idProvaLink: string = ''
  //   const clsCrud: ClsCrud = new ClsCrud()
  //   const { layoutState, setLayoutState, usuarioState, setMensagemState } = useContext(GlobalContext) as GlobalContextInterface
  //   const [rsProvas, setRsProvas] = useState<Array<ProvaInterface>>([])
  //   const handleClick = (oque: string) => {
  //     console.info('Ordenar os Eventos por ', oque);
  //   };

  //   const irPara = useNavigate()

  //   const handleClickIrPara = (id: string) => {
  //     if (!usuarioState.logado) {
  //       irPara("/Login")
  //       setLayoutState({ ...layoutState, titulo: "", pathTitulo: "/Login" })
  //     } else {
  //       irPara("/Inscricao")
  //       setLayoutState({ ...layoutState, titulo: "Cadastro de Atleta", pathTitulo: "/Atleta" })
  //     }
  //   }

  //   const buscarEtapasEmAberto = () => {
  //     clsCrud.pesquisar({
  //       entidade: 'Prova',
  //       criterio: {
  //         status: 'Recebendo Inscrições'
  //       },
  //       select: ['idProva', 'nomeProva', 'cidade', 'uf', 'dataProva'],
  //       msg: 'Buscando provas em aberto...',
  //       setMensagemState: setMensagemState
  //     })
  //       .then((rs: Array<ProvaInterface>) => {
  //         setRsProvas(rs)
  //         console.log(rs)
  //       })
  //   }

  //   useEffect(() => {
  //     buscarEtapasEmAberto()
  //   }, [])

  //   return (
  //     <>
  //       <Grid container justifyContent="center">
  //         <Grid item xs={12} sm={8} md={10} lg={8} xl={6}>
  //           <Stack direction="row" spacing={2} sx={{ marginLeft: 15, marginTop: 5 }}>
  //             <Chip
  //               label="Favoritos"
  //               onClick={() => handleClick('Favoritos')}
  //             />
  //             <Chip
  //               label="Circuitos"
  //               onClick={() => handleClick('Circuitos')}
  //             />
  //             <Chip
  //               label="Open"
  //               onClick={() => handleClick('Open')}
  //             />
  //           </Stack>
  //           {rsProvas.map((prova, i) => (

  //             <CardEvento
  //               key={i}
  //               titulo={prova.nomeProva}
  //               imagem={"logo512.png"}
  //               cidade={prova.cidade}
  //               uf={prova.uf}
  //               data={prova.dataProva}
  //               qtdInscritos={4}
  //               onClickCard={handleClickIrPara(prova.idProva)}
  //             />
  //           ))}
  //         </Grid>
  //         <Condicional condicao={localState.action === 'detalhes'}>
  //           <Grid item xs={12}>
  //             <Inscricao rsProva={ } />
  //           </Grid>
  //         </Condicional>
  //       </Grid>
  //     </>
  //   );
  // }
}