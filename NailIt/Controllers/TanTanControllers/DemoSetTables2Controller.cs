using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.TanTanControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DemoSetTables2Controller : ControllerBase
    {
        private readonly NailitDBContext _context;

        public DemoSetTables2Controller(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/DemoSetTables2
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DemoSetTable>>> GetDemoSetTables()
        {
            return await _context.DemoSetTables.ToListAsync();
        }

        //// GET: api/DemoSetTables2/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<DemoSetTable>> GetDemoSetTable(int id)
        //{
        //    var demoSetTable = await _context.DemoSetTables.FindAsync(id);

        //    if (demoSetTable == null)
        //    {
        //        return NotFound();
        //    }

        //    return demoSetTable;
        //}

        //// PUT: api/DemoSetTables2/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutDemoSetTable(int id, DemoSetTable demoSetTable)
        //{
        //    if (id != demoSetTable.DemoSetId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(demoSetTable).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!DemoSetTableExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        //// POST: api/DemoSetTables2
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<DemoSetTable>> PostDemoSetTable(DemoSetTable demoSetTable)
        //{
        //    _context.DemoSetTables.Add(demoSetTable);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetDemoSetTable", new { id = demoSetTable.DemoSetId }, demoSetTable);
        //}

        //// DELETE: api/DemoSetTables2/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteDemoSetTable(int id)
        //{
        //    var demoSetTable = await _context.DemoSetTables.FindAsync(id);
        //    if (demoSetTable == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.DemoSetTables.Remove(demoSetTable);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool DemoSetTableExists(int id)
        {
            return _context.DemoSetTables.Any(e => e.DemoSetId == id);
        }
    }
}
