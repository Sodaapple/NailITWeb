using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class CommentTable
    {
        public int CommentId { get; set; }
        public int CommentBuilder { get; set; }
        public int CommentTarget { get; set; }
        public double CommentScore { get; set; }
        public string CommentContent { get; set; }
        public bool CommentType { get; set; }
        public DateTime CommentBuildTime { get; set; }
        public int CommentOrderId { get; set; }
    }
}
