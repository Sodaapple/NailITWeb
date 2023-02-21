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
    public class YueRemovalPriceTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public YueRemovalPriceTablesController(NailitDBContext context)
        {
            _context = context;
        }



        // GET: api/YueRemovalPriceTables/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RemovalPriceTable>> GetRemovalPriceTable(int id)
        {
            var removalPriceTable = await _context.RemovalPriceTables.FindAsync(id);

            return removalPriceTable;
        }

        // PUT: api/YueRemovalPriceTables/5
        [HttpPut("{id}")]
        public async Task<bool> PutRemovalPriceTable(int id, RemovalPriceTable removalPriceTable)
        {
            _context.Entry(removalPriceTable).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch { return false; }
            return true;
        }

    }
}
