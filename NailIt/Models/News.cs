using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class News
    {
        public int NewsId { get; set; }
        public string Ymd { get; set; }
        public string Title { get; set; }
    }
}
