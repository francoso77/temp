using System;
using System.Globalization;

namespace ExerciciosCopy
{
    class ProgramCopy 
    {
        static void MainCopy(string[] args)
        {
            /*int cod1, cod2, qte1, qte2;
            double preco1, preco2, total;

            string[] valores = Console.ReadLine().Split(' ');
            cod1 = int.Parse(valores[0]);
            qte1 = int.Parse(valores[1]);
            preco1 = double.Parse(valores[2], CultureInfo.InvariantCulture);

            valores = Console.ReadLine().Split(' ');
            cod2 = int.Parse(valores[0]);
            qte2 = int.Parse(valores[1]);
            preco2 = double.Parse(valores[2], CultureInfo.InvariantCulture);

            total = preco1 * qte1 + preco2 * qte2;

            Console.WriteLine("VALOR A PAGAR: R$ " + total.ToString("F2", CultureInfo.InvariantCulture));

            //Exercício 1

            int num1, num2, soma;

            num1 = int.Parse(Console.ReadLine());
            num2 = int.Parse(Console.ReadLine());

            soma = num1 + num2;
            Console.WriteLine("SOMA: " + soma);

            //Exercício 2

            double pi = 3.14159, a, r;

            r = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture );

            a = pi * r * r;
            
            Console.WriteLine("A: " + a.ToString("F4",CultureInfo.InvariantCulture ));

            //Exercício 3


            int A, B, C, D, dif;

            A = int.Parse(Console.ReadLine());
            B = int.Parse(Console.ReadLine());
            C = int.Parse(Console.ReadLine());
            D = int.Parse(Console.ReadLine());

            dif = A * B - C * D;

            Console.WriteLine("DIFERANÇA: " + dif );

            //Exercício 4


            int num, horas;
            double vrh, salario;

            num = int.Parse(Console.ReadLine());
            horas = int.Parse(Console.ReadLine());
            vrh = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture );

            salario = horas * vrh;

            Console.WriteLine("NUMBER  = " + num);
            Console.WriteLine("SALARIO = R$ " + salario.ToString("F2",CultureInfo.InvariantCulture ));

            //Exercício 5

            double A,
                B,
                C,
                triangulo,
                circulo,
                trapezio,
                quadrado,
                retangulo,
                p = 3.14159;

            string[] valores = Console.ReadLine().Split(' ');
            A = double.Parse(valores[0], CultureInfo.InvariantCulture);
            B = double.Parse(valores[1], CultureInfo.InvariantCulture);
            C = double.Parse(valores[2], CultureInfo.InvariantCulture);

            triangulo = A * C / 2.0;
            circulo = p * Math.Pow(C, 2.0);
            trapezio = (A + B) / 2.0 * C;
            quadrado = B * B;
            retangulo = A * B;
            
            Console.WriteLine("TRIANGULO = " + triangulo.ToString("F3",CultureInfo.InvariantCulture ));
            Console.WriteLine("CIRCULO = " + circulo.ToString("F3",CultureInfo.InvariantCulture ));
            Console.WriteLine("TRAPEZIO = " + trapezio.ToString("F3",CultureInfo.InvariantCulture ));
            Console.WriteLine("QUADRADO = " + quadrado.ToString("F3",CultureInfo.InvariantCulture ));
            Console.WriteLine("RETANGULO = " + retangulo.ToString("F3",CultureInfo.InvariantCulture ));*/


            //raiz quadrada

            double a, b, c, delta, x1, x2;

            a = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
            b = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
            c = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);

            delta = Math.Pow(b, 2.0) - 4.0 * a * c;

            x1 = (-b + Math.Sqrt(delta)) / (2.0 * a);
            x2 = (-b - Math.Sqrt(delta)) / (2.0 * a);

            Console.WriteLine("A = " + a);
            Console.WriteLine("B = " + b);
            Console.WriteLine("C = " + c);
            Console.WriteLine("DELTA = " + delta);
            Console.WriteLine("X1 = " + x1);
            Console.WriteLine("X2 = " + x2);

        }
    }
}
