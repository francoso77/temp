using Course.Services;

namespace Course
{
    class Program_sem
    {
        //delegate pode ser com ou sem return
        delegate void OpComDoisValores (double n1,  double n2);
        static void Main_sem(string[] args)
        {
            double a = 10;
            double b = 12;

            //instanciar delegate para 2 funções

            OpComDoisValores op = CalculationService.ShowSum;
            op += CalculationService.ShowMax;

            op(a, b);
        }
    }
}