using System;
using System.IO;
using Course.Entities;


namespace Course
{
    class Program_Ler
    {
        static void Main_Ler(string[] args)
        {
            //criando um conjunto cujo a ordem não importa, pra isso o melhor é o HashSet
            //caso a ordem fosse importante o melhor seria o SortedSet

            HashSet<LogRecord> records = new HashSet<LogRecord>();  

                        
            //código para ler um arquivo texto e imprimir linha a linha na tela
            Console.Write("Enter file full path: ");
            string path = Console.ReadLine();
            try
            {
                using (StreamReader sr = File.OpenText(path))
                {
                    /*while (!sr.EndOfStream)
                    {
                        //rotina para imprimir as linhas do arquivo na tela
                        string line = sr.ReadLine();
                        Console.WriteLine(line);
                    }*/
                    while (!sr.EndOfStream)
                    {
                        //rotina para armazenar em um vetor para depois colocar no conjunto hashset
                        
                        string[] lines = sr.ReadLine().Split(' ');
                        string userName = lines[0];
                        DateTime instant = DateTime.Parse(lines[1]);
                        //sintaxe com construtor
                        //records.Add(new LogRecord(userName, instant));
                        //se eu não tivesse construtor ficaria assim
                        records.Add(new LogRecord { UserName = userName, Instant = instant });
                        
                        //como foi implementado o GetHashCode e o Equals baseado no nome ele não aceita duplicidade
                    }
                    Console.WriteLine("Total users: " + records.Count);

                }
            }
            catch (IOException e) 
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
