      //加入生日數字
      for(var i=1;i<13;i++){
        document.getElementById("inputGroupSelect02").add(new Option(i,i));
      }
      for(var i=1;i<32;i++){
        document.getElementById("inputGroupSelect03").add(new Option(i,i));
      }
//切換 content
function openinfor(evt, idcontent, titile) {
    tedDiv.style.display = "block";
    contentdiv.style.display = "none";
        var i,content,innerlink;
        content = document.getElementsByClassName('content');
        for(i=0;i<content.length;i++)
        content[i].style.display = "none"
        innerlink = document.getElementsByClassName('inner-link');
        for(i=0;i<innerlink.length;i++)
        innerlink[i].className = innerlink[i].className.replace("active","");

        document.getElementById(idcontent).style.display = "block";
        //evt.currentTarget.className += " active";

        document.querySelector('.inner1 b').innerHTML = '<b>我的帳戶></b>'+titile;
        if(titile == "我的預約"){
            orderstat(event,'ing','switch-ing');
        }else if(titile =="我的評價>歷史評價"){
            orderstat(event,'await','evaluation-await')
        }else if(titile =="我的評價>評價通知"){
            orderstat(event,'wait-custom','evaluation-wait-custom')
        }
      }
      //切換 modif
//切換訂單狀態
function orderstat(evt, stat, switchbtn) {
    tedDiv.style.display = "block";
    contentdiv.style.display = "none";
        var i,taborder,btn,btn1;
        taborder = document.getElementsByClassName('tab-order');
        for(i=0;i<taborder.length;i++)
        {
          taborder[i].style.display = "none"
        }
        
        document.getElementById(stat).style.display = "block";
        btn = document.getElementsByClassName('switch-btn');
        btn1 = document.getElementsByClassName('evaluation-btn')
        for(i=0;i<btn.length;i++){
            btn[i].style="border-bottom: none"
        }
        for(i=0;i<btn1.length;i++){
            btn1[i].style="border-bottom:none"
        }
        document.getElementById(switchbtn).style = "border-bottom: 2px solid";
        
      }
      //評價星星
function ratstar(e) {
    var key = e.id.substr(5, 1);
    var rat = ".rating" + key
        const stars=document.querySelector(rat).children;
        for(var i=0;i<stars.length;i++){
          stars[i].className ="fa fa-star-o"
        }
        for(var i=0;i<parseInt(e.id[4]);i++){
          stars[i].className = "fa fa-star"
    }
    bb.evainsertlist[0].commentScore = parseInt(e.id.substr(4, 1));
    
         
      }
var area_data = {
  '台北市': [
      '中正區', '大同區', '中山區', '萬華區', '信義區', '松山區', '大安區', '南港區', '北投區', '內湖區', '士林區', '文山區'
  ],
  '新北市': [
      '板橋區', '新莊區', '泰山區', '林口區', '淡水區', '金山區', '八里區', '萬里區', '石門區', '三芝區', '瑞芳區', '汐止區', '平溪區', '貢寮區', '雙溪區', '深坑區', '石碇區', '新店區', '坪林區', '烏來區', '中和區', '永和區', '土城區', '三峽區', '樹林區', '鶯歌區', '三重區', '蘆洲區', '五股區'
  ],
  '基隆市': [
      '仁愛區', '中正區', '信義區', '中山區', '安樂區', '暖暖區', '七堵區'
  ],
  '桃園市': [
      '桃園區', '中壢區', '平鎮區', '八德區', '楊梅區', '蘆竹區', '龜山區', '龍潭區', '大溪區', '大園區', '觀音區', '新屋區', '復興區'
  ],
  '新竹縣': [
      '竹北市', '竹東鎮', '新埔鎮', '關西鎮', '峨眉鄉', '寶山鄉', '北埔鄉', '橫山鄉', '芎林鄉', '湖口鄉', '新豐鄉', '尖石鄉', '五峰鄉'
  ],
  '新竹市': [
      '東區', '北區', '香山區'
  ],
  '苗栗縣': [
      '苗栗市', '通霄鎮', '苑裡鎮', '竹南鎮', '頭份鎮', '後龍鎮', '卓蘭鎮', '西湖鄉', '頭屋鄉', '公館鄉', '銅鑼鄉', '三義鄉', '造橋鄉', '三灣鄉', '南庄鄉', '大湖鄉', '獅潭鄉', '泰安鄉'
  ],
  '台中市': [
      '中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區', '豐原區', '后里區', '東勢區', '石岡區', '新社區', '和平區', '神岡區', '潭子區', '大雅區', '大肚區', '龍井區', '沙鹿區', '梧棲區', '清水區', '大甲區', '外埔區', '大安區'
  ],
  '南投縣': [
      '南投市', '埔里鎮', '草屯鎮', '竹山鎮', '集集鎮', '名間鄉', '鹿谷鄉', '中寮鄉', '魚池鄉', '國姓鄉', '水里鄉', '信義鄉', '仁愛鄉'
  ],
  '彰化縣': [
      '彰化市', '員林鎮', '和美鎮', '鹿港鎮', '溪湖鎮', '二林鎮', '田中鎮', '北斗鎮', '花壇鄉', '芬園鄉', '大村鄉', '永靖鄉', '伸港鄉', '線西鄉', '福興鄉', '秀水鄉', '埔心鄉', '埔鹽鄉', '大城鄉', '芳苑鄉', '竹塘鄉', '社頭鄉', '二水鄉', '田尾鄉', '埤頭鄉', '溪州鄉'
  ],
  '雲林縣': [
      '斗六市', '斗南鎮', '虎尾鎮', '西螺鎮', '土庫鎮', '北港鎮', '莿桐鄉', '林內鄉', '古坑鄉', '大埤鄉', '崙背鄉', '二崙鄉', '麥寮鄉', '臺西鄉', '東勢鄉', '褒忠鄉', '四湖鄉', '口湖鄉', '水林鄉', '元長鄉'
  ],
  '嘉義縣': [
      '太保市', '朴子市', '布袋鎮', '大林鎮', '民雄鄉', '溪口鄉', '新港鄉', '六腳鄉', '東石鄉', '義竹鄉', '鹿草鄉', '水上鄉', '中埔鄉', '竹崎鄉', '梅山鄉', '番路鄉', '大埔鄉', '阿里山鄉'
  ],
  '嘉義市': [
      '東區', '西區'
  ],
  '台南市': [
      '中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區', '南化區', '仁德區', '關廟區', '龍崎區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '學甲區', '北門區', '新營區', '後壁區', '白河區', '東山區', '六甲區', '下營區', '柳營區', '鹽水區', '善化區', '大內區', '山上區', '新市區', '安定區'
  ],
  '高雄市': [
      '楠梓區', '左營區', '鼓山區', '三民區', '鹽埕區', '前金區', '新興區', '苓雅區', '前鎮區', '小港區', '旗津區', '鳳山區', '大寮區', '鳥松區', '林園區', '仁武區', '大樹區', '大社區', '岡山區', '路竹區', '橋頭區', '梓官區', '彌陀區', '永安區', '燕巢區', '田寮區', '阿蓮區', '茄萣區', '湖內區', '旗山區', '美濃區', '內門區', '杉林區', '甲仙區', '六龜區', '茂林區', '桃源區', '那瑪夏區'
  ],
  '屏東縣': [
      '屏東市', '潮州鎮', '東港鎮', '恆春鎮', '萬丹鄉', '長治鄉', '麟洛鄉', '九如鄉', '里港鄉', '鹽埔鄉', '高樹鄉', '萬巒鄉', '內埔鄉', '竹田鄉', '新埤鄉', '枋寮鄉', '新園鄉', '崁頂鄉', '林邊鄉', '南州鄉', '佳冬鄉', '琉球鄉', '車城鄉', '滿州鄉', '枋山鄉', '霧台鄉', '瑪家鄉', '泰武鄉', '來義鄉', '春日鄉', '獅子鄉', '牡丹鄉', '三地門鄉'
  ],
  '宜蘭縣': [
      '宜蘭市', '羅東鎮', '蘇澳鎮', '頭城鎮', '礁溪鄉', '壯圍鄉', '員山鄉', '冬山鄉', '五結鄉', '三星鄉', '大同鄉', '南澳鄉'
  ],
  '花蓮縣': [
      '花蓮市', '鳳林鎮', '玉里鎮', '新城鄉', '吉安鄉', '壽豐鄉', '秀林鄉', '光復鄉', '豐濱鄉', '瑞穗鄉', '萬榮鄉', '富里鄉', '卓溪鄉'
  ],
  '台東縣': [
      '臺東市', '成功鎮', '關山鎮', '長濱鄉', '海端鄉', '池上鄉', '東河鄉', '鹿野鄉', '延平鄉', '卑南鄉', '金峰鄉', '大武鄉', '達仁鄉', '綠島鄉', '蘭嶼鄉', '太麻里鄉'
  ],
  '澎湖縣': [
      '馬公市', '湖西鄉', '白沙鄉', '西嶼鄉', '望安鄉', '七美鄉'
  ],
  '金門縣': [
      '金城鎮', '金湖鎮', '金沙鎮', '金寧鄉', '烈嶼鄉', '烏坵鄉'
  ],
  '連江縣': [
      '南竿鄉', '北竿鄉', '莒光鄉', '東引鄉'
  ]
}
var app = ["台北市","基隆市","新北市","連江縣","宜蘭縣","新竹市","新竹縣","桃園市","苗栗縣","台中市","彰化縣",
"南投縣","嘉義市","嘉義縣","雲林縣","台南市","高雄市","澎湖縣","金門縣","屏東縣","台東縣","花蓮縣"]

for (var i = 0; i < 22; i++){
    document.getElementById('city').add(new Option(app[i], app[i]));
    document.getElementById('city1').add(new Option(app[i], app[i]));
}
 
function change(x){
    var name = x.value;
    document.getElementById("hometown").options.length = 0;
    document.getElementById("hometown1").options.length = 0;
   for(var i=0;i<area_data[name].length;i++){
       document.getElementById("hometown").add(new Option(area_data[name][i], area_data[name][i]));
       document.getElementById("hometown1").add(new Option(area_data[name][i], area_data[name][i]));
   }
    
}
$("#btn-tool").attr('title', '一組三位數的安全碼，通常位於信用卡或簽帳金融卡背面。這組數字有時稱為信用卡安全碼或信用卡檢查碼，可提供多一層保障以防詐騙。');
