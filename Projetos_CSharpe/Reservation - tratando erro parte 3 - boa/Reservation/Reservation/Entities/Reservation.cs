using System.Text;
using Reservations.Entities.Exceptions;


namespace Reservations.Entities
{
    class Reservation
    {
        public int RoomNumber { get; set; }
        DateTime CheckIn { get; set; }  
        DateTime CheckOut { get; set; }

        public Reservation() { }

        public Reservation(int roomNumber, DateTime checkIn, DateTime checkOut)
        {
            if (checkOut <= checkIn)
            {
                throw new DomainException("Error in reservation: Check-out date must be after check-in date.");
            }

            RoomNumber = roomNumber;
            CheckIn = checkIn;
            CheckOut = checkOut;
        }

        public int Duration()
        {
            TimeSpan duration = CheckOut.Subtract(CheckIn);
            return (int) duration.TotalDays;
        }

        //lançar excessão no DomainException criado
        //corta o processamento o throw
        public void UpdateDates(DateTime checkIn, DateTime checkOut )
        {
            
            DateTime now = DateTime.Now;

            if (checkIn < now || checkOut < now) 
            {
                throw new DomainException("Reservation dates for update must be future dates.");
            }
            
            if (checkOut <= checkIn)
            {
                throw new DomainException("Error in reservation: Check-out date must be after check-in date.");
            }

            CheckIn = checkIn;
            CheckOut = checkOut;
            
        }

        public override string ToString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("Reservation: Room ");
            sb.Append(RoomNumber);
            sb.Append(", check-in: ");
            sb.Append(CheckIn.ToString("dd/MM/yyyy"));
            sb.Append(", check-out: ");
            sb.Append(CheckOut.ToString("dd/MM/yyyy"));
            sb.Append(", ");
            sb.Append(Duration());
            sb.Append(" nights");

            return sb.ToString();
        }
    }
}
 