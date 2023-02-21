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
    public class ArticleTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ArticleTablesController(NailitDBContext context)
        {
            _context = context;
        }

        public List<MemberTable> LoginCheck()
        {
            string theKey = Request.Cookies[".AspNetCore.Session"];
            if (HttpContext.Session.GetString("NailLogin") == null || theKey == null)
                return null;
            Guid aa = Guid.Parse(HttpContext.Session.GetString("NailLogin"));
            var theId = from member in _context.MemberTables where member.MemberLogincredit == aa select member;
            return theId.ToList();
        }

        /// <summary>
        /// load 10 articles. click on "more button" will load more 10 articles.
        /// </summary>
        /// <param name="boardSort">which board 'L2':'交流','L1':'手模','L0':'招標'</param>
        /// <param name="page">count clicking on "more button"</param>
        /// <param name="order">which order 'latest':'最新', 'other':'愛心'</param>
        /// <param name="searchValue">search article title</param>
        /// <returns></returns>
        // GET: api/ArticleTables/L0/0/latest/Good
        [HttpGet("{boardSort}/{page}/{order}/{searchValue}")]
        [HttpGet("{boardSort}/{page}/{order}")]
        public async Task<ActionResult<IEnumerable<ArticleTable>>> GetArticleTables(string boardSort = "L0", int page = 0, string order = "latest", string searchValue = "")
        {
            var loginId = LoginCheck()?[0].MemberId ?? -1;
            var amountPerPage = 10;
            var articles = await _context.ArticleTables.
                Where(a => a.ArticleBoardC == boardSort).
                OrderByDescending(a => (order == "latest") ? a.ArticleId : a.ArticleLikesCount).
                ThenByDescending(a => a.ArticleId).
                ToListAsync();
            if (searchValue != "")
            {
                articles = articles.
                Where(a => a.ArticleTitle.Contains(searchValue)).
                ToList();
            }
            // remove the article had been report by this user
            var userArticleReport = _context.ReportTables.Where(r => r.ReportBuilder == loginId && r.ReportPlaceC == "D5").ToList();
            var leftJoinReport = (from article in articles
                                  join report in userArticleReport
                                       on article.ArticleId equals report.ReportItem into gj
                                  from userReport in gj.DefaultIfEmpty()
                                  where userReport?.ReportId == null
                                  select article
                                 ).ToList();
            articles = leftJoinReport.
                Skip(page * amountPerPage).
                Take(amountPerPage).
                ToList();

            // don't count those reply, which be report by user.
            foreach (var article in articles)
            {
                var replyReport = _context.ReportTables.
                    Where(r => r.ReportBuilder == loginId && r.ReportPlaceC == "D6").
                    ToList();
                var articleReplyReportCount = replyReport.
                    Join(_context.ReplyTables,
                        report => report.ReportItem,
                        reply => reply.ReplyId,
                        (report, reply) => new { reply.ArticleId }).
                    Where(r => r.ArticleId == article.ArticleId).
                    Count();
                article.ArticleReplyCount -= articleReplyReportCount;
            }

            var articlesJoinMember = articles.
                Join(_context.MemberTables,
                    a => a.ArticleAuthor,
                    m => m.MemberId,
                    (a, m) => new { article = a, m.MemberAccount, m.MemberNickname }).
                ToList();

            var userArticleLike = _context.ArticleLikeTables.Where(a => a.MemberId == loginId).ToList();
            var leftJoinLike = (from article in articlesJoinMember
                                join like in userArticleLike
                                     on article.article.ArticleId equals like.ArticleId into gj
                                from userlike in gj.DefaultIfEmpty()
                                select new
                                {
                                    article.article,
                                    memberAccount = article.MemberAccount,
                                    memberNickname = article.MemberNickname,
                                    like = userlike?.ArticleLikeId == null ? false : true
                                }).ToList();


            return Ok(leftJoinLike);
        }

        // PUT: api/ArticleTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutArticleTable(int id, ArticleTable articleTable)
        {
            if (id != articleTable.ArticleId)
            {
                return BadRequest();
            }

            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            _context.Entry(articleTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArticleTableExists(id))
                {
                    t.Commit();
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            t.Commit();
            return NoContent();
        }

        // POST: api/ArticleTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ArticleTable>> PostArticleTable(ArticleTable articleTable)
        {
            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            _context.ArticleTables.Add(articleTable);
            await _context.SaveChangesAsync();

            t.Commit();
            return CreatedAtAction("GetArticleTable", new { id = articleTable.ArticleId }, articleTable);
        }

        // DELETE: api/ArticleTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticleTable(int id)
        {
            var articleTable = await _context.ArticleTables.FindAsync(id);
            if (articleTable == null)
            {
                return NotFound();
            }

            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            _context.ArticleTables.Remove(articleTable);
            await _context.SaveChangesAsync();

            t.Commit();
            return NoContent();
        }

        private bool ArticleTableExists(int id)
        {
            return _context.ArticleTables.Any(e => e.ArticleId == id);
        }
    }
}
