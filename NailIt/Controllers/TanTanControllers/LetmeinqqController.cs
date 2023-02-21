using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using System.Net;

namespace NailIt.Controllers.TanTanControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LetmeinqqController : ControllerBase
    {
        private readonly NailitDBContext _context;


        public LetmeinqqController(NailitDBContext context)
        {
            _context = context;
        }

        public class LoginPost
        {
            public string Account { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("post")]
        public string BSLogin(LoginPost value)
        {

            var user = (from a in _context.ManagerTables
                        where a.ManagerAccount == value.Account
                        && a.ManagerPassword == value.Password
                        select a).SingleOrDefault();

            if (user == null)
            {
                return "-1";
            }
            else
            {
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.ManagerAccount),
                 
                    new Claim("ManagerId", user.ManagerId.ToString()),
                    new Claim("ManagerName", user.ManagerName.ToString()),
                    //[Authorize(Roles="1")]
                    new Claim(ClaimTypes.Role, "1")
                };
                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTime.UtcNow.AddMinutes(20),


                };

                HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);


                return "OK";
            }
        }



        [HttpDelete("delete")]
        public void BSLogout()
        {
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
        [HttpGet("NoLogin")]
        public string BSnoLogin()
        {
            return "未登入";
        }

        [HttpGet("Logintext")]
        public Dictionary<string, string> BSLoginName()
        {
            Dictionary<string, string> Logintext = new Dictionary<string, string>();

            var loginid = HttpContext.User.Claims.First(c => c.Type == "ManagerId").Value.ToString();
            var loginname = HttpContext.User.Claims.First(c => c.Type == "ManagerName").Value.ToString();
            Logintext.Add("ManagerId", loginid);
            Logintext.Add("ManagerName", loginname);
            return Logintext;
        }


        private bool ManagerTableExists(int id)
        {
            return _context.ManagerTables.Any(e => e.ManagerId == id);
        }
    }
}
