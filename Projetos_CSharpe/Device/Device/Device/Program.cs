using System;
using Device.Entities;

namespace Devices
{
    class Program
    {
        static void Main(string[] args)
        {
            Printer p = new Printer() { SerialNumber = 1080};
            p.ProcessDoc("My letter");
            p.Print("meu texto");

            Scanner s = new Scanner() { SerialNumber = 2003};
            s.ProcessDoc("my email");
            Console.WriteLine(s.Scan());

            ComboDevice c = new ComboDevice() { SerialNumber = 3923 };
            c.ProcessDoc("My dissertation");
            c.Print("minha dissertação");
            Console.WriteLine(c.Scan());

        }
    }
}
