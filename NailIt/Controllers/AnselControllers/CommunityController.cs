using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using static System.Collections.Specialized.BitVector32;
using System.Web;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using NailIt.Controllers.YueyueControllers;

namespace NailIt.Controllers
{
    public class CommunityController : Controller
    {
        private readonly NailitDBContext _context;

        public CommunityController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: Community
        public IActionResult Index()
        {
            // // setup login user info
            if (LoginCheck()!=null)
            {
                var LoginMemberInfo = LoginCheck()[0];
                HttpContext.Session.SetInt32("loginId", LoginMemberInfo.MemberId);
            }

            return View();
        }

        // GET: Chat
        public IActionResult Chat(int? id)
        {
            // // setup login user info
            if (LoginCheck()!=null)
            {
                var LoginMemberInfo = LoginCheck()[0];
                HttpContext.Session.SetInt32("loginId", LoginMemberInfo.MemberId);
            }

            // if comes with memberId which user want to talk to
            ViewBag.FindMemberId = (id != null) ? id : -1;
            if (id != null)
            {
                var findMember = _context.MemberTables.Find(id);
                ViewBag.FindMemberAccount = findMember.MemberAccount;
                ViewBag.FindMemberNickname = findMember.MemberNickname;
            }

            return View();
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

    }
}
