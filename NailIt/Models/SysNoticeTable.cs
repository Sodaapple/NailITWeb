using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class SysNoticeTable
    {
        public int SysNoticeId { get; set; }
        public string SysNoticeTitle { get; set; }
        public int SysNoticeTarget { get; set; }
        public string SysNoticeContent { get; set; }
        public DateTime SysNoticeBuildTime { get; set; }
        public bool SysNoticeState { get; set; }
    }
}
