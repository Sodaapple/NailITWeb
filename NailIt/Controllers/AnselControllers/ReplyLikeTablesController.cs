using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.AnselControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReplyLikeTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ReplyLikeTablesController(NailitDBContext context)
        {
            _context = context;
        }

        // POST: api/ReplyLikeTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ReplyLikeTable>> PostReplyLikeTable(ReplyLikeTable replyLikeTable)
        {
            // this reply ReplyLikesCount +1 at ReplyTables
            var replyTable = _context.ReplyTables.FirstOrDefault(a => a.ReplyId == replyLikeTable.ReplyId);
            if (replyTable != null) { replyTable.ReplyLikesCount += 1; }

            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            _context.ReplyLikeTables.Add(replyLikeTable);
            await _context.SaveChangesAsync();

            t.Commit();
            return CreatedAtAction("GetReplyLikeTable", new { id = replyLikeTable.ReplyLikeId }, replyLikeTable);
        }

        // DELETE: api/ReplyLikeTables/5
        [HttpDelete("{replyId}/{memberId}")]
        public async Task<IActionResult> DeleteReplyLikeTable(int replyId, int memberId)
        {
            try
            {
                var replyLikeTable = await _context.ReplyLikeTables.
                Where(r => r.ReplyId == replyId && r.MemberId == memberId).FirstOrDefaultAsync();
                if (replyLikeTable == null)
                {
                    return NotFound();
                }

                // lock DB
                var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

                // this reply ReplyLikesCount -1 at ReplyTables
                var replyTable = _context.ReplyTables.FirstOrDefault(a => a.ReplyId == replyLikeTable.ReplyId);
                if (replyTable != null) { replyTable.ReplyLikesCount -= 1; }

                _context.ReplyLikeTables.Remove(replyLikeTable);
                await _context.SaveChangesAsync();

                t.Commit();
                return NoContent();
                //return Ok(new { status = "OK" });

            }
            catch (Exception e)
            {
                return NotFound(e);
                    //Ok(new { status = "Exception", message = e });
            }
        }

    }
}
