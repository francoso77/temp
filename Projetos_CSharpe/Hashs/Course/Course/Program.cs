using System;
using System.Collections.Generic;
using Course.Entities;

namespace Course
{
    class Program
    {
        static void Main(string[] args)
        {   
            //conjuntos não aceita repetição
            
            // GetHashCode e Equals implementados nativo do C#
            HashSet<string> set = new HashSet<string>();

            set.Add("Alex");
            set.Add("Maria");

            Console.WriteLine("Teste se tem MARIA no HashSet Implementado nativo: " + set.Contains("Maria"));

            // qdo o não há implementação

            
            HashSet<Product> a = new HashSet<Product>();
            a.Add(new Product("TV", 900.0));
            a.Add(new Product("Notebook", 1200.0));

            HashSet<Point> p1 = new HashSet<Point>();

            p1.Add(new Point(3, 8));
            p1.Add(new Point(5, 10));

            Product b = new Product("Notebook", 1200.0);

            //embora os dados sejam os mesmo... dará falso pq os dados estão em espaços diferentes na memória ... tem 
            //referências diferentes resposta é FALSE
            //depois e implatando na Classe a resposta tem quer TRUE
            Console.WriteLine("Teste o mesmo produto em A e B no HashSet NÂO implementado: " + a.Contains(b));
            

            //no STRUCT a resposta é TRUE pois o struct faz comparação por valor e não por referência
            //neste caso não precisa fazer a implementação de GetHashCode e Equals.
            Point p2 = new Point(3, 8);
            Console.WriteLine("Teste se P1 e igual P2 no HashSet NÂO implementado: " + p1.Contains(p2));

        }
    }
}