using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class ManagerTable
    {
        public int ManagerId { get; set; }
        public string ManagerAccount { get; set; }
        public string ManagerPassword { get; set; }
        public string ManagerName { get; set; }
        public Guid? ManagerLoginCredit { get; set; }
        public int ManagerPurview { get; set; }
        public DateTime ManagerBuildTime { get; set; }
    }
}
