using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using NailIt.Models;

namespace NailIt.Controllers.TedControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderTEDController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public OrderTEDController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/OrderTED
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderTable>>> GetOrderTables()
        {
            return await _context.OrderTables.ToListAsync();
        }

        // GET: api/OrderTED/5
        [HttpGet("{id}")]
        public async Task<List<Orderappointment>> GetOrderTables(int id)
        {

            var order = from o in _context.OrderTables
                        join m in _context.ManicuristTables on o.ManicuristId equals m.ManicuristId
                        join p in _context.PlanTables on o.PlanId equals p.PlanId
                        join c in _context.CodeTables on o.OrderPartC equals c.CodeId
                        join d in _context.DemoSetTables on o.OrderItem equals d.DemoSetId
                        into groupjoin from a in groupjoin.DefaultIfEmpty()
                        where o.MemberId == id
                        select new Orderappointment()
                        {
                            OrderType = o.OrderType,
                            DemoSetId = a.DemoSetId,
                            MemberId =o.MemberId,
                            ManicuristId =o.ManicuristId,
                            OrderPartC = o.OrderPartC,
                            OrderId = o.OrderId,
                          ManicuristAddress= m.ManicuristAddress,
                          ManicuristSalonName= m.ManicuristSalonName,
                          ManicuristPublic= m.ManicuristPublic,
                          OrderItemName= o.OrderItemName,
                            ManicuristPic = o.OrderType == true ?  null: m.ManicuristPic,
                            OrderOrderTime=  o.OrderOrderTime,
                            OrderAcceptTime= o.OrderAcceptTime,
                            OrderDoneTime= o.OrderDoneTime,
                            OrderCancelTime= o.OrderCancelTime,
                            OrderCompleteTime= o.OrderCompleteTime,
                            OrderStateC= o.OrderStateC,
                            OrderPrice= o.OrderPrice,
                            OrderDeposit= o.OrderDeposit,
                            OrderRemovalC= o.OrderRemovalC,
                            DemoSetContent = o.OrderType == true ? a.DemoSetContent : null,
                            DemoSetCover = o.OrderType == true ? a.DemoSetCover: null,
                        };
            var orderlist = await order.ToListAsync();

            return orderlist;

        }

        // PUT: api/OrderTED/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderTable(int id, string[] newstat)
        {
            var orderTable = await _context.OrderTables.FindAsync(id);
            SysNoticeTable notic = new SysNoticeTable();
            notic.SysNoticeBuildTime = DateTime.UtcNow;
            if (newstat[0] == "A5")
            {
                orderTable.OrderCompleteTime = DateTime.Now;
                notic.SysNoticeTitle = "訂單已完成";
                notic.SysNoticeContent = "訂單編號:" + Convert.ToString(id).PadLeft(8, '0') + "已完成，要記得去評論呦~";
                notic.SysNoticeTarget = orderTable.MemberId;
                notic.SysNoticeState = false;
            }
            else if (newstat[0] == "A7")
            {
                orderTable.OrderCancelTime = DateTime.Now;
                notic.SysNoticeTitle = "訂單已取消";
                notic.SysNoticeContent = "訂單編號:" + Convert.ToString(id).PadLeft(8, '0') + "已取消。";
                notic.SysNoticeTarget = orderTable.MemberId;
                notic.SysNoticeState = false;
            }
            orderTable.OrderStateC = newstat[0];



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

        // POST: api/OrderTED
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OrderTable>> PostOrderTable(OrderTable orderTable)
        {
            _context.OrderTables.Add(orderTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOrderTable", new { id = orderTable.OrderId }, orderTable);
        }

        // DELETE: api/OrderTED/5
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
