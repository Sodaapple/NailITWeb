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
    public class ReplyTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ReplyTablesController(NailitDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// load reply of article
        /// </summary>
        /// <param name="ArticleId">which article's reply</param>
        /// <returns></returns>
        // GET: api/ReplyTables
        [HttpGet("{ArticleId}")]
        public async Task<ActionResult<IEnumerable<ReplyTable>>> GetReplyTables(int ArticleId)
        {
            var loginId = HttpContext.Session.GetInt32("loginId") ?? -1;
            var replies = await _context.ReplyTables.
                Where(r => r.ArticleId == ArticleId).
                OrderByDescending(r => r.ReplyId).
                ToListAsync();

            // remove the reply had been report by this user
            var userArticleReport = _context.ReportTables.Where(r => r.ReportBuilder == loginId && r.ReportPlaceC == "D6").ToList();
            var leftJoinReport = (from reply in replies
                                  join report in userArticleReport
                                       on reply.ReplyId equals report.ReportItem into gj
                                  from userReport in gj.DefaultIfEmpty()
                                  where userReport?.ReportId == null
                                  select reply
                                 ).ToList();

            var repliesJoinMember = leftJoinReport.Join(
                _context.MemberTables,
                r => r.MemberId,
                m => m.MemberId,
                (r, m) => new { reply = r, m.MemberNickname }).ToList();

            var userReplyLike = _context.ReplyLikeTables.Where(r => r.MemberId == loginId).ToList();
            var leftJoinLike = (from reply in repliesJoinMember
                                join like in userReplyLike
                                     on reply.reply.ReplyId equals like.ReplyId into gj
                                from userlike in gj.DefaultIfEmpty()
                                select new
                                {
                                    reply.reply,
                                    memberNickname = reply.MemberNickname,
                                    replyLastDateDiff = dateTimeDiff(DateTime.UtcNow, reply.reply.ReplyLastEdit),
                                    like = userlike?.ReplyLikeId == null ? false : true
                                }).ToList();

            return Ok(leftJoinLike);
        }

        public static string dateTimeDiff(DateTime date1, DateTime date2)
        {
            string result = "";

            //if (距離今天的時間 > 1年) 
            if (date1.AddYears(-1) > date2)
            {
                int years = date1.Year - date2.Year;
                result = $"{years}年前";
            }
            //else if(距離今天的時間 > 1月)
            else if (date1.AddMonths(-1) > date2)
            {
                int months = (date1.Year - date2.Year) * 12 - date2.Month + date1.Month;
                result = $"{months}月前";
            }
            //else if(距離今天的時間 > 1週)
            else if (date1.AddDays(-7) > date2)
            {
                var weeks = (date1 - date2).TotalDays / 7;
                result = $"{Math.Floor(weeks)}週前";//無條件捨去
            }
            //else if(距離今天的時間 > 1天)
            else if (date1.AddDays(-1) > date2)
            {
                var days = (date1 - date2).TotalDays;
                result = $"{Math.Floor(days)}天前";//無條件捨去
            }
            //else if(距離今天的時間 > 1小時)
            else if (date1.AddHours(-1) > date2)
            {
                var hours = (date1 - date2).TotalHours;
                result = $"{Math.Floor(hours)}小時前";//無條件捨去
            }
            else
            {
                var minutes = (date1 - date2).TotalMinutes;
                result = $"{Math.Floor(minutes)}分前";//無條件捨去
            }

            return result;
        }


        // POST: api/ReplyTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ReplyTable>> PostReplyTable(ReplyTable replyTable)
        {
            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            // this article ArticleReplyCount +1 at ArticleTables
            var articleTable = _context.ArticleTables.FirstOrDefault(a => a.ArticleId == replyTable.ArticleId);
            if (articleTable != null) { articleTable.ArticleReplyCount += 1; }

            _context.ReplyTables.Add(replyTable);
            await _context.SaveChangesAsync();

            t.Commit();
            return CreatedAtAction("GetReplyTable", new { id = replyTable.ReplyId }, replyTable);
        }

        // DELETE: api/ReplyTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReplyTable(int id)
        {
            var replyTable = await _context.ReplyTables.FindAsync(id);
            if (replyTable == null)
            {
                return NotFound();
            }

            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            // this article ArticleReplyCount -1 at ArticleTables
            var articleTable = _context.ArticleTables.FirstOrDefault(a => a.ArticleId == replyTable.ArticleId);
            if (articleTable != null) { articleTable.ArticleReplyCount -= 1; }

            _context.ReplyTables.Remove(replyTable);
            await _context.SaveChangesAsync();

            t.Commit();
            return NoContent();
        }

    }
}
