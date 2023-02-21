using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NailIt.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace NailIt.Controllers.YiPControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManicuristController : ControllerBase
    {
        private readonly NailitDBContext Context;
        public ManicuristController(NailitDBContext PContext)
        {
            Context = PContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ManicuristTable>>> GetManicuristTable(string name)
        {
            var query = from Designer 
                                   in Context.ManicuristTables 
                            where Designer.ManicuristSalonName.Contains(name) 
                            select Designer;
            return await query.ToListAsync();
            //return await Context.ManicuristTables.ToListAsync();

        }


        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<ManicuristTable>>> GetThisManicuristTable(int id)
        {
            var Manicurist = await (from User 
                                     in Context.ManicuristTables 
                              where User.ManicuristId == id 
                              select User).FirstOrDefaultAsync();
            //return await myquery;
            //return Ok(new { Manicurist });
            return Ok(Manicurist);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutManicuristTable(int id, ManicuristTable manicuristTable)
        {
      
            if (id != manicuristTable.ManicuristId)
            {
                return BadRequest();
            }
            var CertainManicurist = (from o in Context.ManicuristTables
                                          where o.ManicuristId == id
                                          select o).FirstOrDefault();

            CertainManicurist.ManicuristPic = manicuristTable.ManicuristPic;
            CertainManicurist.ManicuristIntro = manicuristTable.ManicuristIntro;

            try
            {

                await Context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ManicuristTableExists(id))
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

        private bool ManicuristTableExists(int id)
        {
            return Context.ManicuristTables.Any(e => e.ManicuristId == id);
        }

    }
}
