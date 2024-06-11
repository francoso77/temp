using System.Security.Cryptography.X509Certificates;
namespace Course.Entities
{
    public class Products
    {
        public string Name { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }  

        public Products(string name, double price, int quantity)
        {
            Name = name;
            Price = price;
            Quantity = quantity;
        }

        public double Total()
        {
            return Price * Quantity;
        }

    }
}