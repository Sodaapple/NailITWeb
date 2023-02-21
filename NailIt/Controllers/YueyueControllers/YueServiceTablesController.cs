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
    public class YueServiceTablesController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public YueServiceTablesController(NailitDBContext context)
        {
            _context = context;
        }

        // GET: api/YueServiceTables/5
        [HttpGet("{id}")]
        public async Task<List<ServiceTable>> GetServiceTable(int id)
        {
            var serviceTable = from service in _context.ServiceTables
                               where id == service.ManicuristId
                               select service;

            if (serviceTable == null)
            {
                return null;
            }
            return await serviceTable.ToListAsync();
        }

        // PUT: api/YueServiceTables/5
        [HttpPut("{id}")]
        public async Task<bool> PutServiceTable(int id, ServiceTable serviceTable)
        {
            var myservice = await _context.ServiceTables.FindAsync(id);
            myservice.ServiceName = serviceTable.ServiceName;
            myservice.ServicePartC = serviceTable.ServicePartC;
            myservice.ServicePrice = serviceTable.ServicePrice;
            myservice.SeriveDeposit = serviceTable.SeriveDeposit;
            _context.Entry(myservice).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch {
                return false;
            }
            return true;
        }

        // POST: api/YueServiceTables
        [HttpPost]
        public async Task<bool> PostServiceTable(ServiceTable serviceTable)
        {
            _context.ServiceTables.Add(serviceTable);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch {
                return false;
            }
            return true;
        }

        // DELETE: api/YueServiceTables/5
        [HttpDelete("{id}")]
        public async Task<bool> DeleteServiceTable(int id)
        {
            var serviceTable = await _context.ServiceTables.FindAsync(id);

            _context.ServiceTables.Remove(serviceTable);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch { return false; }
            return  true;
        }

       
    }
}
