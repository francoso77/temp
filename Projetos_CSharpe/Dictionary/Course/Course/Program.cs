using System;
using System.IO;
using System.Collections.Generic;


namespace Course
{
    class Program
    {
        static void Main(string[] args)
        {
                        
            Console.Write("Enter file full path: ");
            string path = Console.ReadLine();
            try
            {
                using (StreamReader sr = File.OpenText(path))
                {
                    Dictionary<string, int> cookies = new Dictionary<string, int>();

                    while (!sr.EndOfStream)
                    {
                        string[] lines = sr.ReadLine().Split(',');
                        string name = lines[0];
                        int votosLidos = int.Parse(lines[1]);
                                               
                        if (cookies.ContainsKey(name))
                        {
                            cookies[name] += votosLidos;
                        }
                        else
                        {
                            cookies[name] = votosLidos;
                        }

                    }

                    foreach (var votos in cookies)
                    {
                        Console.WriteLine(votos.Key + ": " + votos.Value);
                    }
                    
                }
            }
            catch (IOException e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}

