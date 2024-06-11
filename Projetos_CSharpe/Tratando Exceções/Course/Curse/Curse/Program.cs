using System;
using System.IO;

namespace Course
{
    class Program
    {
        static void Main(string[] args)
        {
            //1º tipo 
            /*
            try
            {
                int n1 = int.Parse(Console.ReadLine());
                int n2 = int.Parse(Console.ReadLine());

                int result = n1 / n2;
                Console.WriteLine(result);
            } catch (Exception e)
            {
                Console.WriteLine("Error!");
                Console.WriteLine(e.Message);
            }
            
            //2º tipo

            try
            {
                int n1 = int.Parse(Console.ReadLine());
                int n2 = int.Parse(Console.ReadLine());

                int result = n1 / n2;
                Console.WriteLine(result);
            }
            catch (DivideByZeroException)
            {
                Console.WriteLine("Division by zero is not allowed!");
            }
            catch (FormatException)
            {
                Console.WriteLine("Format Incorrect!");
            }
            finally
            {
                Console.WriteLine("Operalção finalizada!");
            }
            */

            FileStream fs = null;

            try
            {
                fs = new FileStream(@"C:\temp\data.txt", FileMode.Open);
                StreamReader sr = new StreamReader(fs);
                string line = sr.ReadLine();
                Console.WriteLine(line);

            }
            catch (FileNotFoundException)
            {
                Console.WriteLine("file not found!");
            }
            finally
            {
                if (fs != null)
                {
                    fs.Close();
                }
                Console.WriteLine("Operation finally!");
            }
        }
    }
}