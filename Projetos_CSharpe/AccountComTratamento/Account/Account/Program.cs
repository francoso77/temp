using Accounts.Entities;
using Accounts.Entities.Exceptions;
using System.Globalization;

namespace Accounts
{
    class Program
    {
        static void Main(string[] args)
        {

            Console.WriteLine("Enter account data");
            Console.Write("Number:");
            int number = int.Parse(Console.ReadLine());
            Console.Write("Holder: ");
            string holder = Console.ReadLine();
            Console.Write("Initial balance: ");
            double balance = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
            Console.Write("Withdraw limit: ");
            double withDrawLimit = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);
            Console.WriteLine();

            Account acc = new Account(number, holder, balance, withDrawLimit);

            Console.WriteLine();

            try
            {
                Console.Write("Enter amount for Withdraw: ");
                double withDraw = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);

                acc.WithDraw(withDraw);
                Console.WriteLine(acc);
            }
            catch (AccountException e)
            {
                Console.WriteLine("Withdraw error: " + e.Message);
            }
            catch (FormatException e)
            {
                Console.WriteLine("Error in Format: " + e.Message);
            }
            catch (Exception e)
            {
                Console.WriteLine("Error unexpected: " + e.Message);
            }
        }
    }
}