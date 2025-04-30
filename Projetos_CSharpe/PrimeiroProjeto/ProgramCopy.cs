using System;
using System.Globalization;

namespace PrimeiroProjetoCopy
{
    class ProgramCopy
    {
        static void MainCopy(string[] args)
        {
            /*bool completo = true;
            char genero = 'M';
            sbyte x = 100;
            byte n1 = 15;
            int n2 = 1000;
            long n3 = 2147483649L;
            string Nome = "Frank Alves";
            char letra = '\u0041';
            float n4 = 4.5f;
            double n5 = 4.5111;


            Console.WriteLine(x);
            Console.WriteLine(n1);
            Console.WriteLine(n2);
            Console.WriteLine(n3);
            Console.WriteLine(completo);
            Console.WriteLine(genero);
            Console.WriteLine(Nome);
            Console.WriteLine(letra);
            Console.WriteLine(n4);
            Console.WriteLine(n5);

            int N1 = int.MinValue;
            int N2 = int.MaxValue;
            decimal N3 = decimal.MaxValue;

            
            Console.WriteLine("=============================================");
            Console.WriteLine(N1);
            Console.WriteLine(N2);
            Console.WriteLine(N3);

            char genero = 'F';
            int idade = 32;
            double saldo = 10.35784;
            string nome = "Maria Aparecida";

            Console.WriteLine(genero);
            Console.WriteLine(idade);
            Console.WriteLine(saldo);
            Console.WriteLine(nome);
            Console.WriteLine(saldo.ToString("F2"));
            Console.WriteLine(saldo.ToString("F3"));
            Console.WriteLine(saldo.ToString("F4"));
            Console.WriteLine(saldo.ToString("F4", CultureInfo.InvariantCulture));
            Console.WriteLine(saldo.ToString("============================================="));

            Console.Write(nome);
            Console.Write(" tem ");
            Console.Write(idade);
            Console.WriteLine(" anos de idade.");

            //placeholders

            Console.WriteLine("{0} tem {1} anos e tem saldo de {2} reais.", nome, idade, saldo);
            Console.WriteLine("{0} tem {1} anos e tem saldo de {2:F2} reais.", nome, idade, saldo);

            //$ Interpolação
            
            Console.WriteLine($"{nome} tem {idade} anos e tem saldo de {saldo:F3} reais.");

            //Concatenar

            Console.WriteLine(nome + " tem " + idade + " anos e tem saldo de " + saldo.ToString("F4", CultureInfo.InvariantCulture) + " reais.");



            string produto1 = "Computador";
            string produto2 = "Mesa de escritório";

            byte idade = 30;
            int codigo = 5290;
            char genero = 'M';

            double preco1 = 2100.0;
            double preco2 = 650.50;
            double medida = 53.234567;

            Console.WriteLine("Produtos:");
            Console.WriteLine($"{produto1} cujo preço é $ {preco1:F2} ");
            Console.WriteLine($"{produto2} cujo preço é $ {preco2:F2} ");
            Console.WriteLine(" ");
            Console.WriteLine($"Registro: {idade} anos de idade, código {codigo} e gênero: {genero} ");
            Console.WriteLine(" ");
            Console.WriteLine("Medida com oito casas decimais: " + medida.ToString("F8"));
            Console.WriteLine("Arredondado (três casas decimais):" + medida.ToString("F3" ));
            Console.WriteLine("Separador decimal invariant culture:" + medida.ToString("F3", CultureInfo.InvariantCulture));


//atribuições

    int a = 10;
    System.Console.WriteLine(a);

    a += 2;
    System.Console.WriteLine(a);

    a *= 3;
    System.Console.WriteLine(a);

    string x = "ABC";
    System.Console.WriteLine(x);

    x += "DEF";
    System.Console.WriteLine(x);

    a++;
    System.Console.WriteLine(a);

    a--;
    System.Console.WriteLine(++a);

    a=10;
    int b = ++a;
    System.Console.WriteLine("valor de a: " + a);
    System.Console.WriteLine("valor de b = a++: " + b);
    b = a++;
    System.Console.WriteLine("valor de b = ++a: " + b);
*/

            //conversão ímplicita e Casting

            //conversão ímplicita
            float a = 4.5f;

            double b = a;

            Console.WriteLine(b);

            //casting

            double x = 4.8522;

            float z = (float)x;

            Console.WriteLine(z);

            double xx;
            int zz;

            xx = 5.1;
            zz = (int)xx;

            Console.WriteLine(zz);

            int numero1 = 5;
            int numero2 = 2;

            double resultado1 = numero1 / numero2;

            Console.WriteLine(resultado1);            
            //um dos valores inteiros tem q ser double
            
            double resultado2 = (double) numero1 / numero2;
            Console.WriteLine(resultado2);            

        }
    }
}
