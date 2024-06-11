using System.ComponentModel;
using Employees.Entities;
using System.Globalization;
using System;
using System.Collections.Generic;

namespace Employees
{
    class Program
    {
        static void Main(string[] args)
        {
            List<Employee> listEmp = new List<Employee>();

            System.Console.Write("Enter the number of employees: ");
            int n = int.Parse(Console.ReadLine());

            for (int i = 1; i <= n; i++)
            {
                System.Console.WriteLine($"Employee #{i} data:");
                System.Console.Write("Outsourced (y/n)? ");
                char resp = char.Parse(Console.ReadLine());

                System.Console.Write("Name: ");
                string name = System.Console.ReadLine();
                System.Console.Write("Hours: ");
                int hours = int.Parse(System.Console.ReadLine());
                System.Console.Write("Value per hour: ");
                double valuePerHour = double.Parse(System.Console.ReadLine(), CultureInfo.InvariantCulture);
                
                if (resp == 'y' || resp == 'Y')
                {
                    System.Console.Write("Additional charge: ");
                    double additionalCharge = double.Parse(System.Console.ReadLine(), CultureInfo.InvariantCulture);

                    listEmp.Add(new OutSourcedEmployee(name, hours, valuePerHour, additionalCharge));
                } else {
                    listEmp.Add(new Employee(name, hours, valuePerHour));
                }
            }

                //execução polimorfica por tipo de empregado
                System.Console.WriteLine();
                System.Console.WriteLine("PAYMENTS:");
                foreach (Employee emp in listEmp)
                {
                    System.Console.WriteLine(emp.Name + " - $ " + emp.Payment().ToString("F2", CultureInfo.InvariantCulture));
                }
        }  
    }
}