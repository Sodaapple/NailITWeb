using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class ReportTable
    {
        public int ReportId { get; set; }
        public int ReportBuilder { get; set; }
        public int ReportTarget { get; set; }
        public int ReportItem { get; set; }
        public string ReportPlaceC { get; set; }
        public string ReportReasonC { get; set; }
        public string ReportContent { get; set; }
        public DateTime ReportBuildTime { get; set; }
        public DateTime? ReportCheckTime { get; set; }
        public int? ManagerId { get; set; }
        public bool? ReportResult { get; set; }
    }
}
