using Reservations.Entities;
using Reservations.Entities.Exceptions;

namespace Reservations
{
    class Program
    {
        static void Main(string[] args)
        {

            try
            {
                Console.Write("Room number: ");
                int n = int.Parse(Console.ReadLine());
                Console.Write("Check-in date (dd/MM/YYYY): ");
                DateTime checkIn = DateTime.Parse(Console.ReadLine());
                Console.Write("Check-out date (dd/MM/YYYY): ");
                DateTime checkOut = DateTime.Parse(Console.ReadLine());

                Reservation reservation = new Reservation(n, checkIn, checkOut);
                Console.WriteLine(reservation);

                Console.WriteLine();
                Console.WriteLine("Enter data to update the reservation:");
                Console.Write("Check-in date (dd/MM/YYYY): ");
                checkIn = DateTime.Parse(Console.ReadLine());
                Console.Write("Check-out date (dd/MM/YYYY): ");
                checkOut = DateTime.Parse(Console.ReadLine());

                reservation.UpdateDates(checkIn, checkOut);
                Console.WriteLine(reservation);
            }
            catch (DomainException e)
            {
                Console.WriteLine("Error in reservation: " + e.Message);
            }
            catch (FormatException e) 
            {
                Console.WriteLine("Error in Format: " + e.Message);
            }
            catch(Exception e)
            {
                Console.WriteLine("Error unexpected: " + e.Message);
            }
        }
    }
}