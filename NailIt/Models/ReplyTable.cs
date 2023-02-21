using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class ReplyTable
    {
        public int ReplyId { get; set; }
        public int ArticleId { get; set; }
        public int MemberId { get; set; }
        public string ReplyContent { get; set; }
        public DateTime ReplyBuildTime { get; set; }
        public DateTime ReplyLastEdit { get; set; }
        public int ReplyLikesCount { get; set; }
    }
}
