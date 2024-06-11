using Reservations.Entities;

namespace Reservations
{
    class Program
    {
        static void Main(string[] args)
        {
            
            
            Console.Write("Room number: ");
            int n = int.Parse(Console.ReadLine());
            Console.Write("Check-in date (dd/MM/YYYY): ");
            DateTime checkIn = DateTime.Parse(Console.ReadLine());
            Console.Write("Check-out date (dd/MM/YYYY): ");
            DateTime checkOut = DateTime.Parse(Console.ReadLine());

            //verificando datas de forma ruim usand if
            
            if (checkOut <= checkIn)
            {
                Console.WriteLine("Error in reservation: Check-out date must be after check-in date");
            }
            else
            {
                Reservation reservation = new Reservation(n, checkIn, checkOut);
                Console.WriteLine(reservation);
                Console.WriteLine();
                Console.WriteLine("Enter data to update the reservation:");
                Console.Write("Check-in date (dd/MM/YYYY): ");
                checkIn = DateTime.Parse(Console.ReadLine());
                Console.Write("Check-out date (dd/MM/YYYY): ");
                checkOut = DateTime.Parse(Console.ReadLine());

                string error = reservation.UpdateDates(checkIn, checkOut);

                if (error != null)
                {
                    Console.WriteLine("Error in reservation: " + error);
                }
                else
                {                     
                    Console.WriteLine(reservation);
                }
            }
        }
    }
}