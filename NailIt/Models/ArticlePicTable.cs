using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class ArticlePicTable
    {
        public int ArtclePicId { get; set; }
        public int ArticleId { get; set; }
        public string ArticlePicPath { get; set; }
    }
}
