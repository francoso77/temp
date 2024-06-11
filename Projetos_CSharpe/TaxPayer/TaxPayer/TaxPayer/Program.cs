using System.Globalization;
using System;
using System.Text;
using TaxPayers.Entities;
using System.Xml;

namespace TaxPayers
{
    class Program
    {
        static void Main(string[] args)
        {
            List<TaxPayer> taxPayers = new List<TaxPayer>();

            Console.Write("Enter the number of tax payers: ");
            int n = int.Parse(Console.ReadLine());

            for (int i = 1; i <= n; i++)
            {
                Console.WriteLine($"Tax payer #{1} data:");
                Console.Write("Individual or company (i/c)? ");
                char resp = char.Parse(Console.ReadLine());
                Console.Write("Name: ");
                string name = Console.ReadLine();
                Console.Write("Anual income: ");
                double anuelIncome = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
                
                if (resp == 'i')
                {
                    Console.Write("Health expenditures: ");
                    double healthExpenditures = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);

                    taxPayers.Add(new Individual( name, anuelIncome, healthExpenditures));
                } 
                else if (resp == 'c')
                {
                    Console.Write("Number of employees: ");
                    int numberOfEmployees = int.Parse(Console.ReadLine());

                    taxPayers.Add(new Company(name, anuelIncome, numberOfEmployees));
                }
            }

            Console.WriteLine();
            Console.WriteLine("TAXES PAID:");

            double totalTax = 0;
            foreach (TaxPayer tax in taxPayers)
            {
                Console.WriteLine(tax.Name + ": $ " + tax.Tax().ToString("F2", CultureInfo.InvariantCulture));
                totalTax += tax.Tax();
            }
            Console.WriteLine();
            Console.Write("TOTAL TAXES: $ " + totalTax.ToString("F2", CultureInfo.InvariantCulture));
        }
    }
}