using ShapeSemInterface.Model.Entities;
using ShapeSemInterface.Model.Enums;
using System;

namespace Course
{
    class Program
    {
        static void Main(string[] args)
        {
            Shape s1 = new Circle() { Color = Color.White, Radius = 2.0 };
            Shape s2 = new Rectangle() { Color = Color.Black, Height = 4.2, Width = 3.5 };

            Console.WriteLine(s1);
            Console.WriteLine(s2);
        }
    }
}