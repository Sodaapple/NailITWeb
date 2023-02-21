using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace NailIt.Models
{
    public partial class NailitDBContext : DbContext
    {
        public NailitDBContext()
        {
        }

        public NailitDBContext(DbContextOptions<NailitDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ArticleLikeTable> ArticleLikeTables { get; set; }
        public virtual DbSet<ArticlePicTable> ArticlePicTables { get; set; }
        public virtual DbSet<ArticleTable> ArticleTables { get; set; }
        public virtual DbSet<CodeTable> CodeTables { get; set; }
        public virtual DbSet<ColorTable> ColorTables { get; set; }
        public virtual DbSet<CommentTable> CommentTables { get; set; }
        public virtual DbSet<CreditCardTable> CreditCardTables { get; set; }
        public virtual DbSet<DemoSetTable> DemoSetTables { get; set; }
        public virtual DbSet<DemoTable> DemoTables { get; set; }
        public virtual DbSet<ManagerTable> ManagerTables { get; set; }
        public virtual DbSet<ManicuristTable> ManicuristTables { get; set; }
        public virtual DbSet<MemberTable> MemberTables { get; set; }
        public virtual DbSet<MessageBlacklistTable> MessageBlacklistTables { get; set; }
        public virtual DbSet<MessageTable> MessageTables { get; set; }
        public virtual DbSet<NoticeReadTable> NoticeReadTables { get; set; }
        public virtual DbSet<NoticeTable> NoticeTables { get; set; }
        public virtual DbSet<OrderTable> OrderTables { get; set; }
        public virtual DbSet<PlanTable> PlanTables { get; set; }
        public virtual DbSet<RemovalPriceTable> RemovalPriceTables { get; set; }
        public virtual DbSet<ReplyLikeTable> ReplyLikeTables { get; set; }
        public virtual DbSet<ReplyTable> ReplyTables { get; set; }
        public virtual DbSet<ReportTable> ReportTables { get; set; }
        public virtual DbSet<ServiceTable> ServiceTables { get; set; }
        public virtual DbSet<SysNoticeTable> SysNoticeTables { get; set; }
        public virtual DbSet<TagTable> TagTables { get; set; }
        public virtual DbSet<Verificationcode> Verificationcodes { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Chinese_Taiwan_Stroke_CI_AS");

            modelBuilder.Entity<ArticleLikeTable>(entity =>
            {
                entity.HasKey(e => e.ArticleLikeId);

                entity.ToTable("ArticleLike_Table");

                entity.Property(e => e.ArticleLikeId).HasColumnName("articleLike_ID");

                entity.Property(e => e.ArticleId).HasColumnName("article_ID");

                entity.Property(e => e.MemberId).HasColumnName("member_ID");
            });

            modelBuilder.Entity<ArticlePicTable>(entity =>
            {
                entity.HasKey(e => e.ArtclePicId);

                entity.ToTable("ArticlePic_Table");

                entity.Property(e => e.ArtclePicId).HasColumnName("artclePic_ID");

                entity.Property(e => e.ArticleId).HasColumnName("article_ID");

                entity.Property(e => e.ArticlePicPath)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("articlePic_Path");
            });

            modelBuilder.Entity<ArticleTable>(entity =>
            {
                entity.HasKey(e => e.ArticleId)
                    .HasName("PK_article_Table");

                entity.ToTable("Article_Table");

                entity.Property(e => e.ArticleId).HasColumnName("article_ID");

                entity.Property(e => e.ArticleAuthor).HasColumnName("article_Author");

                entity.Property(e => e.ArticleBoardC)
                    .IsRequired()
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .HasColumnName("article_Board_C")
                    .IsFixedLength(true);

                entity.Property(e => e.ArticleBuildTime)
                    .HasColumnType("datetime")
                    .HasColumnName("article_BuildTime");

                entity.Property(e => e.ArticleContent)
                    .IsRequired()
                    .HasMaxLength(500)
                    .HasColumnName("article_Content");

                entity.Property(e => e.ArticleLastEdit)
                    .HasColumnType("datetime")
                    .HasColumnName("article_LastEdit");

                entity.Property(e => e.ArticleLikesCount).HasColumnName("article_LikesCount");

                entity.Property(e => e.ArticleReplyCount).HasColumnName("article_ReplyCount");

                entity.Property(e => e.ArticleTitle)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("article_Title")
                    .HasDefaultValueSql("('文章標題未填')");
            });

            modelBuilder.Entity<CodeTable>(entity =>
            {
                entity.HasKey(e => e.CodeId);

                entity.ToTable("Code_Table");

                entity.Property(e => e.CodeId)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .HasColumnName("code_ID")
                    .IsFixedLength(true);

                entity.Property(e => e.CodeRepresent)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("code_Represent");

                entity.Property(e => e.CodeUseIn)
                    .IsRequired()
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasColumnName("code_UseIn")
                    .IsFixedLength(true);
            });

            modelBuilder.Entity<ColorTable>(entity =>
            {
                entity.HasKey(e => e.ColorId)
                    .HasName("PK__Color_Ta__795F1D741816687F");

                entity.ToTable("Color_Table");

                entity.Property(e => e.ColorId).HasColumnName("Color_ID");

                entity.Property(e => e.ColorCss)
                    .HasMaxLength(7)
                    .HasColumnName("Color_css");

                entity.Property(e => e.ColorName)
                    .IsRequired()
                    .HasMaxLength(5)
                    .HasColumnName("Color_Name");
            });

            modelBuilder.Entity<CommentTable>(entity =>
            {
                entity.HasKey(e => e.CommentId);

                entity.ToTable("Comment_Table");

                entity.Property(e => e.CommentId).HasColumnName("comment_ID");

                entity.Property(e => e.CommentBuildTime)
                    .HasColumnType("datetime")
                    .HasColumnName("comment_BuildTime");

                entity.Property(e => e.CommentBuilder).HasColumnName("comment_Builder");

                entity.Property(e => e.CommentContent)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnName("comment_Content")
                    .HasDefaultValueSql("('評論內容未填')");

                entity.Property(e => e.CommentOrderId).HasColumnName("comment_OrderID");

                entity.Property(e => e.CommentScore)
                    .HasColumnName("comment_Score")
                    .HasDefaultValueSql("((5))");

                entity.Property(e => e.CommentTarget).HasColumnName("comment_Target");

                entity.Property(e => e.CommentType).HasColumnName("comment_Type");
            });

            modelBuilder.Entity<CreditCardTable>(entity =>
            {
                entity.HasKey(e => e.CreditCardId);

                entity.ToTable("CreditCard_Table");

                entity.Property(e => e.CreditCardId).HasColumnName("creditCard_ID");

                entity.Property(e => e.CreditCardBilladdress)
                    .HasMaxLength(50)
                    .HasColumnName("creditCard_billaddress");

                entity.Property(e => e.CreditCardExpirationdateMon).HasColumnName("creditCard_expirationdate_mon");

                entity.Property(e => e.CreditCardExpirationdateYear).HasColumnName("creditCard_expirationdate_year");

                entity.Property(e => e.CreditCardHolder)
                    .HasMaxLength(20)
                    .HasColumnName("creditCard_holder");

                entity.Property(e => e.CreditCardNumber)
                    .IsRequired()
                    .HasMaxLength(16)
                    .IsUnicode(false)
                    .HasColumnName("creditCard_Number")
                    .IsFixedLength(true);

                entity.Property(e => e.CreditCardOwner).HasColumnName("creditCard_Owner");

                entity.Property(e => e.CreditCardPostalCode).HasColumnName("creditCard_Postal_code");
            });

            modelBuilder.Entity<DemoSetTable>(entity =>
            {
                entity.HasKey(e => e.DemoSetId)
                    .HasName("PK_demoSet_Table");

                entity.ToTable("DemoSet_Table");

                entity.Property(e => e.DemoSetId).HasColumnName("demoSet_ID");

                entity.Property(e => e.DemoSetColor).HasColumnName("demoSet_Color");

                entity.Property(e => e.DemoSetContent)
                    .HasMaxLength(100)
                    .HasColumnName("demoSet_Content");

                entity.Property(e => e.DemoSetCount).HasColumnName("demoSet_Count");

                entity.Property(e => e.DemoSetCover)
                    .HasMaxLength(50)
                    .HasColumnName("demoSet_Cover");

                entity.Property(e => e.DemoSetDeposit)
                    .HasColumnType("money")
                    .HasColumnName("demoSet_Deposit");

                entity.Property(e => e.DemoSetMain).HasColumnName("demoSet_Main");

                entity.Property(e => e.DemoSetMainEndTime)
                    .HasColumnType("datetime")
                    .HasColumnName("DemoSet_MainEndTime");

                entity.Property(e => e.DemoSetMainStartTime)
                    .HasColumnType("datetime")
                    .HasColumnName("DemoSet_MainStartTime");

                entity.Property(e => e.DemoSetName)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("demoSet_Name")
                    .HasDefaultValueSql("('Demo集沒有命名')");

                entity.Property(e => e.DemoSetPartC)
                    .IsRequired()
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .HasColumnName("demoSet_Part_C")
                    .IsFixedLength(true);

                entity.Property(e => e.DemoSetPrice)
                    .HasColumnType("money")
                    .HasColumnName("demoSet_Price");

                entity.Property(e => e.DemoSetPublic)
                    .IsRequired()
                    .HasColumnName("demoSet_Public")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.DemoSetTag1)
                    .HasMaxLength(5)
                    .HasColumnName("demoSet_Tag_1");

                entity.Property(e => e.DemoSetTag2)
                    .HasMaxLength(5)
                    .HasColumnName("demoSet_Tag_2");

                entity.Property(e => e.DemoSetTag3)
                    .HasMaxLength(5)
                    .HasColumnName("demoSet_Tag_3");

                entity.Property(e => e.DemoSetTag4)
                    .HasMaxLength(5)
                    .HasColumnName("demoSet_Tag_4");

                entity.Property(e => e.ManicuristId).HasColumnName("manicurist_ID");
            });

            modelBuilder.Entity<DemoTable>(entity =>
            {
                entity.HasKey(e => e.DemoId)
                    .HasName("PK_demo_Table");

                entity.ToTable("Demo_Table");

                entity.Property(e => e.DemoId).HasColumnName("demo_ID");

                entity.Property(e => e.DemoPic)
                    .HasMaxLength(50)
                    .HasColumnName("demo_Pic");

                entity.Property(e => e.DemoSetId).HasColumnName("demoSet_ID");
            });

            modelBuilder.Entity<ManagerTable>(entity =>
            {
                entity.HasKey(e => e.ManagerId)
                    .HasName("PK_manager_Table");

                entity.ToTable("Manager_Table");

                entity.Property(e => e.ManagerId).HasColumnName("manager_ID");

                entity.Property(e => e.ManagerAccount)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("manager_Account");

                entity.Property(e => e.ManagerBuildTime)
                    .HasColumnType("datetime")
                    .HasColumnName("manager_BuildTime");

                entity.Property(e => e.ManagerLoginCredit).HasColumnName("manager_LoginCredit");

                entity.Property(e => e.ManagerName)
                    .IsRequired()
                    .HasMaxLength(10)
                    .HasColumnName("manager_Name");

                entity.Property(e => e.ManagerPassword)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("manager_Password");

                entity.Property(e => e.ManagerPurview).HasColumnName("manager_Purview");
            });

            modelBuilder.Entity<ManicuristTable>(entity =>
            {
                entity.HasKey(e => e.ManicuristId)
                    .HasName("PK_manicurist_Table");

                entity.ToTable("Manicurist_Table");

                entity.Property(e => e.ManicuristId)
                    .ValueGeneratedNever()
                    .HasColumnName("manicurist_ID");

                entity.Property(e => e.ManicuristAddress)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("manicurist_Address");

                entity.Property(e => e.ManicuristBankAccount)
                    .HasMaxLength(16)
                    .IsUnicode(false)
                    .HasColumnName("manicurist_BankAccount");

                entity.Property(e => e.ManicuristBankCode)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasColumnName("manicurist_BankCode");

                entity.Property(e => e.ManicuristBankCompanyName)
                    .HasMaxLength(20)
                    .HasColumnName("manicurist_BankCompanyName");

                entity.Property(e => e.ManicuristBankName)
                    .HasMaxLength(20)
                    .HasColumnName("manicurist_BankName");

                entity.Property(e => e.ManicuristBankNameBranch)
                    .HasMaxLength(20)
                    .HasColumnName("manicurist_BankNameBranch");

                entity.Property(e => e.ManicuristCounty)
                    .IsRequired()
                    .HasMaxLength(5)
                    .HasColumnName("manicurist_County");

                entity.Property(e => e.ManicuristIntro)
                    .HasMaxLength(200)
                    .HasColumnName("manicurist_Intro")
                    .HasDefaultValueSql("('未填')");

                entity.Property(e => e.ManicuristLicense)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("manicurist_License")
                    .HasDefaultValueSql("(' ')");

                entity.Property(e => e.ManicuristPic)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("manicurist_Pic");

                entity.Property(e => e.ManicuristPublic).HasColumnName("manicurist_Public");

                entity.Property(e => e.ManicuristSalonName)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("manicurist_SalonName");

                entity.Property(e => e.ManicuristSalonPhone)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("manicurist_SalonPhone");

                entity.Property(e => e.ManicuristScore).HasColumnName("manicurist_Score");

                entity.Property(e => e.ManicuristTownship)
                    .IsRequired()
                    .HasMaxLength(5)
                    .HasColumnName("manicurist_Township");
            });

            modelBuilder.Entity<MemberTable>(entity =>
            {
                entity.HasKey(e => e.MemberId);

                entity.ToTable("Member_Table");

                entity.Property(e => e.MemberId).HasColumnName("member_ID");

                entity.Property(e => e.MemberAccount)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("member_Account");

                entity.Property(e => e.MemberAnswer)
                    .HasMaxLength(20)
                    .HasColumnName("member_Answer");

                entity.Property(e => e.MemberBanned).HasColumnName("member_Banned");

                entity.Property(e => e.MemberBirth)
                    .HasColumnType("datetime")
                    .HasColumnName("member_Birth");

                entity.Property(e => e.MemberEmail)
                    .HasMaxLength(50)
                    .HasColumnName("member_Email");

                entity.Property(e => e.MemberGender).HasColumnName("member_gender");

                entity.Property(e => e.MemberLogincredit).HasColumnName("member_Logincredit");

                entity.Property(e => e.MemberManicurist).HasColumnName("member_Manicurist");

                entity.Property(e => e.MemberName)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("member_Name");

                entity.Property(e => e.MemberNickname)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("member_Nickname");

                entity.Property(e => e.MemberPassword)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("member_Password");

                entity.Property(e => e.MemberPhone)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("member_Phone");

                entity.Property(e => e.MemberQuestion)
                    .HasMaxLength(20)
                    .HasColumnName("member_Question");

                entity.Property(e => e.MemberReportpoint).HasColumnName("member_Reportpoint");

                entity.Property(e => e.MemberScore).HasColumnName("member_Score");

                entity.Property(e => e.MemberVerify)
                    .HasMaxLength(6)
                    .IsUnicode(false)
                    .HasColumnName("member_Verify")
                    .IsFixedLength(true);
            });

            modelBuilder.Entity<MessageBlacklistTable>(entity =>
            {
                entity.HasKey(e => e.BlacklistId)
                    .HasName("PK__MessageB__570B2EEB49F9ACF8");

                entity.ToTable("MessageBlacklist_Table");

                entity.Property(e => e.BlacklistId).HasColumnName("blacklist_ID");

                entity.Property(e => e.BlacklistBuilder).HasColumnName("blacklist_Builder");

                entity.Property(e => e.BlacklistTarget).HasColumnName("blacklist_Target");
            });

            modelBuilder.Entity<MessageTable>(entity =>
            {
                entity.HasKey(e => e.MessageId)
                    .HasName("PK_message_Table");

                entity.ToTable("Message_Table");

                entity.Property(e => e.MessageId).HasColumnName("message_ID");

                entity.Property(e => e.MessageContent)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnName("message_Content");

                entity.Property(e => e.MessageRead).HasColumnName("message_Read");

                entity.Property(e => e.MessageReceiver).HasColumnName("message_Receiver");

                entity.Property(e => e.MessageSender).HasColumnName("message_Sender");

                entity.Property(e => e.MessageTime)
                    .HasColumnType("datetime")
                    .HasColumnName("message_Time");
            });

            modelBuilder.Entity<NoticeReadTable>(entity =>
            {
                entity.HasKey(e => e.NoticeReadId)
                    .HasName("PK_noticeRead_Table");

                entity.ToTable("NoticeRead_Table");

                entity.Property(e => e.NoticeReadId).HasColumnName("noticeRead_ID");

                entity.Property(e => e.NoticeId).HasColumnName("notice_ID");

                entity.Property(e => e.NoticeReadMember).HasColumnName("noticeRead_Member");

                entity.Property(e => e.NoticeReadRead).HasColumnName("noticeRead_Read");
            });

            modelBuilder.Entity<NoticeTable>(entity =>
            {
                entity.HasKey(e => e.NoticeId)
                    .HasName("PK_notice_Table");

                entity.ToTable("Notice_Table");

                entity.Property(e => e.NoticeId).HasColumnName("notice_ID");

                entity.Property(e => e.NoticeBuildTime)
                    .HasColumnType("datetime")
                    .HasColumnName("notice_BuildTime");

                entity.Property(e => e.NoticeContent)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("notice_Content")
                    .HasDefaultValueSql("('無內容')");

                entity.Property(e => e.NoticeManagerId).HasColumnName("notice_manager_ID");

                entity.Property(e => e.NoticePushTime)
                    .HasColumnType("datetime")
                    .HasColumnName("notice_PushTime");

                entity.Property(e => e.NoticeScope)
                    .HasColumnName("notice_Scope")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.NoticeState)
                    .HasColumnName("notice_State")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.NoticeTitle)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("notice_Title")
                    .HasDefaultValueSql("('TITLE沒進')");
            });

            modelBuilder.Entity<OrderTable>(entity =>
            {
                entity.HasKey(e => e.OrderId);

                entity.ToTable("Order_Table");

                entity.Property(e => e.OrderId).HasColumnName("order_ID");

                entity.Property(e => e.ManicuristId).HasColumnName("manicurist_ID");

                entity.Property(e => e.MemberId).HasColumnName("member_ID");

                entity.Property(e => e.OrderAcceptTime)
                    .HasColumnType("datetime")
                    .HasColumnName("order_AcceptTime");

                entity.Property(e => e.OrderCancelTime)
                    .HasColumnType("datetime")
                    .HasColumnName("order_CancelTime");

                entity.Property(e => e.OrderCompleteTime)
                    .HasColumnType("datetime")
                    .HasColumnName("order_CompleteTime");

                entity.Property(e => e.OrderDeposit)
                    .HasColumnType("money")
                    .HasColumnName("order_Deposit");

                entity.Property(e => e.OrderDoneTime)
                    .HasColumnType("datetime")
                    .HasColumnName("order_DoneTime");

                entity.Property(e => e.OrderItem).HasColumnName("order_Item");

                entity.Property(e => e.OrderItemName)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("order_ItemName");

                entity.Property(e => e.OrderOrderTime)
                    .HasColumnType("datetime")
                    .HasColumnName("order_OrderTime");

                entity.Property(e => e.OrderPartC)
                    .IsRequired()
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .HasColumnName("order_Part_C")
                    .IsFixedLength(true);

                entity.Property(e => e.OrderPrice)
                    .HasColumnType("money")
                    .HasColumnName("order_Price");

                entity.Property(e => e.OrderRemovalC)
                    .IsRequired()
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .HasColumnName("order_removal_C")
                    .IsFixedLength(true);

                entity.Property(e => e.OrderStateC)
                    .IsRequired()
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .HasColumnName("order_State_C")
                    .IsFixedLength(true);

                entity.Property(e => e.OrderType).HasColumnName("order_Type");

                entity.Property(e => e.PlanId).HasColumnName("plan_ID");
            });

            modelBuilder.Entity<PlanTable>(entity =>
            {
                entity.HasKey(e => e.PlanId)
                    .HasName("PK_plan_Table");

                entity.ToTable("Plan_Table");

                entity.Property(e => e.PlanId).HasColumnName("plan_ID");

                entity.Property(e => e.ManicuristId).HasColumnName("manicurist_ID");

                entity.Property(e => e.OrderId).HasColumnName("Order_ID");

                entity.Property(e => e.PlanRemark)
                    .HasMaxLength(50)
                    .HasColumnName("plan_Remark")
                    .HasDefaultValueSql("('無')");

                entity.Property(e => e.PlanStartTime)
                    .HasColumnType("datetime")
                    .HasColumnName("plan_StartTime");
            });

            modelBuilder.Entity<RemovalPriceTable>(entity =>
            {
                entity.HasKey(e => e.RemovalPriceManicuristId);

                entity.ToTable("RemovalPrice_Table");

                entity.Property(e => e.RemovalPriceManicuristId)
                    .ValueGeneratedNever()
                    .HasColumnName("removalPrice_manicuristID");

                entity.Property(e => e.RemovalPriceB0)
                    .HasColumnType("money")
                    .HasColumnName("removalPrice_B0");

                entity.Property(e => e.RemovalPriceB1)
                    .HasColumnType("money")
                    .HasColumnName("removalPrice_B1");

                entity.Property(e => e.RemovalPriceB2)
                    .HasColumnType("money")
                    .HasColumnName("removalPrice_B2");

                entity.Property(e => e.RemovalPriceB3)
                    .HasColumnType("money")
                    .HasColumnName("removalPrice_B3");
            });

            modelBuilder.Entity<ReplyLikeTable>(entity =>
            {
                entity.HasKey(e => e.ReplyLikeId);

                entity.ToTable("ReplyLike_Table");

                entity.Property(e => e.ReplyLikeId).HasColumnName("replyLike_ID");

                entity.Property(e => e.MemberId).HasColumnName("member_ID");

                entity.Property(e => e.ReplyId).HasColumnName("reply_ID");
            });

            modelBuilder.Entity<ReplyTable>(entity =>
            {
                entity.HasKey(e => e.ReplyId);

                entity.ToTable("Reply_Table");

                entity.Property(e => e.ReplyId).HasColumnName("reply_ID");

                entity.Property(e => e.ArticleId).HasColumnName("article_ID");

                entity.Property(e => e.MemberId).HasColumnName("member_ID");

                entity.Property(e => e.ReplyBuildTime)
                    .HasColumnType("datetime")
                    .HasColumnName("reply_BuildTime");

                entity.Property(e => e.ReplyContent)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("reply_Content")
                    .HasDefaultValueSql("('留言內容未填')");

                entity.Property(e => e.ReplyLastEdit)
                    .HasColumnType("datetime")
                    .HasColumnName("reply_LastEdit");

                entity.Property(e => e.ReplyLikesCount).HasColumnName("reply_LikesCount");
            });

            modelBuilder.Entity<ReportTable>(entity =>
            {
                entity.HasKey(e => e.ReportId);

                entity.ToTable("Report_Table");

                entity.Property(e => e.ReportId).HasColumnName("report_ID");

                entity.Property(e => e.ManagerId).HasColumnName("Manager_ID");

                entity.Property(e => e.ReportBuildTime)
                    .HasColumnType("datetime")
                    .HasColumnName("report_BuildTime");

                entity.Property(e => e.ReportBuilder).HasColumnName("report_Builder");

                entity.Property(e => e.ReportCheckTime)
                    .HasColumnType("datetime")
                    .HasColumnName("report_CheckTime");

                entity.Property(e => e.ReportContent)
                    .IsRequired()
                    .HasMaxLength(200)
                    .HasColumnName("report_Content");

                entity.Property(e => e.ReportItem).HasColumnName("report_Item");

                entity.Property(e => e.ReportPlaceC)
                    .IsRequired()
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .HasColumnName("report_Place_C")
                    .IsFixedLength(true);

                entity.Property(e => e.ReportReasonC)
                    .IsRequired()
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .HasColumnName("report_Reason_C")
                    .IsFixedLength(true);

                entity.Property(e => e.ReportResult).HasColumnName("report_Result");

                entity.Property(e => e.ReportTarget).HasColumnName("report_Target");
            });

            modelBuilder.Entity<ServiceTable>(entity =>
            {
                entity.HasKey(e => e.ServiceId)
                    .HasName("PK_service_Table");

                entity.ToTable("Service_Table");

                entity.Property(e => e.ServiceId).HasColumnName("service_ID");

                entity.Property(e => e.ManicuristId).HasColumnName("manicurist_ID");

                entity.Property(e => e.SeriveDeposit)
                    .HasColumnType("money")
                    .HasColumnName("serive_Deposit");

                entity.Property(e => e.ServiceName)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasColumnName("service_Name");

                entity.Property(e => e.ServicePartC)
                    .IsRequired()
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .HasColumnName("service_Part_C")
                    .IsFixedLength(true);

                entity.Property(e => e.ServicePrice)
                    .HasColumnType("money")
                    .HasColumnName("service_Price");
            });

            modelBuilder.Entity<SysNoticeTable>(entity =>
            {
                entity.HasKey(e => e.SysNoticeId)
                    .HasName("PK_sysNotice_Table");

                entity.ToTable("SysNotice_Table");

                entity.Property(e => e.SysNoticeId).HasColumnName("sysNotice_ID");

                entity.Property(e => e.SysNoticeBuildTime)
                    .HasColumnType("datetime")
                    .HasColumnName("sysNotice_BuildTime");

                entity.Property(e => e.SysNoticeContent)
                    .IsRequired()
                    .HasMaxLength(100)
                    .HasColumnName("sysNotice_Content")
                    .HasDefaultValueSql("('無內容')");

                entity.Property(e => e.SysNoticeState).HasColumnName("sysNotice_State");

                entity.Property(e => e.SysNoticeTarget).HasColumnName("sysNotice_Target");

                entity.Property(e => e.SysNoticeTitle)
                    .HasMaxLength(50)
                    .HasColumnName("sysNotice_Title");
            });

            modelBuilder.Entity<TagTable>(entity =>
            {
                entity.HasKey(e => e.TagId)
                    .HasName("PK_tag_Table");

                entity.ToTable("Tag_Table");

                entity.Property(e => e.TagId).HasColumnName("tag_ID");

                entity.Property(e => e.TagName)
                    .IsRequired()
                    .HasMaxLength(10)
                    .HasColumnName("tag_Name");
            });

            modelBuilder.Entity<Verificationcode>(entity =>
            {
                entity.HasKey(e => e.VerifcodeId)
                    .HasName("PK__Verifica__AF7445D56AAF6972");

                entity.ToTable("Verificationcode");

                entity.Property(e => e.VerifcodeId).ValueGeneratedNever();

                entity.Property(e => e.Verifcodetext)
                    .IsRequired()
                    .HasMaxLength(6);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
