using Course.Entities;
using System.Globalization;
using System;
using System.IO;
using System.Collections.Generic;


namespace Course
{
    class Program
    {
        private static void Main(string[] args)
        {
            Console.Write("Enter full file path: ");
            string path = Console.ReadLine();

            List<Product> products = new List<Product>();

            using (StreamReader sr = File.OpenText(path))
            {
                while (!sr.EndOfStream)
                {
                    string[] fields = sr.ReadLine().Split(',');
                    string name = fields[0];
                    double price = double.Parse(fields[1], CultureInfo.InvariantCulture);
                    products.Add(new Product(name, price));
                }
            }

            var Average = products.Select(p => p.Price).DefaultIfEmpty(0.0).Average();
            var AveragePrice =
                (from p in products
                 select p.Price)
                 .DefaultIfEmpty(0.0)
                 .Average();
            Console.WriteLine("Average price: " + Average.ToString("F2", CultureInfo.InvariantCulture));
            Console.WriteLine("Average price / similar SQL: " + AveragePrice.ToString("F2", CultureInfo.InvariantCulture));

            var prod = 
                from p in products
                where p.Price < AveragePrice
                orderby p.Name descending
                select p;

            foreach (Product p in prod)
            {
                Console.WriteLine(p.Name);
            }
        }
    }
}
