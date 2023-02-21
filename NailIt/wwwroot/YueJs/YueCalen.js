class Calendar {
        constructor({
            element,
            defaultDate
        }) {
            // 判斷 A是否為B
            if (defaultDate instanceof Date) {
                this.defaultDate = defaultDate
            } else {
                // 建立一個表示現在的 Date 物件 日期
                this.defaultDate = new Date();
            }
            if (element instanceof HTMLElement) {
                this.element = element;
            }

            this.#init();
        }

        // private properties
        // 年
        #year;
        // start from 1
        // 月
        #month;
        // 日
        #date;
        // 日期字串
        #dateString;


        // 取得目前日期函數 init
        #init = () => {
            // 目前年月日
            // defaultYear  目前年
            // defaultMonth 目前月
            // defaultDate  目前日
            const defaultYear = this.defaultDate.getFullYear();
            const defaultMonth = this.defaultDate.getMonth() + 1;
            const defaultDate = this.defaultDate.getDate();
            // 設定當前日期
            this.#setDate(defaultYear, defaultMonth, defaultDate);
            // 監聽事件
            this.#listenEvents();
        }

        // 監聽 年份月份切換按鈕
        #listenEvents = () => {
            // DOMS 
            // 四個按鈕 去年 上個月 下個月 明年
            const lastYearButton = this.element.querySelector('.lastYear');
            const lastMonthButton = this.element.querySelector('.lastMonth');
            const nextYearButton = this.element.querySelector('.nextYear');
            const nextMonthButton = this.element.querySelector('.nextMonth');

            // last year
            lastYearButton.addEventListener('click', () => {
                this.#year--;
                this.#setDate(this.#year, this.#month);
            });
            // next year
            nextYearButton.addEventListener('click', () => {
                this.#year++;
                this.#setDate(this.#year, this.#month);
            });
            // last month
            lastMonthButton.addEventListener('click', () => {
                // 當點擊上個月 當前月份為 1月時 重調回12月 當前年份 - 1
                if (this.#month === 1) {
                    this.#month = 12;
                    this.#year--;
                } else {
                    this.#month--;
                }
                this.#setDate(this.#year, this.#month);
            });
            // next month
            nextMonthButton.addEventListener('click', () => {
                // 當點擊下個月 當前月份為 12月時 重調回1月 當前年份 + 1
                if (this.#month === 12) {
                    this.#month = 1;
                    this.#year++;
                } else {
                    this.#month++
                }
                this.#setDate(this.#year, this.#month);
            });
            // click dates
            this.element.addEventListener('click', (e) => {
                // 當點擊 畫面上 class = "date" 時 觸發
                // 顯示出 log 出 點擊的時間
                if (e.target.classList.contains('date')) {
                    // console.log(e.target.title);
                    // split() 方法使用指定的分隔符字符串将一个String對象分割成子字符串數組
                    // map() 方法會建立一個新的陣列
                    // parseInt() 將字串轉換為以十進位表示的整數
                    const params = e.target.title.split('-').map(str => parseInt(str, 10));
                    // console.log(params);
                    this.#setDate(...params, false);
                }
            });
        }

        // 設定日期
        #setDate = (year, month, date, reRenderDate = true) => {
            this.#year = year;
            this.#month = month;
            this.#date = date;
            // the only place to do renders
            // 畫面顯示當前選擇的日期 事件
            this.#renderCurrentDate();
            this.#renderDates(reRenderDate);
        }
        // 畫面顯示當前選擇的日期
        #renderCurrentDate = () => {
            // 選擇 class = "currentDate"
            const currentDateEL = this.element.querySelector('.currentDate');

            // 測試 旁邊欄位 顯示 選擇的日期
            // const choseDateEL = document.querySelector('.chosedate');

            // 全域變數 日期字串 = #getDateString 函數 (年,月,日)
            this.#dateString = this.#getDateString(this.#year, this.#month, this.#date);
            // class = "currentDate" 內容文字 替換成 全域變數 日期字串
            currentDateEL.textContent = this.#dateString;

            // 加入 選擇日期的 文字
             //choseDateEL.textContent = this.#dateString;
        }

        // 取得上個月資訊
        #getLastMonthInfo = () => {
            let lastMonth = this.#month - 1;
            let yearOfLastMonth = this.#year;
            if (lastMonth === 0) {
                lastMonth = 12;
                yearOfLastMonth -= 1;
            }
            let dayCountInLastMonth = this.#getDayCount(yearOfLastMonth, lastMonth);

            return {
                lastMonth,
                yearOfLastMonth,
                dayCountInLastMonth
            }
        }

        // 取得下個月資訊
        #getNextMonthInfo = () => {
            let nextMonth = this.#month + 1;
            let yearOfNextMonth = this.#year;
            if (nextMonth === 13) {
                nextMonth = 1;
                yearOfNextMonth += 1;
            }
            let dayCountInNextMonth = this.#getDayCount(yearOfNextMonth, nextMonth);

            return {
                nextMonth,
                yearOfNextMonth,
                dayCountInNextMonth
            }
        }
        // 取得日期字串 點擊裡面button 顯示 年月日 點擊切換年月 顯示 年月
    #getDateString = (year, month, date) => {
        month = month >= 10 ? month : '0' + String(month);
        if (typeof date === "undefined") {
        } else
        {
             date = date >= 10 ? date : '0' + String(date);
        }
        
            if (date) {
                return `${year}-${month}-${date}`;
            } else {
                return `${year}-${month}`;
            }
        }

        #renderDates = (reRender) => {
            // DOM
            const datesEL = this.element.querySelector('.dates');
            if (!reRender) {
                const dateELs = datesEL.querySelectorAll('.date');
                for (const el of dateELs) {
                    el.classList.toggle('selected', el.title === this.#dateString);
                }
                return;
            }

            datesEL.innerHTML = '';
            const dayCountInCurrentMonth = this.#getDayCount(this.#year, this.#month);
            const firstDay = this.#getDayOfFirstDate();
            const { lastMonth, yearOfLastMonth, dayCountInLastMonth } = this.#getLastMonthInfo();
            const { nextMonth, yearOfNextMonth } = this.#getNextMonthInfo();

            // 循環生成日曆頁面 div
            for (let i = 1; i <= 42; i++) {
                const dateEL = document.createElement('button');
                // 測試用 p 放入 button 之中
                const datetext = document.createElement('p')

                //const choseDateEL = document.querySelector('.chosedate');


                // 

                dateEL.classList.add('date');
                dateEL.classList.add('btnnotclick');
                let dateString;
                let date;

                // 測試用參數
                let apple;
                let testdate

                if (firstDay > 1 && i < firstDay) {
                    // dates in last month
                    // 結餘的上個月日期
                    date = dayCountInLastMonth - (firstDay - i) + 1;
                    dateString = this.#getDateString(yearOfLastMonth, lastMonth, date);

                    // console.log(date); 顯示這個日曆表 上個月的日期 只有日期
                    // console.log(dateString); 顯示這個日曆表 上個月的年月日 EX:2022-12-31
                } else if (i >= dayCountInCurrentMonth + firstDay) {
                    // dates in next month
                    // 結餘的下個月日期
                    date = i - (dayCountInCurrentMonth + firstDay) + 1;
                    dateString = this.#getDateString(yearOfNextMonth, nextMonth, date);

                    // console.log(date); 顯示這個日曆表 下個月的日期 只有日期
                    // console.log(dateString); 顯示這個日曆表 下個月的年月日 EX:2022-02-01
                } else {
                    // dates in currrent month
                    // 當月日期
                    date = i - firstDay + 1;
                    dateString = this.#getDateString(this.#year, this.#month, date);
                    // 當時間帶入時 日期符合 則帶入可預約時間
                    // testdate = "2023-1-5"
                    // console.log(dateString);
                    // if(dateString == testdate){
                    //   apple = "9:00-10:00";
                    // }
                    // console.log(date); 顯示這個日曆表 這個月的日期 只有日期
                    // 顯示這個日曆表 這個月的年月日 格式為 EX:2023-1-1
                    dateEL.classList.add('currentMonth');
                    if (date === this.#date) {
                        // dateEL.classList.add('selected');
                    }
                }
                dateEL.textContent = date;
                dateEL.id = dateString;
                dateEL.title = dateString;
                dateEL.setAttribute("type", "button");
                // 將 <p> 裡面的文字 設為 apple(之後要帶入的可預約時間)
                datetext.textContent = apple;

                datesEL.append(dateEL);
                dateEL.addEventListener("click", () => { calenSetDay(dateEL.id); })
                var today = new Date();
                var myday = "";
                var year = today.getFullYear();
                var month = today.getMonth() + 1;
                var day = today.getDate() >= 10 ? today.getDate().toString() : "0"+today.getDate()
                if (month < 10) { myday = year + "-" + "0" + month + "-" + day; }
                else { myday = year + "-" + month + "-" + day; }
                
                if (dateString < myday) {
                    dateEL.disabled = "disabled";
                    dateEL.style.backgroundColor = "#F0F0F0";
                }
                // 加入 p 段落 時間
                dateEL.append(datetext);
                // choseDateEL.append(datetext);
            }
        }

        /**
         * Get day count with year, month0
         * @param {number} month month number that starts from 1
         * @returns 
         */
        #getDayCount = (year, month) => {
            return new Date(year, month, 0).getDate();
        }

        #getDayOfFirstDate = () => {
            let day = new Date(this.#year, this.#month - 1, 1).getDay();
            return day === 0 ? 7 : day;
    }
    }