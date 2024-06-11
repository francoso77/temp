using Course.Services;

namespace Course
{
    class Program_delegate
    {
        delegate double OpComDoisValores (double n1,  double n2);
        static void Main_delegate(string[] args)
        {
            // sem usar o delegate
            double a = 10;
            double b = 12;
            Console.WriteLine("Sum: " + CalculationService_old.Sum(a, b));
            Console.WriteLine("Max: " + CalculationService_old.Max(a, b));
            Console.WriteLine("Square: " + CalculationService_old.Square(a));

            //usando o delegate

            OpComDoisValores opSum = CalculationService_old.Sum;
            OpComDoisValores opMax = CalculationService_old.Max;
            //o Square não aceita pq ele tem apenas 1 valor
            //OpComDoisValores opSquare = CalculationService.Square;

            Console.WriteLine("Delesgate SUM: "+ opSum (a,b));
            Console.WriteLine("Delegate MAX: " + opMax (a,b));
        }
    }
}