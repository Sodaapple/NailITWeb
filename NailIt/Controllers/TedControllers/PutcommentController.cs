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
    public class PutcommentController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public PutcommentController(NailitDBContext context)
        {
            _context = context;
        }
        // PUT: api/Putcomment/1
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderTable(int id, string stat)
        {
            var orderTable = await _context.OrderTables.FindAsync(id);
            orderTable.OrderStateC = "A5";


        
                await _context.SaveChangesAsync();
            
      

            return NoContent();
        }
    }
}
