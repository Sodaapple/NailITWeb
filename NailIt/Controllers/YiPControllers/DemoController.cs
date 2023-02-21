using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NailIt.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace NailIt.Controllers.YiPControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DemoController : ControllerBase
    {
        private readonly NailitDBContext Context;
        public DemoController(NailitDBContext PContext)
        {
            Context = PContext;
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetThisDemoTable(int id)
        {
            var query = from User in Context.DemoTables
                            //join Demo in Context.DemoTables
                            //on User.DemoSetId equals Demo.DemoSetId
                        where User.DemoSetId == id
                        select User;
            //select User;
            return await query.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<DemoSetTable>> PostDemoTable(List<DemoTable> DemoTable)
        {
            //List<DemoTable> DemoTables = new List<DemoTable>();
            //DemoTables.AddRange(DemoTable);
            foreach (var DemoS in DemoTable)
            {
                Context.DemoTables.Add(DemoS);
            }
            //Context.DemoTables.Add(DemoTables);

            await Context.SaveChangesAsync();
            //return CreatedAtAction("GetDemotTable", new { id = DemoTable.DemoSetId }, DemoTable);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDemoTable(int id)
        {
            var DemoTable = await Context.DemoTables.FindAsync(id);
            //var DeleteCertainDemoSet = (from o in Context.DemoSetTables
            //                      where o.DemoSetId == id
            //                      select o).FirstOrDefault();
            Context.DemoTables.Remove(DemoTable);
            await Context.SaveChangesAsync();
            return Ok();
        }

    }
}
