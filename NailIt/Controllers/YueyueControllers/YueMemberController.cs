using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.YueyueControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YueMemberController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public YueMemberController(NailitDBContext context)
        {
            _context = context;
        }

        [HttpGet("{AC}")]
        public async Task<string> GetMemberTalbe(string AC)
        {
            var myMember = from member in _context.MemberTables
                           where member.MemberAccount == AC
                           select member;   
            if (myMember.Count() == 0) return "";
            string qq = (await myMember.ToListAsync())[0].MemberQuestion;
           

            return qq;
        }
        [HttpPut("{state}")]
        public async Task<int> GetMemberTalbe(int state, string[] acAndaa)
        {
            var myMember = from member in _context.MemberTables
                           where member.MemberAccount == acAndaa[0]
                           select member;
            if (myMember.Count() == 0) return -1;
            string aa = (await myMember.ToListAsync())[0].MemberAnswer;
            if (aa == acAndaa[1]) return (await myMember.ToListAsync())[0].MemberId;

            return -1;
        }

        // PUT: api/YueMember   //登入用
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<string> PutMemberTable(string[] ACandPW)
        {
            string account = ACandPW[0];
            string password = ACandPW[1];
            var myMember =(
            from MemberTable in _context.MemberTables
            where MemberTable.MemberAccount == account
            select MemberTable);
            MemberTable nowUse;
            if (myMember.Any())
                nowUse = myMember.ToList()[0];
            else
                return "noAC";
            
            if (nowUse.MemberPassword != password)
                return "wrongPW";
            else 
            {
                Guid g = Guid.NewGuid();
                _context.Entry(nowUse).State = EntityState.Modified;
                nowUse.MemberLogincredit = g;
                HttpContext.Session.SetString("NailLogin", g.ToString());
                await _context.SaveChangesAsync();
                return "OK";
            }

        }

       // POST: api/Member      用於註冊會員
       // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<bool> PostMemberTable(MemberTable memberTable)
        {
            var myMember =
            from MemberTable in _context.MemberTables
            where MemberTable.MemberAccount == memberTable.MemberAccount
            select MemberTable;
            if (!myMember.Any())
            {
                 SysNoticeTable daNotice = new SysNoticeTable();
                daNotice.SysNoticeTitle = "註冊完成";
                daNotice.SysNoticeContent = "歡迎加入Nailit！！";
                daNotice.SysNoticeState = false;
                daNotice.SysNoticeBuildTime = DateTime.UtcNow;
                _context.MemberTables.Add(memberTable);
                await _context.SaveChangesAsync();
                daNotice.SysNoticeTarget = (from  no in _context.MemberTables where no.MemberAccount == memberTable.MemberAccount select no.MemberId).ToList()[0];
                _context.SysNoticeTables.Add(daNotice);
                await _context.SaveChangesAsync();
                return true;
            }
            else
                return false;
        }
    }
}
