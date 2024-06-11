using Microsoft.EntityFrameworkCore;
using AppSales.Models;

namespace AppSales.Data
{
    public class AppSalesContext : DbContext
    {
        public AppSalesContext (DbContextOptions<AppSalesContext> options)
            : base(options)
        {
        }

        public DbSet<Department> Department { get; set; }
        public DbSet<Seller> Seller { get; set; }
        public DbSet<SalesRecord> SalesRecord { get; set; }
    }
}
