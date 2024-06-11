using System;
using System.IO;


namespace Course_03
{
    class Program_03
    {
        static void Main_03(string[] args)
        {
            //usando using block 
            string arquivo1 = @"c:\temp\file1.txt";
            string arquivo2 = @"c:\temp\file2.txt";
            try
            {
               //com o using não precisa fechar os arquivos.
                using (FileStream fs = new FileStream(arquivo1, FileMode.Open))
                {
                    using (StreamReader sr = new StreamReader(fs))
                    {
                        while (!sr.EndOfStream)
                        {
                            string line = sr.ReadLine();
                            Console.WriteLine(line);
                        }
                    }
                }
                // instanciando direto
                using(StreamReader sr = File.OpenText(arquivo2))
                {
                    while (!sr.EndOfStream)
                    {
                        string line = sr.ReadLine();
                        Console.WriteLine(line);
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