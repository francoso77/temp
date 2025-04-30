using System;
using System.Globalization;

namespace Exercicios
{
    public class ConversorDeMoeda
    {
        public static double IOF = 1.06;

        public static double ValorAPagar(double Cotacao, double Quantidade){
            return (Quantidade * Cotacao) * IOF;
         }

    
    }
}