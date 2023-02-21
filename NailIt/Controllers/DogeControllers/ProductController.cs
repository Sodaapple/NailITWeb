using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NailIt.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using System.Drawing;

namespace NailIt.Controllers.DogeControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        // 套用 DB
        private readonly NailitDBContext _db;

        public ProductController(NailitDBContext db)
        {
            _db = db;
        }
        // 可以讀到資料 拿回 設計師表(ManicuristTables) join Demo的集合表(DemoSet_Table)
        [HttpGet("{id:int}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetProducts(int id)
        {
            var res = _db.DemoSetTables.Find(id);
            if (res == null) return NotFound();
            // 當點進讀取作品資料時 瀏覽次數+1
            var demoCount = (from d in _db.DemoSetTables
                             where d.DemoSetId == id
                             select d).SingleOrDefault();
            demoCount.DemoSetCount += 1;
            _db.SaveChanges();
            // 撈取設計師 demoset demo 相關資料
            var query = from o in _db.ManicuristTables
                            // 利用 ManicuristId 設計師ID 兩表join
                        join demoset in _db.DemoSetTables
                        on o.ManicuristId equals demoset.ManicuristId
                        // demo表 美甲照片路徑
                        join demo in _db.DemoTables
                        on demoset.DemoSetId equals demo.DemoSetId
                        where demoset.DemoSetId == id
                        select new {
                            o,
                            demoset,
                            demo,
                            color = (
                                from c in _db.ColorTables
                                join demoset in _db.DemoSetTables
                                on c.ColorId equals demoset.DemoSetColor
                                where demoset.DemoSetId == id
                                select c
                            ).ToList()
                        };
            
            return await query.ToListAsync();
        }
        // 傳送預約表單
        [HttpPost]
        public async Task<ActionResult<OrderTable>> insertOrder(OrderTable orderTable)
        {
            
            var plan = _db.PlanTables.FirstOrDefault(p => p.PlanId == orderTable.PlanId);

            _db.OrderTables.Add(orderTable);
            await _db.SaveChangesAsync();

            var res = _db.OrderTables.FirstOrDefault(r => r.PlanId == orderTable.PlanId && r.OrderOrderTime == orderTable.OrderOrderTime );
            plan.OrderId = res.OrderId;

            SysNoticeTable insert = new SysNoticeTable
            {
                SysNoticeTitle = "交易通知",
                SysNoticeTarget = orderTable.ManicuristId,
                SysNoticeContent = "交易成立通知-客人進行預約",
                SysNoticeBuildTime = DateTime.UtcNow,
                SysNoticeState = false,
            };
            SysNoticeTable CashComplete = new SysNoticeTable
            {
                SysNoticeTitle = "交易通知",
                SysNoticeTarget = orderTable.ManicuristId,
                SysNoticeContent = "交易付款完成通知",
                SysNoticeBuildTime = DateTime.UtcNow,
                SysNoticeState = false,
            };
            _db.SysNoticeTables.Add(CashComplete);
            _db.SysNoticeTables.Add(insert);
            
            await _db.SaveChangesAsync();
            return Content("OK");
        }
        [HttpPost]
        [Route("report")]
        public async Task<ActionResult<ReportTable>> Report(ReportTable reportTable)
        {
            ReportTable insert = new ReportTable
            {
                ReportBuilder = reportTable.ReportBuilder,
                ReportTarget = reportTable.ReportTarget,
                ReportItem = reportTable.ReportItem,
                ReportPlaceC = reportTable.ReportPlaceC,
                ReportReasonC = reportTable.ReportReasonC,
                ReportContent = reportTable.ReportContent,
                ReportBuildTime = DateTime.Now,
            };
            _db.ReportTables.Add(insert);
            await _db.SaveChangesAsync();
            return Content("OK");
        }
        [HttpGet]
        [Route("{id:int}/reserve")]
        public async Task<ActionResult<IEnumerable<dynamic>>> Getdata(int id)
        {
            var res = from p in _db.PlanTables
                      join m in _db.ManicuristTables
                      on p.ManicuristId equals m.ManicuristId
                      where m.ManicuristId == id
                      select new { p,m };

            return await res.ToListAsync();
        }
        [HttpGet]
        [Route("MID/service/{mid:int}/{opartc}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetServicedata(int mid,string opartc)
        {
            var res = from s in _db.ServiceTables
                      where s.ManicuristId == mid && (s.ServicePartC == opartc || s.ServicePartC == "C2")
                      select s;
            return await res.ToListAsync();
        }
        [HttpGet]
        [Route("MID/dset/{mid:int}/{opartc}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetDemosetdata(int mid, string opartc)
        {
            var res = (from dset in _db.DemoSetTables
                      where dset.ManicuristId == mid && dset.DemoSetPublic == true 
                      && (dset.DemoSetPartC == opartc || dset.DemoSetPartC == "C2")
                      select dset);
            return await res.ToListAsync();
        }
        [HttpGet]
        [Route("MID/{mid:int}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetManicuristData(int mid)
        {
            var res = from m in _db.ManicuristTables
                      where m.ManicuristId == mid
                      select m;
            return await res.ToListAsync();
        }
        [HttpGet]
        [Route("{mid:int}/RemovalPrice")]
        public ActionResult<IEnumerable<RemovalPriceTable>> GetRemovelPrice(int mid)
        {
            // 搜尋傳入美甲師ID 搜尋卸甲價格表
            var res = (from r in _db.RemovalPriceTables
                      where r.RemovalPriceManicuristId == mid
                      select r).SingleOrDefault();
            
            if (res == null)
            {
                return NotFound("無對應設計師卸甲價格");
            }
            return Ok(res);
        }
        [HttpGet]
        [Route("{planid:int}/Remark")]
        public ActionResult<IEnumerable<PlanTable>> GetPlanRemark(int planid)
        {
            var res = (from p in _db.PlanTables
                       where p.PlanId == planid
                       select new
                       {
                           Remark = p.PlanRemark
                       }).SingleOrDefault();

            if (res == null)
            {
                return NotFound("無對應行程表ID");
            }
            return Ok(res);
        }
    }
}
