using System;
using System.IO;
using System.Collections.Generic;


namespace Course_06
{
    class Program_06
    {
        static void Main_06(string[] args)
        {
            //Manipulando aquivos e pasta usando Directory e DirectoryInfor

            string pathArquivo = @"c:\temp\myfolder\file1.txt";
            
            Console.WriteLine("GetDirectoryName: " + Path.GetDirectoryName(pathArquivo));
            Console.WriteLine("GetFileName: " + Path.GetFileName(pathArquivo));
            Console.WriteLine("GetExtension: " + Path.GetExtension(pathArquivo));
            Console.WriteLine("PathSeparator: " + Path.PathSeparator);
            Console.WriteLine("GetFileNameWithoutExtensions: " + Path.GetFileNameWithoutExtension(pathArquivo));
            Console.WriteLine("GetTempPath: " + Path.GetTempPath());


        }
    }
}