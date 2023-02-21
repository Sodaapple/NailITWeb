using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NailIt.Models;
using Newtonsoft.Json;

namespace NailIt.Controllers.AnselControllers
{
    // for getMemberAllMessage method
    partial class AllMessage
    {
        public AllMessage(dynamic obj)
        {
            MessageSrc = obj.MessageSrc;
            MessageId = obj.MessageId;
            MessageSender = obj.MessageSender;
            MessageReceiver = obj.MessageReceiver;
            MessageContent = obj.MessageContent;
            MessageTime = obj.MessageTime;
            MessageRead = obj.MessageRead;
        }
        public string MessageSrc { get; set; }
        public int MessageId { get; set; }
        public int MessageSender { get; set; }
        public int? MessageReceiver { get; set; }
        public string MessageContent { get; set; }
        public DateTime MessageTime { get; set; }
        public bool MessageRead { get; set; }
    }

    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly NailitDBContext _context;

        public ChatController(NailitDBContext context)
        {
            _context = context;
        }

        public List<MemberTable> LoginCheck()
        {
            string theKey = Request.Cookies[".AspNetCore.Session"];
            if (HttpContext.Session.GetString("NailLogin") == null || theKey == null)
                return null;
            Guid aa = Guid.Parse(HttpContext.Session.GetString("NailLogin"));
            var theId = from member in _context.MemberTables where member.MemberLogincredit == aa select member;
            return theId.ToList();
        }

        // Get all message from MessageTables, SysNoticeTables and NoticeTables
        private async Task<List<AllMessage>> getMemberAllMessage(int? loginId)
        {
            var scop = (_context.MemberTables.Where(m => m.MemberId == loginId).FirstOrDefault().MemberManicurist) ? 1 : 0;
            var messages = await _context.MessageTables.Where(m => m.MessageSender == loginId || m.MessageReceiver == loginId).
                Select(m => new AllMessage(new
                {
                    MessageSrc = "MessageTables",
                    m.MessageId,
                    m.MessageSender,
                    MessageReceiver = (int?)m.MessageReceiver,
                    m.MessageContent,
                    m.MessageTime,
                    m.MessageRead
                }
                )).ToListAsync();
            var sysNotices = _context.SysNoticeTables.Where(s => s.SysNoticeTarget == loginId).
                Select(s => new AllMessage(new
                {
                    MessageSrc = "SysNoticeTables",
                    MessageId = s.SysNoticeId,
                    MessageSender = 0,
                    MessageReceiver = loginId,
                    MessageContent = $"[{s.SysNoticeTitle}]{s.SysNoticeContent}",
                    MessageTime = s.SysNoticeBuildTime,
                    MessageRead = s.SysNoticeState
                }
                )).ToList();
            var notices = _context.NoticeTables.Where(n => n.NoticeScope == 2 || n.NoticeScope == scop).
                Join(_context.NoticeReadTables,
                l => l.NoticeId,
                r => r.NoticeId,
                (l, r) => new AllMessage(new
                {
                    MessageSrc = "NoticeTables",
                    MessageId = l.NoticeId,
                    MessageSender = 0,
                    MessageReceiver = loginId,
                    MessageContent = $"[{l.NoticeTitle}]{l.NoticeContent}",
                    MessageTime = l.NoticePushTime,
                    MessageRead = r.NoticeReadRead
                }
                )).ToList();
            // 如果未讀沒有建入NoticeReadTables，使用left join
            // var notices = (from notice in _context.NoticeTables
            //                where notice.NoticeScope == 2 || notice.NoticeScope == scop
            //                join read in _context.NoticeReadTables on notice.NoticeId equals read.NoticeId into lg
            //                from noticRead in lg.DefaultIfEmpty()
            //                select new AllMessage(new
            //                {
            //                    MessageSrc = "NoticeTables",
            //                    MessageId = notice.NoticeId,
            //                    MessageSender = 0,
            //                    MessageReceiver = loginId,
            //                    MessageContent = $"[{notice.NoticeTitle}]{notice.NoticeContent}",
            //                    MessageTime = notice.NoticePushTime,
            //                    MessageRead = (noticRead == null) ? false : noticRead.NoticeReadRead
            //                })
            //                ).ToList();
            var resultList = messages.Union(sysNotices.Union(notices)).ToList();
            // the message i sent, it's read for me.
            var tempList = resultList.Where(a => a.MessageSender == loginId).ToList();
            foreach (var item in tempList)
            {
                item.MessageRead = true;
            }
            return resultList;
        }

        // Exclude those be placed on blacklist
        // Get list of chatting with members with latest message content, sent time and message unreadCount
        private List<dynamic> getChattingList(List<AllMessage> messages, int? loginId)
        {
            var blacklist = _context.MessageBlacklistTables.Where(m => m.BlacklistBuilder == loginId).ToList();
            var removeBlack = (from m in messages
                               from black in blacklist.
                                        Where(b => m.MessageSender == b.BlacklistTarget || m.MessageReceiver == b.BlacklistTarget).DefaultIfEmpty()
                               where black == null
                               select m).ToList();
            // Get list of chatting with members with latest message and sent time
            var messageList = removeBlack.
                        GroupBy(r => new { r.MessageSender, r.MessageReceiver },
                                        (key, g) => g.OrderByDescending(x => x.MessageTime).
                                        Select(r => new
                                        {
                                            r.MessageSender,
                                            r.MessageReceiver,
                                            r.MessageContent,
                                            r.MessageTime,
                                            // r.MessageRead,
                                            unreadCount = g.Where(x => x.MessageRead == false).Count()
                                        }).FirstOrDefault()
                        ).OrderByDescending(x => x.MessageTime).ToList();
            var myMessages = new List<dynamic>();
            foreach (var message in messageList)
            {
                if (message.MessageSender != loginId && !myMessages.Any(r => r.memberId == message.MessageSender))
                {
                    myMessages.Add(new
                    {
                        memberId = message.MessageSender,
                        message.MessageContent,
                        message.MessageTime,
                        // message.MessageRead,
                        message.unreadCount,
                        msgTimeDiff = ReplyTablesController.dateTimeDiff(DateTime.UtcNow, message.MessageTime)
                    });
                }
                else if (message.MessageReceiver != loginId && !myMessages.Any(r => r.memberId == message.MessageReceiver))
                {
                    myMessages.Add(new
                    {
                        memberId = message.MessageReceiver,
                        message.MessageContent,
                        message.MessageTime,
                        // message.MessageRead,
                        message.unreadCount,
                        msgTimeDiff = ReplyTablesController.dateTimeDiff(DateTime.UtcNow, message.MessageTime)
                    });
                }
            }
            // left join memberTable, get MemberAccount and MemberNickname
            var leftJoinMember = (from l in myMessages
                                  join member in _context.MemberTables on l.memberId equals member.MemberId into lg
                                  from r in lg.DefaultIfEmpty()
                                  select new
                                  {
                                      l.memberId,
                                      l.MessageContent,
                                      l.MessageTime,
                                      l.unreadCount,
                                      l.msgTimeDiff,
                                      memberAccount = r?.MemberAccount ?? "systemAdmin",
                                      memberNickname = r?.MemberNickname ?? "系統通知"
                                      // memberAccount = (r?.MemberAccount != null) ? r.MemberAccount : "",
                                      // memberNickname = (r?.MemberNickname != null) ? r.MemberNickname : ""
                                  }
                ).ToList();
            return ((IEnumerable<dynamic>)leftJoinMember).ToList();
        }

        // GET: api/Chat/GetMembersMsg
        [HttpGet]
        public async Task<ActionResult> GetMembersMsg()
        {
            var loginId = LoginCheck()?[0].MemberId ?? -1;
            // Get all message from MessageTables, SysNoticeTables and NoticeTables
            List<AllMessage> allMessage = await getMemberAllMessage(loginId);

            // Exclude those be placed on blacklist.
            // Get list of chatting with members with latest message content, sent time and message unreadCount.
            var myMessages = getChattingList(allMessage, loginId);

            return Ok(myMessages.OrderBy(r => r.MessageTime));
        }

        // GET: api/Chat/GetSingleMemberMsg/1
        [HttpGet("{memberId}")]
        public async Task<ActionResult> GetSingleMemberMsg(int memberId)
        {
            var loginId = LoginCheck()?[0].MemberId ?? -1;

            // Get all message from MessageTables, SysNoticeTables, NoticeTables and NoticeReadTables
            List<AllMessage> allMessage = await getMemberAllMessage(loginId);

            // Get read latest 100 history message
            var latest100history = allMessage.
                    Where(m => m.MessageRead == true &&
                            ((m.MessageSender == loginId && m.MessageReceiver == memberId) ||
                            (m.MessageSender == memberId && m.MessageReceiver == loginId))).
                    OrderByDescending(m => m.MessageTime).
                    Take(100).
                    ToList();

            return Ok(latest100history.OrderBy(m => m.MessageTime).ToList());
        }

        // GET: api/Chat/CheckNewMsg
        [HttpGet("{updateTime}")]
        public async Task<ActionResult> GetNewMsg(DateTime updateTime)
        {
            var loginId = LoginCheck()?[0].MemberId ?? -1;
            // Get all message from MessageTables, SysNoticeTables, NoticeTables and NoticeReadTables
            List<AllMessage> allMessage = await getMemberAllMessage(loginId);

            // Check those later than display latest message_Time (not include login person sent).
            var newMessages = allMessage.Where(a => a.MessageTime > updateTime && a.MessageSender != loginId).ToList();
            if (newMessages.Count() > 0)
            {
                // Exclude those be placed on blacklist.
                // Get list of chatting with members with latest message content, sent time and message unreadCount.
                var myMessages = getChattingList(newMessages, loginId);
                return Ok(myMessages.OrderBy(r => r.MessageTime));
            }

            return Ok(newMessages);
        }

        // PUT: api/Chat/PutMsgRead/1
        [HttpPut("{senderId}")]
        public async Task<ActionResult> PutMsgRead(int senderId)
        {
            var loginId = LoginCheck()?[0].MemberId ?? -1;
            // Get all message from MessageTables, SysNoticeTables, NoticeTables and NoticeReadTables
            List<AllMessage> allMessage = await getMemberAllMessage(loginId);
            // Get all unread message
            var unreadMessage = allMessage.Where(m => m.MessageRead == false && m.MessageSender == senderId && m.MessageReceiver == loginId).ToList();

            // Change the message state, unread to read
            if (unreadMessage.Count() > 0)
            {
                // lock DB
                var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

                if (senderId == 0)
                {
                    // SysNoticeTables
                    var sysNotices = _context.SysNoticeTables.Where(s => s.SysNoticeState == false && s.SysNoticeTarget == loginId).ToList();
                    foreach (var item in sysNotices)
                    {
                        item.SysNoticeState = true;
                    }
                    // NoticeReadTables
                    var unreadNotice = _context.NoticeReadTables.Where(n => n.NoticeReadRead == false && n.NoticeReadMember == loginId).ToList();
                    // var unreadNotice = unreadMessage.Where(u => u.MessageSrc == "NoticeTables").ToList();// 如果未讀沒有建入NoticeReadTables,已讀使用insert
                    foreach (var item in unreadNotice)
                    {
                        item.NoticeReadRead = true;

                        // 如果未讀沒有建入NoticeReadTables,已讀使用insert
                        // var noticeRead = new NoticeReadTable();
                        // noticeRead.NoticeReadId = 0;
                        // noticeRead.NoticeId = item.MessageId;
                        // noticeRead.NoticeReadMember = (int)loginId;
                        // noticeRead.NoticeReadRead = true;
                        // _context.NoticeReadTables.Add(noticeRead);
                    }
                }
                else
                {
                    // MessageTables
                    var messages = _context.MessageTables.Where(m => m.MessageRead == false && m.MessageSender == senderId && m.MessageReceiver == loginId).ToList();
                    foreach (var item in messages)
                    {
                        item.MessageRead = true;
                    }
                }
                await _context.SaveChangesAsync();
                t.Commit();
                return Ok(unreadMessage.OrderBy(r => r.MessageTime));
            }

            return Ok(unreadMessage);
        }

        // PUT: api/Chat/PutMsgRevoke/1
        [HttpPut("{id}")]
        public async Task<ActionResult> PutMsgRevoke(int id)
        {
            var message = _context.MessageTables.FirstOrDefault(m => m.MessageId == id);
            if (message != null)
            {
                message.MessageContent = "訊息已收回";
                message.MessageRead = true;
            }
            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);
            await _context.SaveChangesAsync();
            t.Commit();
            return NoContent();
        }

        // POST: api/Chat/PostMessage
        [HttpPost]
        public async Task<ActionResult> PostMessage(MessageTable message)
        {
            // lock DB
            var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

            _context.MessageTables.Add(message);
            await _context.SaveChangesAsync();

            t.Commit();
            return CreatedAtAction("GetMessageTable", new { id = message.MessageId }, message);
        }

        /// <summary>
        /// upload image to ChatImage file and return image display link.
        /// </summary>
        /// <param name="frm">attached file</param>
        /// <returns></returns>
        // POST:/api/Social/UploadImage
        [HttpPost]
        public async Task<IActionResult> UploadImage(IFormCollection frm)
        {
            if (frm.Files.Count > 0)
            {
                List<string> imageUrls = new List<string>();

                // lock DB
                var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);

                // get latest MessageId
                var latestMsg = await _context.MessageTables.OrderByDescending(m => m.MessageId).FirstOrDefaultAsync();
                var newMessageId = latestMsg.MessageId + 1;
                for (int i = 0; i < frm.Files.Count; i++)
                {
                    // use messageId be image name
                    string imageName = $"{newMessageId}-{i + 1}.png";
                    chatSaveImage(imageName, frm.Files[i]);
                    imageUrls.Add($"/AnselLib/ChatImage/{imageName}");
                }

                t.Commit();
                return Ok(imageUrls);
            }
            return NotFound();
        }

        // POST: api/Chat/PostMsgImage
        [HttpPost]
        public async Task<ActionResult> PostMsgImage(IFormCollection frm)
        {
            if (frm.Files.Count > 0)
            {
                var messages = new List<MessageTable>();
                MessageTable message = JsonConvert.DeserializeObject<MessageTable>(frm["message"]);
                // lock DB
                var t = _context.Database.BeginTransaction(System.Data.IsolationLevel.ReadUncommitted);
                // save Image message
                _context.MessageTables.Add(message);
                await _context.SaveChangesAsync();
                var id = message.MessageId;
                for (int i = 0; i < frm.Files.Count; i++)
                {
                    if (i != 0)
                        message.MessageId = 0;
                    // use messageId be image name
                    string imageName = $"{id}.png";
                    chatSaveImage(imageName, frm.Files[i]);
                    message.MessageContent = $"<img src='/AnselLib/ChatImage/{imageName}' onclick='showPicModal(this)'>";
                    if (i == 0)
                        await _context.SaveChangesAsync();
                    else
                        _context.MessageTables.Add(message);
                    await _context.SaveChangesAsync();
                    // deep copy, then add into return list
                    var theMsg = new MessageTable();
                    Common.DeepCopy(ref message, ref theMsg);
                    messages.Add(theMsg);
                    id++;
                }

                t.Commit();
                return Ok(messages);
            }
            return NotFound();
        }

        private async void chatSaveImage(string imageName, IFormFile imageFile)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\AnselLib\\ChatImage") + "\\" + imageName; //檔案存放位置在wwwroot中的資料夾

            using (var stream = System.IO.File.Create(filePath))
            {
                await imageFile.CopyToAsync(stream);
            }
        }
    }
}