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
    [Route("api/[controller]")]
    [ApiController]
    public class BlacklistController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public BlacklistController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/Blacklist
        [HttpGet]
        public async Task<ActionResult> GetBlacklist()
        {
            var loginId = HttpContext.Session.GetInt32("loginId") ?? -1;
            var blacklist = await _context.MessageBlacklistTables.
                Where(b => b.BlacklistBuilder == loginId).ToListAsync();
            var joinMember = blacklist.Join(_context.MemberTables, 
                l=>l.BlacklistTarget,
                r=>r.MemberId,
                (l,r)=> new {
                    l.BlacklistId,
                    l.BlacklistBuilder,
                    l.BlacklistTarget,
                    r.MemberAccount,
                    r.MemberNickname
                }
                ).ToList();
            return Ok(joinMember);
        }

        // POST: api/Blacklist
        [HttpPost]
        public async Task<ActionResult> PostBlacklist(MessageBlacklistTable blacklist)
        {
            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            _context.MessageBlacklistTables.Add(blacklist);
            await _context.SaveChangesAsync();

            t.Commit();
            return CreatedAtAction("GetMessageBlacklistTable", new { id = blacklist.BlacklistId }, blacklist);
        }

        // DELETE: api/Blacklist/1
        [HttpDelete("{blacklistId}")]
        public async Task<ActionResult> DeleteBlacklist(int blacklistId)
        {
            var blacklist = _context.MessageBlacklistTables.Find(blacklistId);
            if (blacklist == null)
            {
                return NotFound();
            }
            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);
            _context.MessageBlacklistTables.Remove(blacklist);
            await _context.SaveChangesAsync();
            t.Commit();
            return NoContent();
        }
    }
}