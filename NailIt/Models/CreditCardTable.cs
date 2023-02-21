using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class CreditCardTable
    {
        public int CreditCardId { get; set; }
        public int CreditCardOwner { get; set; }
        public string CreditCardNumber { get; set; }
        public byte? CreditCardExpirationdateYear { get; set; }
        public byte? CreditCardExpirationdateMon { get; set; }
        public string CreditCardHolder { get; set; }
        public string CreditCardBilladdress { get; set; }
        public int? CreditCardPostalCode { get; set; }
    }
}
