namespace TaxPayers.Entities
{
    class Individual : TaxPayer
    {
        public double HealthExpeditures { get; set; }
        public Individual(string name, double anualIncome, double healthExpeditures) 
            : base(name, anualIncome)
        {
            HealthExpeditures = healthExpeditures;
        }

        public override double Tax()
        {
            double tax = 0;
            if (AnualIncome < 20000.0)
            {
                tax = AnualIncome * 0.15;
            }
            else
            {
                if (HealthExpeditures > 0)
                {
                    tax = (AnualIncome * 0.25) - (HealthExpeditures / 2.0);
                }
            }
            return tax;
        }
    }
}
