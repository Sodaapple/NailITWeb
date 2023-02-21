using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class DemoSetTable
    {
        public int DemoSetId { get; set; }
        public string DemoSetName { get; set; }
        public string DemoSetCover { get; set; }
        public int ManicuristId { get; set; }
        public string DemoSetPartC { get; set; }
        public string DemoSetContent { get; set; }
        public decimal DemoSetPrice { get; set; }
        public decimal DemoSetDeposit { get; set; }
        public string DemoSetTag1 { get; set; }
        public string DemoSetTag2 { get; set; }
        public string DemoSetTag3 { get; set; }
        public string DemoSetTag4 { get; set; }
        public bool? DemoSetPublic { get; set; }
        public bool DemoSetMain { get; set; }
        public int DemoSetCount { get; set; }
        public DateTime? DemoSetMainStartTime { get; set; }
        public DateTime? DemoSetMainEndTime { get; set; }
        public int? DemoSetColor { get; set; }
    }
}
