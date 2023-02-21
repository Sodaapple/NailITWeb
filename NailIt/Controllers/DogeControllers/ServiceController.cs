using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NailIt.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;

namespace NailIt.Controllers.DogeControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly NailitDBContext _db;

        public ServiceController(NailitDBContext db)
        {
            _db = db;
        }
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<dynamic>>> service()
        //{
        //    var res = from s in _db.ServiceTables
        //              select s;
        //    return await res.ToListAsync();
        //}
        [HttpPost]
        public async Task<ActionResult<ServiceTable>> service(ServiceTable service)
        {
            _db.ServiceTables.Add(service);
            await _db.SaveChangesAsync();
            return Content("新增成功"); ;
        }
    }
}
