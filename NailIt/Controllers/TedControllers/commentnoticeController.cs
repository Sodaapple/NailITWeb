using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.TedControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class commentnoticeController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public commentnoticeController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/commentnotice
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderTable>>> GetOrderTables()
        {
            return await _context.OrderTables.ToListAsync();
        }

        // GET: api/commentnotice/5
        [HttpGet("{id}")]
        public async Task<List<Evaorder>> GetOrderTable(int id)
        {
            var order = from o in _context.OrderTables
                        join e in _context.MemberTables on o.MemberId equals e.MemberId
                        join co in _context.CommentTables on o.OrderId equals co.CommentOrderId
                        join m in _context.ManicuristTables on o.ManicuristId equals m.ManicuristId
                        join p in _context.PlanTables on o.PlanId equals p.PlanId
                        join c in _context.CodeTables on o.OrderPartC equals c.CodeId
                        join d in _context.DemoSetTables on o.OrderItem equals d.DemoSetId
                        into groupjoin
                        from a in groupjoin.DefaultIfEmpty()
                        where o.ManicuristId == id
                        select new Evaorder()
                        {
                            DemoSetId = a.DemoSetId,
                            CommentScore = co.CommentScore,
                            CommentContent = co.CommentContent,
                            CommentBuildTime = co.CommentBuildTime,
                            MemberName = e.MemberName,
                            MemberId = o.MemberId,
                            ManicuristId = o.ManicuristId,
                            OrderPartC = o.OrderPartC,
                            OrderId = o.OrderId,
                            ManicuristAddress = m.ManicuristAddress,
                            ManicuristSalonName = m.ManicuristSalonName,
                            ManicuristPublic = m.ManicuristPublic,
                            OrderItemName = o.OrderItemName,
                            ManicuristPic = o.OrderType == true ? null : m.ManicuristPic,
                            OrderOrderTime = o.OrderOrderTime,
                            OrderAcceptTime = o.OrderAcceptTime,
                            OrderDoneTime = o.OrderDoneTime,
                            OrderCancelTime = o.OrderCancelTime,
                            OrderCompleteTime = o.OrderCompleteTime,
                            OrderStateC = o.OrderStateC,
                            OrderPrice = o.OrderPrice,
                            OrderDeposit = o.OrderDeposit,
                            OrderRemovalC = o.OrderRemovalC,
                            DemoSetContent = o.OrderType == true ? a.DemoSetContent : null,
                            DemoSetCover = o.OrderType == true ? a.DemoSetCover : null,
                        };
            var orderlist = await order.ToListAsync();

            return orderlist;
        }

        // PUT: api/commentnotice/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderTable(int id, OrderTable orderTable)
        {
            if (id != orderTable.OrderId)
            {
                return BadRequest();
            }

            _context.Entry(orderTable).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderTableExists(id))
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

        // POST: api/commentnotice
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OrderTable>> PostOrderTable(OrderTable orderTable)
        {
            _context.OrderTables.Add(orderTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrderTable", new { id = orderTable.OrderId }, orderTable);
        }

        // DELETE: api/commentnotice/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderTable(int id)
        {
            var orderTable = await _context.OrderTables.FindAsync(id);
            if (orderTable == null)
            {
                return NotFound();
            }

            _context.OrderTables.Remove(orderTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderTableExists(int id)
        {
            return _context.OrderTables.Any(e => e.OrderId == id);
        }
    }
}
