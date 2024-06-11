using Course.Entities;
using System.Globalization;

namespace Course
{
    class Program_Linq2
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

        static void Main_Linq2(string[] args)
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

            var r1 = products.Where(p => p.Category.Tier == 1 && p.Price < 900.0);
            Print("Produtos do tipo 1 e preços menor que 900.00: ", r1 );

            var r2 = products.Where(p => p.Category.Tier == 2).Select(p => p.Name.ToUpper());
            Print("Listar todos os produtos da categoria Tools - somento os nome dos produtos em maiusculo: ", r2);

            var r3 = products.Where(p => p.Name[0] == 'C').Select(p => new { p.Name, p.Price, CategoryName = p.Category.Name });
            Print("Listar produtos que começa com a letra C em objeto anonimo:", r3);

            var r4 = products.Where(p => p.Category.Tier == 1).OrderBy(p => p.Price).ThenBy(p => p.Name);
            Print("Listar produtos da categoria tier 1 em ordem de preço e depois de nome:", r4);

            var r5 = r4.Skip(2).Take(4);
            Print("Listar produtos da categoria tier 1 em ordem de preço e depois de nome - pula 2 e mostra 4 da lista:", r5);

            var r6 = products.First();
            Console.WriteLine("Listar o primeiro produtos da lista: " +  r6);

            var r7 = products.Where(p => p.Price > 3000.0).FirstOrDefault();
            //first or default imprimi vazio qdo não tem
            Console.WriteLine("r7 com first or default : " + r7);

            var r8 = products.Where(p => p.Id == 3).SingleOrDefault();
            
            // sem o single or default ele é um valor com ele é um conjunto - usar somente para 1 ou nenhum elemento
            // sem o single or default vc usa Console.Write
            //Print("teste", r8);
            Console.WriteLine("tem o produto com id igual a 3 ...se não tem volta em branco: " + r8);

            var r9 = products.Max(p => p.Price);
            Console.WriteLine("o valor maximo: " +  r9);

            var r10 = products.Min(p => p.Price);
            Console.WriteLine("o valor minimo : " + r10);

            var r11 = products.Average(p => p.Price);
            Console.WriteLine("o valor medio: " + r11.ToString("F2", CultureInfo.InvariantCulture));

            var r12 = products.Where(p => p.Category.Id == 1).Sum(p => p.Price);
            Console.WriteLine("Soma dos produtos de ID = 1: " +  r12);

            var r13 = products.Where(p => p.Category.Id == 1).Count();
            Console.WriteLine("Quantidade dos produtos de ID = 1: " + r13);

            // para tratar lista sem valores
            var r14 = products.Where(p => p.Category.Id == 5)
                .Select(p => p.Price)
                .DefaultIfEmpty(0.0)
                .Average();
            Console.WriteLine("Media dos produtos de ID = 5 - ou lista vaiza : " + r14);

            //criando a sua própria soma

            var r15 = products.Where(p => p.Category.Id == 1)
                .Select (p => p.Price)
                .Aggregate(0.0, (x, y) => x + y);
            Console.WriteLine("Soma dos produtos de ID = 1 com Aggregate  - com tratamento antes da lambda: " + r15);
            Console.WriteLine();

            var GroupByProducts = products.GroupBy(p => p.Category);
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