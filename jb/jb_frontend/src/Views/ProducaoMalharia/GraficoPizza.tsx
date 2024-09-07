import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3D from 'highcharts/highcharts-3d';
import Accessibility from 'highcharts/modules/accessibility'
import ClsCrud from '../../Utils/ClsCrudApi';


//Inicializa o módulo 3D
Highcharts3D(Highcharts)
Accessibility(Highcharts)

interface DadosGraficoInterface {
    produto: string
    pesoTotal: number
}

interface PropsInterface {
    open: boolean
    clickFechar: () => void
}

export default function GraficoPizza({ open = false, clickFechar }: PropsInterface) {

    const [dadosGrafico, setDadosGrafico] = useState<DadosGraficoInterface[]>([])

    const clsCrud = new ClsCrud()

    const DadosGrafico = async () => {
        try {
            const rs: DadosGraficoInterface[] = await clsCrud.consultar({
                entidade: 'ProducaoMalharia',
                joins: [{ tabelaRelacao: 'producaomalharia.produto', relacao: 'produto' }],
                groupBy: 'nome',
                campoOrder: ['nome'],
                having: 'pesoTotal > 0',
                select: ['ROUND(SUM(peso),2) AS pesoTotal', 'produto.nome AS nome'],
            })
            setDadosGrafico(rs)

        } catch (error) {
            console.error('Erro ao consultar dados:', error)
        }
    }

    useEffect(() => {
        DadosGrafico()
    }, [])

    const options = {
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
                innerSize: 100, // Para criar um gráfico de rosquinha (opcional)
                depth: 45,
            },
        },
        series: [
            {
                name: 'Porcentagem',
                data: [
                    ['Produto A', 29.9],
                    ['Produto B', 71.5],
                    ['Produto C', 106.4],
                    ['Produto D', 129.2],
                    ['Produto E', 144.0],
                ],
            },
        ],
    }

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    )
}