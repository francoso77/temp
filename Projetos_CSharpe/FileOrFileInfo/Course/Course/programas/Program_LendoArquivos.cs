using System;
using System.IO;


namespace Course_02
{
    class Program_02
    {
        static void Main_02(string[] args)
        {
            //o uso do @ é para não ter q digitar assim c:\\temp\\file1.txt

            //aqui usando o FileStream e o StreamReader
            /*string arquivo = @"c:\temp\file1.txt";
            FileStream fs = new FileStream(arquivo, FileMode.Open);
            StreamReader sr = new StreamReader(fs);*/

            //usando o File
            string arquivo = @"c:\temp\file1.txt";
            StreamReader sr = null;

            try
            {
                sr = File.OpenText(arquivo);
                while (!sr.EndOfStream)
                {
                    string line = sr.ReadLine();
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
                if(sr != null) sr.Close();
                //if(fs != null) fs.Close();
                Console.WriteLine("Operação finalizada!");
            }
        }
    }
}