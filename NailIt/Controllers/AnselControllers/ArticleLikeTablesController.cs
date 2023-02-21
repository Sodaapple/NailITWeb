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
    public class ArticleLikeTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ArticleLikeTablesController(NailitDBContext context)
        {
            _context = context;
        }
        // POST: api/ArticleLikeTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ArticleLikeTable>> PostArticleLikeTable(ArticleLikeTable articleLikeTable)
        {
            // this article ArticleLikesCount +1 at ArticleTables
            var articleTable = _context.ArticleTables.FirstOrDefault(a => a.ArticleId == articleLikeTable.ArticleId);
            if (articleTable != null) { articleTable.ArticleLikesCount += 1; }

            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            _context.ArticleLikeTables.Add(articleLikeTable);
            await _context.SaveChangesAsync();

            t.Commit();
            return CreatedAtAction("GetArticleLikeTable", new { id = articleLikeTable.ArticleLikeId }, articleLikeTable);
        }

        // DELETE: api/ArticleLikeTables/1/1
        [HttpDelete("{articleId}/{memberId}")]
        public async Task<IActionResult> DeleteArticleLikeTable(int articleId, int memberId)
        {

            var articleLikeTable = await _context.ArticleLikeTables.
            Where(a => a.ArticleId == articleId && a.MemberId == memberId).FirstOrDefaultAsync();
            if (articleLikeTable == null)
            {
                return NotFound();
            }

            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            // this article ArticleLikesCount -1 at ArticleTables
            var articleTable = _context.ArticleTables.FirstOrDefault(a => a.ArticleId == articleLikeTable.ArticleId);
            if (articleTable != null) { articleTable.ArticleLikesCount -= 1; }

            _context.ArticleLikeTables.Remove(articleLikeTable);
            await _context.SaveChangesAsync();

            t.Commit();
            return NoContent();
        }

    }
}
