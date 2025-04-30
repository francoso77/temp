using System;

namespace Exercicios
{
    public class Triangulo
    {
        public double A;
        public double B;
        public double C;

        //define o tipo de saída (return) dessa função
        public double Area()
        {
            double p = (A + B + C) / 2.0;
            return Math.Sqrt(p * (p - A) * (p - B) * (p - C));
        }
    }
}
