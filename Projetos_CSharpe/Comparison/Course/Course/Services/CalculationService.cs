using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Course.Services
{
    class CalculationService
    {
        //sem retornar fazendo tudo na classe

        public static void ShowMax(double x, double y)
        {
            Console.WriteLine("ShowMax: " + ((x > y) ? x : y));
        }

        public static void ShowSum(double x, double y)
        {
            Console.WriteLine("ShowSum: " +  (x + y));
        }
    }
}
