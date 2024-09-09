import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Highcharts3D from 'highcharts/highcharts-3d'
import ClsCrud from '../../Utils/ClsCrudApi'
import { Dialog, Grid, IconButton, Paper, useMediaQuery, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Accessibility from 'highcharts/modules/accessibility'

type MesesIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

interface MesesMapping {
    [index: number]: string
}

interface GraficoColunaInterface {
    mes: MesesIndex
    pesoTotal: number
    qtdTotal: number
}

interface GraficoPizzaInterface {
    produto: string
    pesoTotal: number
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


    const [mesesData, setMesesData] = useState<string[]>([])
    const [pesosData, setPesosData] = useState<number[]>([])
    const [qtdsData, setQtdsData] = useState<number[]>([])
    const [pizzaData, setPizzaData] = useState<[string, number][]>([])

    const clsCrud = new ClsCrud()

    const DadosGrafico = async () => {
        try {
            const rsColuna: GraficoColunaInterface[] = await clsCrud.consultar({
                entidade: 'ProducaoMalharia',
                joins: [{ tabelaRelacao: 'producaomalharia.produto', relacao: 'produto' }],
                groupBy: 'mes',
                campoOrder: ['mes'],
                having: 'pesoTotal > 0',
                select: ['ROUND(SUM(peso),2) AS pesoTotal', 'COUNT(peso) AS qtdTotal', 'MONTH(dataProducao) AS mes'],
            })

            const mesesData = rsColuna.map((item) => obterMes(item.mes))
            const pesosData = rsColuna.map((item) => item.pesoTotal)
            const qtdsData = rsColuna.map((item) => item.qtdTotal)

            setMesesData(mesesData)
            setPesosData(pesosData)
            setQtdsData(qtdsData)

            const rsPizza: GraficoPizzaInterface[] = await clsCrud.consultar({
                entidade: 'ProducaoMalharia',
                joins: [{ tabelaRelacao: 'producaomalharia.produto', relacao: 'produto' }],
                groupBy: 'nome',
                campoOrder: ['nome'],
                having: 'pesoTotal > 0',
                select: ['produto.nome AS produto', 'ROUND(SUM(peso),2) AS pesoTotal' ],
            })
            
            const produtosAtualizados: [string, number][]= rsPizza.map(dado => [dado.produto, dado.pesoTotal])

            setPizzaData(produtosAtualizados)

        } catch (error) {
            console.error('Erro ao consultar dados:', error)
        }
    }

    useEffect(() => {
        DadosGrafico()
    }, [])

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
            text: 'Produção Malharia',
        },
        xAxis: {
            categories: mesesData,
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
        series: [
            {
                name: 'Produção',
                data: pesosData,
                color: '#7cb5ec', // Cor das colunas para produção
            },
            // {
            //   name: 'Quantidade',
            //   data: qtdsData,
            //   color: '#434348', // Cor das colunas para quantidade
            // },
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
            text: 'Produção por Artigo',
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
                data:  pizzaData,
                type: 'pie',
            },
        ],
    }

    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    return (

        <Dialog
            open={open}
            onClose={clickFechar}
            fullScreen={fullScreen}
            fullWidth
            maxWidth='md'
        >
            <Grid item xs={12} sx={{ textAlign: 'right', m: { md: 0.5 } }}>
                <IconButton onClick={() => clickFechar()}>
                    <CloseIcon />
                </IconButton>
            </Grid>

            <Paper variant="outlined" sx={{ padding: 0.5, m: 0.5 }}>
                <Grid container spacing={1.2} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item xs={12} md={12} sx={{ mt: 0.5, pl: { md: 0.5 } }}>
                        <HighchartsReact highcharts={Highcharts} options={setupColuna} />
                    </Grid>
                    <Grid item xs={12} md={12} sx={{ mt: 0.5, pl: { md: 0.5 } }}>
                        <HighchartsReact highcharts={Highcharts} options={setupPizza} />
                    </Grid>
                </Grid>
            </Paper>
        </Dialog>
    )
}