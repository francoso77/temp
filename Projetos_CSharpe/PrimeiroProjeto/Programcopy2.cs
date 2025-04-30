using System;
using System.Globalization;

namespace PrimeiroProjetoCopy2
{
    class ProgramCopy2
    {
        static void MainCopy2(string[] args)
        {
            /* bool c1 = 2 >3 || 4 != 5; // true
             bool c2 = !(2 > 3) && 4 != 5; //true
 
             Console.WriteLine(c1);
             Console.WriteLine(c2);
 
             //precedencia no teste logico
 
             Console.WriteLine("-----------------------");
 
             bool c3 = 10 < 5; //false
             
             //aqui ele testa o && primeiro
             bool c4 = c1 || c2 && c3; //c2 && c3 é false ela é feita primeiro
 
             Console.WriteLine(c3);
             Console.WriteLine(c4);
 */

            Console.WriteLine("Digite 3 números:");
            int n1 = int.Parse(Console.ReadLine());
            int n2 = int.Parse(Console.ReadLine());
            int n3 = int.Parse(Console.ReadLine());

            int resultado = Maior(n1, n2, n3);
            Console.WriteLine("Maior = " + resultado);
        }

        static int Maior(int a, int b, int c)
        {
            int m;
            if (a > b && a > c)
            {
                m = a;
            }
            else if (b > c)
            {
                m = b;
            }
            else
            {
                m = c;
            }

            return m;
        }
    }
}
