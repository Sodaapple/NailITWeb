using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;

namespace NailIt.Controllers.TanTanControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ManagerTablesController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/ManagerTables
        [HttpGet]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetManagerTables()
        {
            var ManagerTables = from o in _context.ManagerTables
                                select new
                                {
                                    ManagerId = o.ManagerId,
                                    ManagerAccount = o.ManagerAccount,
                                    ManagerName = o.ManagerName,
                                    ManagerPurview = o.ManagerPurview == 0 ? "最高管理員" : o.ManagerPurview == 1 ? "審核、修改、查詢" : o.ManagerPurview == 2 ? "查詢" : "－"

                                };


            return await ManagerTables.ToListAsync();
        }
        // GET: api/ManagerTables/condition/{managerId}/{managerName}/{managerPurview}
        [HttpGet("condition/{managerId}/{managerName}/{managerPurview}")]
        public async Task<ActionResult<IEnumerable<dynamic>>> GetManagerCondition(int managerId, string managerName, int managerPurview)
        {
            var query = from o in _context.ManagerTables
                        select o;

            var result = query;

            if (managerId != 0) { result = result.Where(a => a.ManagerId == managerId); }
            if (managerName != "$"){ result = result.Where(r => r.ManagerName.Contains(managerName) || r.ManagerName.StartsWith(managerName) || r.ManagerName.EndsWith(managerName)); };
            if (managerPurview != 3) { result = result.Where(a => a.ManagerPurview == managerPurview); }

            var managercondition = from o in result
                                   select new
                                       {
                                           ManagerId = o.ManagerId,
                                           ManagerAccount = o.ManagerAccount,
                                           ManagerName = o.ManagerName,
                                           ManagerPurview = o.ManagerPurview == 0 ? "最高管理員" : o.ManagerPurview == 1 ? "審核、修改、查詢" : o.ManagerPurview == 2 ? "查詢" : "－"

                                       };


                return await managercondition.ToListAsync();
            
        }


        // GET: api/ManagerTables/5
        [HttpGet("oneget/{id}")]
        public async Task<ActionResult<dynamic>> GetManagerTable(int id)
        {
            var manager = from o in _context.ManagerTables
                          where o.ManagerId == id
                          select new
                          {
                              ManagerId = o.ManagerId,
                              ManagerAccount = o.ManagerAccount,
                              ManagerPassword = o.ManagerPassword,
                              ManagerName = o.ManagerName,
                              ManagerPurview = o.ManagerPurview,
                              ManagerBuildTime = o.ManagerBuildTime.ToString("yyyy-MM-dd HH:mm")
                          };

            if (manager == null)
            {
                return NotFound();
            }

            return await manager.ToListAsync();
        }

        // PUT: api/ManagerTables/put/{id}
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("put/{id}")]
        public async Task<IActionResult> PutManagerTable(int id, ManagerTable managerTable)
        {
            if (id != managerTable.ManagerId)
            {
                return BadRequest();
            }

            //_context.Entry(managerTable).State = EntityState.Modified;
            var CertainManagerTable = (from o in _context.ManagerTables
                                       where o.ManagerId == id
                                       select o).FirstOrDefault();

            CertainManagerTable.ManagerName = managerTable.ManagerName;
            CertainManagerTable.ManagerPassword = managerTable.ManagerPassword;
            CertainManagerTable.ManagerPurview = managerTable.ManagerPurview;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ManagerTableExists(id))
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

        // POST: api/ManagerTables
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ManagerTable>> PostManagerTable(ManagerTable managerTable)
        {
            _context.ManagerTables.Add(managerTable);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetManagerTable", new { id = managerTable.ManagerId }, managerTable);
        }

        // DELETE: api/ManagerTables/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteManagerTable(int id)
        {
            var managerTable = await _context.ManagerTables.FindAsync(id);
            if (managerTable == null)
            {
                return NotFound();
            }

            _context.ManagerTables.Remove(managerTable);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ManagerTableExists(int id)
        {
            return _context.ManagerTables.Any(e => e.ManagerId == id);
        }
    }
}

