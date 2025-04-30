using Course.Entities;
using System.Globalization;
using System.Runtime.CompilerServices;

namespace Course
{
    class Program
    {

        static void Print<T>(string menssage, IEnumerable<T> collection) 
        {
            Console.WriteLine(menssage);
            foreach (T item in collection)
            {
                Console.WriteLine(item);
            }
            Console.WriteLine();
        }

        static void Main(string[] args)
        {
            Category c1 = new Category() { Id = 1, Name = "Tools", Tier = 2 };
            Category c2 = new Category() { Id = 2, Name = "Computers", Tier = 1 };
            Category c3 = new Category() { Id = 3, Name = "Electronics", Tier = 1 };

            List<Product> products = new List<Product>()
            {
                new Product(){ Id = 1, Name ="Computer", Price=1100.0, Category = c2 },
                new Product(){ Id = 2, Name ="Hammer", Price=90.0, Category = c1 },
                new Product(){ Id = 3, Name ="TV", Price=1700.0, Category = c3 },
                new Product(){ Id = 4, Name ="Notebook", Price=1300.0, Category = c2 },
                new Product(){ Id = 5, Name ="Saw", Price=80.0, Category = c1 },
                new Product(){ Id = 6, Name ="Tablet", Price=700.0, Category = c2 },
                new Product(){ Id = 7, Name ="Camera", Price=700.0, Category = c3 },
                new Product(){ Id = 8, Name ="Printer", Price=350.0, Category = c3 },
                new Product(){ Id = 9, Name ="MacBook", Price=1800.0, Category = c2 },
                new Product(){ Id = 10, Name ="Sound Bar", Price=700.0, Category = c3 },
                new Product(){ Id = 11, Name ="Level", Price=70.0, Category = c1 }

            };

            var r1 =
                from p in products
                where p.Category.Tier == 1
                select p;
            Print("Produtos do tipo 1 e preços menor que 900.00: ", r1 );

            var r2 = 
                from p in products
                where p.Category.Tier == 2
                select p.Name.ToUpper();
            Print("Listar todos os produtos da categoria Tools - somento os nome dos produtos em maiusculo: ", r2);

            var r3 =
                from p in products
                where p.Name[0] == 'C'
                select new
                {
                    p.Name,
                    p.Price,
                    CategoryName = p.Category.Name
                };
            Print("Listar produtos que começa com a letra C em objeto anonimo:", r3);

            var r4 =
                from p in products
                where p.Category.Tier == 1
                orderby p.Name
                orderby p.Price
                select p;
            Print("Listar produtos da categoria tier 1 em ordem de preço e depois de nome:", r4);

            //var r5 = r4.Skip(2).Take(4);

            //para operações especiais coloque similar a "SQL" entre (instrução)
            var r5 =
                (from p in r4
                 select p)
                 .Skip(2)
                 .Take(4);
            Print("Listar produtos da categoria tier 1 em ordem de preço e depois de nome - pula 2 e mostra 4 da lista:", r5);

            var r6 =
                (from p in products
                 where p.Price > 1000.0
                 select p).FirstOrDefault();
            Console.WriteLine("Usando simila ao SQL: " + r6);
            
            
            //criando a sua própria soma
            var r15 = products.Where(p => p.Category.Id == 1)
                .Select (p => p.Price)
                .Aggregate(0.0, (x, y) => x + y);
            Console.WriteLine("Soma dos produtos de ID = 1 com Aggregate  - com tratamento antes da lambda: " + r15);
            Console.WriteLine();

            //var GroupByProducts = products.GroupBy(p => p.Category);

            var GroupByProducts =
                from p in products
                orderby p.Price
                orderby p.Name
                group p by p.Category;
                
            //var ou IGrouping<Categgory, Product>
            foreach ( var group in GroupByProducts)
            {
                Console.WriteLine("Category " + group.Key.Name + ":");
                foreach (Product item in group)
                {
                    Console.WriteLine(item);
                }
                Console.WriteLine();
            }
        }   
    }
}