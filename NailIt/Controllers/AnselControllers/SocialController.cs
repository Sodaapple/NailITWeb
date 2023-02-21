using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using Newtonsoft.Json;

namespace NailIt.Controllers.AnselControllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SocialController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public SocialController(NailitDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// get a list of related options
        /// </summary>
        /// <param name="code">where this code use</param>
        /// <returns></returns>
        // GET:/api/Social/GetCodeTable/L
        [HttpGet("{code}")]
        public async Task<ActionResult<CodeTable>> GetCodeTable(string code)
        {
            var articleSorts = await _context.CodeTables.
                Where(c => c.CodeUseIn == code).ToListAsync();

            return Ok(articleSorts);
        }

        /// <summary>
        /// upload image to ArticleImage file and return image display link.
        /// </summary>
        /// <param name="frm">attached file</param>
        /// <returns></returns>
        // POST:/api/Social/UploadImage
        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormCollection frm)
        {
            if (frm.Files.Count > 0)
            {
                // get data and files from formdata of request
                ArticlePicTable articlePic = JsonConvert.DeserializeObject<ArticlePicTable>(frm["articlePic"]);
                List<string> imageUrls = new List<string>();

                // lock DB
                var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

                // record image at ArticlePicTable
                if (articlePic.ArticleId == 0)
                {
                    var articles = _context.ArticleTables.ToList();
                    // new article havn't got a id.
                    if (articles.Count > 0)
                    {
                        articlePic.ArticleId = articles.OrderByDescending(a => a.ArticleId).FirstOrDefault().ArticleId + 1;
                    }
                    // very first article.
                    else
                    {
                        articlePic.ArticleId = 1;
                    }
                }
                foreach (var imageFile in frm.Files)
                {
                    articlePic.ArtclePicId = 0;
                    string imageUrl = await saveImage(articlePic ,imageFile);
                    imageUrls.Add(imageUrl);
                }

                t.Commit();
                return Ok(imageUrls);
            }
            return NotFound();
        }

        private async Task<string> saveImage(ArticlePicTable articlePic,IFormFile imageFile)
        {
            // articlePic.ArticlePicPath = "wwwroot\\AnselLib\\ArticleImage" + "\\" + "00.png";
            _context.ArticlePicTables.Add(articlePic);
            _context.SaveChanges();

            var latestIageId = _context.ArticlePicTables.OrderByDescending(a => a.ArtclePicId).FirstOrDefault().ArtclePicId;
            articlePic.ArticlePicPath = "wwwroot\\AnselLib\\ArticleImage" + "\\" + latestIageId + ".png";
            _context.SaveChanges();

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\AnselLib\\ArticleImage") + "\\" + latestIageId + ".png"; //檔案存放位置在wwwroot中的資料夾

            using (var stream = System.IO.File.Create(filePath))
            {
                await imageFile.CopyToAsync(stream);
            }

            return $"/AnselLib/ArticleImage/{latestIageId}.png";
        }


        /// <summary>
        /// create a new report.
        /// </summary>
        /// <param name="reportTable">new report info</param>
        /// <returns></returns>
        // POST: api/Social/PostReportTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ReportTable>> PostSocialReport(ReportTable reportTable)
        {
            // At very begining, checking(審核) infos will be null.
            reportTable.ReportCheckTime = null;
            reportTable.ManagerId = null;
            reportTable.ReportResult = null;

            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            _context.ReportTables.Add(reportTable);
            await _context.SaveChangesAsync();

            t.Commit();
            return CreatedAtAction("GetReportTable", new { id = reportTable.ReportId }, reportTable);
        }

    }
}
