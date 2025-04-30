using System.Globalization;
using Orders.Entities;
using Orders.Entities.Enums;
using System;


namespace Orders
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Enter cliente data:");
            Console.Write("Name: ");
            string name = Console.ReadLine();
            Console.Write("Email: ");
            string email = Console.ReadLine();
            Console.Write("Birth date (DD/MM/YYYY):");
            DateTime birth = DateTime.Parse(Console.ReadLine());

            Client Clients = new Client(name, email, birth);

            Console.WriteLine("Enter order data:");
            Console.Write("Status: ");
            OrderStatus status = Enum.Parse<OrderStatus>(Console.ReadLine());

            Order Orders = new Order(DateTime.Now, status, Clients);

            Console.Write("How many items to this order? ");
            int n = int.Parse(Console.ReadLine());

            for (int i = 1; i <= n; i++)
            {
                Console.WriteLine($"Enter #{i} item data:");
                Console.Write("Product name: ");
                string productName = Console.ReadLine();
                Console.Write("Product price: ");
                double productPrice = double.Parse(Console.ReadLine(), CultureInfo.InvariantCulture);

                Product Products = new Product(productName, productPrice);

                Console.Write("Quantity: ");
                int quantity = int.Parse(Console.ReadLine());
                
                
                OrderItem Items = new OrderItem(quantity, productPrice, Products);
                Orders.AddOrderItem(Items);
                
            }
            Console.WriteLine();
            Console.WriteLine("ORDER SUMARY:");
            Console.WriteLine(Orders);
        }
    }
}