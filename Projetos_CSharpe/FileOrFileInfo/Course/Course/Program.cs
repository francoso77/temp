using System.Globalization;
using System;
using System.IO;
using Course.Entities;

namespace Course
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Write("Enter file full path: ");
            string sourceFilePath = Console.ReadLine();

            try
            {
                string [] lines = File.ReadAllLines(sourceFilePath);

                string sourceFolderPath = Path.GetDirectoryName(sourceFilePath);
                string targetFolderPath = sourceFolderPath + @"\out";
                string targetFilePath = targetFolderPath + @"\summary.csv";

                Directory.CreateDirectory(targetFolderPath);

                using (StreamWriter sw = File.AppendText(targetFilePath))
                {
                    
                    foreach (string line in lines)
                    {
                        string [] fields = line.Split(',');

                        string name = fields[0];
                        double price = double.Parse(fields[1],CultureInfo.InvariantCulture);
                        int quantity = int.Parse(fields[2]);

                        Products product = new Products(name, price, quantity);

                        sw.WriteLine(product.Name + "," + product.Total().ToString("F2", CultureInfo.InvariantCulture));
                    }
                }
            }
            catch (IOException e)
            {
                Console.WriteLine("An error occurred!");
                Console.WriteLine(e.Message);
            }
            finally
            {
                Console.WriteLine("Operação finalizada!");
            }
        }
    }
}
