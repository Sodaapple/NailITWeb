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
    public class TagTableController : ControllerBase
    {
        private readonly NailitDBContext Context;
        public TagTableController(NailitDBContext PContext)
        {
            Context = PContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagTable>>> GetTagTable()
        {
            return await Context.TagTables.ToListAsync();
        }
    }
}
