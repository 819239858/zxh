var map;var iCount;ruler1='';ruler2=''; //地图主体
// 获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var Hours=date.getHours();
    var Minutes=date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (Hours >= 0 && Hours <= 9) {
        Hours = "0" + Hours;
    }
    if (Minutes >= 0 && Minutes <= 9) {
        Minutes = "0" + Minutes;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate+ " " + Hours + seperator2 + Minutes
    return currentdate;
}
$(function() {
    //用户管理
    var s_uid = sessionStorage.getItem("s_uid"); 
    s_uid!=null?s_uid:location.href = '/HNLYT/index2.html';
    var user = sessionStorage.getItem("name");
    var city= sessionStorage.getItem("city");
    var character= sessionStorage.getItem("userLevel");
    if (character=="3") {
        character="超级管理员";
    }else if(character=="1") {
        character="普通用户";
        $("#user_").hide();
    }else{
        character="管理员";
    }
    $("#user_user span").html(city+'-'+character+'：'+user);
    $("#mobile_app_download").click(function() {
        var app="<div class='styleCss' style='display:inline-block;margin-right:25px'><img src='img/apk/hunan/apk/hly_php.png' style='width: 195px'><p>护林员APP</p><p>版本号：1.05</p><p>更新日期：2018-12-6</p>" +
            "</div><div class=\"styleCss\" style='display:inline-block;margin-right:25px'><img src='img/apk/hunan/apk/xfy_php.png' style='width: 195px'><p>消防员APP</p><p>版本号：1.05</p><p>更新日期：2018-12-6</p></div>"+
            "<div class=\"styleCss\" style='display:inline-block;margin-right:20px'><img src='img/apk/hunan/apk/wrj_php.png' style='width: 195px'><p>无人机APP</p><p>版本号：1.05</p><p>更新日期：2018-11-8</p></div>";
        layer.alert(app, {
            skin: 'layui-layer-molv',title:'APP下载'
            ,closeBtn: 0,anim: 4,btnAlign: 'c',area:['800px','350px']
        });
    });
    // 页面加载
    $("#index_main_context").load("wj_dataView.html");
    $("#index_titel").html("数据概况");
    $(".side-menu li:first-child").addClass("open");
    sessionStorage.removeItem('hidebtn');

    $("#menu_7_141").click(function() {
        $("#index_main_context").load("wj_dataView.html");
        $("#index_titel").html("数据概况");
        stopInterval();
    });
    // 数据概况
    $("#menu_1_1").click(function() {
        $("#index_titel").html("数据概况");
        $("#index_main_context").load("wj_dataView.html");
        stopInterval();
    });
    //网上办公
    $("#menu_7_1").click(function(){
        $("#index_main_context").load("wj_document.html");
        $("#index_titel").html("公文管理");
        stopInterval();
    });
    $("#menu_7_2").click(function(){
        $("#index_main_context").load("wj_mail.html");
        $("#index_titel").html("邮件管理");
        stopInterval();
    });
    $("#menu_7_3").click(function(){
        $("#index_main_context").load("wj_phone.html");
        $("#index_titel").html("内部通讯录");
        stopInterval();
    });
    $("#menu_7_4").click(function(){
        window.open("http://www.slfh.gov.cn/");
        // $("#index_main_context").load("wj_forestInternet.html");
        // $("#index_titel").html("中国森林防火网");
        // stopInterval();
    });
    //湖南省森林防火预警系统
    $("#menu_7_10").click(function () {
        window.open("http://119.39.124.66/FireForecast/Account/Login?ReturnUrl=/fireforecast");
    });
    $("#menu_7_5").click(function(){
        $("#index_main_context").load("wj_huInternet.html");
        var address=localStorage.getItem('setAllAddress');
        $("#index_titel").html(address+"林业厅官网");
        stopInterval();
    });
    $("#menu_7_6").click(function(){
        $("#index_main_context").load("lqz_newsManagement.html");
        $("#index_titel").html("新闻管理");
        stopInterval();
    });
    //任务管理 航空
    $("#menu_4_1").click(function() {
        $("#index_main_context").load("Aviation_Mission.html");
        $("#index_titel").html("航空监测任务");
        stopInterval();
    });
    //任务管理 地面
    $("#menu_4_2").click(function() {
        $("#index_main_context").load("Personnel_Mission.html");
        $("#index_titel").html("地面巡护任务");
        stopInterval();

    });
    // 卫星监测热点
    $("#menu_2_2").click(function() {
        $("#index_titel").html("卫星监测热点");
        $("#index_main_context").load("lqz_satellite_hot.html");
        stopInterval();
    });

    //轨迹回放
    $("#menu_2_4").click(function() {
        $("#index_main_context").load("LK_html/qjgl/gjhf.html");
        $("#index_titel").html("轨迹回放");
        stopInterval();
    });
    // 无人机上报数据
    $("#menu_2_7").click(function() {
        $("#index_main_context").load("LK_html/qjgl/wrjsb.html");
        $("#index_titel").html("无人机上报数据");
        stopInterval();
    });
    //森林火险及气象预报
    $("#menu_2_8").click(function() {
        $("#index_main_context").load("wj_weather.html");
        $("#index_titel").html("森林火险及气象预报");
        stopInterval();
    });
    // 火灾实情
    $("#menu_2_6").click(function() {
        $("#index_main_context").load("LK_html/qjgl/hzsq.html");
        $("#index_titel").html("实时火情");
        stopInterval();

    });
    //终端在线情况
    $("#menu_2_1").click(function() {
        $("#index_titel").html("终端在线情况");
        $("#index_main_context").load("LK_html/qjgl/zdzxqk.html");
    });
    // 突发事件
    $("#menu_2_3").click(function() {
        $("#index_main_context").load("LK_html/qjgl/tfsj.html");
        $("#index_titel").html("突发事件");
        //隐藏地图
        stopInterval();
    });
    //地面监控点
    $("#menu_2_5").click(function() {
        $("#index_main_context").load("LK_html/qjgl/dmjkd.html");
        $("#index_titel").html("地面监控点");
        //隐藏地图
        stopInterval();
    });

    //	火灾现场分时图
    $("#menu_6_1").click(function() {
        $("#index_titel").html("火灾现场分时图");
        $("#index_main_context").load("lqz_fbt.html");
        // showAllUsers();
        stopInterval();
    });
    $("#menu_6_2").click(function() {
        $("#index_titel").html("扑火指挥");
        $("#index_main_context").load("lqz_command.html");
        stopInterval();
    });
    $("#menu_3_1").click(function() {
        $("#index_main_context").load("wj_fireInfoList.html");
        $("#index_titel").html("火情信息");
        stopInterval();
    });
    //火灾查询
    $("#menu_3_2").click(function() {
        $("#index_main_context").load("fire_search_table.html");
        $("#index_titel").html("火情查询");
        stopInterval();
    });
    // 数据统计
    $("#menu_3_3").click(function() {
        $("#index_main_context").load("ld_fireStatic.html");
        $("#index_titel").html("数据统计");
        stopInterval();
    });
    // 火情分布图
    $("#menu_3_4").click(function() {
        $("#index_main_context").load("lqz_hqfbt.html");
        $("#index_titel").html("火情分布图");
        stopInterval();
    });
    // 任务管理-数据统计
    $("#menu_4_3").click(function() {
        $("#index_main_context").load("ld_taskStatic.html");
        $("#index_titel").html("数据统计");
        stopInterval();
    });
    //森林消防资源分布
    $("#menu_5_1").click(function() {
        $("#index_main_context").load("wj_resourcesOffice.html");
        $("#index_titel").html("防火办公室");
        stopInterval();
    });
    $("#menu_5_2").click(function() {
        $("#index_main_context").load("wj_fireMaterial.html");
        $("#index_titel").html("物资储备库");
        stopInterval();
    });
    $("#menu_5_3").click(function() {
        $("#index_main_context").load("wj_fireTower.html");
        $("#index_titel").html("瞭望塔");
        stopInterval();
    });
    $("#menu_5_4").click(function() {
        $("#index_main_context").load("ld_forestFireTeam.html");
        $("#index_titel").html("消防队伍");
        stopInterval();
    });
    $("#menu_5_5").click(function() {
        $("#index_main_context").load("ld_forestFirebarrier.html");
        $("#index_titel").html("防火隔离带");
        stopInterval();
    });
    $("#menu_5_6").click(function() {
        $("#index_main_context").load("wj_fireDistribution.html");
        $("#index_titel").html("分布示意图");
        stopInterval();
    });
    // 护林员管理
    $("#menu_8_1").click(function() {
        $("#index_main_context").load("lqz_hly_basic.html");
        $("#index_titel").html("护林员基本资料");
        stopInterval();
    });
    $("#menu_8_2").click(function() {
        $("#index_main_context").load("lqz_hly_positioning.html");
        $("#index_titel").html("人员在线定位");
        stopInterval();
    });
    $("#menu_8_3").click(function() {
        $("#index_main_context").load("lqz_hly_trajectory.html");
        $("#index_titel").html("历史轨迹");
        stopInterval();
    });
    $("#menu_8_4").click(function() {
        $("#index_main_context").load("lqz_hly_statistical.html");
        $("#index_titel").html("上报数据");
        stopInterval();
    });
    $("#menu_8_5").click(function() {
        $("#index_main_context").load("lqz_hly_report.html");
        $("#index_titel").html("任务完成统计");
        stopInterval();
    });
    $("#menu_8_6").click(function() {
        $("#index_main_context").load("lqz_performance.html");
        $("#index_titel").html("绩效数据导出");
        stopInterval();
    });
    // 请假明细
    $("#menu_8_7").click(function() {
        $("#index_main_context").load("lqz_drawing.html");
        $("#index_titel").html("请假明细");
        stopInterval();
    });
    // 典型案例
    $("#menu_9").click(function() {
        $("#index_main_context").load("lqz_typical_cases.html");
        $("#index_titel").html("典型案例");
        stopInterval();
    });
    // 灾害评估灾害评估
    $("#menu_9_1").click(function() {
        $("#index_main_context").load("lqz_hazard_assessment.html");
        $("#index_titel").html("灾害评估");
        stopInterval();
    });
    // 用户管理
    $("#menu_10_1").click(function() {
        $("#index_main_context").load("lqz_background_user.html");
        $("#index_titel").html("后台用户");
        //隐藏地图
        stopInterval();
    });
    $("#menu_10_2").click(function() {
        $("#index_main_context").load("lqz_the_ranger_user.html");
        $("#index_titel").html("护林员用户");
        //隐藏地图
        stopInterval();
    });
    $("#menu_10_3").click(function() {
        $("#index_main_context").load("lqz_uav_user.html");
        $("#index_titel").html("无人机用户");
        //隐藏地图
        stopInterval();
    });
    $("#menu_10_4").click(function() {
        $("#index_main_context").load("lqz_firefighters_user.html");
        $("#index_titel").html("消防员用户");
        //隐藏地图
        stopInterval();
    });
    $("#menu_10_5").click(function() {
        $("#index_main_context").load("lqz_manned_user.html");
        $("#index_titel").html("载人机用户");
        //隐藏地图
        stopInterval();
    });
    /**
     * 历史视频数据
     */
    $("#hitstory_video").click(function() {
        $("#index_titel").html("历史视频数据");
        $("#index_main_context").load("lqz_video_list.html");
        //隐藏地图
        stopInterval();
    });
});

function sanweiMarkerClick(marker, id) {
    AMap.event.addListener(marker, 'click', function() {
        if (id == 0) {
            $("#index_main_context").load("taoyuan.jsp");
        } else if (id == 1) {
            $("#index_main_context").load("lanshan.jsp");
        } else if (id == 2) {
            $("#index_main_context").load("huoshizhen.jsp");
        } else if (id == 3) {
            $("#index_main_context").load("alpk.jsp");
        }
    });
}

function showAllUsers() {
    $("#input_hot").attr("style", "display: none");
    stopInterval();
    //设置地图的高度
    $("#map_div").attr("style", "width: 100%;height: 100%; position: absolute;bottom: 0px;");
    $(".tableDiv_fire").hide();
    
}
/**
 * 停止更新数据
 */
function stopInterval() {
    $("#wsbg ul").hide();
    $("#yqlj ul").hide();
    layer.closeAll();
    clearInterval(iCount);
}

// 城市区请求
function callback(id, e) {
    var dom = $(e).next();
    sendAjax({
        "url":"fire/region/getRegion",
        "data":{"parentId":id},
        "callback":function(data){
            $(dom).children('option').remove();
            $(dom).next("#area").children('option').remove();
            $(dom).next("#area_sx").children('option').remove();
            $(dom).next("#village").children('option').remove();
            $(dom).append("<option></option>");
            if (data.code=="s_ok") {
                $.each(data.var, function(i, element) {
                    var op = $("<option></option>").attr({ 'value': element.id, }).html(element.name);
                    $(dom).append(op);
                });
            }
        },
        error: function(e) {
            layer.msg("错误！！");
        }
    });
}
//开场调用的--设置区域名称
function returnDer(id,set) {
    sendAjax({
        "url":"fire/region/getRegion",
        "data":{"parentId":id},
        "callback":function(data){
            if (data.code=="s_ok") {
                for(var i=0;i<data.var.length;i++){
                    var op = $("<option></option>").attr({ 'value': data.var[i].id, }).html(data.var[i].name);
                    $(set).append(op);
                }
            }
        },
        error: function(e) {
            layer.msg("错误！！");
        }
    })
}

//查询权限
function callback1() {
    var region= sessionStorage.getItem("region");
    var character = sessionStorage.getItem("userLevel");
    console.log(region,character)
    if (character!='3'&&region!='43') {
        $("#province option[value='" + region+ "']").prop("selected", "selected").parent().css("background-color","#f2f2f2").prop("disabled", "disabled");
        $("#hot_city option[value='" + region+ "']").prop("selected", "selected").parent().css("background-color","#f2f2f2").prop("disabled", "disabled");
        $("#fireArea option[value='" + region+ "']").prop("selected", "selected").parent().css("background-color","#f2f2f2").prop("disabled", "disabled");
        $("#province").change();$("#hot_city").change();$("#fireArea").change();
        if (region.length>4){
            $("#city option[value='" + region+ "']").prop("selected", "selected").parent().css("background-color","#f2f2f2").prop("disabled", "disabled");
            $("#city_sx option[value='" + region+ "']").prop("selected", "selected").parent().css("background-color","#f2f2f2").prop("disabled", "disabled");
            $("#city_two option[value='" + region+ "']").prop("selected", "selected").parent().css("background-color","#f2f2f2").prop("disabled", "disabled");
            $("#city").change();$("#city_sx").change();$("#city_two").change();
        }else if(region.length>6){
            $("#area option[value='" +region+ "']").prop("selected", "selected");
            $("#village option[value='" +region+ "']").prop("selected", "selected");
            $("#area_sx option[value='" +region+ "']").prop("selected", "selected");
        }
    }
}

//渲染城市范围线
function addBeiJing(city) {
    var city= sessionStorage.getItem("liveCity");
    // console.log(city);
    if (city=='43'||city==''||city=='省'||city==undefined) {city='湖南省'}
    if (city=='湘西自治州') {city='土家族苗族自治州'}
    //加载云图层插件
    AMap.service('AMap.DistrictSearch', function() {
        var opts = {
            subdistrict:2,   //返回下一级行政区
            extensions: 'all',  //返回行政区边界坐标组等具体信息
            level: 'district'      //查询行政级别为 市
        };
        //实例化DistrictSearch
        district = new AMap.DistrictSearch(opts);
        district.setLevel('district');
    
    //行政区查询=====显示登陆者的行政区域以下等级的行政区域,先查询出所有的城市，再划线
    district.search(city, function(status, result) {
        var list=result.districtList[0].districtList;
        for(var i=0;i<list.length;i++){
            district.search(list[i].name, function(status, element) {
                var bounds = element.districtList[0].boundaries; //一个城市的坐标点集合 districtList
                var polygons = [];
                if (bounds) {
                    for (var i = 0, l = bounds.length; i < l; i++) {
                        //随机红色
                        var gb = Math.random() * 150 + 50;
                        var a = 'rgb(255,' + gb + ',' + gb + ')';
                        //生成行政区划polygon
                        var polygon = new AMap.Polygon({
                            map: map,
                            strokeWeight: 2,
                            path: bounds[i],
                            fillOpacity: 0.01,
                            fillColor: '#fff',
                            //strokeColor: 'red'
                            strokeColor: a
                        });
                        polygons.push(polygon);
                    }
                    // map.setFitView();//地图自适应
                }
            })
        }
    });
});
        //行政区查询=====只显示登陆者的行政区域范围
        // district.search(city, function(status, result) {
        //     console.log(result.districtList[0].districtList);
        //
        //     var bounds = result.districtList[0].boundaries; //一个城市的坐标点集合 districtList
        //     var polygons = [];
        //     if (bounds) {
        //         for (var i = 0, l = bounds.length; i < l; i++) {
        //             //生成行政区划polygon
        //             var polygon = new AMap.Polygon({
        //                 map: map,
        //                 strokeWeight: 2,
        //                 path: bounds[i],
        //                 fillOpacity: 0.01,
        //                 fillColor: '#fff',
        //                 strokeColor: 'red'
        //             });
        //             polygons.push(polygon);
        //         }
        //         // map.setFitView();//地图自适应
        //     }
        // });
}

 //启用点测距
function startRuler1() {
    startRuler2();
    map.plugin(["AMap.RangingTool"], function() {
        ruler1 = new AMap.RangingTool(map);
        AMap.event.addListener(ruler1, "end", function(e) {
            ruler1.turnOff();
        });
        var sMarker = {
            icon: new AMap.Icon({
                image: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b1.png"
            })
        };
        var eMarker = {
            icon: new AMap.Icon({
                image: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b2.png"
            }),
        };
        var lOptions = {
            strokeStyle: "solid",
            strokeColor: "#FF33FF",
            strokeOpacity: 1,
            strokeWeight: 2
        };
        var rulerOptions = {startMarkerOptions: sMarker, endMarkerOptions: eMarker, lineOptions: lOptions};
        ruler2 = new AMap.RangingTool(map, rulerOptions);
    });
    ruler2.turnOff();
    ruler1.turnOn();
}
//启用面测距
function startRuler2() {
    map.plugin(["AMap.MouseTool"], function() {
        var mouseTool = new AMap.MouseTool(map);
        //鼠标工具插件添加draw事件监听
        AMap.event.addListener(mouseTool, "draw", function callback(e) {
            var eObject = e.obj;   //obj属性就是鼠标事件完成所绘制的覆盖物对象
        });
        mouseTool.measureArea();  //调用鼠标工具的面积量测功能
    });
}
//启用地图清理
function startRuler3() {
    map.clearMap();
}

function sendAjax(data){
    var s_token = sessionStorage.getItem("s_token");
    $.ajax({
        url:Public_address+data.url+'?s_token='+s_token,
        async:false,
        data:data.data,
        dataType: 'json',
        type:'POST',
        success:function(res){
            if(res.code=="error"&&res.var=="身份认证失败,请重新登录"){
                layer.alert('您的身份已经过期，请重新登录？', {
                    title:'系统提示',
                    skin: 'layui-layer-molv',
                    btnAlign: 'c'
                }, function(){
                    location.href='/HNLYT/index2.html';

                });
                return false;
            }
            data.callback(res);
        }
    });
};