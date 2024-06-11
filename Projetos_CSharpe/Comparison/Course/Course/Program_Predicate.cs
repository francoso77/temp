using Course.Entities;

namespace Course
{
    class Program_Predicate
    {
        static void Main_Predicate(string[] args)
        {
            List<Product> products = new List<Product>();

            products.Add(new Product("Tv", 900.00));
            products.Add(new Product("Mouse", 50.00));
            products.Add(new Product("Tablet", 350.50));
            products.Add(new Product("HD Case", 80.90));

            //removando usando lambda
            //products.RemoveAll(p => p.Price >= 100.00);

            //usando predicate
            //lembrando q o predicate o seu retorno é bool
            products.RemoveAll(ProductTest);
            foreach (Product product in products) { Console.WriteLine(product); }
        }

        public static bool ProductTest(Product product)
        {
            return product.Price >= 100.0;
        }

    }
}