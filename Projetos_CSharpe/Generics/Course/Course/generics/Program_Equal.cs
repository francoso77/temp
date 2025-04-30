using Course.Entities;
using Course.Services;
using System.Globalization;

namespace Course.generics
{
    class Program_Equal
    {
        static void Main_Equal(string[] args)
        {
            Clients a = new Clients { Name = "Frank", Email = "frank@gmail.com" };
            Clients b = new Clients { Name = "Frank", Email = "frank@gmail.com" };

            Console.WriteLine(a.Equals(b));
            Console.WriteLine(a.GetHashCode());
            Console.WriteLine(b.GetHashCode());
            // aqui está comparando a referência
            Console.WriteLine(a == b);
        }
    }
}