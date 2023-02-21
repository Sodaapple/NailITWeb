using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class ServiceTable
    {
        public int ServiceId { get; set; }
        public int ManicuristId { get; set; }
        public string ServiceName { get; set; }
        public string ServicePartC { get; set; }
        public decimal? ServicePrice { get; set; }
        public decimal SeriveDeposit { get; set; }
    }
}
