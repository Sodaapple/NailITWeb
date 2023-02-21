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
    public class MemberTables2Controller : ControllerBase
    {
        private readonly NailitDBContext _context;

        public MemberTables2Controller(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/MemberTables2/nocheck
        [HttpGet("nocheck")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetNoCMemberTables()
        {


            var NoCheckMember = from o in _context.MemberTables
                                where o.MemberManicurist == false
                                select new
                                {
                                    MemberId = o.MemberId,
                                };

            return await NoCheckMember.ToListAsync();
        }
        // GET: api/MemberTables2/check
        [HttpGet("check")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetCMemberTables()
        {


            var CheckMember = from o in _context.MemberTables
                              where o.MemberManicurist == true
                              select new
                              {
                                  MemberId = o.MemberId,
                              };

            return await CheckMember.ToListAsync();
        }

        // GET: api/MemberTables2
        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetMemberTables()
        {
            var MemberTables = from o in _context.MemberTables
                                  select new
                                  {
                                      MemberId = o.MemberId,
                                      MemberAccount = o.MemberAccount,
                                      MemberName = o.MemberName,
                                      MemberManicurist = o.MemberManicurist == true ? "店家／美甲師" : "一般會員",
                                      MemberReportpoint = o.MemberReportpoint >= 20 ? "已停權" : "使用中"
                                  };
            return await MemberTables.ToListAsync();
        }
        
        // GET: api/MemberTables2/2
        [HttpGet("2/{pageNum}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetMemberTables2(int pageNum)
        {
            var MemberTables = from o in _context.MemberTables
                               select new
                               {
                                   MemberId = o.MemberId,
                                   MemberAccount = o.MemberAccount,
                                   MemberName = o.MemberName,
                                   MemberManicurist = o.MemberManicurist == true ? "店家／美甲師" : "一般會員",
                                   MemberReportpoint = o.MemberReportpoint >= 20 ? "已停權" : "使用中"
                               };
            //每頁條数
            const int pageSize = 5;
            //頁碼 0也就是第一条 


            //源数据   


            //分页   
            var query = MemberTables.Skip(pageNum * pageSize).Take(pageSize);


            return await query.ToListAsync();
        }

        // GET: api/MemberTables2/5
        [HttpGet("{id}")]
        public async Task<ActionResult<dynamic>> GetMemberTable(int id)
        {
            var memberTable = from o in _context.MemberTables
                              join ma in _context.ReportTables on o.MemberId equals ma.ReportTarget into malist
                              from ma in malist.DefaultIfEmpty()
                              where o.MemberId == id
                              select new
                              {
                                  MemberId = o.MemberId,
                                  MemberAccount = o.MemberAccount,
                                  MemberName = o.MemberName,
                                  MemberNickname = o.MemberNickname,
                                  MemberGender = o.MemberGender == true ? "男" : "女",
                                  MemberPhone = o.MemberPhone,
                                  MemberBirth = o.MemberBirth == null ? "" : ((DateTime)o.MemberBirth).ToString("yyyy-MM-dd"),
                                  MemberEmail = o.MemberEmail,
                                  MemberManicurist = o.MemberManicurist == true ? "店家／美甲師" : "一般會員",
                                  MemberReportpoint = o.MemberReportpoint,
                                  MemberStatus = o.MemberReportpoint >= 20 ? "已停權" : "使用中",
                                  //MemberBanned = o.MemberBanned, //???幹嗎用???
                                  MemberReportId = ma.ReportId.ToString() == null ? "－" : ma.ReportId.ToString(),

                              };

            if (memberTable == null)
            {
                return NotFound();
            }

            return await memberTable.ToListAsync();
        }


        // GET: api/MemberTables2/condition 條件
        [HttpGet("condition/{memberId}/{memberManicurist}/{memberStatus}")]
        public async Task<ActionResult<dynamic>> GetMemberCondition(int memberId, string memberManicurist, int memberStatus)
        {
            var query = from o in _context.MemberTables
                        select o;

            var result = query;



            if (memberId != 0) { result = result.Where(a => a.MemberId == memberId); }
   

            if (memberManicurist == "0") { result = result.Where(a => a.MemberManicurist == false); }
            else if(memberManicurist == "1") { result = result.Where(a => a.MemberManicurist == true); }

            if (memberStatus == 1) { result = result.Where(a => a.MemberReportpoint >= 20); }
            else if (memberStatus == 0) { result = result.Where(a => a.MemberReportpoint < 20); }
 



            var membercondition = from o in result
                                  select new
                                  {
                                      MemberId = o.MemberId,
                                      MemberAccount = o.MemberAccount,
                                      MemberName = o.MemberName,
                                      MemberManicurist = o.MemberManicurist == true ? "店家／美甲師" : "一般會員",
                                      MemberReportpoint = o.MemberReportpoint >= 20 ? "已停權" : "使用中"
                                      
                                      
                                  };



            return await membercondition.ToListAsync();
        }

        // GET: api/MemberTables2/condition 條件
        [HttpGet("condition/{memberId}/{memberManicurist}/{memberStatus}/{pageNum}")]
        public async Task<ActionResult<dynamic>> GetMemberCondition2(int memberId, string memberManicurist, int memberStatus, int pageNum)
        {
            var query = from o in _context.MemberTables
                        select o;

            var result = query;



            if (memberId != 0) { result = result.Where(a => a.MemberId == memberId); }


            if (memberManicurist == "0") { result = result.Where(a => a.MemberManicurist == false); }
            else if (memberManicurist == "1") { result = result.Where(a => a.MemberManicurist == true); }

            if (memberStatus == 1) { result = result.Where(a => a.MemberReportpoint >= 20); }
            else if (memberStatus == 0) { result = result.Where(a => a.MemberReportpoint < 20); }




            var membercondition = from o in result
                                  select new
                                  {
                                      MemberId = o.MemberId,
                                      MemberAccount = o.MemberAccount,
                                      MemberName = o.MemberName,
                                      MemberManicurist = o.MemberManicurist == true ? "店家／美甲師" : "一般會員",
                                      MemberReportpoint = o.MemberReportpoint >= 20 ? "已停權" : "使用中"


                                  };
            //每頁條数
            const int pageSize = 5;
            //頁碼 0也就是第一条 


            //源数据   


            //分页   
            var membercondition2 = membercondition.Skip(pageNum * pageSize).Take(pageSize);


            return await membercondition2.ToListAsync();


            
        }


        private bool MemberTableExists(int id)
        {
            return _context.MemberTables.Any(e => e.MemberId == id);
        }

    }
}

