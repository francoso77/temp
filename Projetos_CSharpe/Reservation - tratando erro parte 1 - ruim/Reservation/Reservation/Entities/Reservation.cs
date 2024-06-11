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

        public void UpdateDates(DateTime checkin, DateTime checkout )
        {
            CheckIn = checkin;
            CheckOut = checkout;
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
 