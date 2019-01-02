//基本地图加载
var map = new AMap.Map("container_map", {
    resizeEnable: true,
    zoom: 10
});
var type = new AMap.MapType({
    defaultType: 1,
    showRoad: true
});
map.addControl(type);
var infoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(16, -25)
});
//查询
callback1();
showFireHot_two();

function showFireHot_two() {
    var region = $("#city_sx").val();
    $("#city_sx").val() == '' || $("#city_sx").val() == undefined ? region = $("#hot_city").val() : $("#area").val() == '' || $("#area").val() == undefined ? region = $("#city_sx").val() : region = $("#area").val();
    var report_type = $('#event_type').val();
    var end_time = $('#endTime').val();
    var begin_time = $('#startTime').val();
    sendAjax({
        "url": "fire/report_data/getReportDataList",
        "data": { "current_page": 1, "region": region, "report_type": report_type, "per_page": 20, "end_time": end_time, "begin_time": begin_time },
        "callback": function (result) {
            var num = ''; map.clearMap();
            if (result.code != "s_ok") {
                $(".complete_total").html(0); layer.msg('查询数据为空');
                num = 1; $("#complete_report").html('');
                //上报数据的--数据统计
                var none = [];
                handle(none);
            } else {
                $("#complete_report").html('');
                $(".complete_total").html(result.var.total);
                num = result.var.total;
                //上报数据的--数据统计
                handle(num);
                //分页
                var data = result.var.data;
                $(".complete_page").createPage({
                    pageCount: Math.ceil(num / 20),
                    current: 1,
                    backFn: function (p) {
                        sendAjax({
                            "url": "fire/report_data/getReportDataList",
                            "data": { "current_page": p, "region": region, "report_type": report_type, "per_page": 20, "end_time": end_time, "begin_time": begin_time },
                            "callback": function (result) {
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
                                        content: data[i].region_name + "；" + data[i].happen_time.substring(0, 16)
                                    });
                                    map.setFitView();
                                    addHotMarkerClick_two(marker, data[i]);
                                };
                                $("#complete_report .mr-5").click(function () {
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
                        content: data[i].region_name + "；" + data[i].happen_time.substring(0, 16)
                    });
                    map.setFitView();
                    addHotMarkerClick_two(marker, data[i]);
                };
                $("#complete_report .mr-5").click(function () {
                    var index = $("#complete_report .mr-5").index(this);
                    details_resources(data[index])
                });
            }
        }
    })
}
//marker点击事件
function addHotMarkerClick_two(marker, data) {
    marker.content = "<div style=\"background-color:#fff;border-radius:6px;padding-left: 20px;width:400px\"><p style=\"color:#030303;font-size:14px;line-height:20px;\">类型:<span style=\"color:#999da8;margin-left:6px;\">" + forestMaps.get(data.report_type) + "</span></p><p style=\"color:#030303;font-size:14px;line-height:20px;\">时间:<span style=\"color:#999da8;margin-left:6px;\">" + data.happen_time + "</span></p><p style=\"color:#030303;font-size:14px;line-height:20px;\">区域:<span style=\"color:#999da8;margin-left:6px;\">" + data.region_name + "</span></p><p style=\"color:#030303;font-size:14px;line-height:20px;\">位置:<span style=\"color:#999da8;margin-left:6px;\">" + data.position + "</span></p><p style=\"color:#030303;font-size:14px;line-height:20px;\">姓名:<span style=\"color:#999da8;margin-left:6px;\">" + data.name + "</span></p><p style=\"color:#030303;font-size:14px;line-height:20px;\">电话:<span style=\"color:#999da8;margin-left:6px;\">" + data.tel + "</span></p><div style=\"display: block;width:120px;height:28px;background-color:#addc9d;color:#fff;text-align: center;line-height:28px;font-size:14px;border-radius:4px;margin:8px auto 0 auto;\" class=\"ml-5\">详情</div></div>"
    AMap.event.addListener(marker, 'click', function () {
        infoWindow.setContent(marker.content);
        infoWindow.open(map, marker.getPosition());
        $(".ml-5").click(function () {
            details_resources(data);
        });
    });
};

//上报
function add_resources() {
    // var add_resources = "<ul class=\"form_sub form_sub_release\"><li><label>区域<i style=\"color:red\">*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"><option value='43'>省</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onclick=\"callback(value,this)\"></select><select id=\"village\" class=\"remove_disabled\"></select><label>地图位置<i style=\"color:red\">*</i></label><input type=\"text\" class=\"form-control form-boxed\" id=\"add_latLngs\" disabled style=\"margin: 0 2px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#add_latLngs').val(localStorage.getItem('site'));}})\" /></li><li><label>发生时间<i style=\"color:red\">*</i></label>" +
    //     "<input type=\"text\" id=\"add_creactTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})\" class=\"Wdate remove_disabled form-control\" style=\"width:150px\"/><label>事件类型<i style=\"color:red\">*</i></label><select id=\"add_type\" style=\"width:150px;\"><option value=\"0\">森林火灾</option><option value=\"1\">破坏森林资源</option><option value=\"2\">偷猎野生生物</option><option value=\"3\">林业有害生物</option><option value=\"4\">其他情况</option></select></li><li><label>事件描述</label><textarea id=\"add_desc\" class=\"form-control form-boxed remove_disabled\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"add_photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#add_photoName1').click()\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li></ul>"
    var add_resources = "<ul class=\"form_sub form_sub_release\"><li><label>区域<i style=\"color:red\">*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"city_two\" class=\"remove_disabled\" onclick=\"callback(value,this)\"></select><select id=\"village\" class=\"remove_disabled\"></select><label>地图位置<i style=\"color:red\">*</i></label><input type=\"text\" class=\"form-control form-boxed\" id=\"add_latLngs\" disabled style=\"margin: 0 2px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#add_latLngs').val(localStorage.getItem('site'));}})\" /></li><li><label>发生时间<i style=\"color:red\">*</i></label>" +
        "<input type=\"text\" id=\"add_creactTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate:'%y-%M-%d'})\" class=\"Wdate remove_disabled form-control\" style=\"width:150px\"/><label>事件类型<i style=\"color:red\">*</i></label><select id=\"add_type\" style=\"width:150px;\"><option value=\"0\">森林火灾</option><option value=\"1\">破坏森林资源</option><option value=\"2\">偷猎野生生物</option><option value=\"3\">林业有害生物</option><option value=\"4\">其他情况</option></select></li><li><label>事件描述</label><textarea id=\"add_desc\" class=\"form-control form-boxed remove_disabled\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"add_photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#add_photoName1').click()\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li></ul>"
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
    }, function () {
        var region = $("#province").val();
        $("#city_two").val() == '' || $("#city_two").val() == undefined ? region = $("#province").val() : $("#village").val() == '' || $("#village").val() == undefined ? region = $("#city_two").val() : region = $("#village").val();
        var report_type = $('#add_type').val();
        var position = $('#add_latLngs').val();
        var position_type = localStorage.getItem("pointTpye");
        var happen_time = $('#add_creactTime').val();
        var report_desc = $('#add_desc').val();
        var fire_image = imgName;
        if (region != '' && position != '' && happen_time != '') {
            sendAjax({
                "url": "fire/report_data/addReportData",
                "data": { "region": region, "report_type": report_type, "report_desc": report_desc, "position": position, "position_type": position_type, "happen_time": happen_time, "fire_image[]": fire_image },
                "callback": function (data) {
                    if (data.code == "s_ok") {
                        layer.msg('新增成功');
                        layer.closeAll('page');
                        showFireHot_two();
                    } else {
                        layer.msg('保存失败:' + data.var);
                    }
                },
                error: function (data) {
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
    }, function () {
        layer.closeAll('page');
    });

    var all_citys = localStorage.getItem('Public_city');
    $('#province').html(all_citys);

    callback1();
    $("#add_photoName1").takungaeImgup({
        formData: {
            "path": "user_image",
            "file_ext": "image"
        },
        url: "fire/upload/fileUpload",
        id: "imgBox1"
    });
}
var list = [];
//详情
function details_resources(fireid) {
    sendAjax({
        "url": "fire/report_data/getReportDataInfo",
        "data": { "id": fireid.id },
        "callback": function (result) {
            if (result.code == "s_ok") {
                var result = result.var;
                layer.open({
                    type: 1,
                    skin: 'layui-layer-molv', //样式类名
                    closeBtn: 1, //关闭按钮
                    anim: 2,
                    btnAlign: 'c',
                    area: ['600px', '400px'],
                    title: "事件详情",
                    shadeClose: true, //开启遮罩关闭
                    content: "<ul class=\"form_sub form_sub_release\"><li><label>区域</label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onclick=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"village\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>地图位置</label><input type=\"text\" class=\"form-control form-boxed \" id=\"add_latLngs\" disabled style=\"margin: 0 2px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#add_latLngs').val(localStorage.getItem('site'));}})\" /><input class=\"enter_map_look\" type=\"button\" value=\"回显位置\" onclick=\"dthx('"+result.position+"',"+result.position_type+")\" style='width: 65px;border:none;background: #addc9d;color: #fff;'></li><li><label>发生时间</label><input type=\"text\" id=\"add_creactTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})\" class=\"Wdate remove_disabled form-control\" style=\"width:150px\"/><label>事件类型</label><select id=\"add_type\"disabled style=\"width:150px;background-color:#f2f2f2\" class=\"remove_disabled\"><option value=\"0\">森林火灾</option><option value=\"1\">破坏森林资源</option><option value=\"2\">偷猎野生生物</option><option value=\"3\">林业有害生物</option><option value=\"4\">其他情况</option></select></li><li><label>上报人姓名</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\"" + result.name + "\"><label>联系电话</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\"" + result.tel + "\"></li><li><label>事件描述</label><textarea id=\"add_desc\" class=\"form-control form-boxed remove_disabled\" disabled></textarea></li><li><li style=\"position:relative\"><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li><li class=\"background_user_information\">" +
                        "<input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> " +
                        "<input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user(" + fireid.id + ")\"></li></ul>"
                });
                var all_citys = localStorage.getItem('all_city');
                $('#province').html(all_citys);

                $("#add_desc").val(result.report_desc);
                $("#add_latLngs").val(result.position);
                $("#add_creactTime").val(result.happen_time);
                //add_type
                console.log($("#add_type").get(0));
                console.log($("#add_type").get(0));
                $("#add_type").get(0).selectedIndex = result.report_type;
                list = [];
                img_del = [];
                if (result.image_path != '') {
                    var images = result.image_path;
                    for (var i = 0; i < images.length; i++) {
                        $("#imgBox1").append("<img src=" + Public_address + 'uploads/' + images[i].path + " onerror=\"this.style=&quot;display:none&quot;\" class=\"imgbig\">");
                        list.push(images[i].id);
                    }
                }
                $("#province option[value='" + (result.region).substr(0, 4) + "']").prop("selected", "selected");
                callback((result.region).substr(0, 4), $("#province"))
                $("#city_two option[value='" + (result.region).substr(0, 6) + "']").prop("selected", "selected");
                callback((result.region).substr(0, 6), $("#city_two"))
                $("#village option[value='" + (result.region).substr(0, 9) + "']").prop("selected", "selected");
                $("#upload_a").hide();

                $("#photoName2").takungaeImgup({
                    formData: {
                        "path": "user_image",
                        "file_ext": "image"
                    },
                    url: "fire/upload/fileUpload",
                    id: "imgBox1"
                });
            } else {
                layer.msg(result.var);
            }
        },
        error(result) {
            layer.msg(result);
        }
    })
}

// 保存
function disabled_user(id) {
    console.log(id);
    var region = $("#province").val();
    $("#city_two").val() == '' || $("#city_two").val() == undefined ? region = $("#province").val() : $("#village").val() == '' || $("#village").val() == undefined ? region = $("#city_two").val() : region = $("#village").val();
    var report_type = $('#add_type').val();
    var position = $('#add_latLngs').val();
    var position_type = localStorage.getItem("pointTpye");
    var happen_time = $('#add_creactTime').val();
    var report_desc = $('#add_desc').val();
    if (img_del.length > 0) {
        //说明在修改中有删除图片
        for (var x = 0; x < img_del.length; x++) {
            list.splice(img_del[x], 1);
        }
    }
    if (imgName.length > 0) {
        for (var y = 0; y < imgName.length; y++) {
            list.push(imgName[y]);
        }
    }
    var fire_image = list;
    if (region != '' && position != '' && happen_time != '') {
        sendAjax({
            "url": "fire/report_data/editReportData",
            "data": {
                "id": id, "region": region, "report_type": report_type, "report_desc": report_desc,
                "position": position, "position_type": position_type, "happen_time": happen_time,
                "fire_image": fire_image
            },
            "callback": function (data) {
                if (data.code == "s_ok") {
                    layer.msg('新增成功');
                    layer.closeAll('page');
                    showFireHot_two();
                    imgName = [];
                } else {
                    layer.msg(data.var);
                }
            },
            error: function (data) {
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
//地图回显
function  dthx(latLngs,pointTpye) {
    layer.open({
        type: 1,
        skin: 'layui-layer-molv', //样式类名
        closeBtn: 1, //关闭按钮
        anim: 2,
        btnAlign: 'c',
        area: ['600px', '440px;'],
        title:"地图信息",
        shadeClose: true, //开启遮罩关闭
        content:"<div id=\"container1\" style=\"width:600px;height:400px\"></div>",
        success:function(){
            var map = new AMap.Map("container1",{
                resizeEnable: true,
                zoom:11
            });
            var type= new AMap.MapType({
                defaultType:1,
                showRoad:true
            });
            map.addControl(type);
            map.clearMap();
            var lnglatXY=[];
            if (pointTpye=="0") {
              var lnglat=latLngs.split(";");
              lnglat=lnglat[0].split(",");
              map.setZoomAndCenter(12, lnglat);
              var marker = new AMap.Marker({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: lnglat,
                map: map
              });
              //marker.setMap(map);
              map.add(marker);
            }
          
            if (pointTpye=="1") {
              var lnglat=latLngs.split(";");
              lnglat.pop();
               //lnglat  ["111.569998,28.381557", "112.119314,26.961065"]
              var arr=[];
              for(var i=0;i<lnglat.length;i++){
                  arr.push(lnglat[i].split(","));
              }
              map.clearMap();
              var polyline = new AMap.Polyline({
                  path:arr,          //设置线覆盖物路径
                  strokeColor: "#4196e1", //线颜色
                  strokeOpacity: 1,       //线透明度
                  strokeWeight: 5,        //线宽
                  strokeStyle: "solid",   //线样式
                  strokeDasharray: [10, 5] //补充线样式
              });
              polyline.setMap(map);
              //map.setZoomAndCenter(16, lnglatXY[0]);
            }
            if (pointTpye=="2"|| pointTpye==='') {
              var lnglat=latLngs.split(";");
              lnglat.pop();
              var arr=[];
                for(var i=0;i<lnglat.length;i++){
                    arr.push(lnglat[i].split(","));
                }
              map.clearMap();
                var polygon = new AMap.Polygon({
                    path: arr,//设置多边形边界路径
                    strokeColor: "#4196e1", //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 2,    //线宽
                    fillColor: "#4196e1", //填充色
                    fillOpacity: 0.35//填充透明度
                });
                polygon.setMap(map);
              //map.setZoomAndCenter(16, lnglatXY[0]);
            }	
  
        }
    })
  };

// 编辑
function remove_disabled() {
    $("body").find(".form_sub_release").find(".remove_disabled").removeAttr("disabled").removeAttr("style");
    $("#upload_a").show();
    $("#upload_b").hide();
    $(".enter_map_two").show();
    $(".enter_map_look").hide();
    $("body").find(".form_sub_release").find(".upFileBtn").removeAttr("style");
    $("body").find(".form_sub_release").find(".fileInput").removeAttr("style");
    $("#add_type").css("width", "150px");
    $("#imgBox1").find("img").removeClass("imgbig");
    $("#imgBox1").find("img").addClass("up-section");
    $("#rtmp_two").hide();
}

// 删除
function delete_data(fireid) {
    layer.confirm('确定要删除吗？', {
        btn: ['确定', '取消'],
        skin: 'layui-layer-molv',
        title: '提示',
        btnAlign: 'c'
    }, function () {
        sendAjax({
            "url": "fire/report_data/removeReportData",
            "data": { "id": Number(fireid) }, "callback": function (element) {
                if (element.code == "s_ok") {
                    layer.closeAll('page');
                    layer.msg('删除成功');
                    showFireHot_two();
                    infoWindow.close();
                } else {
                    layer.msg(element.var);
                }
            },
            error: function (e) {
                layer.alert("网络不好，请刷新试试！", {
                    skin: 'layui-layer-molv'
                    , closeBtn: 0, anim: 4, btnAlign: 'c'
                });
            }
        });
    }, function () {
        layer.closeAll();
    });
}
//点击数据统计
function statistics() {
    $('.statistical_figure').show();
    $("#container_map").hide();
    $(".container_table").hide();
    //统计搜索头部
    $('.search_area .origin').hide();
    $('.search_area .count').show();
}
//地图和列表切换
$("#modeSwitch").click(function () {
    if ($(this).val() == "切换成列表模式") {
        $("#container_map").hide();
        $(".container_table").show();
        $(".statistical_figure").hide();
        $(".button-group").hide();
        $(".btn_none").css("display", "inline-block");

        $(".menu").css({ "position": "relative", "top": "25px", "left": "30px" });
        $(this).val("切换成地图模式");
        //统计搜索头部
        $('.search_area .origin').show();
        $('.search_area .count').hide();
    } else {
        $("#container_map").show();
        $(".button-group").show();
        $(".container_table").hide();
        $(".statistical_figure").hide();
        $(".btn_none").css("display", "none");
        $(".menu").css({ "position": "fixed", "top": "115px", "left": "260px" });
        $(this).val("切换成列表模式");
        //统计搜索头部
        $('.search_area .origin').show();
        $('.search_area .count').hide();
    }
})
$("body").on('click', '.imgbig', function () {
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
    }, function () {
        layer.closeAll('dialog');
    }, function () { });
})
// 加载统计图
//查询条件



var first_city = localStorage.getItem('first_city');
var city = $("#city_count option:checked").html() == "省" ? first_city : $("#city_count option:checked").html();
var town = $("#city_sx_count option:checked").html();
var village = $("#area_count option:checked").html();
//获取当前年月
var myDate = new Date;
var year = myDate.getFullYear();
var month = myDate.getMonth() + 1 > 9 ? myDate.getMonth() + 1 : "0" + (myDate.getMonth() + 1);
var now = year + "-" + month;
sessionStorage.setItem("now", now);
//横轴
function getXArr() {
    if ($("#startTime_count").val() == '') {
        var xArr = [];
        var now = sessionStorage.getItem("now");
        xArr.push(now);
        return xArr;
    } else {
        var xArr = [$("#startTime_count").val()];
        var sYear = parseInt($("#startTime_count").val().substring(0, 4));
        var sMonth = parseInt($("#startTime_count").val().substring(5));
        var eYear = parseInt($("#endTime_count").val().substring(0, 4));
        var eMonth = parseInt($("#endTime_count").val().substring(5));
        var count = (eYear - sYear) * 12 + (eMonth - sMonth);
        for (var i = 0; i < count; i++) {
            var str = "";
            sMonth = sMonth + 1;
            if (sMonth == 13) {
                sMonth = 1;
                sYear = sYear + 1;
            }
            var m = sMonth > 9 ? sMonth : "0" + sMonth;
            str = str + sYear + '-' + m;
            xArr.push(str);
        }
        return xArr;
    }
}
//fire/report_data/getReportDataList
//hlyUploadDataCount.htm
//  $(function() {
//         $.ajax({
//             url: "fire/report_data/getReportDataList",
//             type: "post",
//             dataType: "json",
//             data: { "city": city, "town": town, "village": village, startTime: now, endTime: now },
//             success: function(data) {
//                 handle(data);
//             },
//             error: function(data) {
//                 layer.alert("网络不好，请刷新试试！", {
//                     skin: 'layui-layer-molv',
//                     closeBtn: 0,
//                     anim: 4,
//                     btnAlign: 'c'
//                 });
//             }
//         });
// })
//统计图
function handle(allArr) {
    console.log(allArr);
    var xArr = getXArr();
    //任务类型数据
    function reportStatic(finish0, finish1, finish2, finish3, finish4, total) {
        this.finish0 = finish0;
        this.finish1 = finish1;
        this.finish2 = finish2;
        this.finish3 = finish3;
        this.finish4 = finish4;
        this.total = total;
    };
    //统计数据解析
    function getStaticData(xArr, allArr) {
        var staticData = { showdata: [], data: [] };
        var static = allArr;
        for (var j = 0; j < xArr.length; j++) {
            var flag = true;
            var obj = null;
            for (var h = 0; h < static.length; h++) {
                if (xArr[j] == static[h].time) {
                    flag = false;
                    staticData.data.push(static[h].count);
                    //type数据
                    var typeArr = [0, 0, 0, 0, 0, 0];
                    typeArr[0] = static[h].count;
                    var staric = static[h];
                    for (var i = 0; i < staric.length; i++) {
                        switch (staric[i].report_type) {
                            case "0":
                                typeArr[0] = staric[i].count;
                                break;
                            case "1":
                                typeArr[1] = staric[i].count;
                                break;
                            case "2":
                                typeArr[2] = staric[i].count;
                                break;
                            case "3":
                                typeArr[3] = staric[i].count;
                                break;
                            case "4":
                                typeArr[4] = staric[i].count;
                                break;
                        }
                    }
                    obj = new reportStatic(typeArr[0], typeArr[1], typeArr[2], typeArr[3], typeArr[4], typeArr[5], typeArr[6]);
                }
            }
            if (flag) {
                staticData.data.push(0);
                obj = new reportStatic(0, 0, 0, 0, 0, 0)
            }
            staticData.showdata.push(obj);
        }
        return staticData;
    };
    // 系列数据 
    var staticData = getStaticData(xArr, allArr);
    var myChart = echarts.init(document.getElementById('lqz_fireManage'));
    var title = '';
    if ($("#city_count option:checked").html() == "城市") {
        var first_city = localStorage.getItem('first_city');
        title = first_city + now + "月护林员上报情况统计图"
    } else {
        title = $("#city_count option:checked").html() + $("#startTime_count").val() + "至" + $("#endTime_count").val() + "护林员上报情况统计图"
    }
    var option = {
        title: {
            text: title,
            left: '30%'
        },
        tooltip: {
            trigger: 'item',
            axisPointer: { // 坐标指示器
                type: 'cross', // 类型 line:直线指示器  'shadow' 阴影指示器 'cross' 十字准星指示器
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            formatter: function (params) {
                var item = staticData.showdata[params.dataIndex];
                var res = '<div><p>' + params.name.substring(0, 4) + '年' + params.name.substring(5) + '月总计' + params.data + '条</p>' +
                    '<p>森林火灾:<span style="color:#fff;">' + item.finish0 + '条</span></p>' +
                    '<p>破坏森林资源:<span style="color:#fff;">' + item.finish1 + '条</span></p>' +
                    '<p>偷猎野生生物:<span style="color:#fff;">' + item.finish2 + '条</span></p>' +
                    '<p>林业有害生物:<span style="color:#fff;">' + item.finish3 + '条</span></p>' +
                    '<p>其他情况:<span style="color:#fff;">' + item.finish4 + '条</span></p>' +
                    '</div>';
                return res;
            }
        },
        legend: {
            data: [],
            right: '14%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xArr,
            name: "时间"
        },
        yAxis: {
            type: 'value',
            name: "任务数量(条)"
        },
        series: [{
            data: staticData.data,
            type: 'line'
        }],
    };
    myChart.setOption(option);
}
//统计查询
$('#search_Countbtn').click(function () {
    //市不能为空
    if ($("#city") == '' && '城市') {
        layer.open({
            content: '市不能为空',
            skin: 'layui-layer-molv',
            scrollbar: false,
            btnAlign: 'c'
        });
        return;
    }
    //开始时间不能为空
    if ($("#startTime_count").val() == '') {
        layer.open({
            content: '开始时间不能为空',
            skin: 'layui-layer-molv',
            scrollbar: false,
            btnAlign: 'c'
        });
        return;
    };
    //结束时间不能为空
    if ($("#endTime_count").val() == '') {
        layer.open({
            content: '结束时间不能为空',
            skin: 'layui-layer-molv',
            scrollbar: false,
            btnAlign: 'c'
        });
        return;
    };
    // 结束时间不得小于开始时间
    var s = parseInt($("#startTime_count").val().substring(0, 4)) + parseInt($("#startTime_count").val().substring(5)) / 12;
    var e = parseInt($("#endTime_count").val().substring(0, 4)) + parseInt($("#endTime_count").val().substring(5)) / 12;
    if (s >= e) {
        layer.open({
            content: '开始时间必须小于结束时间!',
            skin: 'layui-layer-molv',
            scrollbar: false,
            btnAlign: 'c'
        });
        return;
    };
    //时间范围十年之内
    if (e - s > 10) {
        layer.open({
            content: '最大时间范围为10年,请重新选择年月!',
            skin: 'layui-layer-molv',
            scrollbar: false,
            btnAlign: 'c'
        });
        return;
    };
    var region = $("#city_sx_count").val();
    region = ($("#city_sx_count").val() == '' || $("#city_sx_count").val() == undefined ? $("#city_count").val() : ($("#area_count").val() == '' || $("#area_count").val() == undefined ? $("#city_sx_count").val() : $("#area_count").val()));

    var s_token = sessionStorage.getItem("s_token");
    //统计数据查询
    $.ajax({
        url: Public_address + "fire/report_data/countReportData" + '?s_token=' + s_token,
        type: "post",
        dataType: "json",
        data: { "region": region, "begin_time": $("#startTime_count").val(), "end_time": $("#endTime_count").val() },
        success: function (result) {
            if (result.code == 's_ok') {
                if (result.var.length < 1) {
                    layer.msg('没有查询到数据');
                } else {
                    handle(result.var);
                }
            } else {
                layer.msg(result.var);
            }
        },
        error: function (result) { }
    })
})