using System;

namespace Course.generics
{
    class ProgramGenerics
    {
        static void MainGeneric(string[] args)
        {
            // instanciação especifísca 
            //PrintService ps = new PrintService();  

            //instanciação passando o tipo como parâmetro
            // PrintService<string> ps = new PrintService<string>();
            //com isso vc pode usar o typeSafet e ganha performance tb

            PrintService<int> ps = new PrintService<int>();


            Console.Write("How many values? ");
            int n = int.Parse(Console.ReadLine());

            for (int i = 0; i < n; i++)
            {
                ps.AddValue(int.Parse(Console.ReadLine()));
            }
            ps.Print();
            Console.WriteLine();
            Console.WriteLine("FIRST: " + ps.First());

        }
    }
}