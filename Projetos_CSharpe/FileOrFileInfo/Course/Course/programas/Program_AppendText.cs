using System;
using System.IO;


namespace Course_04
{
    class Program_04
    {
        static void Main_04(string[] args)
        {
            //usando StreamWriter

            string arquivoOrigem = @"c:\temp\file1.txt";
            string arquivoDestino = @"c:\temp\file2.txt";
            try
            {
                string[] lines = File.ReadAllLines(arquivoOrigem);

                //a função AppendText acrescenta novas linhas no final do arquivo 
                using (StreamWriter sw = File.AppendText(arquivoDestino))
                {
                    foreach (string line in lines)
                    {
                        sw.WriteLine(line.ToUpper());
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