using System;
using System.Collections.Generic;

#nullable disable

namespace NailIt.Models
{
    public partial class MessageTable
    {
        public int MessageId { get; set; }
        public int MessageSender { get; set; }
        public int MessageReceiver { get; set; }
        public string MessageContent { get; set; }
        public DateTime MessageTime { get; set; }
        public bool MessageRead { get; set; }
    }
}
