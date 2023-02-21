using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class ManicuristTable
    {
        public int ManicuristId { get; set; }
        public string ManicuristPic { get; set; }
        public string ManicuristSalonName { get; set; }
        public string ManicuristAddress { get; set; }
        public string ManicuristCounty { get; set; }
        public string ManicuristTownship { get; set; }
        public bool? ManicuristPublic { get; set; }
        public string ManicuristSalonPhone { get; set; }
        public string ManicuristLicense { get; set; }
        public string ManicuristBankCode { get; set; }
        public string ManicuristBankAccount { get; set; }
        public string ManicuristIntro { get; set; }
        public double? ManicuristScore { get; set; }
        public string ManicuristBankName { get; set; }
        public string ManicuristBankNameBranch { get; set; }
        public string ManicuristBankCompanyName { get; set; }
    }
}
