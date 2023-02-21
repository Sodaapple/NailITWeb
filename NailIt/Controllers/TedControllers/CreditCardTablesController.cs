using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.TedControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CreditCardTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public CreditCardTablesController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/CreditCardTables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CreditCardTable>>> GetCreditCardTables()
        {

            return await _context.CreditCardTables.ToListAsync();
        }

        // GET: api/CreditCardTables/5
        [HttpGet("{id}")]
        public async Task<List<CreditCardTable>> GetCreditCardTable(int id)
        {
            var query =  from user in _context.CreditCardTables where user.CreditCardOwner == id select user;
            
            var x =  await query.ToListAsync();
            if(x.Count() < 0)
            {
                return new List<CreditCardTable>();
            }
            return x;
        }

        // PUT: api/CreditCardTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCreditCardTable(int id, CreditCardTable creditCardTable)
        {
            if (id != creditCardTable.CreditCardId)
            {
                return BadRequest();
            }

            _context.Entry(creditCardTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CreditCardTableExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/CreditCardTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CreditCardTable>> PostCreditCardTable(CreditCardTable creditCardTable)
        {
            _context.CreditCardTables.Add(creditCardTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCreditCardTable", new { id = creditCardTable.CreditCardId }, creditCardTable);
        }

        // DELETE: api/CreditCardTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCreditCardTable(int id)
        {
           
            
            var creditCardTable = await _context.CreditCardTables.FindAsync(id);
            if (creditCardTable == null)
            {
                return NotFound();
            }

            _context.CreditCardTables.Remove(creditCardTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CreditCardTableExists(int id)
        {
            return _context.CreditCardTables.Any(e => e.CreditCardId == id);
        }
    }
}
