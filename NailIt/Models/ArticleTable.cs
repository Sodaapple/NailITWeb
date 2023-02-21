using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class ArticleTable
    {
        public int ArticleId { get; set; }
        public string ArticleBoardC { get; set; }
        public int ArticleAuthor { get; set; }
        public string ArticleTitle { get; set; }
        public int ArticleReplyCount { get; set; }
        public int ArticleLikesCount { get; set; }
        public DateTime ArticleBuildTime { get; set; }
        public DateTime ArticleLastEdit { get; set; }
        public string ArticleContent { get; set; }
    }
}
