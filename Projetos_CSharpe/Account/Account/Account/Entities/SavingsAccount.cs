namespace Accounts.Entities
{
    //sealed é para não deixar outras classes derivar desta.. não terá como herdar
    sealed class SavingsAccount :Account
    {
        public double InterestRate { get; set; }

        public SavingsAccount() { }

        public SavingsAccount(int number, string holder, double balance, double interestRate)
            :base (number, holder, balance)
        { 
            InterestRate = interestRate;
        }

        public void UpdateBalance()
        {
            Balance = (InterestRate / 100.00) * Balance + Balance;
        }

        //override sobreposição de função de outa classe
        // podemos selar metodos tb... mas tem q ser metodos sobrepostos
        public sealed override void Withdraw(double amount)
        {
            //usand base - vc executa a função original e ainda pode fazer novas alterações 
            base.Withdraw(amount);
            Balance -= 2.0;
        }

    }
}
