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
    public class LoginCheckController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public LoginCheckController(NailitDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<MemberTable>> LoginCheck()
        {
            if(HttpContext.Session.GetString("NailLogin")==null)
                return null;
            Guid aa = Guid.Parse(HttpContext.Session.GetString("NailLogin"));
            var theId = from member in _context.MemberTables where member.MemberLogincredit == aa select member;
            
            return await theId.ToListAsync();
        }

    }
}
