// 'use strict';
var options_this;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LunarHelp = function () {
  function LunarHelp(year, month, day) {
    _classCallCheck(this, LunarHelp);

    this.lunarInfo = new Array(0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0);

    this.nStr1 = new Array('日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十');
    this.nStr2 = new Array('初', '十', '廿', '三');

    var date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    var i,
        leap = 0,
        temp = 0; //天数
    var baseDate = new Date(1900, 0, 31);
    var offset = (date - baseDate) / 86400000;

    //计算年数
    for (i = 1900; i < 2050 && offset - this.lYearDays(i) > 0; i++) {
      offset -= this.lYearDays(i);
    }

    this.year = i;
    leap = this.leapMonth(i); //闰哪个月
    this.isLeap = false;

    //计算月数
    for (i = 1; i < 13 && offset > 0; i++) {
      //闰月
      if (leap > 0 && i == leap + 1 && this.isLeap == false) {
        --i;
        temp = this.leapDays(this.year);
      } else {
        temp = this.monthDays(this.year, i);
      }

      //解除闰月
      if (this.isLeap == true && i == leap + 1) this.isLeap = false;

      offset -= temp;
    }

    //如果恰好减完了，不是闰月的话月数减1
    if (offset == 0 && leap > 0 && i == leap + 1) if (this.isLeap) {
      this.isLeap = false;
    } else {
      this.isLeap = true;
      --i;
    }

    if (offset < 0) {
      offset += temp;
      --i;
    }

    this.month = i;
    //最后剩余的就是日期
    this.day = offset + 1;
  }

  // 获取y年的总天数


  _createClass(LunarHelp, [{
    key: 'lYearDays',
    value: function lYearDays(year) {
      var i,
          sum = 0;
      for (i = 0x8000; i > 0x8; i >>= 1) {
        sum += this.lunarInfo[year - 1900] & i ? 30 : 29;
      }return sum + this.leapDays(year); //最后在加上可能有的闰年的闰月
    }

    //获取闰年闰月的天数 闰大月还是小月

  }, {
    key: 'leapDays',
    value: function leapDays(year) {
      if (this.leapMonth(year)) return this.lunarInfo[year - 1900] & 0x10000 ? 30 : 29;else return 0;
    }

    //获取闰年闰哪个月1-12 ,没闰传回 0

  }, {
    key: 'leapMonth',
    value: function leapMonth(year) {
      return this.lunarInfo[year - 1900] & 0xf;
    }

    //获取y年m月的总天数 正常月
  }, {
    key: 'monthDays',
    value: function monthDays(year, month) {
      return this.lunarInfo[year - 1900] & 0x10000 >> month ? 30 : 29;
    }

    //中文日期

  }, {
    key: 'cDay',
    value: function cDay(d) {
      var s;

      switch (d) {
        case 10:
          s = '初十';
          break;
        case 20:
          s = '二十';
          break;
          break;
        case 30:
          s = '三十';
          break;
          break;
        default:
          s = this.nStr2[Math.floor(d / 10)];
          s += this.nStr1[d % 10];
      }
      return s;
    }
    //中文月份

  }, {
    key: 'cMonth',
    value: function cMonth(m) {
      var s;

      switch (m) {
        case 1:
          s = '正月';
          break;
        case 2:
          s = '二月';
          break;
        case 3:
          s = '三月';
          break;
        case 4:
          s = '四月';
          break;
        case 5:
          s = '五月';
          break;
        case 6:
          s = '六月';
          break;
        case 7:
          s = '七月';
          break;
        case 8:
          s = '八月';
          break;
        case 9:
          s = '九月';
          break;
        case 10:
          s = '十月';
          break;
        case 11:
          s = '十一月';
          break;
        case 12:
          s = '十二月';
          break;
        default:
          break;
      }
      return s;
    }

    //获得阴历日期 字符串

  }, {
    key: 'getLunarDay',
    value: function getLunarDay() {
      return cMonth(this.month) + cDay(this.day);
    }
    //获得阴历日期某一天的中文

  }, {
    key: 'getLunarDayName',
    value: function getLunarDayName() {

      if (this.day == 1) return this.cMonth(this.month);
      return this.cDay(this.day);
    }
    //获取阴历日期的数字

  }, {
    key: 'getLunarDayNum',
    value: function getLunarDayNum() {
      return {
        day: this.day,
        month: this.month
      };
    }
  }]);

  return LunarHelp;
}();

var SimpleCalendar = function () {
  //构造函数
  function SimpleCalendar(query, options) {
    _classCallCheck(this, SimpleCalendar);
    //默认配置
    this._defaultOptions = {
      width: '500px',
      height: '600px',
      language: 'CH', //语言
      showLunarCalendar: true, //阴历
      showHoliday: true, //休假
      showFestival: true, //节日
      showLunarFestival: true, //农历节日
      showSolarTerm: true, //节气
      showMark: true, //标记
      timeRange: {
        startYear: 1900,
        endYear: 2049
      },
      timeZone: "", //时区
      theme: {
        changeAble: false,
        weeks: {
          backgroundColor: '#FBEC9C',
          fontColor: '#4A4A4A',
          fontSize: '20px'
        },
        days: {
          backgroundColor: '#ffffff',
          fontColor: '#565555',
          fontSize: '24px'
        },
        todaycolor: 'orange',
        activeSelectColor: 'orange',
        invalidDays: '#C1C0C0'
      }
    };

    //容器
    this.container = document.querySelector(query);

    this._defaultOptions.width = this.container.style.offsetWidth;
    this._defaultOptions.height = this.container.style.offsetHeight;

    //this._options = Object.assign({}, this._defaultOptions, options);

    //得到最终配置
    this._options = this.optionAssign(this._defaultOptions, options);
    this.create();
  }

  //用B更新A的属性 并返回结果
  _createClass(SimpleCalendar, [{
    key: 'optionAssign',
    value: function optionAssign(optionsA, optionsB) {
      for (var key in optionsB) {
        if (_typeof(optionsA[key]) !== 'object') optionsA[key] = optionsB[key];else {
          optionsA[key] = this.optionAssign(optionsA[key], optionsB[key]);
        }
      }
      return optionsA;
    }

    //生成日历样式

  }, {
    key: 'create',
    value: function create() {
      var root = this.container;
      root.innerHTML = '<div class="sc-header_top"> </div><div class="sc-header"> </div> <div class="sc-body"> </div>';
      root.style.width = this._options.width;
      root.style.height = this._options.height;
      root.className = 'sc-calendar';
      var header_top = root.querySelector('.sc-header_top');
      var header = root.querySelector('.sc-header');
      var scbody = root.querySelector('.sc-body');
      header_top.innerHTML = header_top.innerHTML + '<div class="sc-header_top">考勤记录<span class="layui-layer-setwin"><a class="layui-layer-ico layui-layer-close layui-layer-close1" href="javascript:;"></a></span></div>';
      //actions
      header.innerHTML = header.innerHTML + '<div class="sc-actions">' + '      <div class="sc-yleft">' + '        &lsaquo;</div>' + '      <select class="sc-select-year" name="">' + '      </select>' + '      <div class="sc-yright">&rsaquo;</div>' + '  </div>';
      header.innerHTML = header.innerHTML + '<div class="sc-actions">' + '    <div class="sc-mleft">' + '      &lsaquo;</div>' + '    <select class="sc-select-month" name="">' + '    </select>' + '    <div class="sc-mright">&rsaquo;</div>' + '</div>';
      //header.innerHTML = header.innerHTML + '<div class="sc-actions"><span class="sc-return-today">打卡：<span style="color:#01dacf;margin-right: 20px;" id="has_clock">0次</span>未打卡：<span style="color:#ff8a8a" id="not_clock">30次</span></span></div>';
      header.innerHTML = header.innerHTML + '<div class="sc-actions"><span class="sc-time"></span></div>';
      scbody.innerHTML = ' <div class="sc-week"> </div> <div class="sc-days"> </div>';
      var week = scbody.querySelector('.sc-week');
      var days = scbody.querySelector('.sc-days');
      for (var i = 0; i < 7; i++) {
        week.innerHTML = week.innerHTML + '<div class="sc-week-item"></div>';
      }
      for (var i = 0; i < 42; i++) {
        days.innerHTML = days.innerHTML + '<div class="sc-item"><div class="day"></div><div class="lunar-day"></div></div>';
      }
      var tyear= sessionStorage.getItem("year");
      var tmonth= sessionStorage.getItem("month");
      //添加下拉框数据
      this.updateSelect(tyear,tmonth);
      //刷新日历
      this.update(tmonth, tyear);
      //时间刷新
      self.setInterval('SimpleCalendar.timeupdate()', 200);
    }

    //刷新日历

  }, {
    key: 'update',
    value: function update() {
      var month = arguments.length <= 0 || arguments[0] === undefined ? this.tmonth : arguments[0];
      var year = arguments.length <= 1 || arguments[1] === undefined ? this.tyear : arguments[1];
      this.updateSize();
      this.updateWeek();
      this.addData(year, month);
      this.updateHoliday(year, month);
      this.updateMark(year, month);
      this.updateFestival(year, month);
      this.updateEvent();
      this.updateTheme(this._options.theme);
    }

    //调整大小

  }, {
    key: 'updateSize',
    value: function updateSize() {
      var width = arguments.length <= 0 || arguments[0] === undefined ? this._options.width : arguments[0];
      var height = arguments.length <= 1 || arguments[1] === undefined ? this._options.height : arguments[1];

      //将大小赋值给option
      this._options.width = width;
      this._options.height = height;

      this.container.style.width = width;
      this.container.style.height = height;

      //根据长度和宽度大小调整适合的样式
      if (parseInt(width) < 500) {
        var actions = this.arrayfrom(this.container.querySelectorAll('.sc-actions'));
        actions.forEach(function (v, i) {
          v.classList.add('sc-actions-big');
        });
      } else {
        var actions = this.arrayfrom(this.container.querySelectorAll('.sc-actions'));
        actions.forEach(function (v, i) {
          v.classList.remove('sc-actions-big');
        });
      }
      if (parseInt(height) < 400) {
        var items = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
        var weeks = this.arrayfrom(this.container.querySelectorAll('.sc-week-item'));
        items.forEach(function (v, i) {
          v.querySelector('.day').classList.add('sc-item-small');
        });
        weeks.forEach(function (v, i) {
          v.classList.add('sc-item-small');
        });
      } else {
        var items = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
        var weeks = this.arrayfrom(this.container.querySelectorAll('.sc-week-item'));
        items.forEach(function (v, i) {
          v.querySelector('.day').classList.remove('sc-item-small');
        });
        weeks.forEach(function (v, i) {
          v.classList.remove('sc-item-small');
        });
      }
    }

    //刷新下拉框 只有在初始化和设置语言后才会更新

  }, {
    key: 'updateSelect',
    value: function updateSelect(year, month) {
      //下拉框
      var selectYear = this.container.querySelector('.sc-select-year');
      var selectMonth = this.container.querySelector('.sc-select-month');
      selectYear.innerHTML = '';
      for (var i = this._options.timeRange.startYear; i < this._options.timeRange.endYear + 1; i++) {
        selectYear.innerHTML += '<option value="' + i + '">' + i + '</option>';
      }
      selectMonth.innerHTML = '';
      for (var i = 0; i < 12; i++) {
        var data = this.languageData['months_' + this._options.language];
        selectMonth.innerHTML += '<option value="' + (i + 1) + '">' + data[i] + '</option>';
      }

      selectYear.value = year;
      selectMonth.value = month;
    }

    //刷新星期

  }, {
    key: 'updateWeek',
    value: function updateWeek() {
      var weeks = this.arrayfrom(this.container.querySelectorAll('.sc-week-item'));
      var data = this.languageData['days_' + this._options.language];
      if (!data) {
        console.error('language error!');
      }
      weeks.forEach(function (v, i) {
        v.innerHTML = data[i];
      });
    }

    //添加阳历阴历数据

  }, {
    key: 'addData',
    value: function addData(year, month) {
      var daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
      var day = new Date(year, month - 1, 1);
      var week = day.getDay();
      if (week == 0) week = 7;

      //计算得到第一个格子的日期
      var thispageStart = new Date(Date.parse(day) - (week - 1) * 24 * 3600 * 1000);
      
      //对每一个格子遍历
      var list_time=[];
      if (month<10) {
        var month = '0'+month;
      }
      for (var i = 0; i < 42; i++) {
        daysElement[i].className = 'sc-item';
        var theday = new Date(Date.parse(thispageStart) + i * 24 * 3600 * 1000);
        var writeyear = theday.getFullYear();
        var writeday = theday.getDate();
        if (writeday<10) {
          var writeday = '0'+writeday;
        }
        var writemonth = theday.getMonth() + 1;
        if (writemonth<10) {
          var writemonth = '0'+writemonth;
        }
        if (writemonth != month) {
          daysElement[i].classList.add('sc-othermenth');
          list_time.push(daysElement[i]);
        }
        daysElement[i].querySelector('.day').innerHTML = writeday;
        //判断是否添加阴历
        if (this._options.showLunarCalendar) {
          //this._options.mark======[{data: "2018-12-10", time: "15:50:13",
          // position: "湖南省长沙市芙蓉区古曲中路642号靠近长沙银行(长沙嘉雨社区支行)",
          // location: "113.037730,28.181059;"}]
          //当天时间
          var nTime= new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
          //打卡时间的天数----17875
          
          var day_time =Math.floor(nTime/86400);
          //theday.getTime()  本月第一天
          var dayend_time=Math.floor(theday.getTime()/86400000);
          var a=[];
          var  that=this;
          //console.log(that._options.mark);
          for(var x=0;x<that._options.mark.length;x++){
            var markDay=Math.floor(new Date(this._options.mark[x].data).getTime()/86400000);
            if (dayend_time > day_time) {
              //本月还没到的时间(不包括今天)
              daysElement[i].querySelector('.lunar-day').innerHTML="";
              daysElement[i].style.backgroundColor = '#fff';
              daysElement[i].style.color = '#565555';
            }else{
                if(markDay == (dayend_time+1)){
                  //記錄已經打卡的格子
                  a.push(i);
                  //添加点击事件
                  var position=that._options.mark[x].location;
                  var data=that._options.mark[x].data+" "+that._options.mark[x].time;
                  var location=that._options.mark[x].position;
                  
                  console.log(data);
                  daysElement[i].addEventListener('click',function(){
                    
                    var add_resources='<ul class="ulText" style="width:100%;padding:20px;text-align:left;">' +
                      '<li><label>打卡时间：</label><span id="textData"></span></li>' +
                      '<li><label>地址：</label><span id="textPos"></span></li>' +
                      "<li><label>坐标：</label><input class=\"enter_map\" type=\"button\" value=\"回显位置\" onclick=\"echo_map(\'"+position+"',"+'1'+")\" style=\'width: 65px;border:none;background: #01dacf;color: #fff;\'>" +
                      '</li></ul>';     
                    layer.confirm(add_resources, {
                      title:'打卡信息',
                      type: 1,
                      closeBtn: 1, //关闭按钮
                      anim: 2,
                      skin: 'layui-layer-molv',
                      shadeClose: true, //开启遮罩关闭
                      btnAlign: 'c',
                    })
                    $("#textData").html(data);
                    $("#textPos").html(location);
                  });

                }else{
                    //console.log(dayend_time);//17874-17860
                    daysElement[i].querySelector('.lunar-day').innerHTML="未打卡";
                    daysElement[i].style.backgroundColor = '#FF8A8A';
                }
            }
           
          }
          //已经打卡的时间，添加样式
          for(var y=0;y<a.length;a++){
            daysElement[a].querySelector('.lunar-day').innerHTML="已打卡";
            daysElement[a].style.backgroundColor = '#14e16b';
            daysElement[a].style.color = '#565555';
          }

        } else {
            daysElement[i].querySelector('.lunar-day').innerHTML = '';
            daysElement[i].classList.add('item-nolunar');
        }

        //添加today样式
        if (this.tyear == writeyear && this.tday == writeday && this.tmonth == writemonth) {
          this.selectDay = daysElement[i];
          daysElement[i].classList.add("sc-today");
        }
      };
      // 总天数
      number_days=daysElement.length-list_time.length;
    }
    //刷新标记日期
  }, {
    key: 'updateMark',
    value: function updateMark(year, month) {
      var options = this._options;
      if (options.showMark) {
        var daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
        var currentmonth = month - 1;
        //取得节日数据
        var data = options.mark;
        if (data) {
          var num_leng=[];
          daysElement.forEach(function (v, i) {
            var day = +v.querySelector('.day').innerHTML;
            if (day == 1) currentmonth++;
            if (currentmonth<10) {
              var string_='0'+currentmonth.toString();
            }
            if (day<10) {
              var day='0'+day.toString();
            }
            
            if (data[year + '-' +string_ + '-' + day]) {
              num_leng.push(year + '-' +string_ + '-' + day);
              v.classList.add('sc-mark');
              v.querySelector('.lunar-day').innerHTML="<span>"+data[year + '-' + string_ + '-' + day]+"</span><br><span class=\"lunar-day_two\" data-map=\""+data[year + '-' + string_ + '-' + day+ '__']+"\"></span>";
            } else {
              v.classList.remove('sc-mark');
              v.title = '';
            }
            if (data[year + '-' +string_ + '-' + day+ '_']) {
              v.querySelector('.lunar-day_two').innerHTML="<i class=\"icon-map-marker\"></i>"+data[year + '-' +string_ + '-' + day+ '_']+"";
            } else {
              v.classList.remove('sc-mark');
              v.title = '';
            }

          });
          // 打卡天数
          var days_two =num_leng.length;
          var has_clock=number_days-days_two;
          $("#has_clock").html(days_two+"次");
          $("#not_clock").html(has_clock+"次");
        }
      }
    }

    //刷新节日数据
  }, {
    key: 'updateFestival',
    value: function updateFestival(year, month) {
      var options = this._options;
      var daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
      var currentmonth = month - 1;
      //取得节日数据
      var data = this.languageData['feativals_' + this._options.language];
      var lunardata = this.languageData['lunarFeatival_' + this._options.language];
      var solarTermdata = this.languageData['solarTerm'];
      if (!data) {
        console.error('language error!');
      }
      daysElement.forEach(function (v, i) {
        var day = +v.querySelector('.day').innerHTML;
        if (day == 1) currentmonth++;

        //24节气
        if (options.showSolarTerm) {
          if (solarTermdata[currentmonth + '-' + day]) {
            v.querySelector('.lunar-day').innerHTML = solarTermdata[currentmonth + '-' + day];
            v.classList.add('sc-festival');
          }
        }

        //国际节日
        if (options.showFestival) {
          if (data[currentmonth + '-' + day]) {
            v.querySelector('.lunar-day').innerHTML = data[currentmonth + '-' + day];
            v.classList.add('sc-festival');
          }
        }
        //阴历节日
        if (lunardata && options.showLunarFestival) {
          var lunar = new LunarHelp(year, currentmonth, day).getLunarDayNum();
          if (lunardata[lunar.month + '-' + lunar.day]) {
            v.querySelector('.lunar-day').innerHTML = lunardata[lunar.month + '-' + lunar.day];
            v.classList.add('sc-festival');
          }
        }
      });
    }

    //刷新假期 休假

  }, {
    key: 'updateHoliday',
    value: function updateHoliday(year, month) {

      var options = this._options;
      if (options.showHoliday) {
        var daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
        var currentmonth = month - 1;
        //取得节日数据
        var data = this.languageData.vocation['data_' + year];
        if (data) {
          daysElement.forEach(function (v, i) {
            var day = +v.querySelector('.day').innerHTML;
            if (day == 1) currentmonth++;
            //国际节日
            if (data.indexOf(currentmonth + '-' + day) > 0) {
              v.classList.add('sc-vocation');
            }
          });
        }
      }
    }

    //刷新主题

  }, {
    key: 'updateTheme',
    value: function updateTheme(theme) {
      if (this._options.theme.changeAble) {
        var daytheme = theme.days;
        var weektheme = theme.weeks;
        var weeks = this.arrayfrom(this.container.querySelectorAll('.sc-week-item'));
        var days = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
        weeks.forEach(function (v, i) {
          v.style.backgroundColor = weektheme.backgroundColor;
          v.style.fontSize = weektheme.fontSize;
          v.style.color = weektheme.fontColor;
        });
        days.forEach(function (v, i) {
          if (!v.classList.contains('sc-today')) {
            v.style.backgroundColor = daytheme.backgroundColor;
            v.querySelector('.day').style.color = daytheme.fontColor;
          } else {
            v.style.backgroundColor = theme.todaycolor;
          }
          v.querySelector('.day').style.fontSize = daytheme.fontSize;
        });
        var Calendar = this;
        //active border
        days.forEach(function (v, i) {
          v.onmouseover = function (e) {
            this.style.borderColor = theme.activeSelectColor;
            this.style.borderWidth = '1px';
          };
          v.onmouseout = function (e) {
            this.style.borderColor = '#F1EBE4';
            this.style.borderWidth = '0 0 1px 1px';
          };
        });
      }
    }

    //刷新事件

  }, {
    key: 'updateEvent',
    value: function updateEvent() {
      var daysElement = this.arrayfrom(this.container.querySelectorAll('.sc-item'));
      var container = this.container;
      var calendar = this;
      daysElement.forEach(function (v, i) {
        v.onmouseover = function (e) {
          this.classList.add('sc-active-day');
        };
        v.onmouseout = function (e) {
          this.classList.remove('sc-active-day');
        };
        v.onclick = function () {
          calendar.selectDay = v;
          var pre = container.querySelector('.sc-selected');
          if (pre) pre.classList.remove('sc-selected');
          this.classList.add('sc-selected');
        };
      });
      var userName=sessionStorage.getItem("kquserName");
      var tel=sessionStorage.getItem("kqusertel");
      var selectYear = container.querySelector('.sc-select-year');
      var selectMonth = container.querySelector('.sc-select-month');

      selectYear.onchange = function () {

        var m = selectMonth.value;//月
        var y = this.value;//年
        calendar.update(m, y);
        var options_this=calendar;
        report_index233(tel,userName,y,m,options_this);
      };

      selectMonth.onchange = function () {
        var y = selectYear.value;//年
        var m = this.value;//月
        calendar.update(m, y);
        var options_this=calendar;
        report_index233(tel,userName,y,m,options_this);
      };

      var yearadd = container.querySelector('.sc-yright');
      var yearsub = container.querySelector('.sc-yleft');
      var monthadd = container.querySelector('.sc-mright');
      var monthsub = container.querySelector('.sc-mleft');

      yearadd.onclick = function () {
        var currentyear = selectYear.value;
        if (currentyear < 2049) currentyear++;
        selectYear.value = currentyear;
        var currentmonth = selectMonth.value;
        
        selectMonth.value = currentmonth;
        var options_this=calendar;
        calendar.update(currentmonth, currentyear);
        var options_this=calendar;
        report_index233(tel,userName,currentyear,currentmonth,options_this);
      };
      yearsub.onclick = function () {
        var currentyear = selectYear.value;
        if (currentyear > 2000) currentyear--;
        selectYear.value = currentyear;
        var currentmonth = selectMonth.value;
        
        selectMonth.value = currentmonth;
        var options_this=calendar;
        calendar.update(currentmonth, currentyear);
        var options_this=calendar;
        report_index233(tel,userName,currentyear,currentmonth,options_this);
      };
      monthadd.onclick = function () {
        var currentmonth = selectMonth.value;
        var currentyear = selectYear.value;
        if (currentmonth < 12) currentmonth++;else {
          currentmonth = 1;
          selectYear.value = ++currentyear;
        };
        selectMonth.value = currentmonth;
        calendar.update(currentmonth, currentyear);
        var options_this=calendar;
        report_index233(tel,userName,currentyear,currentmonth,options_this);
      };
      monthsub.onclick = function () {
        var currentmonth = selectMonth.value;
        var currentyear = selectYear.value;
        if (currentmonth > 1) currentmonth--;else {
          currentmonth = 12;
          selectYear.value = --currentyear;
        }
        selectMonth.value = currentmonth;
        calendar.update(currentmonth, currentyear);
        var options_this=calendar;
        report_index233(tel,userName,currentyear,currentmonth,options_this);
      };

      /*var returntoday = container.querySelector('.sc-return-today');
      returntoday.onclick = function () {
        selectYear.value = calendar.tyear;
        selectMonth.value = calendar.tmonth;
        calendar.update();
      };*/
    }

    //添加标记

  }, {
    key: 'addMark',
    value: function addMark(day, info) {
      // this.update();
      this._options.mark[day] = info;
      
    }

    //获取用户点击的日期

  }, {
    key: 'getSelectedDay',
    value: function getSelectedDay() {
      var selectYear = this.container.querySelector('.sc-select-year').value;
      var selectMonth = this.container.querySelector('.sc-select-month').value;
      var selectDay = this.selectDay.querySelector('.day').innerHTML;
      return new Date(selectYear, selectMonth - 1, selectDay);
    }

    //设置语言

  }, {
    key: 'setLenguage',
    value: function setLenguage(language) {
      this._options.language = language;
      var selectYear = this.container.querySelector('.sc-select-year');
      var selectMonth = this.container.querySelector('.sc-select-month');
      this.updateSelect(selectYear.value, selectMonth.value);
      this.update();
    }

    //设置是否显示节日

  }, {
    key: 'showFestival',
    value: function showFestival(s) {
      this._options.showFestival = s;
      this.update();
    }

    //设置是否显示假期

  }, {
    key: 'showHoliday',
    value: function showHoliday(s) {
      this._options.showHoliday = s;
      this.update();
    }

    //设置是否显示节气

  }, {
    key: 'showSolarTerm',
    value: function showSolarTerm(s) {
      this._options.showSolarTerm = s;
      this.update();
    }

    //设置是否显示阴历节日

  }, {
    key: 'showLunarFestival',
    value: function showLunarFestival(s) {
      this._options.showLunarFestival = s;
      this.update();
    }

    //设置是否显示阴历日期

  }, {
    key: 'showLunarCalendar',
    value: function showLunarCalendar(s) {
      this._options.showLunarCalendar = s;
      this.update();
    }

    //设置是否显示标记日期

  }, {
    key: 'showMark',
    value: function showMark(s) {
      this._options.showMark = s;
      this.update();
    }
    //将nodelist转为数组

    //nodelist转数组

  }, {
    key: 'arrayfrom',
    value: function arrayfrom(nidelist) {
      var array = [];
      [].forEach.call(nidelist, function (v) {
        array.push(v);
      });
      return array;
    }

  }]);

  return SimpleCalendar;
}();
//时间刷新函数


SimpleCalendar.timeupdate = function () {
  var timespan = document.querySelectorAll('.sc-time');
  var now = new Date();
  var nh = now.getHours();
  var nm = now.getMinutes();
  var ns = now.getSeconds();
  if (nh < 10) nh = '0' + nh;
  if (nm < 10) nm = '0' + nm;
  if (ns < 10) ns = '0' + ns;
  [].forEach.call(timespan, function (v) {
    v.innerHTML = '时间：' + nh + ":" + nm + ':' + ns;
  });
};
//国际化，和一些节日数据，标记数据
SimpleCalendar.prototype.languageData = {
  feativals_CH: {
    '1-1': '元旦',
    '2-14': '情人节',
    '3-8': '妇女节',
    '3-12': '植树节',
    '4-1': '愚人节',
    '4-22': '地球日',
    '5-1': '劳动节',
    '5-4': '青年节',
    '6-1': '儿童节',
    '7-1': '建党节',
    '8-1': '建军节',
    '9-10': '教师节',
    '10-1': '国庆节',
    '12-25': '圣诞节'
  },
  feativals_EN: {
    '1-1': "new year’s day",
    '2-14': "Saint Valentine's Day",
    '3-8': 'international women’s day',
    '3-12': "Arbor Day",
    '4-1': "April Fool's Day",
    '4-22': "Earth Day",
    '5-1': "international labour day",
    '5-4': "Chinese Youth Day",
    '6-1': "Children's Day",
    '7-1': "The party's Day",
    '8-1': "the Army's Day",
    '9-10': "Teachers' Day",
    '10-1': 'National Day',
    '12-25': 'Christmas Day'
  },
  lunarFeatival_CH: {
    '1-1': '春节',
    '2-2': '龙抬头',
    '1-15': '元宵节',
    '4-4': '寒食节',
    '4-5': '清明节',
    '5-5': '端午节',
    '8-15': '中秋节',
    '9-9': '重阳节',
    '12-30': '除夕'
  },
  //节气
  solarTerm: {
    '2-3': '立春',
    '5-5': '立夏',
    '8-7': '立秋',
    '11-7': '立冬',
    '2-18': '雨水',
    '5-20': '小满',
    '8-22': '处暑',
    '11-22': '小雪',
    '3-5': '惊蛰',
    '6-5': '芒种',
    '9-7': '白露',
    '12-6': '大雪',
    '3-20': '春分',
    '6-21': '夏至',
    '9-22': '秋分',
    '12-21': '冬至',
    '4-4': '清明',
    '7-6': '小暑',
    '10-8': '寒露',
    '1-5': '小寒',
    '4-19': '谷雨',
    '7-22': '大暑',
    '10-23': '霜降',
    '1-20': '大寒'

  },
  days_EN: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  days_CH: ["一", "二", "三", "四", "五", "六", "日"],
  months_EN: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  months_CH: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
  vocation: {
    data_2016: ['1-1', '1-2', '1-3', '2-7', '2-8', '2-9', '2-10', '2-11', '2-12', '2-13', '4-2', '4-3', '4-4', '4-30', '5-1', '5-2', '6-9', '6-10', '6-11', '9-15', '9-16', '9-17',, '10-1', '10-2', '10-3', '10-4', '10-5', '10-6', '10-7']
  }
};

SimpleCalendar.prototype.tyear = new Date().getFullYear();
SimpleCalendar.prototype.tmonth = new Date().getMonth() + 1;
SimpleCalendar.prototype.tday = new Date().getDate();
// 回显点
$("#calendar").on("click",".lunar-day_two",function() {
    var lnglat=$(this).attr("data-map").split(";");
    lnglat.pop();
    layer.open({
        type: 1,
        skin: 'layui-layer-molv', //样式类名
        closeBtn: 1, //关闭按钮
        anim: 2,
        btnAlign: 'c',
        area: ['600px', '440px;'],
        title:"地图信息",
        shadeClose: true, //开启遮罩关闭
        content:"<div id=\"container\" style=\"width:600px;height:400px\"></div>",
        success:function(){
            var map = new AMap.Map("container", {
                resizeEnable: true,
                zoom:12,
            });
            var type= new AMap.MapType({
                defaultType:1,
                showRoad:true
            });
            map.addControl(type);
            for (var i = 0; i < lnglat.length; i++) {
                var marker = new AMap.Marker({
                    icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    position: JSON.parse('[' + String(lnglat[i]) + ']'),
                    map: map
                });
                marker.setMap(map);
                map.setZoomAndCenter(17, JSON.parse('[' + String(lnglat[i]) + ']'));
                map.setFitView(10);// 执行定位
            };
        }
    })  
});


function report_index233(tel,uid,year,month) {
  sessionStorage.setItem("month",month);
  sessionStorage.setItem("year",year);
  sendAjax({
      "url":"fire/on_work/getWorkListByCondition",
      "data":{"uid":uid,"year":year,"month":month},"callback":function(data){
          
          if (data.code="s_ok") {
              layer.msg('查询成功');
              var result=data.var;
              var options = {
                language: 'CH', //语言
                showLunarCalendar: true, //阴历
                showHoliday: false, //休假
                showFestival: false, //节日
                showLunarFestival: false, //农历节日
                showSolarTerm: false, //节气
                showMark: true, //标记
                time:true,
                timeRange: {
                  startYear: 2000,
                  endYear: 2049
                },
                mark:{},
              };
              sessionStorage.setItem("kquserName",uid);
              sessionStorage.setItem("kqusertel",tel);
              $(".calendar_fire").show();
              $("#calendar").show();
              // 考勤记录
              sendAjax({
                  "url":"fire/level/findLevelByCondition",
                  "data":{"current_page":1,"per_page":100,"apply_tel":tel},"callback":function(data){
                      var data=data.var.data;
                      if (data!='') {
                          for (var i = 0; i < data.length; i++) {
                              var key1=data[i].apply_start_time.substr(0,10);
                              var data1=data[i].apply_start_time.substr(0,10);
                              var key2=data[i].apply_start_time.substr(0,10)+'_';
                              var data2=data[i].apply_reason;
                              var key3=data[i].apply_start_time.substr(0,10)+'__';
                              var data3=data[i].apply_end_time.substr(0,10);

                              options.mark[key1]=data1;
                              options.mark[key2]=data2;
                              options.mark[key3]=data3;
                          };
                      }
                  }
              }) 
              // 打卡记录
              for (var i = 0; i < result.length; i++) {
                  var key1=result[i].record_date;
                  var data1=result[i].record_time;
                  var key2=result[i].record_date+'_';
                  var data2=result[i].address;
                  var key3=result[i].record_date+'__';
                  var data3=result[i].latlng;
                  options.mark[key1]=data1;
                  options.mark[key2]=data2;
                  options.mark[key3]=data3;
              };

              var myCalendar = new SimpleCalendar('#calendar',options);
          }else{
              layer.alert("网络不好，请刷新试试！", {
                skin: 'layui-layer-molv' 
                ,closeBtn: 0,anim: 4,btnAlign: 'c'
              });
          }
          
      }
  });
}