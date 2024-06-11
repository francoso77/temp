using System.Runtime.CompilerServices;
using System;
using System.Globalization;
using Course.Entities;
using Course.Entities.Enums;

namespace Course
{
    class Program
    {
        static void Main(string[] args)
        {
            Order order = new Order {
                Id = 1080,
                Moment = DateTime.Now,
                Status = OrderStatus.SHIPPED                
            };
            Console.WriteLine(order);

            string txt = OrderStatus.PENDING_PAYMENT.ToString();
            Console.WriteLine(txt);

            OrderStatus os = Enum.Parse<OrderStatus>("DELIVERED");
            Console.WriteLine(os);
        }
    }
}
