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
    public class ColorTables2Controller : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ColorTables2Controller(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/ColorTables2
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ColorTable>>> GetColorTables()
        {
            return await _context.ColorTables.ToListAsync();
        }

        //// GET: api/ColorTables2/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<ColorTable>> GetColorTable(int id)
        //{
        //    var colorTable = await _context.ColorTables.FindAsync(id);

        //    if (colorTable == null)
        //    {
        //        return NotFound();
        //    }

        //    return colorTable;
        //}

        //// PUT: api/ColorTables2/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutColorTable(int id, ColorTable colorTable)
        //{
        //    if (id != colorTable.ColorId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(colorTable).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!ColorTableExists(id))
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

        //// POST: api/ColorTables2
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<ColorTable>> PostColorTable(ColorTable colorTable)
        //{
        //    _context.ColorTables.Add(colorTable);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetColorTable", new { id = colorTable.ColorId }, colorTable);
        //}

        //// DELETE: api/ColorTables2/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteColorTable(int id)
        //{
        //    var colorTable = await _context.ColorTables.FindAsync(id);
        //    if (colorTable == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.ColorTables.Remove(colorTable);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool ColorTableExists(int id)
        {
            return _context.ColorTables.Any(e => e.ColorId == id);
        }
    }
}
