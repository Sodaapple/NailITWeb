using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NailIt.Controllers.YiPControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private readonly string DownloadTo;
        public FilesController(IWebHostEnvironment env)
        {
            DownloadTo = $@"{env.WebRootPath}\YiPLib\UploadFolder";
        }
        [HttpPost]
        public async Task<IActionResult> Upload(List<IFormFile> files)
        {
            var FilesPath = new Dictionary<string, string>();
            foreach(var file in files) { 
                if(file.Length > 0) { 
                    var path = $@"{DownloadTo}\{file.FileName}";
                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    FilesPath.Add(file.FileName, path);
                }
            }
            return Ok(new { FilesPath });
        }

    }
}
