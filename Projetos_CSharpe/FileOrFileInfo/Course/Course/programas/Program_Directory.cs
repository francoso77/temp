using System;
using System.IO;
using System.Collections.Generic;


namespace Course_05
{
    class Program_05
    {
        static void Main_05(string[] args)
        {
            //Manipulando aquivos e pasta usando Directory e DirectoryInfor

            string pathFolder = @"c:\temp\myfolder";
            IEnumerable<string> listaDePastas;

            try
            {
                listaDePastas = Directory.EnumerateDirectories(pathFolder, "*.*", SearchOption.AllDirectories);
                Console.WriteLine("FOLDERS:");
                foreach (string pasta in listaDePastas) 
                {
                    Console.WriteLine(pasta);
                }

                var listaDeArquivos = Directory.EnumerateFiles(pathFolder, "*.*", SearchOption.AllDirectories);
                Console.WriteLine("FILES:");
                foreach (string file in listaDeArquivos)
                {
                    Console.WriteLine(file);
                }
                //criando uma nova pasta
                Directory.CreateDirectory(pathFolder + @"\fotos");
                Directory.CreateDirectory(@"c:\temp\myfolder\Internet");
                Console.WriteLine("FOLDERS:");
                foreach (string pasta in listaDePastas)
                {
                    Console.WriteLine(pasta);
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