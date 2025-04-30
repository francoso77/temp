using Course.Entities;

namespace Course
{
    class Program_Action
    {
        static void Main_Action(string[] args)
        {
            List<Product> products = new List<Product>();

            products.Add(new Product("Tv", 900.00));
            products.Add(new Product("Mouse", 50.00));
            products.Add(new Product("Tablet", 350.50));
            products.Add(new Product("HD Case", 80.90));

            //removando usando lambda
            products.ForEach(product => { product.Price = product.Price * 1.1; });

            //usando Action
            //lembrando q o Acton não tem retorno é VOID
            //products.ForEach(UpdatePrice);
            foreach (Product product in products) { Console.WriteLine(product); }
        }

        static void UpdatePrice(Product product)
        {
            product.Price = product.Price * 1.1;
        }

    }
}