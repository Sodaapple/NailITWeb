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
    public class CodeTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public CodeTablesController(NailitDBContext context)
        {
            _context = context;
        }


        // GET: api/CodeTables
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<CodeTable>>> GetCodeTables()
        //{
        //    return await _context.CodeTables.ToListAsync();
        //}

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CodeTable>>> GetCodeTables()
        {
            var reportcode = _context.CodeTables.Where(x => x.CodeUseIn == "D");

            return await reportcode.ToListAsync();
        }

        // GET: api/CodeTables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CodeTable>> GetCodeTable(string id)
        {
            var codeTable = await _context.CodeTables.FindAsync(id);

            if (codeTable == null)
            {
                return NotFound();
            }

            return codeTable;
        }

        // PUT: api/CodeTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCodeTable(string id, CodeTable codeTable)
        {
            if (id != codeTable.CodeId)
            {
                return BadRequest();
            }

            _context.Entry(codeTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CodeTableExists(id))
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

        // POST: api/CodeTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CodeTable>> PostCodeTable(CodeTable codeTable)
        {
            _context.CodeTables.Add(codeTable);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CodeTableExists(codeTable.CodeId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCodeTable", new { id = codeTable.CodeId }, codeTable);
        }

        // DELETE: api/CodeTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCodeTable(string id)
        {
            var codeTable = await _context.CodeTables.FindAsync(id);
            if (codeTable == null)
            {
                return NotFound();
            }

            _context.CodeTables.Remove(codeTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CodeTableExists(string id)
        {
            return _context.CodeTables.Any(e => e.CodeId == id);
        }
    }
}
