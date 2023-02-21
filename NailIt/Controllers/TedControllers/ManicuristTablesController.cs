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
    public class ManicuristTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ManicuristTablesController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/ManicuristTables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ManicuristTable>>> GetManicuristTables()
        {
            return await _context.ManicuristTables.ToListAsync();
        }

        // GET: api/ManicuristTables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ManicuristTable>> GetManicuristTable(int id)
        {
            var manicuristTable = await _context.ManicuristTables.FindAsync(id);

            if (manicuristTable == null)
            {
                return NotFound();
            }

            return manicuristTable;
        }

        // PUT: api/ManicuristTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutManicuristTable(int id, ManicuristTable manicuristTable)
        {

            

            _context.Entry(manicuristTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ManicuristTableExists(id))
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

        // POST: api/ManicuristTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ManicuristTable>> PostManicuristTable(ManicuristTable manicuristTable)

        {
            var table = new RemovalPriceTable();
            table.RemovalPriceManicuristId = manicuristTable.ManicuristId;
            table.RemovalPriceB0 = 0;
            table.RemovalPriceB1 = 0;
            table.RemovalPriceB3 = 0;
            table.RemovalPriceB2 = 0;
            _context.RemovalPriceTables.Add(table);
            _context.ManicuristTables.Add(manicuristTable);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ManicuristTableExists(manicuristTable.ManicuristId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetManicuristTable", new { id = manicuristTable.ManicuristId }, manicuristTable);
        }

        // DELETE: api/ManicuristTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteManicuristTable(int id)
        {
            var manicuristTable = await _context.ManicuristTables.FindAsync(id);
            if (manicuristTable == null)
            {
                return NotFound();
            }

            _context.ManicuristTables.Remove(manicuristTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ManicuristTableExists(int id)
        {
            return _context.ManicuristTables.Any(e => e.ManicuristId == id);
        }
    }
}
