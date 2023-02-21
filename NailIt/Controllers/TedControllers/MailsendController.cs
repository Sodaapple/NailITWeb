using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using System.Threading.Tasks;
using System.Net.Mail;
using System.Net;
using System.Security.Principal;
using System.Text;
using System;

namespace NailIt.Controllers.TedControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailsendController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public MailsendController(NailitDBContext context)
        {
            _context = context;
        }

        //[HttpGet("{id}")]
        //public async Task<IActionResult> PostOrderTable(int id)
        //{
        //    string Account = "milk742020@gmail.com";
        //    string Password = "epfbqclhgbhnzycx";

        //    SmtpClient client = new SmtpClient();
        //    client.Host = "smtp.gmail.com";
        //    client.Port = 587;
        //    client.Credentials = new NetworkCredential(Account, Password);
        //    client.EnableSsl = true;

        //    MailMessage mail = new MailMessage();
        //    mail.From = new MailAddress(Account);
        //    mail.To.Add("etai183216@gmail.com");
        //    mail.Subject = "測試信";
        //    mail.SubjectEncoding = Encoding.UTF8;
        //    mail.IsBodyHtml = true;
        //    mail.Body = "第一行<br> 第二行<br>第三行<br>";
        //    mail.BodyEncoding = Encoding.UTF8;


        //    try
        //    {

        //        client.Send(mail);
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //    finally
        //    {

        //        mail.Dispose();
        //        client.Dispose();
        //    }


        //    return NoContent();
        //}

    }
}
