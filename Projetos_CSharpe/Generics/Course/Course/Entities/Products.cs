using System.Globalization;

namespace Course.Entities
{
    class Products : IComparable
    {
        public string Name { get; set; }
        public double Price { get; set; }

        public Products(string name, double price)
        {
            Name = name;
            Price = price;
        }

        public override string ToString()
        {
            return Name
                + ", "
                + Price.ToString("F2", CultureInfo.InvariantCulture);
        }

        public int CompareTo(object? obj)
        {
            if (!(obj is Products))
            {
                throw new ArgumentException("Comparing erro: argument is not a Product");
            }
            Products other = obj as Products;
            return Price.CompareTo(other.Price);
        }
    }
}
