//当前时间
var myDate = new Date();
var nowYear = myDate.getFullYear();
var nowMonth = myDate.getMonth() + 1;
//跳转实时火情
function sshq(fireNumber) {
    sessionStorage.setItem("fireNumber",fireNumber);
    $("#index_main_context").load("LK_html/qjgl/hzsq.html");
    $("#index_titel").html("实时火情");
}
//跳转突发事件
function hlysb(textThing) {
    sessionStorage.setItem("textThing",textThing);
    $("#index_main_context").load("LK_html/qjgl/tfsj.html");
    $("#index_titel").html("突发事件");
}
//跳转卫星热点
function wxrd() {
    $("#index_titel").html("卫星监测热点");
    $("#index_main_context").load("lqz_satellite_hot.html");
}
// 新闻列表滚动
// function AutoScroll(obj) {
//     $(obj).animate({
//         marginTop: "-25px"
//     }, 500, function () {
//         $(this).css({ marginTop: "0px" }).find("li:last").appendTo(this);
//     });
// }
$(document).ready(function () {
    // var myar = setInterval('AutoScroll(".scroll")', 2000);
    // 加载新闻
    sendAjax({
        "url":"fire/news/getNewsByCondition",
        "data":{"per_page": 4,"current_page":1,"status":2},"callback":function(result){
            if(result.code='s_ok'){
                if (result.var.total == 0) {
                    $(".scroll").html("<li><p class=\"newslia\">当前无新闻</p></li>");
                    // clearInterval(myar);
                }else{
                    var result=result.var.data;
                    for(var i=0;i<result.length;i++){
                        $(".scroll").append("<li><p class=\"newslia\">" + result[i].title + "</p><span class=\"newslitime\">" + result[i].create_time.substr(5,5) + "</span></li>"
                        );
                        
                        $(".lunbo").append("<li><img src="+Public_address+'uploads/'+result[i].url+" onerror=\"javascript:this.src='img/timg.png'\"  class='als-item'></li>");
                        $(".lunbo_d").append("<li></li>");
                        $(".lunbo_text").append("<span>"+result[i].title+"</span>");

                        // if (result.length<4) {clearInterval(myar);}else{myar = setInterval('AutoScroll(".scroll")', 2000);}
                    };

                    // 当鼠标放上去的时候，滚动停止，鼠标离开的时候滚动开始
                    //  $(".scroll").hover(function () { clearInterval(myar); }, function () {
                    //     // if (result.length>8) {myar = setInterval('AutoScroll(".scroll")', 2000);}
                    // });
                    $(".scroll_news li").click(function() {
                        $(".scroll li").index(this);
                        article(result[index]);
                    }); 
                    var t;
                    var index =0;
                    $("#lunbobox .lunbo_d li").eq(index).addClass("on");
                    $('.lunbo li').eq(index).fadeIn(1000);
                    $('.lunbo_text span').eq(index).fadeIn(1000);
                    // 自动播放
                    t = setInterval(play, 5000);
                    function play() {
                        index++;
                        if (index > 4) {
                            index = 0
                        }

                        $("#lunbobox .lunbo_d li").eq(index).addClass("on").siblings().removeClass("on");
                        $('.lunbo li').eq(index).fadeIn(1000).siblings().fadeOut(0);
                        $('.lunbo_text span').eq(index).fadeIn(1000).siblings().fadeOut(0);
                    };
                }
            }
        },
        error:function(result){
            layer.alert("网络不好，请刷新试试！", {
              skin: 'layui-layer-molv' 
              ,closeBtn: 0,anim: 4 
            });
        }
    });
});
// 跳转文章详情
function article(result) {
    $("#index_main_context").load("lqz_typical_content.html");
    $("#index_titel").html("文章详情");
    sessionStorage.setItem("xwxq_title",result.title);
    sessionStorage.setItem("xwxq_name",result.author);
    sessionStorage.setItem("xwxq_url",Public_address+"uploads/"+result.url);
};
// 跳转新闻中心
function report_index_fh() {
    $("#index_main_context").load("lqz_news_management.html");
    $("#index_titel").html("新闻管理");
    // stopInterval();
};

//请求今日火情数接口
function today_fire(address,state, num, rates, pic, picup, picdown) {
    sendAjax({
        "url":address,
        "data":{},
        "callback":function(result){
            switch (state) {
                case 0:
                    today = result.var[0].happen_status;
                    yesterday = result.var[1].happen_status;
                    break;
                case 1:
                    today = result.var[0].trace_status;
                    yesterday = result.var[1].trace_status;
                    break;
                case 2:
                    today = result.var[0].finish_status;
                    yesterday = result.var[1].finish_status;
                    break;
                case 3:
                    today = result.var[0].count;
                    yesterday = result.var[1].count;
                    break;
                case 4:
                    today = result.var[0].other;
                    yesterday = result.var[1].other;
                    break;
                case 5:
                    today = result.var[0].fire;
                    yesterday = result.var[1].fire;
                    break;
                default:
                    break;
            }
            //数字
            $(num).html(today);

            var rate = '';
            if (yesterday == today) {
                rate = 0 + '%';
            } else if (yesterday == 0 && today !== 0) {
                rate = 100 + "%";
            } else if (yesterday > today) {
                rate = ((yesterday - today) / yesterday * 100).toFixed(2) + "%";
            } else if(yesterday < today && today == 0) {
                rate = 0 + '%';
            }else{
                rate = ((today - yesterday) / yesterday * 100).toFixed(2) + "%";
            }
            //百分比
            if(!rate){
                $(rates).html('0%');
            }else{
                $(rates).html(rate);
            }

            //图片
            if (today == yesterday || today > yesterday) {
                $(pic).css('background-image', 'url(' + picup + ')');
            } else {
                $(pic).css('background-image', 'url(' + picdown + ')');
            }
        },
        error: function(result) {
            layer.msg(result);
        }
    })
};

//统计图接口
function country_pic(url,status) {
    //月
    sendAjax({
        "url":url,
        "data":{"type":"0","status":status},
        "callback":function(result){
            if (result.code="s_ok") {
                var xArr = getDays();
                var allArr = result;
                var allData = getStaticData(xArr, allArr);
                switch (status) {
                    case 1:
                        fire_report(allData,"fire_report","火情上报数量");
                        break;
                    case 2:
                        fire_report(allData,"happing_report","火情追踪数量");
                        break;
                    case 3:
                        fire_report(allData,"out_report","火情结束数量");
                        break;
                    case 4:
                        fire_report(allData,"hotspot_report","卫星热点数量");
                        break;
                    case 5:
                        fire_report(allData,"other_report","其他情况上报数量");
                        break;
                    case 6:
                        fire_report(allData,"forest_report","护林员上报数量");
                        break;
                    default:
                        break;
                }
            }
            else{
                layer.msg(result.var)
            }
        },
        error: function(result) {
            layer.msg(result);
        }
    });
    
    //年
    sendAjax({
        "url":url,
        "data":{"type":"1","status":status},
        "callback":function(result){
            if (result.code="s_ok") {
                var allData = getYearData(result);
                switch (status) {
                    case 1:
                    fire_report_year(allData,"fire_report_year","火情上报数量");
                        break;
                    case 2:
                    fire_report_year(allData,"happing_report_year","火情追踪数量");
                        break;
                    case 3:
                    fire_report_year(allData,"out_report_year","火情结束数量");
                        break;
                    case 4:
                    fire_report_year(allData,"hotspot_report_year","卫星热点数量");
                        break;
                    case 5:
                    fire_report_year(allData,"other_report_year","其他情况上报数量");
                        break;
                    case 6:
                    fire_report_year(allData,"forest_report_year","护林员上报数量");
                        break;
                    default:
                        break;
                }
            }
            else{
                layer.msg(result.var)
            }
        },
        error: function(result) {
            layer.msg(result);
        }
    }); 
};
country_pic('fire/fire/countFire',1);
function country_pic_two(url,status) {
    //月
    sendAjax({
        "url":url,
        "data":{"type":"0","status":status},
        "callback":function(result){
            if (result.code="s_ok") {
                var xArr = getDays();
                var allArr = result;
                var allData = getStaticData(xArr, allArr);
                switch (status) {
                    case 1:
                        fire_report(allData,"other_report","其他情况上报数量");
                        break;
                    case 0:
                        fire_report(allData,"forest_report","护林员上报数量");
                        break;
                    default:
                        break;
                }
            }
            else{
                layer.msg(result.var)
            }
        },
        error: function(result) {
            layer.msg(result);
        }
    });
    
    //年
    sendAjax({
        "url":url,
        "data":{"type":"1","status":status},
        "callback":function(result){
            if (result.code="s_ok") {
                var allData = getYearData(result);
                switch (status) {
                    case 1:
                    fire_report_year(allData,"other_report_year","其他情况上报数量");
                        break;
                    case 0:
                    fire_report_year(allData,"forest_report_year","护林员上报数量");
                        break;
                    default:
                        break;
                }
            }
            else{
                layer.msg(result.var)
            }
        },
        error: function(result) {
            layer.msg(result);
        }
    }); 
};

//今日市县上报火情数量
today_fire('fire/fire/getTodayFire',0, '.middle_num1', '.rate1', '.topBox1', 'img/wj/up1.png', 'img/wj/down1.png');
//今日正在发生的火情
today_fire('fire/fire/getTodayFire',1, '.middle_num5', '.rate5', '.topBox5', 'img/wj/up2.png', 'img/wj/down2.png');
//今日已扑灭的火情
today_fire('fire/fire/getTodayFire',2, '.middle_num6', '.rate6', '.topBox6', 'img/wj/up3.png', 'img/wj/down3.png');
//其他情况上报
today_fire('fire/fire/getTodayReportData',4,'.middle_num4', '.rate4', '.topBox4', 'img/wj/up1.png', 'img/wj/down1.png');
//今日护林员上报火情
today_fire('fire/fire/getTodayReportData',5,'.middle_num2', '.rate2', '.topBox2', 'img/wj/up2.png', 'img/wj/down2.png');
//今日卫星监测热点发布火情
today_fire('fire/fire/getTodayHot',3,'.middle_num3', '.rate3', '.topBox3', 'img/wj/up3.png', 'img/wj/down3.png');

//每月统计图
function fire_report(allArr,id,name) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(id));
    var arr = getDays();
    option = {
        title: {
            text: nowYear + "年" + nowMonth + "月" + name + "统计图",
            left: '38%'
        },
        tooltip: {
            trigger: 'item',
            axisPointer: { // 坐标指示器
                type: 'cross', // 类型 line:直线指示器  'shadow' 阴影指示器 'cross' 十字准星指示器
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            formatter: function(params) {
                var item = allArr.showdata[params.dataIndex];
                var res =
                    '<div>' + nowYear + "年" + nowMonth + "月" + params.name + "日总计" + params.data + "起" +
                    '<p>长沙市（本区域）:<span style="color:#f91b0e;">' + item.changsha + '</span>起</p>' +
                    '<p>株洲市（本区域）:<span style="color:#f91b0e;">' + item.zhuzhou + '</span>起</p>' +
                    '<p>湘潭市（本区域）:<span style="color:#f91b0e;">' + item.xiangtan + '</span>起</p>' +
                    '<p>衡阳市（本区域）:<span style="color:#f91b0e;">' + item.henyang + '</span>起</p>' +
                    '<p>邵阳市（本区域）:<span style="color:#f91b0e;">' + item.shaoyang + '</span>起</p>' +
                    '<p>岳阳市（本区域）:<span style="color:#f91b0e;">' + item.yueyang + '</span>起</p>' +
                    '<p>常德市（本区域）:<span style="color:#f91b0e;">' + item.changde + '</span>起</p>' +
                    '<p>张家界市（本区域）:<span style="color:#f91b0e;">' + item.zhangjiajie + '</span>起</p>' +
                    '<p>益阳市（本区域）:<span style="color:#f91b0e;">' + item.yiyang + '</span>起</p>' +
                    '<p>永州市（本区域）:<span style="color:#f91b0e;">' + item.yongzhou + '</span>起</p>' +
                    '<p>郴州市（本区域）:<span style="color:#f91b0e;">' + item.chengzhou + '</span>起</p>' +
                    '<p>怀化市（本区域）:<span style="color:#f91b0e;">' + item.huaihua + '</span>起</p>' +
                    '<p>娄底市（本区域）:<span style="color:#f91b0e;">' + item.loudi + '</span>起</p>' +
                    '<p>湘西自治州（本区域）:<span style="color:#f91b0e;">' + item.xiangxi + '</span>起</p></div>';
                return res;
            }
        },
        xAxis: {
            type: 'category',
            data: arr,
            name: "时间"
        },
        yAxis: {
            type: 'value',
            name: "事件数量(起)"
        },
        series: [{
            data: allArr.data,
            type: 'line'
        }],
        toolbox: {
            show: true,
            x:'950',
            feature: {
                saveAsImage: {
            　　　　show: true,
            　　　　xcludeComponents: ['toolbox'],
            　　　　pixelRatio: 2
            　　}
            }
        }
    };
    myChart.setOption(option);

};
//每年统计图
function fire_report_year(allArr,id,name) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(id));
    option = {
        title: {
            text: nowYear + "年"+name+"统计图",
            left: '38%'
        },
        tooltip: {
            trigger: 'item',
            axisPointer: { // 坐标指示器
                type: 'cross', // 类型 line:直线指示器  'shadow' 阴影指示器 'cross' 十字准星指示器
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            formatter: function(params) {
                var item = allArr.showdata[params.dataIndex];
                console.log(item);
                var res =
                    '<div>' + nowYear + "年" + params.name + "月总计" + params.data + "起" +
                    '<p>长沙市:<span style="color:#f91b0e;">' + item.changsha + '</span>起</p>' +
                    '<p>株洲市:<span style="color:#f91b0e;">' + item.zhuzhou + '</span>起</p>' +
                    '<p>湘潭市:<span style="color:#f91b0e;">' + item.xiangtan + '</span>起</p>' +
                    '<p>衡阳市:<span style="color:#f91b0e;">' + item.henyang + '</span>起</p>' +
                    '<p>邵阳市:<span style="color:#f91b0e;">' + item.shaoyang + '</span>起</p>' +
                    '<p>岳阳市:<span style="color:#f91b0e;">' + item.yueyang + '</span>起</p>' +
                    '<p>常德市:<span style="color:#f91b0e;">' + item.changde + '</span>起</p>' +
                    '<p>张家界市:<span style="color:#f91b0e;">' + item.zhangjiajie + '</span>起</p>' +
                    '<p>益阳市:<span style="color:#f91b0e;">' + item.yiyang + '</span>起</p>' +
                    '<p>永州市:<span style="color:#f91b0e;">' + item.yongzhou + '</span>起</p>' +
                    '<p>郴州市:<span style="color:#f91b0e;">' + item.chengzhou + '</span>起</p>' +
                    '<p>怀化市:<span style="color:#f91b0e;">' + item.huaihua + '</span>起</p>' +
                    '<p>娄底市:<span style="color:#f91b0e;">' + item.loudi + '</span>起</p>' +
                    '<p>湘西自治州:<span style="color:#f91b0e;">' + item.xiangxi + '</span>起</p></div>';
                return res;
            }
        },
        xAxis: {
            type: 'category',
            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            name: "时间"
        },
        yAxis: {
            type: 'value',
            name: "事件数量(起)"
        },
        series: [{
            data: allArr.data,
            type: 'line'
        }],
        toolbox: {

            　　
            show: true,
            x:'950',
            feature: {

                　　　　 saveAsImage: {

                    　　　　 show: true,

                    　　　　excludeComponents: ['toolbox'],

                    　　　　pixelRatio: 2

                    　　　　 }　　 }

        }
    };
    myChart.setOption(option);
};


//点击出现相应的统计图
$('.lookCount1').click(function() {
    $('.count1').css('display', 'block');
    $('.count1').siblings().css('display', 'none');
    country_pic('fire/fire/countFire',1);
});
$('.lookCount5').click(function() {
    $('.count5').css('display', 'block');
    $('.count5').siblings().css('display', 'none');
    country_pic('fire/fire/countFire',2);
});
$('.lookCount6').click(function() {
    $('.count6').css('display', 'block');
    $('.count6').siblings().css('display', 'none');
    country_pic('fire/fire/countFire',3);
});
$('.lookCount3').click(function() {
    $('.count3').css('display', 'block');
    $('.count3').siblings().css('display', 'none');
    country_pic('fire/fire/countHot',4);
});
$('.lookCount2').click(function() {
    $('.count2').css('display', 'block');
    $('.count2').siblings().css('display', 'none');
    country_pic_two('fire/fire/countReportData',0);
});
$('.lookCount4').click(function() {
    $('.count4').css('display', 'block');
    $('.count4').siblings().css('display', 'none');
    country_pic_two('fire/fire/countReportData',1);
});

//每月天数
function getDays() {
    //构造当前日期对象
    var date = new Date();

    //获取年份
    var year = date.getFullYear();

    //获取当前月份
    var mouth = date.getMonth() + 1;

    //定义当月的天数；
    var days;

    //当月份为二月时，根据闰年还是非闰年判断天数
    if (mouth == 2) {
        days = year % 4 == 0 ? 29 : 28;
    } else if (mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12) {
        //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
        days = 31;
    } else {
        //其他月份，天数为：30.
        days = 30;
    }
    var riqi = [];
    for (var i = 1; i <= days; i++) {
        riqi.push(i);
    }
    return riqi;
};
//每月统计数据
function monthNum(changsha, zhuzhou, xiangtan, henyang, shaoyang, yueyang, changde, zhangjiajie, yiyang, yongzhou, chengzhou, huaihua, loudi, xiangxi) {
    this.changsha = changsha;
    this.zhuzhou = zhuzhou;
    this.xiangtan = xiangtan;
    this.henyang = henyang;
    this.shaoyang = shaoyang;
    this.yueyang = yueyang;
    this.changde = changde;
    this.zhangjiajie = zhangjiajie;
    this.yiyang = yiyang;
    this.yongzhou = yongzhou;
    this.chengzhou = chengzhou;
    this.huaihua = huaihua;
    this.loudi = loudi;
    this.xiangxi = xiangxi;
};
//每年统计数据
function yearNum(changsha, zhuzhou, xiangtan, henyang, shaoyang, yueyang, changde, zhangjiajie, yiyang, yongzhou, chengzhou, huaihua, loudi, xiangxi) {
    this.changsha = changsha;
    this.zhuzhou = zhuzhou;
    this.xiangtan = xiangtan;
    this.henyang = henyang;
    this.shaoyang = shaoyang;
    this.yueyang = yueyang;
    this.changde = changde;
    this.zhangjiajie = zhangjiajie;
    this.yiyang = yiyang;
    this.yongzhou = yongzhou;
    this.chengzhou = chengzhou;
    this.huaihua = huaihua;
    this.loudi = loudi;
    this.xiangxi = xiangxi;
};

//每月统计数据解析
function getStaticData(xArr, allArr) {
    var staticData = { showdata: [], data: [] };
    var static = allArr.var;
    for (var j = 0; j < xArr.length; j++) {
        var flag = true;
        var obj = null;
        //每个地区的数量
        var pic_area = {
            changsha: 0,
            zhuzhou: 0,
            xiangtan: 0,
            henyang: 0,
            shaoyang: 0,
            yueyang: 0,
            changde: 0,
            zhangjiajie: 0,
            yiyang: 0,
            yongzhou: 0,
            chengzhou: 0,
            huaihua: 0,
            loudi: 0,
            xiangxi: 0
        };
        for (var h = 0; h < static.length; h++) {
            if (xArr[j] == static[h].time.split("-")[2]) {
                flag = false;
                staticData.data.push(static[h].count);
                var staric = static[h].obj;
                for (var i = 0; i < staric.length; i++) {
                    switch (staric[i].name) {
                        case "长沙市":
                            pic_area.changsha = staric[i].count;
                            break;
                        case "株洲市":
                            pic_area.zhuzhou = staric[i].count;
                            break;
                        case "湘潭市":
                            pic_area.xiangtan = staric[i].count;
                            break;
                        case "衡阳市":
                            pic_area.henyang = staric[i].count;
                            break;
                        case "邵阳市":
                            pic_area.shaoyang = staric[i].count;
                            break;
                        case "岳阳市":
                            pic_area.yueyang = staric[i].count;
                            break;
                        case "常德市":
                            pic_area.changde = staric[i].count;
                            break;
                        case "张家界市":
                            pic_area.zhangjiajie = staric[i].count;
                            break;
                        case "益阳市":
                            pic_area.yiyang = staric[i].count;
                            break;
                        case "永州市":
                            pic_area.yongzhou = staric[i].count;
                            break;
                        case "郴州市":
                            pic_area.chengzhou = staric[i].count;
                            break;
                        case "怀化市":
                            pic_area.huaihua = staric[i].count;
                            break;
                        case "娄底市":
                            pic_area.loudi = staric[i].count;
                            break;
                        case "湘西自治州":
                            pic_area.xiangxi = staric[i].count;
                            break;
                    }
                    obj = new monthNum(pic_area.changsha, pic_area.zhuzhou, pic_area.xiangtan, pic_area.henyang, pic_area.shaoyang, pic_area.yueyang, pic_area.changde, pic_area.zhangjiajie, pic_area.yiyang, pic_area.yongzhou, pic_area.chengzhou, pic_area.huaihua, pic_area.loudi, pic_area.xiangxi);
                }
            }
        }
        if (flag) {
            staticData.data.push(0);
            obj = new monthNum(pic_area.changsha, pic_area.zhuzhou, pic_area.xiangtan, pic_area.henyang, pic_area.shaoyang, pic_area.yueyang, pic_area.changde, pic_area.zhangjiajie, pic_area.yiyang, pic_area.yongzhou, pic_area.chengzhou, pic_area.huaihua, pic_area.loudi, pic_area.xiangxi);
        }
        staticData.showdata.push(obj);
    }
    return staticData;
};
//每年统计数据解析
function getYearData(allArr) {
    var staticData = { showdata: [], data: [] };
    var static = allArr.var;
    var xArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    for (var j = 0; j < xArr.length; j++) {
        var flag = true;
        var obj = null;
        //每个地区的数量
        var pic_area = {
            changsha: 0,
            zhuzhou: 0,
            xiangtan: 0,
            henyang: 0,
            shaoyang: 0,
            yueyang: 0,
            changde: 0,
            zhangjiajie: 0,
            yiyang: 0,
            yongzhou: 0,
            chengzhou: 0,
            huaihua: 0,
            loudi: 0,
            xiangxi: 0
        };
        for (var h = 0; h < static.length; h++) {
            if (xArr[j] == static[h].time.split("-")[1]) {
                flag = false;
                staticData.data.push(static[h].count);
                var staric = static[h].obj;
                for (var i = 0; i < staric.length; i++) {
                    switch (staric[i].name) {
                        case "长沙市":
                            pic_area.changsha += staric[i].count;
                            break;
                        case "株洲市":
                            pic_area.zhuzhou += staric[i].count;
                            break;
                        case "湘潭市":
                            pic_area.xiangtan += staric[i].count;
                            break;
                        case "衡阳市":
                            pic_area.henyang += staric[i].count;
                            break;
                        case "邵阳市":
                            pic_area.shaoyang += staric[i].count;
                            break;
                        case "岳阳市":
                            pic_area.yueyang += staric[i].count;
                            break;
                        case "常德市":
                            pic_area.changde += staric[i].count;
                            break;
                        case "张家界市":
                            pic_area.zhangjiajie += staric[i].count;
                            break;
                        case "益阳市":
                            pic_area.yiyang += staric[i].count;
                            break;
                        case "永州市":
                            pic_area.yongzhou += staric[i].count;
                            break;
                        case "郴州市":
                            pic_area.chengzhou += staric[i].count;
                            break;
                        case "怀化市":
                            pic_area.huaihua += staric[i].count;
                            break;
                        case "娄底市":
                            pic_area.loudi += staric[i].count;
                            break;
                        case "湘西自治州":
                            pic_area.xiangxi += staric[i].count;
                            break;
                    }
                    obj = new monthNum(pic_area.changsha, pic_area.zhuzhou, pic_area.xiangtan, pic_area.henyang, pic_area.shaoyang, pic_area.yueyang, pic_area.changde, pic_area.zhangjiajie, pic_area.yiyang, pic_area.yongzhou, pic_area.chengzhou, pic_area.huaihua, pic_area.loudi, pic_area.xiangxi);
                }
            }
        }
        if (flag) {
            staticData.data.push(0);
            obj = new monthNum(pic_area.changsha, pic_area.zhuzhou, pic_area.xiangtan, pic_area.henyang, pic_area.shaoyang, pic_area.yueyang, pic_area.changde, pic_area.zhangjiajie, pic_area.yiyang, pic_area.yongzhou, pic_area.chengzhou, pic_area.huaihua, pic_area.loudi, pic_area.xiangxi);
        }
        staticData.showdata.push(obj);
    }
    return staticData;
};


//每年每月切换
function change_day(dayPic, dayBtn, yearPic, yearBtn) {
    $(dayPic).css('display', 'block');
    $(dayBtn).css('background-color', '#addc9d');
    $(dayBtn).css('color', '#fff');
    $(yearPic).css('display', 'none');
    $(yearBtn).css('background-color', '#fff');
    $(yearBtn).css('color', '#000');
};

function change_year(dayPic, dayBtn, yearPic, yearBtn) {
    $(yearPic).css('display', 'block');
    $(dayBtn).css('background-color', '#fff');
    $(dayBtn).css('color', '#000');
    $(dayPic).css('display', 'none');
    $(yearBtn).css('background-color', '#addc9d');
    $(yearBtn).css('color', '#fff');
};