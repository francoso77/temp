using System;
using System.IO;


namespace Course_01
{
    class Program_01
    {
        static void Main_01(string[] args)
        {
            //o uso do @ é para não ter q digitar assim c:\\temp\\file1.txt

            string sourcePath = @"c:\temp\file1.txt";
            string targetPath = @"c:\temp\file2.txt";

            try
            {
                FileInfo file = new FileInfo(sourcePath);
                file.CopyTo(targetPath);

                string[] lines = File.ReadAllLines(sourcePath);
                foreach (string line in lines)
                {
                    Console.WriteLine(line);
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