using Course.Entities;
using System;
using System.Linq;

namespace Course
{
    class Program
    {
        static void Main(string[] args)
        {
            List<Product> products = new List<Product>();

            products.Add(new Product("Tv", 900.00));
            products.Add(new Product("Mouse", 50.00));
            products.Add(new Product("Tablet", 350.50));
            products.Add(new Product("HD Case", 80.90));

            //usando o select do linq para criar uma nova lista
            //List<string> names = products.Select(NameUpper).ToList();

            //criando um delegate
            //Func<Product, string> func = NameUpper;
            //List<string> names = products.Select(func).ToList();

            //usando expressão Lambda com retorno faz direto .. sem retorno usa { ;};  
            List<string> names = products.Select(product => product.Name.ToUpper()).ToList();
            foreach (string name in names) { Console.WriteLine(name); }
        }

        static string NameUpper(Product product)
        {
            return product.Name.ToUpper();
        }
    }
}