using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class OrderTable
    {
        public int OrderId { get; set; }
        public int MemberId { get; set; }
        public int ManicuristId { get; set; }
        public int PlanId { get; set; }
        public decimal? OrderPrice { get; set; }
        public decimal OrderDeposit { get; set; }
        public string OrderPartC { get; set; }
        public string OrderRemovalC { get; set; }
        public bool OrderType { get; set; }
        public int OrderItem { get; set; }
        public string OrderItemName { get; set; }
        public DateTime OrderOrderTime { get; set; }
        public DateTime? OrderAcceptTime { get; set; }
        public DateTime? OrderDoneTime { get; set; }
        public DateTime? OrderCompleteTime { get; set; }
        public string OrderStateC { get; set; }
        public DateTime? OrderCancelTime { get; set; }
    }
}
