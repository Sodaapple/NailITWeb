using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;


namespace NailIt.Models
{
    public class YueReserveView
    {
        public int order_ID { get; set; }
        public int member_ID { get; set; }
        public int manicurist_ID { get; set; }
        public decimal? order_Price { get; set; }
        public decimal? order_Deposit { get; set; }
        public bool order_Type { get; set; }
        public string order_ItemName { get; set;  }
        public DateTime? order_OrderTime { get; set; }
        public DateTime? order_AcceptTime { get; set; }
        public DateTime? order_DoneTime { get; set; }
        public DateTime? order_CompleteTime { get; set; }
        public DateTime? order_CancelTime { get; set; }
        public string member_Nickname { get; set; }
        public DateTime plan_StartTime { get; set; }
        public string plan_Remark { get; set; }
        public string order_part { get; set; }
        public string order_removal { get; set; }
        public string demoSet_Content { get; set; }
        public string order_Cover { get; set; }
        public int order_item { get; set; }
        public double? member_star { get; set; }
    }
}
