import React from 'react';
import { useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  ButtonGroup,
  Stack,
} from "@mui/material"
import {
  BarChart as BarChartIcon,
} from "@mui/icons-material"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"
import { ProductionData } from '../../Utils/ClsValidacao';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

interface GraficoProps {
  monthlyProductionData: ProductionData[];
}


export default function Grafico({
  monthlyProductionData,

}: GraficoProps) {


  const productLabels = {
    nylon: "Nylon",
    palmilha: "Palmilha",
    tecidoCru: "Tecido Cru",
  }

  const productColors = {
    nylon: "#f59e0b",
    palmilha: "#10b981",
    tecidoCru: "#2563eb",
  }


  // const toggleProduct = (product: string) => {
  //   setSelectedProducts((prev) => (prev.includes(product) ? prev.filter((p) => p !== product) : [...prev, product]))
  // }
  const [chartType, setChartType] = useState<"line" | "bar">("line")
  const [selectedProducts, setSelectedProducts] = useState<string[]>([
    "nylon",
    "palmilha",
    "tecidoCru",
  ])

  const chartData = {
    labels: monthlyProductionData.map((item) => item.month),
    datasets: [
      ...(selectedProducts.includes("tecidoCru")
        ? [
          {
            label: productLabels.tecidoCru,
            data: monthlyProductionData.map((item) => item.tecidoCru),
            borderColor: productColors.tecidoCru,
            backgroundColor: productColors.tecidoCru + "15",
            borderWidth: 3,
            tension: 0.4,
          },
        ]
        : []),
      ...(selectedProducts.includes("nylon")
        ? [
          {
            label: productLabels.nylon,
            data: monthlyProductionData.map((item) => item.nylon),
            borderColor: productColors.nylon,
            backgroundColor: productColors.nylon + "15",
            borderWidth: 3,
            tension: 0.4,
          },
        ]
        : []),
      ...(selectedProducts.includes("palmilha")
        ? [
          {
            label: productLabels.palmilha,
            data: monthlyProductionData.map((item) => item.palmilha),
            borderColor: productColors.palmilha,
            backgroundColor: productColors.palmilha + "15",
            borderWidth: 3,
            tension: 0.4,
          },
        ]

        : []),
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  }

  return (
    <>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <BarChartIcon color="primary" />
                <Typography variant="h6">Produção Mensal por Produto</Typography>
              </Box>
              <ButtonGroup>
                <Button
                  variant={chartType === "line" ? "contained" : "outlined"}
                  onClick={() => setChartType("line")}
                >
                  Linha
                </Button>
                <Button
                  variant={chartType === "bar" ? "contained" : "outlined"}
                  onClick={() => setChartType("bar")}
                >
                  Barra
                </Button>
              </ButtonGroup>
            </Box>

            {/* <Box display="flex" flexWrap="wrap" gap={1}>
              {Object.entries(productLabels).map(([key, label]) => (
                <Chip
                  key={key}
                  label={label}
                  onClick={() => toggleProduct(key)}
                  color={selectedProducts.includes(key) ? "primary" : "default"}
                  variant={selectedProducts.includes(key) ? "filled" : "outlined"}
                  sx={{
                    backgroundColor: selectedProducts.includes(key)
                      ? productColors[key as keyof typeof productColors]
                      : undefined,
                    "&:hover": {
                      backgroundColor: selectedProducts.includes(key)
                        ? productColors[key as keyof typeof productColors]
                        : undefined,
                    },
                  }}
                />
              ))}
            </Box> */}

            <Box sx={{ height: 400, mt: 2 }}>
              {chartType === "line" ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <Bar data={chartData} options={chartOptions} />
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}