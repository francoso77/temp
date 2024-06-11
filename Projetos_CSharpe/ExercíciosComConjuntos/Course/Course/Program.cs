using System;
using System.IO;
using Course.Entities;


namespace Course
{
    class Program
    {
        static void Main(string[] args)
        {
            HashSet<int> A = new HashSet<int>();
            HashSet<int> B = new HashSet<int>();
            HashSet<int> C = new HashSet<int>();
            
            Console.Write("How many students for course A?");
            int n = int.Parse(Console.ReadLine());
            for (int i = 0; i < n; i++)
            {
                A.Add(int.Parse(Console.ReadLine()));
            }

            Console.Write("How many students for course B?");
            n = int.Parse(Console.ReadLine());
            for (int i = 0; i < n; i++)
            {
                B.Add(int.Parse(Console.ReadLine()));
            }
            
            Console.Write("How many students for course C?");
            n = int.Parse(Console.ReadLine());
            for (int i = 0; i < n; i++)
            {
                C.Add(int.Parse(Console.ReadLine()));
            }
            
            HashSet<int> a = new HashSet<int>(A);
            a.UnionWith(B);
            a.UnionWith(C);
            Console.WriteLine("Total students: " + a.Count);
        }
    }
}
