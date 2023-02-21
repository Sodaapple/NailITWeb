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
    public class YuePlanTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public YuePlanTablesController(NailitDBContext context)
        {
            _context = context;
        }

       
        // GET: api/YuePlanTables/5
        [HttpGet("{id}")]
        public async Task<List<PlanTable>> GetPlanTable(int id)
        {
            var myPlan = from plan in _context.PlanTables
                         where (plan.ManicuristId == id&&plan.PlanStartTime > DateTime.Now)
                         select plan;

            return await myPlan.ToListAsync();
            }

            // PUT: api/YuePlanTables/5
            // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
            [HttpPut("{id}")]
       
        // POST: api/YuePlanTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PlanTable>> PostPlanTable(PlanTable planTable)
        {
            _context.PlanTables.Add(planTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPlanTable", new { id = planTable.PlanId }, planTable);
        }

        [HttpPut]
        public async Task<bool> PostPlanTable(List<PlanTable> planTables)
        {
            foreach (var plan in planTables)
            { 
                _context.PlanTables.Add(plan);
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch { return false; }
            return true;
        }

        // DELETE: api/YuePlanTables/5
        [HttpDelete]
        public async Task<bool> DeletePlanTable(List<int> idArray)
        {
            foreach (var id in idArray)
            {
                 var planTable = await _context.PlanTables.FindAsync(id);
                  _context.PlanTables.Remove(planTable);
            }
            await _context.SaveChangesAsync();

            return true;
        }

        private bool PlanTableExists(int id)
        {
            return _context.PlanTables.Any(e => e.PlanId == id);
        }
    }
}
