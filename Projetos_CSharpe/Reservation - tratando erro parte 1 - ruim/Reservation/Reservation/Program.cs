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

                DateTime now = DateTime.Now;

                if (checkIn < now || checkOut < now) 
                {
                    Console.WriteLine("Error in resevation: Reservation dates for update must be future dates.");
                }
                else if (checkOut <= checkIn)
                {
                    Console.WriteLine("Error in reservation: Check-out date must be after check-in date.");
                }
                else
                { 
                    reservation.UpdateDates(checkIn, checkOut);
                    Console.WriteLine(reservation);
                }
            }
        }
    }
}