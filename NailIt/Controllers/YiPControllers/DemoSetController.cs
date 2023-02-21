using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace NailIt.Controllers.YiPControllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DemoSetController : ControllerBase
    {
        private readonly NailitDBContext Context;
        public DemoSetController(NailitDBContext PContext)
        {
            Context = PContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetDemoSet()
        {
            var query = from Demo in Context.DemoSetTables
                        where Demo.DemoSetPublic == true
                        select Demo;
            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetDemoSetTable(int id)
        {
            var query = from User in Context.DemoSetTables
                        where User.ManicuristId == id
                        select User;

            return await query.ToListAsync();
        }



        [HttpPost]
        public async Task<ActionResult<DemoSetTable>> PostDemoSetTable(DemoSetTable DemoSetTable)
        {
            Context.DemoSetTables.Add(DemoSetTable);
            await Context.SaveChangesAsync();
            var result = Context.DemoSetTables.FirstOrDefault(r => r.ManicuristId == DemoSetTable.ManicuristId && r.DemoSetName == DemoSetTable.DemoSetName);
            DemoTable insret = new DemoTable
            {
                DemoSetId = result.DemoSetId,
                DemoPic = result.DemoSetCover
            };
            Context.DemoTables.Add(insret);
            await Context.SaveChangesAsync();
            return Ok();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetMainDemoSetTable(int id)
        {
            var query = from Demo
                                   in Context.DemoSetTables
                        where Demo.ManicuristId == id && Demo.DemoSetMain == true
                        select Demo;

            return await query.ToListAsync();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDemoSetTable(int id, DemoSetTable DemoSetTable)
        {
            var CertainDemoSet = (from o in Context.DemoSetTables
                                  where o.ManicuristId == id && o.DemoSetId == DemoSetTable.DemoSetId
                                  select o).FirstOrDefault();

            CertainDemoSet.DemoSetName = DemoSetTable.DemoSetName;
            CertainDemoSet.DemoSetPartC = DemoSetTable.DemoSetPartC;
            CertainDemoSet.DemoSetContent = DemoSetTable.DemoSetContent;
            CertainDemoSet.DemoSetPrice = DemoSetTable.DemoSetPrice;
            CertainDemoSet.DemoSetDeposit = DemoSetTable.DemoSetDeposit;
            CertainDemoSet.DemoSetTag1 = DemoSetTable.DemoSetTag1;
            CertainDemoSet.DemoSetTag2 = DemoSetTable.DemoSetTag2;
            CertainDemoSet.DemoSetTag3 = DemoSetTable.DemoSetTag3;
            CertainDemoSet.DemoSetPublic = DemoSetTable.DemoSetPublic;
            CertainDemoSet.DemoSetMain = DemoSetTable.DemoSetMain;
            CertainDemoSet.DemoSetMainStartTime = DemoSetTable.DemoSetMainStartTime;
            CertainDemoSet.DemoSetMainEndTime = DemoSetTable.DemoSetMainEndTime;
            CertainDemoSet.DemoSetColor = DemoSetTable.DemoSetColor;

            await Context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDemoSetCover(int id, DemoSetTable DemoSetTable)
        {
            var CertainDemoSet = (from o in Context.DemoSetTables
                                  where o.DemoSetId == id
                                  select o).FirstOrDefault();

            CertainDemoSet.DemoSetCover = DemoSetTable.DemoSetCover;

            await Context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDemoSetTable(int id)
        {
            var DemoSetTable = await Context.DemoSetTables.FindAsync(id);
            //var DeleteCertainDemoSet = (from o in Context.DemoSetTables
            //                      where o.DemoSetId == id
            //                      select o).FirstOrDefault();
            Context.DemoSetTables.Remove(DemoSetTable);
            await Context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetSearchTable(int id, string search)
        {
            var query = from DemoSet in Context.DemoSetTables
                        where DemoSet.ManicuristId == id && DemoSet.DemoSetName.Contains(search) || DemoSet.DemoSetTag1.Contains(search) || DemoSet.DemoSetTag2.Contains(search) || DemoSet.DemoSetTag3.Contains(search) || DemoSet.DemoSetTag4.Contains(search)
                        select DemoSet;

            return await query.ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetSearchAllTable(string search)
        {
            var query = from DemoSet in Context.DemoSetTables
                        where (DemoSet.DemoSetName.Contains(search) || DemoSet.DemoSetTag1.Contains(search) || DemoSet.DemoSetTag2.Contains(search) || DemoSet.DemoSetTag3.Contains(search) || DemoSet.DemoSetTag4.Contains(search) ) && DemoSet.DemoSetPublic == true
                        select DemoSet;

            return await query.ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetCountyDemo(string Country)
        {
            var query = from Demo in Context.DemoSetTables
                        join Designer in Context.ManicuristTables
                          on Demo.ManicuristId equals Designer.ManicuristId
                        where Designer.ManicuristCounty.Contains(Country) && Demo.DemoSetPublic == true
                        select new
                        {
                            DemoSetId = Demo.DemoSetId,
                            DemoSetName = Demo.DemoSetName,
                            DemoSetCover = Demo.DemoSetCover,
                            DemoSetPrice = Demo.DemoSetPrice,
                            ManicuristCounty = Designer.ManicuristCounty
                            //DemoSetPartC = Demo.DemoSetPartC,
                            //DemoSetPrice = Demo.DemoSetPrice,
                        };

            return await query.ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetAreaDemo(string Area)
        {
            var query = from Demo in Context.DemoSetTables
                        join Designer in Context.ManicuristTables
                          on Demo.ManicuristId equals Designer.ManicuristId
                        where Designer.ManicuristTownship.Contains(Area) && Demo.DemoSetPublic == true
                        select new
                        {
                            DemoSetId = Demo.DemoSetId,
                            DemoSetName = Demo.DemoSetName,
                            DemoSetCover = Demo.DemoSetCover,
                            DemoSetPrice = Demo.DemoSetPrice,
                            ManicuristTownship = Designer.ManicuristTownship
                        };

            return await query.ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetColorDemo(int Color)
        {
            var query = from DemoSet in Context.DemoSetTables
                        where DemoSet.DemoSetColor == Color && DemoSet.DemoSetPublic == true
                        select DemoSet;

            return await query.ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetFixTagDemo(string FixTag)
        {
            var query = from DemoSet in Context.DemoSetTables
                        where (DemoSet.DemoSetTag1 == FixTag || DemoSet.DemoSetTag2 == FixTag || DemoSet.DemoSetTag3 == FixTag || DemoSet.DemoSetTag4 == FixTag ) && DemoSet.DemoSetPublic == true
                        select DemoSet;

            return await query.ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetMaxPrice()
        {
            var Max = await (from DemoSet in Context.DemoSetTables
                         orderby DemoSet.DemoSetPrice descending
                         select DemoSet.DemoSetPrice).FirstOrDefaultAsync();

            return Ok(new { Max });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetMinPrice()
        {
            var Min = await (from DemoSet in Context.DemoSetTables
                             orderby DemoSet.DemoSetPrice
                             select DemoSet.DemoSetPrice).FirstOrDefaultAsync();

            return Ok(new { Min });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetPriceRange(int Min , int Max)
        {
            var query = from DemoSet in Context.DemoSetTables
                        where DemoSet.DemoSetPrice>=Min && DemoSet.DemoSetPrice<=Max && DemoSet.DemoSetPublic == true
                        select DemoSet;

            return await query.ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetPart(string Part)
        {
            var query = from DemoSet in Context.DemoSetTables
                        where DemoSet.DemoSetPartC == Part && DemoSet.DemoSetPublic == true
                        select DemoSet;

            return await query.ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetAllQuery(string Area , string City , int Color , string FixedTag,string Part , int SearchMax , int SearchMin)
        {
            var query = from Demo in Context.DemoSetTables
                        join Designer in Context.ManicuristTables
                          on Demo.ManicuristId equals Designer.ManicuristId
                        where Designer.ManicuristCounty.Contains(City) && Designer.ManicuristTownship.Contains(Area) && Demo.DemoSetColor == Color && (Demo.DemoSetTag1 == FixedTag || Demo.DemoSetTag2 == FixedTag || Demo.DemoSetTag3 == FixedTag || Demo.DemoSetTag4 == FixedTag) && Demo.DemoSetPartC == Part && Demo.DemoSetPrice >= SearchMin && Demo.DemoSetPrice <= SearchMax
                        select new
                        {
                            DemoSetId = Demo.DemoSetId,
                            DemoSetName = Demo.DemoSetName,
                            DemoSetCover = Demo.DemoSetCover,
                            DemoSetPrice = Demo.DemoSetPrice,
                            ManicuristTownship = Designer.ManicuristTownship
                        };

            return await query.ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetCertainQuery(string Area, string Country, string Manicurist)
        {
            var query = from Designer
                       in Context.ManicuristTables
                        where Designer.ManicuristTownship.Contains(Area) && Designer.ManicuristCounty.Contains(Country) && Designer.ManicuristSalonName.Contains(Manicurist)
                        select Designer;
            return await query.ToListAsync();

        }


    }
}

