using System.Xml.XPath;
using System.Xml.Linq;
using System.Security.Cryptography.X509Certificates;
using System;
using System.Globalization;

namespace PrimeiroProjeto
{
    class Program
    {
        static void Main(string[] args)
        {
            Triangulo x,
                y;

            x = new Triangulo();
            y = new Triangulo();

            Console.WriteLine("Entre com as medidas do triângulo X:");
            x.A = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
            x.B = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
            x.C = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);

            Console.WriteLine("Entre com as medidas do triângulo Y:");
            y.A = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
            y.B = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
            y.C = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);

            double areaX = x.Area();
            double areaY = y.Area();

            Console.WriteLine("Área de X: " + areaX.ToString("F4", CultureInfo.InvariantCulture));
            Console.WriteLine("Área de Y: " + areaY.ToString("F4", CultureInfo.InvariantCulture));

            if (areaX > areaY)
            {
                Console.WriteLine("Maior área: X");
            }
            else
            {
                Console.WriteLine("Maior área: Y");
            }
            /*string pessoaMaisVelha;
            double salarioMedio = 0.0;
            Pessoa p1, p2;
            p1 = new Pessoa();
            p2 = new Pessoa();
            Salario s1, s2;
            s1 = new Salario();
            s2 = new Salario();



            Console.WriteLine("Dados da primeira pessoa:");
            Console.Write("Nome: ");
            p1.nome = Console.ReadLine();
            Console.Write("Idade: ");
            p1.idade = int.Parse(Console.ReadLine());

            Console.WriteLine("Dados da segunda pessoa:");
            Console.Write("Nome: ");
            p2.nome = Console.ReadLine();
            Console.Write("Idade: ");
            p2.idade = int.Parse(Console.ReadLine());

            if (p1.idade > p2.idade){
                pessoaMaisVelha = p1.nome;
            }else
            {
                pessoaMaisVelha = p2.nome;
            }
            Console.WriteLine("Pessoa mais velha: " + pessoaMaisVelha);


            Console.WriteLine("Dados do primeiro funcionário:");
            Console.Write("Funcionário: ");
            s1.funcionario = Console.ReadLine();
            Console.Write("Salário: ");
            s1.salario = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture );

            Console.WriteLine("Dados do segundo funcionário:");
            Console.Write("Funcionário: ");
            s2.funcionario = Console.ReadLine();
            Console.Write("Salário: ");
            s2.salario = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture );

            salarioMedio = (s1.salario + s2.salario) / 2.0;
            Console.WriteLine("Salário Médio = " + salarioMedio.ToString("F2", CultureInfo.InvariantCulture));*/
        }
    }
}
