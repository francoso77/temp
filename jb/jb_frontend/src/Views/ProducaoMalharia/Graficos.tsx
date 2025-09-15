import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Highcharts3D from 'highcharts/highcharts-3d'
import { Dialog, Grid, IconButton, Paper, useMediaQuery, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Accessibility from 'highcharts/modules/accessibility'
import Condicional from '../../Componentes/Condicional/Condicional'
import DialogGraficos from '../../Componentes/Dialog/DialogGraficos'
import { ActionInterface, actionTypes } from '../../Interfaces/ActionInterface'
import { GraficoType } from '../../types/graficoTypes'

type MesesIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

interface MesesMapping {
    [index: number]: string
}

const meses: MesesMapping = {
    1: 'Janeiro',
    2: 'Fevereiro',
    3: 'Março',
    4: 'Abril',
    5: 'Maio',
    6: 'Junho',
    7: 'Julho',
    8: 'Agosto',
    9: 'Setembro',
    10: 'Outubro',
    11: 'Novembro',
    12: 'Dezembro',
}

// Função para obter o nome do mês a partir do índice
function obterMes(index: MesesIndex): string {
    return meses[index]
}

// Inicializa o módulo 3D
Highcharts3D(Highcharts)
Accessibility(Highcharts)

interface PropsInterface {
    open: boolean
    clickFechar: () => void
}

export default function Graficos({ open = false, clickFechar }: PropsInterface) {
    const [categoriaData, setCategoriaData] = useState<string[]>([])
    const [pesosData, setPesosData] = useState<number[]>([])
    const [qtdsData, setQtdsData] = useState<number[]>([])
    const [pizzaData, setPizzaData] = useState<[string, number][]>([])
    const [localState, setLocalState] = useState<ActionInterface>({ action: actionTypes.pessoa })
    const [dadosGrafico, setDadosGrafico] = useState<any[]>([])
    const [selectedValueRadio, setSelectedValueRadio] = useState<GraficoType>(GraficoType.mes)
    const [titulo, setTitulo] = useState("Produção Malharia por Mês")

    useEffect(() => {
        if (dadosGrafico) {
            let categoriaData: string[] = []
            const pesosData = dadosGrafico.map((item) => item.pesoTotal)

            if (selectedValueRadio === GraficoType.mes) {
                categoriaData = dadosGrafico.map((item) => obterMes(item.mes))
            } else if (selectedValueRadio === GraficoType.tecelao) {
                categoriaData = dadosGrafico.map((item) => item.tecelao)
            } else if (selectedValueRadio === GraficoType.produto) {
                categoriaData = dadosGrafico.map((item) => item.produto)
            } else if (selectedValueRadio === GraficoType.perda) {
                categoriaData = dadosGrafico.map((item) => item.tecelao)
            }

            const qtdsData = dadosGrafico.map((item) => item.qtdTotal)
            const produtosAtualizados: [string, number][] = dadosGrafico.map(dado =>
                [
                    selectedValueRadio === GraficoType.produto ? dado.produto
                        : selectedValueRadio === GraficoType.mes ? dado.mes
                            : dado.tecelao, dado.pesoTotal
                ])

            setPizzaData(produtosAtualizados)

            setCategoriaData(categoriaData)
            setPesosData(pesosData)
            setQtdsData(qtdsData)

            if (selectedValueRadio === GraficoType.mes) {
                setTitulo('Produção Malharia por Mês')
            } else if (selectedValueRadio === GraficoType.perda) {
                setTitulo('Perdas na Malharia por Tecelão')
            } else if (selectedValueRadio === GraficoType.produto) {
                setTitulo('Produção Malharia por Produto')
            } else if (selectedValueRadio === GraficoType.tecelao) {
                setTitulo('Produção Malharia por Tecelão')
            }

            const vazio = dadosGrafico.length

            if (vazio === 0) { setTitulo('NÃO HÁ DADOS NO TIPO OU NO INTERVALO DE DATAS !!!') }
        }

    }, [dadosGrafico])

    const btFechar = () => {
        setLocalState({ action: actionTypes.pessoa })
        setTitulo('Produção Malharia por Mês')
    }

    const setupColuna = {
        chart: {
            type: 'column',
            backgroundColor: '#f5f5f5',
            options3d: {
                enabled: true,
                alpha: 10, // Inclinação
                beta: 25,  // Rotação
                depth: 250, // Profundidade
            },
        },
        title: {
            text: titulo,
        },
        xAxis: {
            categories: categoriaData,
        },
        yAxis: {
            title: {
                text: 'Kg',
            },
            labels: {
                format: '{value}',
            },
        },
        plotOptions: {
            column: {
                depth: 50, // Profundidade das colunas
                dataLabels: {
                    enabled: true,
                },
            },
        },
        series: selectedValueRadio === GraficoType.perda ? [
            {
                name: 'Perdas',
                data: pesosData,
                color: '#7cb5ec', // Cor das colunas para produção
            },
            {
                name: 'Quantidade',
                data: qtdsData,
                color: '#434348', // Cor das colunas para quantidade
            },
        ] : [
            {
                name: 'Produção',
                data: pesosData,
                color: '#7cb5ec', // Cor das colunas para produção
            },
        ],
    }

    const setupPizza = {
        chart: {
            type: 'pie',
            backgroundColor: '#f5f5f5',
            options3d: {
                enabled: true,
                alpha: 45, // Inclinação
                beta: 0,   // Rotação
            },
        },
        title: {
            text: '',
        },
        plotOptions: {
            pie: {
                innerSize: 100,// Para criar um gráfico de rosquinha (opcional)
                depth: 45, // Profundidade da fatia do gráfico
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y:.2f}', // Formato para mostrar nome e valor
                },
            },
        },
        series: [
            {
                name: 'Total',
                data: pizzaData,
                type: 'pie',
            },
        ],
    }

    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Dialog
            open={open}
            onClose={btFechar}
            fullScreen={fullScreen}
            fullWidth
            maxWidth='md'
        >
            <Condicional condicao={localState.action === 'pessoa'}>
                <DialogGraficos
                    setDados={setDadosGrafico}
                    setLocalState={setLocalState}
                    clickFechar={clickFechar}
                    setSelectedValueRadio={setSelectedValueRadio}
                />
            </Condicional>
            <Condicional condicao={localState.action !== 'pessoa'}>
                <Grid item xs={12} sx={{ textAlign: 'right', m: { md: 0.5 } }}>
                    <IconButton onClick={() => btFechar()}>
                        <CloseIcon />
                    </IconButton>
                </Grid>

                <Paper variant="outlined" sx={{ padding: 0.5, m: 0.5 }}>
                    <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Grid item xs={12} md={12} sx={{ mt: 0.5, pl: { md: 0.5 } }}>
                            <HighchartsReact highcharts={Highcharts} options={setupColuna} />
                        </Grid>
                        <Condicional condicao={selectedValueRadio === GraficoType.produto}>
                            <Grid item xs={12} md={12} sx={{ mt: 0.5, pl: { md: 0.5 } }}>
                                <HighchartsReact highcharts={Highcharts} options={setupPizza} />
                            </Grid>
                        </Condicional>
                    </Grid>
                </Paper>
            </Condicional>
        </Dialog>
    )
}
