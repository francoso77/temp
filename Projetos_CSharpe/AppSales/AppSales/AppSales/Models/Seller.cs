using System.ComponentModel.DataAnnotations;

namespace AppSales.Models
{
    public class Seller
    {
        public int Id { get; set; }
        [Required (ErrorMessage ="{0} obrigatório")]
        [StringLength(60, MinimumLength =3,ErrorMessage ="o campo {0} deve ter de {2} a {1} caracteres")]
        public string Name { get; set; }
        [Required(ErrorMessage = "{0} obrigatório")]
        [DataType(DataType.EmailAddress)]
        [EmailAddress (ErrorMessage ="Entre com e-mail válido")]
        public string Email { get; set; }
        [Required(ErrorMessage = "{0} obrigatório")]
        [Display(Name = "Bith Date")]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString ="{0:dd/MM/yyyy}")]
        public DateTime BirthDate { get; set; }
        [Required(ErrorMessage = "{0} obrigatório")]
        [Display(Name = "Base Salary")]
        [DisplayFormat(DataFormatString = "{0:N}")]
        [Range (100.0, 50000.0, ErrorMessage = "{0} Valores entre {1} a {2}")]
        public double BaseSalary { get; set; }
        public Department Department { get; set; }
        //para corrigir o problema de entidade referecial do bd
        public int DepartmentId { get; set; }
        public ICollection<SalesRecord> Sales { get; set; } = new List<SalesRecord>();  
        public Seller() { }
        public Seller(int id, string name, string email, DateTime birthDate, double baseSalary, Department department)
        {
            Id = id;
            Name = name;
            Email = email;
            BirthDate = birthDate;
            BaseSalary = baseSalary;
            Department = department;
        }
        public void AddSales(SalesRecord sr)
        {
            Sales.Add(sr);
        }
        public void RemoveSales(SalesRecord sr)
        {
            Sales.Remove(sr);
        }
        //Amount é o campo valor em SalesRecord
        public double TotalSales(DateTime initial, DateTime final)
        {
            return Sales
                .Where(sales => sales.Date >= initial && sales.Date <= final)
                .Sum(sales => sales.Amount);
        }
    }
}
