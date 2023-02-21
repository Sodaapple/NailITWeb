using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class MemberTable
    {
        public int MemberId { get; set; }
        public string MemberAccount { get; set; }
        public string MemberPassword { get; set; }
        public string MemberName { get; set; }
        public string MemberNickname { get; set; }
        public bool MemberGender { get; set; }
        public string MemberPhone { get; set; }
        public DateTime? MemberBirth { get; set; }
        public string MemberEmail { get; set; }
        public double? MemberScore { get; set; }
        public bool MemberManicurist { get; set; }
        public Guid? MemberLogincredit { get; set; }
        public int MemberReportpoint { get; set; }
        public int? MemberBanned { get; set; }
        public string MemberVerify { get; set; }
        public string MemberQuestion { get; set; }
        public string MemberAnswer { get; set; }
    }
}
