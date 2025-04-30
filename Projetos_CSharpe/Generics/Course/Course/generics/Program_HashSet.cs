using Course.Entities;
using Course.Services;
using System.Globalization;

namespace Course.generics
{
    class Program_HashSet
    {
        static void Main_HashSet (string[] args)
        {
            HashSet<string> produtos = new HashSet<string>();

            produtos.Add("TV");
            produtos.Add("Notebook");
            produtos.Add("Iphone");

            Console.WriteLine(produtos.Contains("Iphone"));

            foreach (string produto in produtos)
            {
                Console.WriteLine(produto);
            }

        }
    }
}