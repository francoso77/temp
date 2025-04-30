namespace Course.Services
{
    //implementa��o da Interface ... igual faz com a Heran�a
    class BrazilTaxService : ITaxService
    {
        //o nome do m�todo tem que ter o nome da interface
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