using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public class Evaorder
    {
        public string ManicuristSalonName { get; set; }
        public string ManicuristAddress { get; set; }
        public bool? ManicuristPublic { get; set; }
        public string DemoSetCover { get; set; }
        public string OrderItemName { get; set; }
        public DateTime OrderOrderTime { get; set; }
        public DateTime? OrderAcceptTime { get; set; }
        public DateTime? OrderDoneTime { get; set; }
        public DateTime? OrderCompleteTime { get; set; }
        public string OrderStateC { get; set; }
        public DateTime? OrderCancelTime { get; set; }
        public decimal? OrderPrice { get; set; }
        public decimal OrderDeposit { get; set; }
        public string DemoSetContent { get; set; }
        public string OrderRemovalC { get; set; }
        public string ManicuristPic { get; set; }
        public int OrderId { get; set; }
        public string OrderPartC { get; set; }
        public double CommentScore { get; set; }
        public string CommentContent { get; set; }
        public DateTime CommentBuildTime { get; set; }
        public string MemberName { get; set; }
        public int MemberId { get; set; }
        public int ManicuristId { get; set; }
        public int DemoSetId { get; set; }
    }
}
