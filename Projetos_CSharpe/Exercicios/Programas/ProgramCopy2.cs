using System;
using System.Globalization;

namespace ExerciciosCopy2
{
    class ProgramCopy2
    {
        static void MainCopy2(string[] args)
        {
            /* string frase = Console.ReadLine();
             string x = Console.ReadLine();
             string y = Console.ReadLine();
             string z = Console.ReadLine();
 
             //o split recorta onde tem espaço na string e monta o vetor
 
             string[] cores = Console.ReadLine().Split(' ');
             string a = cores[0];
             string b = cores[1];
             string c = cores[2];
 
             Console.WriteLine("Você digitou: ");
             Console.WriteLine(frase);
             Console.WriteLine(x);
             Console.WriteLine(y);
             Console.WriteLine(z);
             Console.WriteLine(a);
             Console.WriteLine(b);
             Console.WriteLine(c);
 
             int n1 = int.Parse(Console.ReadLine());
             char ch = char.Parse(Console.ReadLine());
             double n2 = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
 
             string[] dados = Console.ReadLine().Split(' ');
             string nome = dados[0];
             char sexo = char.Parse(dados[1]);
             int idade = int.Parse(dados[2]);
             double altura = double.Parse(dados[3], CultureInfo.InvariantCulture);
 
             Console.WriteLine("Você digitou: ");
             Console.WriteLine(n1);
             Console.WriteLine(ch);
             Console.WriteLine(n2, CultureInfo.InvariantCulture);
             Console.WriteLine(nome);
             Console.WriteLine(sexo);
             Console.WriteLine(idade);
             Console.WriteLine(altura, CultureInfo.InvariantCulture);

            Console.WriteLine("Entre com seu nome completo:");
            string nome = Console.ReadLine();

            Console.WriteLine("Quantos quartos tem na sua casa?");
            int quartos = int.Parse(Console.ReadLine());

            Console.WriteLine("Entre com o preço do produto:");
            double preco = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);

            Console.WriteLine("Entre com o seu último nome, idade, e altura (mesma linha):");
            string[] dados = Console.ReadLine().Split(' ');
            string sobrenome = dados[0];
            int idade = int.Parse(dados[1]);
            double altura = double.Parse(dados[2], CultureInfo.InvariantCulture);

            Console.WriteLine("Você digitou: ");
            Console.WriteLine(nome);
            Console.WriteLine(quartos);
            Console.WriteLine(preco.ToString("F2", CultureInfo.InvariantCulture));
            Console.WriteLine(sobrenome);
            Console.WriteLine(idade);
            Console.WriteLine(altura.ToString("F2", CultureInfo.InvariantCulture));*/

            //usando o FOR

            Console.Write("Quantos números inteiros você vai digitar? ");
            int n = int.Parse(Console.ReadLine());

            int soma = 0;

            for (int i = 1; i <= n; i++){

                Console.Write($"Valor #{i}: ");
                int valor = int.Parse(Console.ReadLine());
                soma += valor;
            }

            Console.WriteLine("Soma = " + soma);

        }
    }
}
