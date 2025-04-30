using System;
using System.Collections.Generic;


namespace Course
{
    class Program_Dictionary
    {
        static void Main_Dictionary(string[] args)
        {

            Dictionary<string, string> cookies = new Dictionary<string, string>();

            cookies["user"] = "maria";
            cookies["email"] = "maria@gmail.com";
            cookies["phone"] = "123132131";
            cookies["phone"] = "999999";

            Console.WriteLine(cookies["phone"]);
            Console.WriteLine(cookies["email"]);
            cookies.Remove("email");
            if (cookies.ContainsKey("email"))
            {
                Console.WriteLine(cookies["email"]);
            }
            else
            {
                Console.WriteLine("Não tem ");
            }
            Console.WriteLine("SIZE: " + cookies.Count);
            Console.WriteLine("All Cokies");
            foreach (var item in cookies)
            {
                Console.WriteLine(item.Key + " - " + item.Value);
            }
        }
    }
}
