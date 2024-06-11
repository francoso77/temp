using AppSales.Data;
using AppSales.Models;
using AppSales.Services.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace AppSales.Services
{
    public class SellerService
    {
        private readonly AppSalesContext _context;

        public SellerService(AppSalesContext context)
        {
            _context = context; 
        }

        public async Task<List<Seller>> FindAllAsync()
        {
            return await _context.Seller.ToListAsync();
        }

        public async Task InsertAsync(Seller seller)
        {
            _context.Add(seller); 
            await _context.SaveChangesAsync();
        }
        //.Include() é para mostrar o item relacionado com outra tablea
        public async Task<Seller> FindByIdAsync(int id) => 
            await _context.Seller.Include(obj => obj.Department).FirstOrDefaultAsync(obj => obj.Id == id);

        public async Task RemoveAsync(int id)
        {
            try
            {
                var obj = await _context.Seller.FindAsync(id);
                _context.Seller.Remove(obj);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw new IntegrityException("Existem dados relacionados com este item, não pode ser removido");
            }
        }
        public async Task UpdateAsync(Seller seller)
        {
            //teste se no bd tem alguem com o mesmo id
            bool hasAny = await _context.Seller.AnyAsync(x => x.Id == seller.Id);

            if (!hasAny)
            {
                throw new NotFoundException("Id not Found");
            }
            try
            {
                _context.Update(seller);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException e)
            {
                throw new DbConcurrencyException(e.Message);
            }
        }
    }
}
