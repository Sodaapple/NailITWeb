using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Threading.Tasks;

namespace NailIt.Controllers.YiPControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly string DownloadTo;
        public FileController(IWebHostEnvironment env)
        {
            DownloadTo = $@"{env.WebRootPath}\YiPLib\UploadFolder";
        }
        [HttpPost]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            var path = $@"{DownloadTo}\{file.FileName}";
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return Ok(new { path });
        }
    }
}
