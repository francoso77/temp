namespace Course.Services
{
    //implementação da Interface ... igual faz com a Herança
    class BrazilTaxService : ITaxService
    {
        //o nome do método tem que ter o nome da interface
        public double Tax(double amount)    
        {
            if(amount <= 100.0)
            {
                return amount * 0.2;
            }
            else
            {
                return amount * 0.15;
            }
        }
    }
}