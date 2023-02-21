using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.YueyueControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YueCommentTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public YueCommentTablesController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/YueCommentTables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentTable>>> GetCommentTables()
        {
            return await _context.CommentTables.ToListAsync();
        }

        // GET: api/YueCommentTables/5/A6
        [HttpGet("{id}/{state}")]
        public async Task<List<YueCommentView>> GetCommentTable(int id,string state)
        {
           var myComment =
           from Order in _context.OrderTables
           join Member in _context.MemberTables on Order.MemberId equals Member.MemberId
           join Plan in _context.PlanTables on Order.PlanId equals Plan.PlanId
           join Code in _context.CodeTables on Order.OrderPartC equals Code.CodeId
           join Code2 in _context.CodeTables on Order.OrderRemovalC equals Code2.CodeId
           join Comment in _context.CommentTables on Order.OrderId equals Comment.CommentOrderId
           join DemoSet in _context.DemoSetTables on Order.OrderItem equals DemoSet.DemoSetId into t1
           from subDemoSet in t1.DefaultIfEmpty()
           join Manicurist in _context.ManicuristTables on Order.ManicuristId equals Manicurist.ManicuristId into t2
           from subMamicurist in t2.DefaultIfEmpty()
           where (Order.ManicuristId == Convert.ToInt32(id) && Order.OrderStateC == state && Comment.CommentType==true)
           select new YueCommentView()
           {
               order_ID = Order.OrderId,
               member_ID = Order.MemberId,
               manicurist_ID = Order.ManicuristId,
               order_Price = Order.OrderPrice,
               order_Deposit = Order.OrderDeposit,
               order_Type = Order.OrderType,
               order_ItemName = Order.OrderItemName,
               order_OrderTime = Order.OrderOrderTime,
               order_AcceptTime = Order.OrderAcceptTime,
               order_CompleteTime = Order.OrderCompleteTime,
               order_DoneTime = Order.OrderDoneTime,
               order_CancelTime = Order.OrderCancelTime,
               member_Nickname = Member.MemberNickname,
               plan_StartTime = Plan.PlanStartTime,
               plan_Remark = Plan.PlanRemark,
               order_part = Code.CodeRepresent,
               order_removal = Code2.CodeRepresent,
               demoSet_Content = Order.OrderType == true ? subDemoSet.DemoSetContent : "",
               order_Cover = Order.OrderType == true ? subDemoSet.DemoSetCover : subMamicurist.ManicuristPic,
               comment_Score=Comment.CommentScore,
               comment_Content=Comment.CommentContent,
               comment_BuildTime=Comment.CommentBuildTime,
               manicurist_SalonName= subMamicurist.ManicuristSalonName,
           };



            if (myComment == null)
            {
                return null;
            }
            else
                return await myComment.ToListAsync();
        }

        // POST: api/YueCommentTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<bool> PostCommentTable(CommentTable commentTable)
        {
            commentTable.CommentBuildTime = DateTime.Now;
            _context.CommentTables.Add(commentTable);

            var mycomment = await (from co in _context.CommentTables
                             where co.CommentType == true && co.CommentTarget==commentTable.CommentTarget
                             select co.CommentScore).ToListAsync();
            double total=0;
            foreach (double x in mycomment)
            {
                total += x;
            }
            var theMember = await _context.MemberTables.FindAsync(commentTable.CommentTarget);
            theMember.MemberScore = theMember.MemberScore == null ? commentTable.CommentScore : (total / mycomment.Count);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch 
            {
                return false;
            }
            return true;
        }

    }
}
