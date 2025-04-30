using AppSales.Data;
using AppSales.Models;
using Microsoft.EntityFrameworkCore;

namespace AppSales.Services
{
    public class DepartmentService
    {
        private readonly AppSalesContext _context;

        public DepartmentService(AppSalesContext context)
        {
            _context = context; 
        }
        //transformado de sincrona para assincrona
        public async Task<List<Department>> FindAllAsync()
        {
            return await _context.Department.OrderBy(dep => dep.Name).ToListAsync();
        }
    }
}
