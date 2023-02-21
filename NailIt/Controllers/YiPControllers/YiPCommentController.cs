using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NailIt.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace NailIt.Controllers.YiPControllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class YiPCommentController : ControllerBase
    {
        private readonly NailitDBContext Context;
        public YiPCommentController(NailitDBContext PContext)
        {
            Context = PContext;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetManicuristComment(int id)
        {
            // membernickname
            var query = from User in Context.CommentTables
                            join member in Context.MemberTables
                              on User.CommentBuilder equals member.MemberId
                        where User.CommentTarget == id && User.CommentType == false
                        select new {
                            MemberNickname = member.MemberNickname,
                            CommentId = User.CommentId,
                            CommentTarget = User.CommentTarget,
                            CommentScore = User.CommentScore,
                            CommentContent = User.CommentContent,
                            CommentBuildTime = User.CommentBuildTime
                        };

            return await query.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetDateLTHComment(int id)
        {
            // membernickname
            var query = from User in Context.CommentTables
                        join member in Context.MemberTables
                          on User.CommentBuilder equals member.MemberId
                        where User.CommentTarget == id && User.CommentType == false
                        orderby User.CommentBuildTime
                        select new
                        {
                            MemberNickname = member.MemberNickname,
                            CommentId = User.CommentId,
                            CommentTarget = User.CommentTarget,
                            CommentScore = User.CommentScore,
                            CommentContent = User.CommentContent,
                            CommentBuildTime = User.CommentBuildTime
                        };

            return await query.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetDateHTLComment(int id)
        {
            // membernickname
            var query = from User in Context.CommentTables
                        join member in Context.MemberTables
                          on User.CommentBuilder equals member.MemberId
                        where User.CommentTarget == id && User.CommentType == false
                        orderby User.CommentBuildTime descending
                        select new
                        {
                            MemberNickname = member.MemberNickname,
                            CommentId = User.CommentId,
                            CommentTarget = User.CommentTarget,
                            CommentScore = User.CommentScore,
                            CommentContent = User.CommentContent,
                            CommentBuildTime = User.CommentBuildTime
                        };

            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetRateLTHComment(int id)
        {
            // membernickname
            var query = from User in Context.CommentTables
                        join member in Context.MemberTables
                          on User.CommentBuilder equals member.MemberId
                        where User.CommentTarget == id && User.CommentType == false
                        orderby User.CommentScore
                        select new
                        {
                            MemberNickname = member.MemberNickname,
                            CommentId = User.CommentId,
                            CommentTarget = User.CommentTarget,
                            CommentScore = User.CommentScore,
                            CommentContent = User.CommentContent,
                            CommentBuildTime = User.CommentBuildTime
                        };

            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetRateHTLComment(int id)
        {
            // membernickname
            var query = from User in Context.CommentTables
                        join member in Context.MemberTables
                          on User.CommentBuilder equals member.MemberId
                        where User.CommentTarget == id && User.CommentType == false
                        orderby User.CommentScore descending
                        select new
                        {
                            MemberNickname = member.MemberNickname,
                            CommentId = User.CommentId,
                            CommentTarget = User.CommentTarget,
                            CommentScore = User.CommentScore,
                            CommentContent = User.CommentContent,
                            CommentBuildTime = User.CommentBuildTime
                        };

            return await query.ToListAsync();
        }


    }
}
