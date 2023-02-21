using System;

namespace NailIt.Models
{
    public class YueCommentView
    {
        public int order_ID { get; set; }
        public int member_ID { get; set; }
        public int manicurist_ID { get; set; }
        public decimal? order_Price { get; set; }
        public decimal? order_Deposit { get; set; }
        public bool order_Type { get; set; }
        public string order_ItemName { get; set; }
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
        public double comment_Score { get; set; }
        public string comment_Content { get; set; }
        public DateTime comment_BuildTime { get; set; }
        public string manicurist_SalonName { get; set; }
    }
}
