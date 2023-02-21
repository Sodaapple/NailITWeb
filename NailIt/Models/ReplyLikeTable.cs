using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class ReplyLikeTable
    {
        public int ReplyLikeId { get; set; }
        public int ReplyId { get; set; }
        public int MemberId { get; set; }
    }
}
