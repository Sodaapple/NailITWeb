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
    public class CommentTedController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public CommentTedController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/CommentTed
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentTable>>> GetCommentTables()
        {
            return await _context.CommentTables.ToListAsync();
        }

        // GET: api/CommentTed/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CommentTable>> GetCommentTable(int id)
        {
            var commentTable = await _context.CommentTables.FindAsync(id);

            if (commentTable == null)
            {
                return NotFound();
            }

            return commentTable;
        }

        // PUT: api/CommentTed/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCommentTable(int id, CommentTable commentTable)
        {
            if (id != commentTable.CommentId)
            {
                return BadRequest();
            }

            _context.Entry(commentTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentTableExists(id))
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

        // POST: api/CommentTed
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CommentTable>> PostCommentTable(CommentTable commentTable)
        {


            commentTable.CommentBuildTime = DateTime.Now;
            _context.CommentTables.Add(commentTable);
            SysNoticeTable notic = new SysNoticeTable();
            notic.SysNoticeTitle = "評論已新增";
            notic.SysNoticeContent = "訂單編號:"+Convert.ToString(commentTable.CommentOrderId).PadLeft(8,'0')+"，顧客已經完成評論!!";
            notic.SysNoticeTarget = commentTable.CommentTarget;
            var newsc = (from aa in _context.CommentTables where aa.CommentTarget == commentTable.CommentTarget select aa.CommentScore).ToList();

            double score = 0;
            foreach (var c in newsc)
            {
                score += c;
            }
            score += commentTable.CommentScore;

            var mannewsc = await _context.ManicuristTables.FindAsync(commentTable.CommentTarget);
            if (mannewsc.ManicuristScore == null)
            {
                mannewsc.ManicuristScore = commentTable.CommentScore;
            }
            else
            { 
            mannewsc.ManicuristScore = score / (newsc.Count + 1);
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch 
            {

                return NoContent();
            }
            
            return CreatedAtAction("GetCommentTable", new { id = commentTable.CommentId }, commentTable);
        }

        // DELETE: api/CommentTed/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCommentTable(int id)
        {
            var commentTable = await _context.CommentTables.FindAsync(id);
            if (commentTable == null)
            {
                return NotFound();
            }

            _context.CommentTables.Remove(commentTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CommentTableExists(int id)
        {
            return _context.CommentTables.Any(e => e.CommentId == id);
        }
    }
}
