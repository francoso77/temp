using System.Text;

namespace Reservations.Entities
{
    class Reservation
    {
        public int RoomNumber { get; set; }
        DateTime CheckIn { get; set; }  
        DateTime CheckOut { get; set; }

        public Reservation() { }

        public Reservation(int roomNumber, DateTime checkin, DateTime checkout)
        {
            RoomNumber = roomNumber;
            CheckIn = checkin;
            CheckOut = checkout;
        }

        public int Duration()
        {
            TimeSpan duration = CheckOut.Subtract(CheckIn);
            return (int) duration.TotalDays;
        }

        public string UpdateDates(DateTime checkIn, DateTime checkOut )
        {
            //o metodo return desabilita do else do if
            DateTime now = DateTime.Now;

            if (checkIn < now || checkOut < now) 
            {
                return "Reservation dates for update must be future dates.";
            }
            
            if (checkOut <= checkIn)
            {
                return "Error in reservation: Check-out date must be after check-in date.";
            }

            CheckIn = checkIn;
            CheckOut = checkOut;
            return null;
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
 