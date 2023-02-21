using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NailIt.Controllers.YiPControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ColorController : ControllerBase
    {
        private readonly NailitDBContext Context;
        public ColorController(NailitDBContext PContext)
        {
            Context = PContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ColorTable>>> GetColorTable()
        {
            return await Context.ColorTables.ToListAsync();
        }
    }
}
