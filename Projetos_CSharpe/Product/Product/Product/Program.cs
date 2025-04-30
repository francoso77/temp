using System.Globalization;
using System;
using System.Collections.Generic;
using Products.Entities;

namespace Products
{
    class Program
    {
        static void Main(string[] args)
        {
            List<Product> products = new List<Product>();

            Console.Write("Enter the number of products: ");
            int n = int.Parse(Console.ReadLine());

            for (int i = 1; i <= n; i++)
            {
                Console.WriteLine($"Prduct #{i} data:");
                Console.Write("Common, used or imported (c/u/i)? ");
                char tipo = char.Parse(Console.ReadLine());
                Console.Write("Name: ");
                string name = Console.ReadLine();
                Console.Write("Price: ");
                double price = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);

                if (tipo == 'i')
                {
                    Console.Write("Customs Fee: ");
                    double customsFee = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
                    products.Add(new ImportedProduct (name, price, customsFee));
                }
                else if (tipo == 'u')
                {
                    Console.Write("Manufacture date (DD/MM/YYYY): ");
                    DateTime manufactureDate = DateTime.Parse(Console.ReadLine());
                    products.Add(new UsedProduct(name, price, manufactureDate));
                }
                else
                {
                    products.Add(new Product(name, price));
                }
            }
            Console.WriteLine();
            Console.WriteLine("PRICE TAGS:");
            
            foreach (Product prod in products)
            {
                Console.WriteLine(prod.PriceTag());
            }
        }  
    }
}