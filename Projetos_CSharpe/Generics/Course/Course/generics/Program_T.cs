using Course.Entities;
using Course.Services;
using System.Globalization;

namespace Course.generics
{
    class Program_T
    {
        static void Main_T(string[] args)
        {
            List<Products> list = new List<Products>();

            Console.Write("Enter N: ");
            int n = int.Parse(Console.ReadLine());

            for (int i = 0; i < n; i++)
            {
                string[] vect = Console.ReadLine().Split(',');
                string name = vect[0];
                double price = double.Parse(vect[1], CultureInfo.InvariantCulture);

                list.Add(new Products(name, price));
            }

            CalculationService cs = new CalculationService();

            Products max = cs.Max(list);
            Console.WriteLine("Max: ");
            Console.WriteLine(max);
        }
    }
}