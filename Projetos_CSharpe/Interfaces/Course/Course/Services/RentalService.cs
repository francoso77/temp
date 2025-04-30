using System;
using Course.Entities;


namespace Course.Services
{
    class RentalService
    {
            // o private set é para só podermos alterar esses dados aqui dentro dessa classe
          public double PricePerHour { get; private set; }      
          public double PricePerDay { get; private set; }

          //criando dependÊncia de uma serviço 
        //private BrazilTaxService _brazilTaxService = new BrazilTaxService();  
        private ITaxService _taxService;

          public RentalService(double pricePerHour, double pricePerDay, ITaxService taxService)
          {
            PricePerHour = pricePerHour;
            PricePerDay = pricePerDay;
            _taxService = taxService;
          }

          public void ProcessInvoice(CarRental carRental)
          {
               TimeSpan duration =  carRental.Finish.Subtract(carRental.Start);

               double basicPayment = 0.0;
               if(duration.TotalHours <= 12.0)
               {
                    basicPayment = PricePerHour * Math.Ceiling(duration.TotalHours);
               }
               else
               {
                    basicPayment = PricePerDay * Math.Ceiling(duration.TotalDays);
               }

               double tax = _taxService.Tax(basicPayment);

               carRental.Invoice = new Invoice(basicPayment, tax);

          }
    }
}