using Accounts.Entities;

namespace Accounts
{
    class Program
    {
        static void Main(string[] args)
        {
           /* BusinessAccount ba1 = new BusinessAccount(8010, "Alex Green", 100.00, 500.00);

            Console.WriteLine(ba1.Balance);
            //não se pode alterar este campo aqui pq ele é PROTECTED
            //ba1.Balance = 200.00;
            //Console.WriteLine(ba1.Balance);
           

            Account acc = new Account(1001, "Alex", 0.0);
            BusinessAccount bacc = new BusinessAccount(1002, "Maria", 0.0, 100.00);

            //UPCASTING

            Account acc1 = bacc;
            Account acc2 = new BusinessAccount(1003, "Bob", 0.0, 200.0);
            Account acc3 = new SavingsAccount(1004, "Anna", 100.0, 1);

            
            //DOWNCASTING
            BusinessAccount acc4 = (BusinessAccount)acc2;
            acc4.Loan(1000.00);
            //que dá uma erro em tempo de execução pq o acc3 é do tipo SavingsAccount
            //BusinessAccount acc5 = (BusinessAccount)acc3;

            //neste caso vc precisar testar o tipo

            if (acc3 is BusinessAccount)
            {
                BusinessAccount acc5 = (BusinessAccount)acc3;
                acc5.Loan(150.00);
                Console.WriteLine("Loan!");
            }

            if (acc3 is SavingsAccount)
            {
               // outra forma de fazer referÊncia é com as
                SavingsAccount acc5 = acc3 as SavingsAccount;
                acc5.UpdateBalance();
                Console.WriteLine("Update!");
            }
           */


            Account acc1 = new Account(1001, "Anna", 500.00);
            Account acc2 = new SavingsAccount(1002, "Pedro", 500.00, 1.0);

            acc1.Withdraw(10.0);
            acc2.Withdraw(10.0);

            Console.WriteLine(acc1.Balance);
            Console.WriteLine(acc2.Balance);
        }
    }
} 