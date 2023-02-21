using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Data;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Xml.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using Newtonsoft.Json.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;


namespace NailIt.Controllers.TanTanControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ReportTablesController(NailitDBContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;

        }

        // GET: api/ReportTables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetReportTables()
        {           

            var newReportTables = from o in _context.ReportTables
                                  join c in _context.CodeTables on o.ReportPlaceC equals c.CodeId
                                  join m in _context.MemberTables on o.ReportBuilder equals m.MemberId into mlist
                                  from m in mlist.DefaultIfEmpty()
                                  join n in _context.MemberTables on o.ReportTarget equals n.MemberId into nlist
                                  from n in nlist.DefaultIfEmpty()
                                  join ma in _context.ManagerTables on o.ManagerId equals ma.ManagerId into malist
                                  from ma in malist.DefaultIfEmpty()
                                  orderby o.ReportId descending
                                  select new
                                  {
                                      ReportId = o.ReportId,
                                      ReportBuilder = o.ReportBuilder,
                                      ReportTarget = o.ReportTarget,
                                      ReportItem = o.ReportItem,
                                      ReportPlaceC = o.ReportPlaceC,
                                      ReportReasonC = o.ReportReasonC,
                                      ReportContent = o.ReportContent,
                                      ReportBuildTime = o.ReportBuildTime.ToString("yyyy-MM-dd HH:mm"),
                                      ReportCheckTime = o.ReportCheckTime == null ? "" : ((DateTime)o.ReportCheckTime).ToString("yyyy-MM-dd HH:mm"),
                                      ManagerId = o.ManagerId,
                                      ReportResult = o.ReportResult,
                                      CodeUseIn = c.CodeId,
                                      CodeRepresent = c.CodeRepresent,
                                      BuilderMemberName = m.MemberName,
                                      TargetMemberName = n.MemberName,
                                      ManagerName = ma.ManagerName
                                  };
            return await newReportTables.ToListAsync();
        }

        // GET: api/ReportTables/condition 條件
        [HttpGet("condition/{dateS}/{dateE}/{reportP}/{reportR}/{reportRN}")]  // ReportResult is null的情況 待審核

        public async Task<ActionResult<IEnumerable<dynamic>>> GetProductCondition(string dateS, string dateE, string reportP, bool? reportR, string reportRN)
        {
            var date1 = DateTime.Parse(dateS);
            var date2 = DateTime.Parse(dateE).AddMinutes(1439);


            var query = from o in _context.ReportTables
                        join c in _context.CodeTables on o.ReportPlaceC equals c.CodeId
                        join m in _context.MemberTables on o.ReportBuilder equals m.MemberId into mlist
                        from m in mlist.DefaultIfEmpty()
                        orderby o.ReportId descending
                        select new
                        {
                            ReportId = o.ReportId,
                            ReportBuilder = o.ReportBuilder,
                            ReportTarget = o.ReportTarget,
                            ReportItem = o.ReportItem,
                            ReportPlaceC = o.ReportPlaceC,
                            ReportReasonC = o.ReportReasonC,
                            ReportContent = o.ReportContent,
                            ReportBuildTime = o.ReportBuildTime,
                            ReportCheckTime = o.ReportCheckTime == null ? "" : ((DateTime)o.ReportCheckTime).ToString("yyyy-MM-dd HH:mm"),
                            ManagerId = o.ManagerId,
                            ReportResult = o.ReportResult,
                            CodeUseIn = c.CodeId,
                            CodeRepresent = c.CodeRepresent,
                        };

            //if else query在下where條件!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11
            //原來寫三個去做判斷就就好了!!!!

            var result = query;


            if (dateS != "1900-01-01" && dateE != "3000-01-01")
            {
                result = result.Where(a => a.ReportBuildTime >= Convert.ToDateTime(date1) 
                                        && a.ReportBuildTime <= Convert.ToDateTime(date2));
            }

            if (reportP!= "X0")
            {
                result = result.Where(a => a.ReportPlaceC == reportP);
            }



            if (reportR == true && reportRN.Length == 4)
            {
                result = result.Where(a => a.ReportResult == (bool?)null);

            }
            else if (reportR == true && reportRN.Length == 3)
            {
                result = result.Where(a => a.ReportResult == true);
            }
            else if (reportR == false)
            {
                result = result.Where(a => a.ReportResult == false);
            }

            if (dateS == "1900-01-01" && dateE == "3000-01-01" && reportP == "X0" && reportR == true && reportRN.Length == 2) {
                result = query;
            }
            var result2 = from o in result
                          join c in _context.CodeTables on o.ReportPlaceC equals c.CodeId
                          select new
                        {
                            ReportId = o.ReportId,
                            ReportBuilder = o.ReportBuilder,
                            ReportTarget = o.ReportTarget,
                            ReportItem = o.ReportItem,
                            ReportPlaceC = o.ReportPlaceC,
                            ReportReasonC = o.ReportReasonC,
                            ReportContent = o.ReportContent,
                            ReportBuildTime = o.ReportBuildTime.ToString("yyyy-MM-dd HH:mm"),
                            ReportCheckTime = o.ReportCheckTime,
                            ManagerId = o.ManagerId,
                            ReportResult = o.ReportResult,
                            CodeUseIn = c.CodeId,
                            CodeRepresent = c.CodeRepresent,
                        };
            
            return await result2.ToListAsync();

        }

        // GET: api/ReportTables/5
        [HttpGet("get/{id}")]
        public async Task<ActionResult<dynamic>> GetReportTable(int id)
        {
            var reportTable = from o in _context.ReportTables
                              join c in _context.CodeTables on o.ReportPlaceC equals c.CodeId
                              join r in _context.CodeTables on o.ReportReasonC equals r.CodeId
                              join m in _context.MemberTables on o.ReportBuilder equals m.MemberId into mlist
                              from m in mlist.DefaultIfEmpty()
                              join a in _context.MemberTables on o.ReportTarget equals a.MemberId into alist
                              from a in alist.DefaultIfEmpty()
                              join ma in _context.ManagerTables on o.ManagerId equals ma.ManagerId into malist
                              from ma in malist.DefaultIfEmpty()
                              where o.ReportId == id
                             
                              select new
                              {
                                  ReportId = o.ReportId,
                                  ReportBuilder = o.ReportBuilder,
                                  ReportTarget = o.ReportTarget,
                                  ReportItem = o.ReportItem,
                                  ReportPlaceC = o.ReportPlaceC,
                                  ReportReasonC = o.ReportReasonC,
                                  ReportContent = o.ReportContent,
                                  ReportBuildTime = o.ReportBuildTime.ToString("yyyy-MM-dd HH:mm"),
                                  ReportCheckTime = o.ReportCheckTime == null ? "" : ((DateTime)o.ReportCheckTime).ToString("yyyy-MM-dd HH:mm"),
                                  ManagerId = o.ManagerId,
                                  ReportResult = o.ReportResult,
                                  CodeUseIn = c.CodeId,
                                  CodeRepresent = c.CodeRepresent,
                                  CodeRepresentr = r.CodeRepresent,
                                  BuilderMemberName = m.MemberName,
                                  TargetMemberName = a.MemberName,
                                  ManagerName = ma.ManagerName
                              };

            if (reportTable == null)
            {
                return NotFound();
            };

            return await reportTable.ToListAsync();
        }


        // PUT: api/ReportTables/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("put/{id}")]
        public async Task<IActionResult> PutReportTable(int id,ReportTable reportTable)
        {
            //var Claim = _httpContextAccessor.HttpContext.User.Claims.ToList();
            //var ManagerId = Claim.Where(a => a.Type == "ManagerId").First().Value;
            if (id != reportTable.ReportId)
            {
                return BadRequest();
            }

            //_context.Entry(reportTable).State = EntityState.Modified;
            //借鑑
            var CertainReportTable = (from o in _context.ReportTables
                                      where o.ReportId == id
                                      join m in _context.MemberTables on o.ReportTarget equals m.MemberId into mlist
                                      from m in mlist.DefaultIfEmpty()
                                      select new {o,m}).FirstOrDefault();
            CertainReportTable.o.ReportResult = reportTable.ReportResult;
            CertainReportTable.o.ReportCheckTime = reportTable.ReportCheckTime;
            CertainReportTable.o.ManagerId = reportTable.ManagerId;
            if (reportTable.ReportResult==true)
            {
                CertainReportTable.m.MemberReportpoint = CertainReportTable.m.MemberReportpoint + 1;
            }
           


            try
            {
                await _context.SaveChangesAsync();

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReportTableExists(id))
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


        private bool ReportTableExists(int id)
        {
            return _context.ReportTables.Any(e => e.ReportId == id);
        }
    }
}
