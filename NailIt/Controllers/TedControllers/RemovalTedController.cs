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
    public class RemovalTedController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public RemovalTedController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/RemovalTed
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RemovalPriceTable>>> GetRemovalPriceTables()
        {
            return await _context.RemovalPriceTables.ToListAsync();
        }

        // GET: api/RemovalTed/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RemovalPriceTable>> GetRemovalPriceTable(int id)
        {
            var removalPriceTable = await _context.RemovalPriceTables.FindAsync(id);

            if (removalPriceTable == null)
            {
                return NotFound();
            }

            return removalPriceTable;
        }

        // PUT: api/RemovalTed/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRemovalPriceTable(int id, RemovalPriceTable removalPriceTable)
        {
            if (id != removalPriceTable.RemovalPriceManicuristId)
            {
                return BadRequest();
            }

            _context.Entry(removalPriceTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RemovalPriceTableExists(id))
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

        // POST: api/RemovalTed
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RemovalPriceTable>> PostRemovalPriceTable(RemovalPriceTable removalPriceTable)
        {
            _context.RemovalPriceTables.Add(removalPriceTable);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RemovalPriceTableExists(removalPriceTable.RemovalPriceManicuristId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRemovalPriceTable", new { id = removalPriceTable.RemovalPriceManicuristId }, removalPriceTable);
        }

        // DELETE: api/RemovalTed/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRemovalPriceTable(int id)
        {
            var removalPriceTable = await _context.RemovalPriceTables.FindAsync(id);
            if (removalPriceTable == null)
            {
                return NotFound();
            }

            _context.RemovalPriceTables.Remove(removalPriceTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RemovalPriceTableExists(int id)
        {
            return _context.RemovalPriceTables.Any(e => e.RemovalPriceManicuristId == id);
        }
    }
}
