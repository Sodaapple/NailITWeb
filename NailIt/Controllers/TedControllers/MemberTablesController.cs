using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using NailIt.Models;

namespace NailIt.Controllers.TedControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public MemberTablesController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/MemberTables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberTable>>> GetMemberTables()
        {
            return await _context.MemberTables.ToListAsync();
        }

        // GET: api/MemberTables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MemberTable>> GetMemberTable(int id)
        {
            var memberTable = await _context.MemberTables.FindAsync(id);
            if (memberTable == null)
            {
                return NotFound();
            }

            return memberTable;
        }

        // PUT: api/MemberTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMemberTable(int id, MemberTable memberTable)
        {
            if (id != memberTable.MemberId)
            {
                return BadRequest();
            }

            _context.Entry(memberTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MemberTableExists(id))
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

        // POST: api/MemberTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<MemberTable>> PostMemberTable(MemberTable memberTable)
        //{
        //    _context.MemberTables.Add(memberTable);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetMemberTable", new { id = memberTable.MemberId }, memberTable);
        //}

        // DELETE: api/MemberTables/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteMemberTable(int id)
        //{
        //    var memberTable = await _context.MemberTables.FindAsync(id);
        //    if (memberTable == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.MemberTables.Remove(memberTable);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        private bool MemberTableExists(int id)
        {
            return _context.MemberTables.Any(e => e.MemberId == id);
        }
    }
}
