//基本地图加载
var map = new AMap.Map("container_map", {
    resizeEnable: true,
    zoom: 10
});
var type= new AMap.MapType({
    defaultType:1,
    showRoad:true
});
map.addControl(type);
var infoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(16, -25)
});
callback1();
//查询
showFireHot_two();
var markers = [];
function showFireHot_two() {
    var region = $("#city_sx").val();
    $("#city_sx").val()==''||$("#city_sx").val()==undefined?region=$("#hot_city").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_sx").val():region=$("#area").val();
    var begin_time = $('#startTime').val();

    //突发事件的时候，从数据概要跳转的时候传0,1，如果不是就传5
    var textThing=sessionStorage.getItem("textThing");
    if(textThing == undefined){
        var sel_type=5;
    }else{
        var sel_type=textThing;
    }
    addBeiJing();
    if (begin_time=='') {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        begin_time = currentdate;
    }else{
        begin_time = $('#startTime').val();
    }
    var end_time = $('#endTime').val();
    var report_type = $('#event_type').val();
    sendAjax({
        "url":"fire/report_data/getReportDataList",
        "data":{"current_page":1,"region":region,"report_type":report_type,"per_page":20,"end_time":end_time,
            "begin_time":begin_time,"sel_type":sel_type},
        "callback":function(result){
            var num = '';map.clearMap();
            sessionStorage.setItem("textThing",5);
            if (result.code!="s_ok") {
                $(".complete_total").html(0);layer.msg('查询数据为空');
                num = 1;$("#complete_report").html('');
            } else {
                $("#complete_report").html('');
                $(".complete_total").html(result.var.total);
                num=result.var.total;
                //分页
                var data = result.var.data;
                $(".complete_page").createPage({
                    pageCount: Math.ceil(num / 20),
                    current: 1,
                    backFn: function(p) {
                        sendAjax({
                            "url":"fire/report_data/getReportDataList",
                            "data":{"current_page":p,"region":region,"report_type":report_type,"per_page":20,"end_time":end_time,"begin_time":begin_time},
                            "callback":function(result){
                                var result = result.var.data;
                                $("#complete_report").html('');
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].report_type == "0") { var images = "tf02.png" }
                                    if (data[i].report_type == "1") { var images = "tf04.png" }
                                    if (data[i].report_type == "2") { var images = "tf01.png" }
                                    if (data[i].report_type == "3") { var images = "tf05.png" }
                                    if (data[i].report_type == "4") { var images = "tf03.png" }
                                    var lnglatXY = data[i].position.split(";");
                                    $("#complete_report").append("<tr><td>" + forestMaps.get(data[i].report_type) + "</td><td >" + data[i].region_name + "</td><td>" + lnglatXY[0] + "</td><td>" + data[i].happen_time + "</td><td>" + data[i].name + "</td><td>" + data[i].tel + "</td><td><a title=\"详情\" class=\"mr-5\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + data[i].id + ")\">删除</a></td></tr>");
                                    var lnglatXY = JSON.parse('[' + String(lnglatXY[0]) + ']');
                                    var marker = new AMap.Marker({
                                        position: lnglatXY,
                                        icon: 'img/LK/' + images,
                                        map: map
                                    });
                                    marker.setLabel({
                                        offset: new AMap.Pixel(-90, -20),
                                        content: data[i].region_name +"；" + data[i].happen_time.substring(0, 16)
                                    });
                                    // map.setFitView();
                                    addHotMarkerClick_two(marker, data[i]);
                                };
                                $("#complete_report .mr-5").click(function() {
                                    var index = $("#complete_report .mr-5").index(this);
                                    details_resources(data[index])
                                });
                            }
                        })
                    }
                });
                for (var i = 0; i < data.length; i++) {
                    if (data[i].report_type == "0") { var images = "tf02.png" }
                    if (data[i].report_type == "1") { var images = "tf04.png" }
                    if (data[i].report_type == "2") { var images = "tf01.png" }
                    if (data[i].report_type == "3") { var images = "tf05.png" }
                    if (data[i].report_type == "4") { var images = "tf03.png" }
                    var lnglatXY = data[i].position.split(";");
                    
                    $("#complete_report").append("<tr><td>" + forestMaps.get(data[i].report_type) + "</td><td >" + data[i].region_name + "</td><td>" + lnglatXY[0] + "</td><td>" + data[i].happen_time + "</td><td>" + data[i].name + "</td><td>" + data[i].tel + "</td><td><a title=\"详情\" class=\"mr-5\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + data[i].id + ")\">删除</a></td></tr>");
                    var lnglatXY = JSON.parse('[' + String(lnglatXY[0]) + ']');
                    var marker = new AMap.Marker({
                        position: lnglatXY,
                        icon: 'img/LK/' + images,
                        map: map
                    });
                    marker.setLabel({
                        offset: new AMap.Pixel(-90, -20),
                        content: data[i].region_name +"；" + data[i].happen_time.substring(0, 16)
                    });
                    // map.setFitView();
                    addHotMarkerClick_two(marker, data[i]);
                };
                $("#complete_report .mr-5").click(function() {
                    var index = $("#complete_report .mr-5").index(this);
                    details_resources(data[index])
                });
            }
        }
    })
}
//marker点击事件
function addHotMarkerClick_two(marker, data) {
    marker.content = "<div style=\"background-color:#fff;border-radius:6px;padding-left: 20px;\"><p style=\"color:#030303;font-size:14px;line-height:20px;\">类型:<span style=\"color:#999da8;margin-left:6px;\">" + forestMaps.get(data.report_type) + "</span></p><p style=\"color:#030303;font-size:14px;line-height:20px;\">时间:<span style=\"color:#999da8;margin-left:6px;\">" + data.happen_time + "</span></p><p style=\"color:#030303;font-size:14px;line-height:20px;\">区域:<span style=\"color:#999da8;margin-left:6px;\">" + data.region_name + "</span></p><p style=\"color:#030303;font-size:14px;line-height:20px;\">位置:<span style=\"color:#999da8;margin-left:6px;\">" + data.position + "</span></p><p style=\"color:#030303;font-size:14px;line-height:20px;\">姓名:<span style=\"color:#999da8;margin-left:6px;\">" + data.name + "</span></p><p style=\"color:#030303;font-size:14px;line-height:20px;\">电话:<span style=\"color:#999da8;margin-left:6px;\">" + data.tel + "</span></p><div style=\"display: block;width:120px;height:28px;background-color:#01dacf;color:#fff;text-align: center;line-height:28px;font-size:14px;border-radius:4px;margin:8px auto 0 auto;\" class=\"ml-5\">详情</div></div>"
    AMap.event.addListener(marker, 'click', function() {
        infoWindow.setContent(marker.content);
        infoWindow.open(map, marker.getPosition());
        $(".ml-5").click(function() {
            details_resources(data);
        });
    });        
};

//上报
function add_resources() {
    var add_resources = "<ul class=\"form_sub form_sub_release\"><li><label>区域<i style=\"color:red\">*</i></label>" +
        "<select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"city_two\" class=\"remove_disabled\" onclick=\"callback(value,this)\"></select><select id=\"village\" class=\"remove_disabled\"></select><label>地图位置<i style=\"color:red\">*</i></label><input type=\"text\" class=\"form-control form-boxed\" id=\"add_latLngs\" disabled style=\"margin: 0 2px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#add_latLngs').val(localStorage.getItem('site'));}})\" /></li><li><label>发生时间<i style=\"color:red\">*</i></label>" +
        "<input type=\"text\" id=\"add_creactTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})\" class=\"Wdate remove_disabled form-control\" style=\"width:150px\"/><label>事件类型<i style=\"color:red\">*</i></label><select id=\"add_type\" style=\"width:150px;\"><option value=\"0\">森林火灾</option><option value=\"1\">破坏森林资源</option><option value=\"2\">偷猎野生生物</option><option value=\"3\">林业有害生物</option><option value=\"4\">其他情况</option></select></li><li><label>事件描述</label><textarea id=\"add_desc\" class=\"form-control form-boxed remove_disabled\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"add_photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#add_photoName1').click()\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li></ul>"
   // var add_resources = "<ul class=\"form_sub form_sub_release\"><li><label>区域<i style=\"color:red\">*</i></label>" +
   //      "<select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"city_two\" class=\"remove_disabled\" onclick=\"callback(value,this)\"></select><select id=\"village\" class=\"remove_disabled\"></select><label>地图位置<i style=\"color:red\">*</i></label><input type=\"text\" class=\"form-control form-boxed\" id=\"add_latLngs\" disabled style=\"margin: 0 2px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#add_latLngs').val(localStorage.getItem('site'));}})\" /></li><li><label>发生时间<i style=\"color:red\">*</i></label>" +
   //      "<input type=\"text\" id=\"add_creactTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})\" class=\"Wdate remove_disabled form-control\" style=\"width:150px\"/><label>事件类型<i style=\"color:red\">*</i></label><select id=\"add_type\" style=\"width:150px;\"><option value=\"0\">森林火灾</option><option value=\"1\">破坏森林资源</option><option value=\"2\">偷猎野生生物</option><option value=\"3\">林业有害生物</option><option value=\"4\">其他情况</option></select></li><li><label>事件描述</label><textarea id=\"add_desc\" class=\"form-control form-boxed remove_disabled\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"add_photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#add_photoName1').click()\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li></ul>"
    layer.confirm('' + add_resources + '', {
        type: 1,
        skin: 'layui-layer-molv', //样式类名
        closeBtn: 1, //关闭按钮
        anim: 2,
        btn: ['保存', '取消'],
        btnAlign: 'c',
        area: ['650px', '340px;'],
        title: "上报事件",
        shadeClose: true, //开启遮罩关闭
    }, function() {
        var region = $("#province").val();
        $("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#village").val()==''||$("#village").val()==undefined?region=$("#city_two").val():region=$("#village").val();
        var report_type = $('#add_type').val();
        var position = $('#add_latLngs').val();
        var position_type=localStorage.getItem("pointTpye");
        var happen_time = $('#add_creactTime').val();
        var report_desc = $('#add_desc').val();
        var fire_image=imgName;
        if (region!=''&&position!=''&&happen_time!='') {
            sendAjax({
                "url":"fire/report_data/addReportData",
                "data":{"region":region,"report_type":report_type,"report_desc":report_desc,"position":position,"position_type":position_type,"happen_time":happen_time,"fire_image[]":fire_image},
                "callback":function(data){
                    if (data.code == "s_ok") {
                        layer.msg('新增成功');
                        layer.closeAll('page');
                        showFireHot_two();
                    } else {
                        layer.msg('保存失败');
                    }
                },
                error: function(data) {
                    layer.msg(data);
                }
            })
        } else {
            layer.alert("请完善上报事件信息", {
                skin: 'layui-layer-molv',
                title: '温馨提示',
                closeBtn: 0,
                anim: 4,
                btnAlign: 'c'
            });
        }
    }, function() {
        layer.closeAll('page');
    });


    var allBySet= localStorage.getItem('all_city');
    $('#province').html(allBySet);


    callback1();
    $("#add_photoName1").takungaeImgup({
        formData: {
            "path": "user_image",
            "file_ext":"image"
        },
        url:"fire/upload/fileUpload",
        id:"imgBox1"
    });
}

//详情
function details_resources(result) {
    layer.open({
        type: 1,
        skin: 'layui-layer-molv', //样式类名
        closeBtn: 1, //关闭按钮
        anim: 2,
        btnAlign: 'c',
        area: ['580px', '400px;'],
        title: "事件详情",
        shadeClose: true, //开启遮罩关闭
        content: "<ul class=\"form_sub form_sub_release\"><li><label>区域</label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onclick=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"village\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>地图位置</label><input type=\"text\" class=\"form-control form-boxed \" id=\"add_latLngs\" disabled style=\"margin: 0 2px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#add_latLngs').val(localStorage.getItem('site'));}})\" /></li>" +
        "<li><label>发生时间</label><input type=\"text\" id=\"add_creactTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})\" class=\"Wdate remove_disabled form-control\" style=\"width:150px\"/><label>事件类型</label><select id=\"add_type\" disabled style=\"width:150px;background-color:#f2f2f2\" class=\"remove_disabled\"><option value=\"0\">森林火灾</option><option value=\"1\">破坏森林资源</option><option value=\"2\">偷猎野生生物</option><option value=\"3\">林业有害生物</option><option value=\"4\">其他情况</option></select></li><li><label>上报人姓名</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\""+result.name+"\"><label>联系电话</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\""+result.tel+"\"></li><li><label>事件描述</label><textarea id=\"add_desc\" class=\"form-control form-boxed remove_disabled\" disabled></textarea></li><li><li style=\"position:relative\"><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li><li class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> " +
        "<input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user(" + result.id + ")\"></li></ul>"
    });


    var allBySet= localStorage.getItem('all_city');
    $('#province').html(allBySet);

    $("#add_desc").val(result.report_desc);
    $("#add_latLngs").val(result.position);
    $("#add_creactTime").val(result.happen_time);
    $("#add_type").get(0).selectedIndex = result.report_type;
    if (result.image_path!='') {
        var images=result.image_path;
        for (var i = 0; i < images.length; i++) {
          $("#imgBox1").append("<img src="+Public_address+'uploads/'+images[i].path+" onerror=\"this.style=&quot;display:none&quot;\" class=\"imgbig\">");
        }
    }
    $("#province option[value='" +(result.region).substr(0,4)+ "']").prop("selected", "selected");
    callback((result.region).substr(0,4),$("#province"));
    $("#city_two option[value='" +(result.region).substr(0,6)+ "']").prop("selected", "selected");
    callback((result.region).substr(0,6),$("#city_two"));
    $("#village option[value='" +(result.region).substr(0,9)+ "']").prop("selected", "selected");
    $("#upload_a").hide();
    $("#photoName2").takungaeImgup({
        formData: {
            "path": "user_image",
            "file_ext":"image"
        },
        url:"fire/upload/fileUpload",
        id:"imgBox1"
    });
}

// 保存
function disabled_user(id) {
    var region = $("#province").val();
    $("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#village").val()==''||$("#village").val()==undefined?region=$("#city_two").val():region=$("#village").val();
    var report_type = $('#add_type').val();
    var position = $('#add_latLngs').val();
    var position_type=localStorage.getItem("pointTpye");
    var happen_time = $('#add_creactTime').val();
    var report_desc = $('#add_desc').val();
    var fire_image=imgName;
    if (region!=''&&position!=''&&happen_time!='') {
        sendAjax({
            "url":"fire/report_data/editReportData",
            "data":{"id":id,"region":region,"report_type":report_type,"report_desc":report_desc,
                "position":position,"position_type":position_type,"happen_time":happen_time,
                "fire_image[]":fire_image},
            "callback":function(data){
                if (data.code == "s_ok") {
                    layer.msg('新增成功');
                    layer.closeAll('page');
                    showFireHot_two();
                } else {
                    layer.msg(data.var);
                }
            },
            error: function(data) {
                layer.msg(data);
            }
        })
    } else {
        layer.alert("请完善上报事件信息", {
            skin: 'layui-layer-molv',
            title: '温馨提示',
            closeBtn: 0,
            anim: 4,
            btnAlign: 'c'
        });
    }
}
// 编辑
function remove_disabled() {
    $("body").find(".form_sub_release").find(".remove_disabled").removeAttr("disabled").removeAttr("style");
    $("#upload_a").show();
    $("#upload_b").hide();
    $(".enter_map_two").show();
    $("body").find(".form_sub_release").find(".upFileBtn").removeAttr("style");
    $("body").find(".form_sub_release").find(".fileInput").removeAttr("style");
    $("#add_type").css("width", "150px");
    $("#imgBox1").find("img").removeClass("imgbig");
    $("#imgBox1").find("img").addClass("up-section");
    $("#rtmp_two").hide();
}

// 删除
function delete_data(fireid) {
    layer.confirm('确定要删除吗？',{
        btn: ['确定','取消'],
        skin: 'layui-layer-molv',
        title:'提示',
        btnAlign: 'c'
    }, function(){
      sendAjax({
        "url":"fire/report_data/removeReportData",
        "data":{"id": Number(fireid)},"callback":function(element){
          if (element.code=="s_ok"){
            layer.closeAll('page');
            layer.msg('删除成功');
            showFireHot_two();
            infoWindow.close();
          }else{
            layer.msg(element.var);
          }
        },
        error:function(e){
          layer.alert("网络不好，请刷新试试！", {
            skin: 'layui-layer-molv' 
            ,closeBtn: 0,anim: 4,btnAlign: 'c'
          });
        }
      });
    }, function(){
        layer.closeAll();
    });
}

function statistics() {
    $('.statistical_figure').show();
    $("#container_map").hide();
    $(".container_table").hide();
    //统计搜索头部
    $('.search_area .origin').hide();
    $('.search_area .count').show();
}
//地图和列表切换
$("#modeSwitch").click(function() {
    if ($(this).val() == "切换成列表模式") {
        $("#container_map").hide();
        $(".container_table").show();
        $(".statistical_figure").hide();
        $(".btn_none").css("display", "inline-block");
        $(".button-group").hide();
        $(".menu").css({"position":"relative","top":"25px","left":"30px"});
        $(this).val("切换成地图模式");
        //统计搜索头部
        $('.search_area .origin').show();
        $('.search_area .count').hide();
    } else {
        $("#container_map").show();
        $(".container_table").hide();
        $(".button-group").show();
        $(".statistical_figure").hide();
        $(".btn_none").css("display", "none");
        $(".menu").css({"position":"fixed","top":"115px","left":"260px"});
        $(this).val("切换成列表模式");
        //统计搜索头部
        $('.search_area .origin').show();
        $('.search_area .count').hide();
    }
})
$("body").on('click', '.imgbig', function() {
    var src = $(this).attr("src");
    var $h1 = "<img src=\"" + src + "\" style=\"height:98%;width:98%\">";
    layer.confirm('' + $h1 + '', {
        type: 0,
        anim: 7,
        skin: 'layui-layer-molv',
        title: '图片预览',
        area: ['570px', '500px;'],
        shadeClose: true,
        btnAlign: 'c'
    }, function() {
        layer.closeAll('dialog');
    }, function() {});
})
