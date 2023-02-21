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
    public class NoticeReadTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public NoticeReadTablesController(NailitDBContext context)
        {
            _context = context;
        }

        //// GET: api/NoticeReadTables
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<NoticeReadTable>>> GetNoticeReadTables()
        //{
        //    return await _context.NoticeReadTables.ToListAsync();
        //}

        //// GET: api/NoticeReadTables/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<NoticeReadTable>> GetNoticeReadTable(int id)
        //{
        //    var noticeReadTable = await _context.NoticeReadTables.FindAsync(id);

        //    if (noticeReadTable == null)
        //    {
        //        return NotFound();
        //    }

        //    return noticeReadTable;
        //}

        //// PUT: api/NoticeReadTables/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutNoticeReadTable(int id, NoticeReadTable noticeReadTable)
        //{
        //    if (id != noticeReadTable.NoticeReadId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(noticeReadTable).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!NoticeReadTableExists(id))
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
        [HttpPost]
        // POST: api/NoticeReadTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        public async Task<ActionResult<NoticeReadTable>> PostNoticeReadTable(NoticeReadTable noticeReadTable)
        {
            _context.NoticeReadTables.Add(noticeReadTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNoticeReadTable", new { id = noticeReadTable.NoticeReadId }, noticeReadTable);
        }

        // DELETE: api/NoticeReadTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNoticeReadTable(int id)
        {
            var noticeReadTable = await _context.NoticeReadTables.FindAsync(id);
            if (noticeReadTable == null)
            {
                return NotFound();
            }

            _context.NoticeReadTables.Remove(noticeReadTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NoticeReadTableExists(int id)
        {
            return _context.NoticeReadTables.Any(e => e.NoticeReadId == id);
        }
    }
}
