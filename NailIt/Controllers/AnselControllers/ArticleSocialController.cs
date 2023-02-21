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
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ArticleSocialController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ArticleSocialController(NailitDBContext context)
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
        /// load personal 10 articles. click on "more button" will load more 10 articles.
        /// </summary>
        /// <param name="ArticleAuthor">member id for article and member info</param>
        /// <param name="page">count clicking on "more button"</param>
        /// <param name="order">which order 'latest':'最新', 'other':'愛心'</param>
        /// <param name="searchValue">search article title</param>
        /// <returns></returns>
        // GET: api/ArticleSocial/GetMyArticles/1/0/latest/Good
        [HttpGet("{ArticleAuthor}/{page}/{order}/{searchValue}")]
        [HttpGet("{ArticleAuthor}/{page}/{order}")]
        public async Task<ActionResult<IEnumerable<ArticleTable>>> GetMyArticles(int ArticleAuthor, int page = 0, string order = "latest", string searchValue = "")
        {
            var loginId = LoginCheck()?[0].MemberId ?? -1;
            var amountPerPage = 10;
            var articles = await _context.ArticleTables.
                Where(a => a.ArticleAuthor == ArticleAuthor).
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

            var articleCount = leftJoinReport.Count();

            var articlesJoinMember = articles.Join(
                _context.MemberTables,
                a => a.ArticleAuthor,
                m => m.MemberId,
                (a, m) => new { article = a, m.MemberAccount, m.MemberNickname }).ToList();

            var userArticleLike = _context.ArticleLikeTables.Where(a => a.MemberId == loginId).ToList();
            var leftJoinLike = (from article in articlesJoinMember
                                join like in userArticleLike
                                     on article.article.ArticleId equals like.ArticleId into gj
                                from userLike in gj.DefaultIfEmpty()
                                select new
                                {
                                    article.article,
                                    memberAccount = article.MemberAccount,
                                    memberNickname = article.MemberNickname,
                                    like = userLike?.ArticleLikeId == null ? false : true
                                }).ToList();

            var member = await _context.MemberTables.
                Where(m => m.MemberId == ArticleAuthor).
                Select(m => new
                {
                    m.MemberId,
                    m.MemberAccount,
                    m.MemberNickname,
                    m.MemberManicurist
                }).SingleAsync();

            return Ok(new { reaultArticles = leftJoinLike, member, articleCount });
        }
    }
}
