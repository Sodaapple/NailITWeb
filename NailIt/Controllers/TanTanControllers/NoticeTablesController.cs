using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using NailIt.Models;

namespace NailIt.Controllers.TanTanControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticeTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public NoticeTablesController(NailitDBContext context)
        {
            _context = context;
        }


        // GET: api/NoticeTables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetNoticeTables()
        {

            var newNoticeTables = from o in _context.NoticeTables
                                  orderby o.NoticeId descending
                                  select new
                                  {
                                      NowNoticeId = o.NoticeId,
                                      NoticeId = o.NoticeId,
                                      NoticeScope = o.NoticeScope,
                                      NoticeTitle = o.NoticeTitle,
                                      NoticeContent = o.NoticeContent,
                                      NoticeBuildTime = o.NoticeBuildTime,
                                      NoticePushTime = o.NoticePushTime.ToString("yyyy-MM-dd HH:mm"),
                                      NoticeState = o.NoticeState,
                                      NoticeManagerId = o.NoticeManagerId,
                                  };

            return await newNoticeTables.ToListAsync();
        }
        // GET: api/NoticeTables/condition
        [HttpGet("noticecondition/{NdateS}/{NdateE}/{NoticeScope}/{NoticeState}/{NoiceStateN}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetNoticeCondition(string NdateS, string NdateE, int NoticeScope, bool? NoticeState,string NoiceStateN)
        {
            var date1 = DateTime.Parse(NdateS);
            var date2 = DateTime.Parse(NdateE).AddMinutes(1439);
            var query = from o in _context.NoticeTables
                        select o;

            var result = query;

            if (NdateS != "1900-01-01" && NdateE != "3000-01-01")
            {
                result = result.Where(a => a.NoticePushTime >= Convert.ToDateTime(date1)
                                        && a.NoticePushTime <= Convert.ToDateTime(date2));
            }

            if (NoticeScope == 0) { result = result.Where(a => a.NoticeScope == 0); }
            else if (NoticeScope == 1) { result = result.Where(a => a.NoticeScope == 1); }
            else if (NoticeScope == 2) { result = result.Where(a => a.NoticeScope == 2); }


            if (NoticeState == false && NoiceStateN.Length == 3) { result = result.Where(a => a.NoticeState == false); }
            else if (NoticeState == true && NoiceStateN.Length == 3) { result = result.Where(a => a.NoticeState == true); }

            var newNoticeTables = from o in result
                                  orderby o.NoticeId descending
                                  select new
                                  {
                                      NowNoticeId = o.NoticeId,
                                      NoticeId = o.NoticeId,
                                      NoticeScope = o.NoticeScope,
                                      NoticeTitle = o.NoticeTitle,
                                      NoticeContent = o.NoticeContent,
                                      NoticeBuildTime = o.NoticeBuildTime,
                                      NoticePushTime = o.NoticePushTime.ToString("yyyy-MM-dd HH:mm"),
                                      NoticeState = o.NoticeState,
                                      NoticeManagerId = o.NoticeManagerId,
                                  };


            return await newNoticeTables.ToListAsync();
        }
        // GET: api/NoticeTables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<dynamic>> GetNoticeTable(int id)
        {
            var noticeTable = from o in _context.NoticeTables
                              join ma in _context.ManagerTables on o.NoticeManagerId equals ma.ManagerId into malist
                              from ma in malist.DefaultIfEmpty()
                              where o.NoticeId == id
                              select new
                                  {
                                      NoticeId = o.NoticeId,
                                      NoticeScope = o.NoticeScope,
                                      NoticeTitle = o.NoticeTitle,
                                      NoticeContent = o.NoticeContent,
                                      NoticeBuildTime = o.NoticeBuildTime.ToString("yyyy-MM-dd HH:mm"),
                                      NoticePushTime = o.NoticePushTime.ToString("yyyy-MM-dd HH:mm"),
                                      NoticeState = o.NoticeState,
                                      NoticeManagerId = o.NoticeManagerId,
                                      NoticeManagerName = ma.ManagerName
                              };


            if (noticeTable == null)
            {
                return NotFound();
            }

            return await noticeTable.ToListAsync();
        }


        //// PUT: api/NoticeTables/5
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutNoticeTable(int id, NoticeTable noticeTable)
        //{
        //    if (id != noticeTable.NoticeId)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(noticeTable).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!NoticeTableExists(id))
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
            //Context.DemoSetTables.Add(DemoSetTable);
            //await Context.SaveChangesAsync();
            //var result = Context.DemoSetTables.FirstOrDefault(r => r.ManicuristId == DemoSetTable.ManicuristId && r.DemoSetName == DemoSetTable.DemoSetName);
            //DemoTable insret = new DemoTable
            //{
            //    DemoSetId = result.DemoSetId,
            //    DemoPic = result.DemoSetCover
            //};
            //Context.DemoTables.Add(insret);
            //await Context.SaveChangesAsync();
        //// POST: api/NoticeTables
        //// To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("post")]
        public async Task<ActionResult<NoticeTable>> PostNoticeTable(NoticeTable noticeTable)
        {
            _context.NoticeTables.Add(noticeTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNoticeTable", new { id = noticeTable.NoticeId }, noticeTable);
        }

        // DELETE: api/NoticeTables/delete
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteNoticeTable(int id)
        {
            var noticeTable = await _context.NoticeTables.FindAsync(id);
            if (noticeTable == null)
            {
                return NotFound();
            }

            _context.NoticeTables.Remove(noticeTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NoticeTableExists(int id)
        {
            return _context.NoticeTables.Any(e => e.NoticeId == id);
        }
    }
}
