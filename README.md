# NailIt
"Nail It" It's a web for people to find the manicurist who they really need.
* .NET 5.0

# Package
* Entity Framework
* Swagger
* Bootstrap: v4.6.2 or v4.3.1(.NET5 mvc 內建)
* jQuery: v3.5.1(.NET5 mvc 內建)

# CSS
1. 字體大小：依照PPT
2. 顏色主要：黑色#000000、深灰色#7F7F7F、淺灰#D0CECE、橘紅#FF6733、灰綠色#6D7B72
3. hover button: #fc8158
## 美甲圖源抓取：
1. https://ohoratw.com/
2. https://www.kouve.com.tw/
3. https://www.oh-nala.com/

# Update EF DB Context
* before using this command, please update the connection string. To connect to local Db.
Scaffold-DbContext -Connection "Server=.\sqlexpress;Database=NailitDB;Integrated Security=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -f

Scaffold-DbContext -Connection "Server=.\sqlexpress;Database=NailitDB;Integrated Security=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -Force

# Swagger UI
* 如果有寫api，除了postman可以測api，也推薦可以用swagger測試api，swagger會自動帶出目前專案有的api，還會自動顯示有哪些參數需要傳入，可以試試
* VS跑起來之後，連線https://localhost:xxxxx/swagger/index.html，就會進到swagger UI介面
* 如果在測試api階段，想要預設swagger UI當首頁，可以到Properties> launchSettings.json，把swagger設定的註解打開
