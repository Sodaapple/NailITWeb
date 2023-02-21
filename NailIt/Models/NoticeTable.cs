using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class NoticeTable
    {
        public int NoticeId { get; set; }
        public int NoticeScope { get; set; }
        public string NoticeTitle { get; set; }
        public string NoticeContent { get; set; }
        public DateTime NoticeBuildTime { get; set; }
        public DateTime NoticePushTime { get; set; }
        public bool? NoticeState { get; set; }
        public int NoticeManagerId { get; set; }
    }
}
