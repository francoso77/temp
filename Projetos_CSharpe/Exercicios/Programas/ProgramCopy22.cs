using System;
using System.Collections.Generic;
using System.Globalization;

namespace ExerciciosCopy22
{
    class ProgramCopy22
    {
        static void MainCopy22(string[] args)
        {
            var x = 10;
            var y = 20.0;
            var z = "Frank";
            var a = 'A';
            var tem = true;

            Console.WriteLine(x.GetTypeCode());
            Console.WriteLine(y.GetTypeCode());
            Console.WriteLine(z.GetTypeCode());
            Console.WriteLine(a.GetTypeCode());
            Console.WriteLine(tem.GetTypeCode());

            int resultado = (x > 5) ? 100 : 50;
            Console.WriteLine(resultado);

            string original = "  ";
            Console.WriteLine(original);

            bool b1 = string.IsNullOrEmpty(original);
            bool b2 = string.IsNullOrWhiteSpace(original);

            Console.WriteLine(b1);
            Console.WriteLine(b2);

            DateTime d1 = DateTime.Now;
            Console.WriteLine(d1);

            DateTime d2 = new DateTime(2018, 11, 25, 11, 50, 03);
            Console.WriteLine(d2);
            DateTime d3 = DateTime.Today;
            Console.WriteLine(d3);
            DateTime d4 = DateTime.UtcNow;  //usa
            Console.WriteLine(d4);

            DateTime d5 = DateTime.Parse("2000-08-15 13:05:58");
            Console.WriteLine(d5);
            DateTime d6 = DateTime.Parse("22/03/2023 11:01:15");
            Console.WriteLine(d6);

            //para banco de dados

            DateTime d7 = DateTime.ParseExact("2000-05-15", "yyyy-MM-dd", CultureInfo.InvariantCulture);
            Console.WriteLine(d7);
            DateTime d8 = DateTime.ParseExact("15/08/2000 13:05:55", "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);
            Console.WriteLine(d8);

            //TimeSpan - tipo timeout

            TimeSpan t1 = new TimeSpan();
            TimeSpan t2 = new TimeSpan(9000000000L);
            TimeSpan t3 = new TimeSpan(2, 11, 21);
            TimeSpan t4 = new TimeSpan(2, 4, 15, 35);
            Console.WriteLine(t1);
            Console.WriteLine(t2);
            Console.WriteLine(t3);
            Console.WriteLine(t4);

            TimeSpan t5 = TimeSpan.Zero;
            TimeSpan t6 = TimeSpan.FromDays(1.5);
            TimeSpan t7 = TimeSpan.FromMilliseconds(1.5);

            Console.WriteLine(t5);
            Console.WriteLine(t6);
            Console.WriteLine(t7);

            DateTime d9 = new DateTime(2001, 8, 15, 13, 45, 27);
            Console.WriteLine(d9);
            Console.WriteLine("1) Date: " + d9.Date);
            Console.WriteLine("2) Day: " + d9.Day);
            Console.WriteLine("3) DayOfWeek: " + d9.DayOfWeek);
            Console.WriteLine("4) DayOfYear: " + d9.DayOfYear);
            Console.WriteLine("5) Hour: " + d9.Hour);
            Console.WriteLine("6) Kind: " + d9.Kind);
            Console.WriteLine("7) Minute: " + d9.Minute);
            Console.WriteLine("8) Month: " + d9.Month);
            Console.WriteLine("9) TimeOdDay: " + d9.TimeOfDay);
            Console.WriteLine("10) Ticks: " + d9.Ticks);
            Console.WriteLine("11) Yaer: " + d9.Year);

            Console.WriteLine("Strings: " + d9.ToLongDateString());
            Console.WriteLine("Strings: " + d9.ToLongTimeString());
            Console.WriteLine("Strings: " + d9.ToShortDateString());
            Console.WriteLine("Strings: " + d9.ToShortTimeString());
            Console.WriteLine("Strings: " + d9.ToString("yyyy-MM-dd HH:mm:ss"));

            DateTime d10 = d9.AddDays(10);
            Console.WriteLine(d10);

            DateTime d11 = new DateTime(2023, 03, 22);
            Console.WriteLine(d11);

            TimeSpan dif = d11.Subtract(d10);
            Console.WriteLine(dif.Days);

            TimeSpan t01 = new TimeSpan(1, 30, 10);
            TimeSpan t02 = new TimeSpan(0, 10, 5);

            TimeSpan sum = t01.Add(t02);
            TimeSpan dif1 = t01.Subtract(t02);
            TimeSpan mult = t02.Multiply(2.0);
            TimeSpan div = t02.Divide(2.0);
            Console.WriteLine(sum);
            Console.WriteLine(dif1);
            Console.WriteLine(mult);
            Console.WriteLine(div);

            // gravar no banco UTC
            // mostrar no modo local


        }
    }
}
