using Course.Entities;
using Course.Services;
using System.Globalization;

namespace Course
{
    class Program
    {
        static void Main(string[] args)
        {
            SortedSet<int> A = new SortedSet<int>() { 10, 0, 2, 4, 6, 8};
            SortedSet<int> B = new SortedSet<int>() { 7, 9, 5, 6, 10, 8 };

            PrintCollection(A);
            PrintCollection(B);

            Console.WriteLine("Union");
            SortedSet<int> C =  new SortedSet<int>(A);
            C.UnionWith(B);
            PrintCollection(C);

            Console.WriteLine("Intersection");
            SortedSet<int> D = new SortedSet<int>(A);
            D.IntersectWith(B);
            PrintCollection(D);

            Console.WriteLine("Difference");
            SortedSet<int> E= new SortedSet<int>(A);
            E.ExceptWith(B);
            PrintCollection(E);
        }

        static void PrintCollection<T>(IEnumerable<T> collection)
        {
            foreach (T item in collection)
            {
                Console.Write(item + " ");
            }
            Console.WriteLine();
        }
    }
}