namespace AppSales.Models
{
    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; }
        //usamos aqui um tipo generico de list / hash - e difinimos qual usar na instanciação
        public ICollection<Seller> Sellers { get; set; } = new List<Seller>();
        public Department() { }
        //cria constructor com argumentos SEM as coleções
        public Department(int id, string name)
        {
            Id = id;
            Name = name;
        }
        public void AddSeller(Seller seller)
        {
            Sellers.Add(seller);
        }
        //aqui vc pode chamar a função q está em vendedores(seller)
        public double TotalSales(DateTime initial, DateTime final)
        {
            return Sellers.Sum(seller => seller.TotalSales(initial, final));
        }
    }
}
