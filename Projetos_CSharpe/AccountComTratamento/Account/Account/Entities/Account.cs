using System;
using System.Globalization;
using Accounts.Entities.Exceptions;

namespace Accounts.Entities
{
    class Account
    {
        public int Number { get; set; }
        public string Holder { get; set; }
        public double Balance { get; set; }
        public double WithDrawLimit { get; set; }   
        public Account() { }

        public Account(int number, string holder, double balance, double withDrawLimit)
        {
            Number = number;
            Holder = holder;
            Balance = balance;
            WithDrawLimit = withDrawLimit;
        }
        
        public void Deposit(double  amount)
        {
            Balance += amount;
        }

        public void WithDraw(double amount)
        {
            if (amount > WithDrawLimit)
            {
                throw new AccountException("The amount exceeds withdraw limit");
            }

            if (amount > Balance)
            {  
                throw new AccountException("Not enough balance");
            }
                        
            Balance -= amount;
        }

        public override string ToString()
        {
            return "New balance: " + Balance.ToString("F2", CultureInfo.InvariantCulture);
        }

    }
}
