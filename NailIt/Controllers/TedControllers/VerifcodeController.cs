using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using System.Net.Mail;
using System.Net;
using System.Security.Principal;
using System.Text;

namespace NailIt.Controllers.TedControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VerifcodeController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public VerifcodeController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/Verifcode
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Verificationcode>>> GetVerificationcodes()
        {
            return await _context.Verificationcodes.ToListAsync();
        }

        // GET: api/Verifcode/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Verificationcode>> GetVerificationcode(int id)
        {
            var verificationcode = await _context.Verificationcodes.FindAsync(id);
      

            if (verificationcode == null)
            {
                return NotFound();
            }

            return verificationcode;
        }

        // PUT: api/Verifcode/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVerificationcode(int id, Verificationcode verificationcode)
        {
            if (id != verificationcode.VerifcodeId)
            {
                return BadRequest();
            }

            _context.Entry(verificationcode).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VerificationcodeExists(id))
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

        // POST: api/Verifcode
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Verificationcode>> PostVerificationcode(List<string> verificationcode )
        {
            if (VerificationcodeExists(Convert.ToInt32(verificationcode[0])))
            {
                var verifff = await _context.Verificationcodes.FindAsync(Convert.ToInt32(verificationcode[0]));
                
                _context.Verificationcodes.Remove(verifff);
                
            }
             Verificationcode verificationcode1 = new Verificationcode();
            verificationcode1.VerifcodeId = Convert.ToInt32(verificationcode[0]);
            verificationcode1.Verifcodetext= Convert.ToString(verificationcode[1]);
            _context.Verificationcodes.Add(verificationcode1);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (VerificationcodeExists(Convert.ToInt32(verificationcode[0])))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            string Account = "milk742020@gmail.com";
            string Password = "epfbqclhgbhnzycx";

            SmtpClient client = new SmtpClient();
            client.Host = "smtp.gmail.com";
            client.Port = 587;
            client.Credentials = new NetworkCredential(Account, Password);
            client.EnableSsl = true;

            MailMessage mail = new MailMessage();
            mail.From = new MailAddress(Account);
            mail.To.Add(Convert.ToString( verificationcode[2]));
            mail.Subject = "Nailit 美甲師功能開通";
            mail.SubjectEncoding = Encoding.UTF8;
            mail.IsBodyHtml = true;
            mail.Body ="Hello 尊貴的會員你好"+"<br/>"+"<br/>"+"這是您的驗證碼" + Convert.ToString(verificationcode[1])+"<br/>"+"利用此驗證碼驗證成功就能開通美甲師功能囉!!";
            mail.BodyEncoding = Encoding.UTF8;


            try
            {

                client.Send(mail);
            }
            catch
            {
                throw;
            }
            finally
            {

                mail.Dispose();
                client.Dispose();
            }
            return CreatedAtAction("GetVerificationcode", new { id =Convert.ToInt16( verificationcode[0]) }, verificationcode1);
        }

        // DELETE: api/Verifcode/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVerificationcode(int id)
        {
            var verificationcode = await _context.Verificationcodes.FindAsync(id);
            if (verificationcode == null)
            {
                return NotFound();
            }

            _context.Verificationcodes.Remove(verificationcode);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VerificationcodeExists(int id)
        {
            return _context.Verificationcodes.Any(e => e.VerifcodeId == id);
        }
    }
}
