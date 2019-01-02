//基本地图加载
var map = new AMap.Map("mapContainer", {
    resizeEnable : true,
    zoom : 13
});
var type = new AMap.MapType({
    defaultType : 1,
    showRoad : true
});
map.addControl(type);
var infoWindow = new AMap.InfoWindow({
    offset : new AMap.Pixel(16, -25)
// 窗体位置的偏移量
});
callback1();
// 查询
var marker, lineArr, markers = [];
clearInterval(iCount);
var iCount = setInterval(zdzxqk, 5000);
data=[];
images='';
zdzxqk();
function zdzxqk() {
    map.clearMap();
    //var city = $("#hot_city option:checked").html() == "城市" ? '' : $("#hot_city option:checked").html();
    var city = $("#hot_city option:checked").html() == "省" ? '' : $("#hot_city option:checked").html();
    var town = $("#city_sx option:checked").html();
    var village = $("#area option:checked").html();
    var name = $('#userName').attr("data-name");
    if (name==undefined||name=='') {name=$('#userName').val();}
    var type = $('#type').val();
    addBeiJing(city);
    sendAjax({
        "url":"fire/receive_app_Info/getDeviceByCondition",
        "data":{"city" : city,"town" : town,"village" : village, "name" : name,"type" : type},
        "callback":function(result){
            if(result.code='s_ok'){
                data=result.var;
                $('#text_list').html("");
                for ( var i = 0; i < data.length; i++) {
                    if (data[i].type == "4") { // 无人机 userLongitude
                        //无人机的遥控
                        images = "user.png";
                        var lnglatXY1 = JSON.parse('['
                                    + String(data[i].userLongitude + ','
                                            + data[i].userLatitude) + ']');
                            var marker = new AMap.Marker({
                                position : lnglatXY1,
                                content: "<img id='"+data[i].publishName+"' src='img/LK/"+images+"'/>",
                                //icon : 'img/LK/' + images,
                                map:map
                            });
                            marker.setLabel({
                                offset : new AMap.Pixel(-35, -20),
                                content : data[i].name
                            });
                            //marker.setAngle(data[i].yaw);
                            addMarker(data[i], images);
                            //addHotMarkerClick(marker, data[i]);
                
                        $('#text_list').append("<tr><td>无人机</td><td>"+data[i].name+"</td><td><a class='list-15'>详情</a></td></tr>");
                        
                        //无人机的飞机
                        if ( data[i].droneLongitude != "null" && data[i].droneLatitude != "") {
                            if (data[i].isPublish == "0") {
                                images = "zd_11.png";
                            } else {
                                images = "zd_10.png";
                            }
                            var lnglatXY2 = JSON.parse('['
                                    + String(data[i].droneLongitude + ','
                                            + data[i].droneLatitude) + ']');
                            var marker = new AMap.Marker({
                                position : lnglatXY2,
                                content: "<img style=\"transform: rotate("+data[i].yaw+"deg);\" id='"
                                +data[i].publishName+"' src='img/LK/"+images+"'/>",
                                //icon : 'img/LK/' + images,
                                map:map
                            });
                            marker.setLabel({
                                offset : new AMap.Pixel(-35, -20),
                                content : data[i].name
                            });
                            marker.setAngle(data[i].yaw);
                            addMarker3(marker,data[i], images);
                            //addHotMarkerClick(marker1, data[i]);
                       
                        }
                    
                    }
                    
                    if (data[i].type == "3") { // 消防员15173369241
                        images = "zd_06.png";
                        if (data[i].isPublish == "0") {
                            images = "zd_05.png";
                        } else {
                            images = "zd_06.png";
                        }
                        $('#text_list').append("<tr><td>消防员</td><td>"+data[i].name+"</td><td><a class='list-15'>详情</a></td></tr>");
                        // $("#text_list .list-15").click(function() {
                        //     var index = $("#text_list .list-15").index(this);
                        //     addMarker1(data[index], images);
                        //     $('.left_div').removeClass('left_width');
                        // });
                        addMarker(data[i], images);
                    }
                    if (data[i].type == "2") { // 护林员
                        images = "zd_03.png";
                        if (data[i].isPublish == "0") {
                            images = "zd22.png";
                        } else {
                            images = "zd_03.png";
                        }
                        $('#text_list').append("<tr><td>护林员</td><td>"+data[i].name+"</td><td><a class='list-15'>详情</a></td></tr>");
                        // $("#text_list .list-15").click(function() {
                        //     var index = $("#text_list .list-15").index(this);
                        //     addMarker1(data[index], images);
                        //     $('.left_div').removeClass('left_width');
                        // });
                        addMarker(data[i], images);
                    }

                }
                $("#text_list .list-15").click(function() {
                    var index = $("#text_list .list-15").index(this);
                    addMarker1(data[index], images);
                    $('.left_div').removeClass('left_width');
                });
                // map.setFitView();
            } else {
                $('#text_list').html("");
                layer.msg('无人在线');
            }
        }
    });
}
function addMarker(data,image){
    if (data.userLongitude != "null" && data.userLongitude != "") {
        var lnglatXY = JSON.parse('['+ String(data.userLongitude + ','+ data.userLatitude) + ']');
        var marker = new AMap.Marker({
            position : lnglatXY,
            icon : 'img/LK/'+image,
            map : map,
            label:{
                offset: new AMap.Pixel(-35, -20),//修改label相对于maker的位置
                content: data.name
            }
        });
        var s_token = sessionStorage.getItem("s_token");
        $.ajax({
            url:Public_address+'fire/play_push/getPlayUrl?s_token='+s_token,
            async:false,
            data:{"live_id" :data.uid},
            dataType: 'json',
            type:'get',
            success:function(result){
                if(result.code='s_ok'){
                    var location=result.var.PlayUrl[0];
                    addHotMarkerClick(marker, data,location);
                }else{
                    layer.msg("直播发生错误！")
                }
            }
        })
    }
}
//无人机的飞机
function addMarker3(marker,data,image){
    if (data.droneLongitude != "null" && data.droneLatitude != "") {
        // var lnglatXY = JSON.parse('['+ String(data.droneLongitude + ','+ data.droneLatitude) + ']');
        // var marker = new AMap.Marker({
        //     position : lnglatXY,
        //     icon : 'img/LK/'+image,
        //     map : map,
        //     label:{
        //         offset: new AMap.Pixel(-35, -20),//修改label相对于maker的位置
        //         content: data.name
        //     }
        // });
        var s_token = sessionStorage.getItem("s_token");
        $.ajax({
            url:Public_address+'fire/play_push/getPlayUrl?s_token='+s_token,
            async:false,
            data:{"live_id" :data.uid},
            dataType: 'json',
            type:'get',
            success:function(result){
                if(result.code='s_ok'){
                    var location=result.var.PlayUrl[0];
                    addHotMarkerClick(marker, data,location);
                }else{
                    layer.msg("直播发生错误！")
                }
            }
        })
    }
}
// 点击
function addHotMarkerClick(marker, data,location) {
    if (data.type == "4") { // 无人机
        marker.content = "<ul class='form_sub_release' style='width:350px;height:100%'><li><object width='350' height='200' id='SampleMediaPlayback' "
        + "name='SampleMediaPlayback' type='application/x-shockwave-flash' "
        + "classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' > "
        + "<param name='movie' value='swfs/SampleMediaPlayback.swf' />  "
        + "<param name='quality' value='high' /> "
        + "<param name='bgcolor' value='#000000' /> "
        + "<param name='allowfullscreen' value='true' />  "
        + "<param name='flashvars'  " + "value= '&src="
        + location
        + "&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'/> "
        + "<embed src='swfs/SampleMediaPlayback.swf' width='350' height='200' "
        + "id='SampleMediaPlayback' quality='high' bgcolor='#000000' "
        + "name='SampleMediaPlayback' allowfullscreen='true'  "
        + "pluginspage='http://www.adobe.com/go/getflashplayer'  "
        + "flashvars='&src="
        + location
        + "&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'  "
        + "type='application/x-shockwave-flash'> </embed> "
        + "</object></li><li><label>用户名：</label><span>"
        + data.name
        + "</span></li><label>手机：</label><span>"
        + data.publishName
        + "</span></li><li><label>位置：</label><span>"
        + data.userLongitude
        + ","
        + data.userLatitude
        + "</span></li><li><label>PM2.5：</label>"
        + data.pm25
        + "<label>PM10：</label>"
        + data.pm10
        + "</li><li><label>TVOC：</label>"
        + data.tvoc
        + "<label>甲醛：</label>"
        + data.jiaquan
        + "</li><li><label>温度：</label>"
        + data.wendu
        + "<label>湿度：</label>"
        + data.shidu
        + "</li><li><label>描述：</label><span>我正在巡逻，有事可以call我...</span></li></ul>"
    }
    if (data.type == "3") { // 消防员
        marker.content = "<ul class='form_sub_release' style='width:350px;height:100%'><li><object width='350' height='200' id='SampleMediaPlayback' "
        + "name='SampleMediaPlayback' type='application/x-shockwave-flash' "
        + "classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' > "
        + "<param name='movie' value='swfs/SampleMediaPlayback.swf' />  "
        + "<param name='quality' value='high' /> "
        + "<param name='bgcolor' value='#000000' /> "
        + "<param name='allowfullscreen' value='true' />  "
        + "<param name='flashvars'  " + "value= '&src="
        + location
        + "&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'/> "
        + "<embed src='swfs/SampleMediaPlayback.swf' width='350' height='200' "
        + "id='SampleMediaPlayback' quality='high' bgcolor='#000000' "
        + "name='SampleMediaPlayback' allowfullscreen='true'  "
        + "pluginspage='http://www.adobe.com/go/getflashplayer'  "
        + "flashvars='&src="
        + location
        + "&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'  "
        + "type='application/x-shockwave-flash'> </embed> "
        + "</object></li><li><label>用户名：</label><span>"
        + data.name
        + "</span></li><label>手机：</label><span>"
        + data.publishName
        + "</span></li><li><label>位置：</label><span>"
        + data.userLongitude
        + ","
        + data.userLatitude
        + "</span></li><li><label>描述：</label><span>我正在巡逻，有事可以call我...</span></li>" +
        "<li><label class='label_information' onclick=\"message('" + data.uid + "','" + data.name + "'," + data.publishName + ")\">发送信息</label></li>" +
        "</ul>"
            }
    if (data.type == "2") { // 护林员
        marker.content = "<ul class='form_sub_release' style='width:350px;height:100%'>" +
            "<li>" +
            "<object width='350' height='200' id='SampleMediaPlayback' "
        + "name='SampleMediaPlayback' type='application/x-shockwave-flash' "
        + "classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' > "
        + "<param name='movie' value='swfs/SampleMediaPlayback.swf' />  "
        + "<param name='quality' value='high' /> "
        + "<param name='bgcolor' value='#000000' /> "
        + "<param name='allowfullscreen' value='true' />  "
        + "<param name='flashvars'  " + "value= '&src="
        + location
        + "&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'/> "
        + "<embed src='swfs/SampleMediaPlayback.swf' width='350' height='200' "
        + "id='SampleMediaPlayback' quality='high' bgcolor='#000000' "
        + "name='SampleMediaPlayback' allowfullscreen='true'  "
        + "pluginspage='http://www.adobe.com/go/getflashplayer'  "
        + "flashvars='&src="
        + location
        + "&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'  "
        + "type='application/x-shockwave-flash'> </embed> "
        + "</object></li>" +
            "<li><label>用户名：</label><span>"
        + data.name
        + "</span></li><label>手机：</label><span>"
        + data.publishName
        + "</span></li><li><label>位置：</label><span>"
        + data.userLongitude
        + ","
        + data.userLatitude
        + "</span></li><li><label>描述：</label><span>我正在巡逻，有事可以call我...</span></li>" +
        // "<li><label class='label_information' onclick=\"message('" + data.uid + "','" + data.name + "'," + data.publishName +")\">发送信息</label></li>" +
            "</ul>"
           }
    AMap.event.addListener(marker, 'click', function() {
        layer.open({
            content :marker.content,
            skin : 'layui-layer-molv',
            shade : 0,
            btnAlign : 'c',
            tipsMore : true,
            type : 1,
            title : title_cons,
            zIndex : layer.zIndex,
            success : function(layero) {
                layer.setTop(layero);
            }
        });
        
        if (data.isPublish == "0") {
            var title_cons = "直播实况"
        } else {
            var title_cons = "人员信息"
        }
        if (data.liveModle == "0" && data.isPublish != "0") {
            var title_cons = "飞机信息"
        }
        // infoWindow.setContent(marker.content);
        // infoWindow.open(map, marker.getPosition());
    });
}


// $("#text_list .list-15").click(function(data) {
//     console.log(data);
//     for ( var i = 0; i < data.length; i++) {
//         var index = $("#text_list .list-15").index(this);
//         addMarker1(data[index], images);
//         $('.left_div').removeClass('left_width');
//     }
// });


//点击列表
function addMarker1(data, image) {
    console.log(data);
    if (data.userLongitude != "null" && data.userLongitude != "") {
        var lnglatXY = JSON.parse('['+ String(data.userLongitude + ','+ data.userLatitude) + ']');
        var marker = new AMap.Marker({
            position : lnglatXY,
            icon : 'img/LK/'+image,
            map : map,
            label:{
                offset: new AMap.Pixel(-35, -20),//修改label相对于maker的位置
                content: data.name
            }
        });
        var s_token = sessionStorage.getItem("s_token");
        $.ajax({
            url:Public_address+'fire/play_push/getPlayUrl?s_token='+s_token,
            async:false,
            data:{"live_id" :data.uid},
            dataType: 'json',
            type:'get',
            success:function(result){
                if(result.code='s_ok'){
                    var location=result.var.PlayUrl[0];
                    addHotMarkerClick1(marker, data,location);
                }else{
                    layer.msg("直播发生错误！")
                }
            }
        })
    }

}
function addHotMarkerClick1(marker, data,location) {
    if (data.type == "4") { // 无人机
        marker.content = "<ul class='form_sub_release' style='width:350px;height:100%'><li><object width='350' height='200' id='SampleMediaPlayback' "
            + "name='SampleMediaPlayback' type='application/x-shockwave-flash' "
            + "classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' > "
            + "<param name='movie' value='swfs/SampleMediaPlayback.swf' />  "
            + "<param name='quality' value='high' /> "
            + "<param name='bgcolor' value='#000000' /> "
            + "<param name='allowfullscreen' value='true' />  "
            + "<param name='flashvars'  " + "value= '&src="
            + location
            + "&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'/> "
            + "<embed src='swfs/SampleMediaPlayback.swf' width='350' height='200' "
            + "id='SampleMediaPlayback' quality='high' bgcolor='#000000' "
            + "name='SampleMediaPlayback' allowfullscreen='true'  "
            + "pluginspage='http://www.adobe.com/go/getflashplayer'  "
            + "flashvars='&src="
            + location
            + "&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'  "
            + "type='application/x-shockwave-flash'> </embed> "
            + "</object></li><li><label>用户名：</label><span>"
            + data.name
            + "</span></li><label>手机：</label><span>"
            + data.publishName
            + "</span></li><li><label>位置：</label><span>"
            + data.userLongitude
            + ","
            + data.userLatitude
            + "</span></li><li><label>PM2.5：</label>"
            + data.pm25
            + "<label>PM10：</label>"
            + data.pm10
            + "</li><li><label>TVOC：</label>"
            + data.tvoc
            + "<label>甲醛：</label>"
            + data.jiaquan
            + "</li><li><label>温度：</label>"
            + data.wendu
            + "<label>湿度：</label>"
            + data.shidu
            + "</li><li><label>描述：</label><span>我正在巡逻，有事可以call我...</span></li></ul>"
    }
    if (data.type == "3") { // 消防员
        marker.content = "<ul class='form_sub_release' style='width:350px;height:100%'><li><object width='350' height='200' id='SampleMediaPlayback' "
            + "name='SampleMediaPlayback' type='application/x-shockwave-flash' "
            + "classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' > "
            + "<param name='movie' value='swfs/SampleMediaPlayback.swf' />  "
            + "<param name='quality' value='high' /> "
            + "<param name='bgcolor' value='#000000' /> "
            + "<param name='allowfullscreen' value='true' />  "
            + "<param name='flashvars'  " + "value= '&src="
            + location
            + "&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'/> "
            + "<embed src='swfs/SampleMediaPlayback.swf' width='350' height='200' "
            + "id='SampleMediaPlayback' quality='high' bgcolor='#000000' "
            + "name='SampleMediaPlayback' allowfullscreen='true'  "
            + "pluginspage='http://www.adobe.com/go/getflashplayer'  "
            + "flashvars='&src="
            + location
            + "&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'  "
            + "type='application/x-shockwave-flash'> </embed> "
            + "</object></li><li><label>用户名：</label><span>"
            + data.name
            + "</span></li><label>手机：</label><span>"
            + data.publishName
            + "</span></li><li><label>位置：</label><span>"
            + data.userLongitude
            + ","
            + data.userLatitude
            + "</span></li><li><label>描述：</label><span>我正在巡逻，有事可以call我...</span></li>" +
            "<li><label class='label_information' onclick=\"message('" + data.uid + "','" + data.name + "'," + data.publishName + ")\">发送信息</label></li>" +
            "</ul>"
    }
    if (data.type == "2") { // 护林员

        marker.content = "<ul class='form_sub_release' style='width:350px;height:100%'>" +
            "<li>" +
            "<object width='350' height='200' id='SampleMediaPlayback' "
            + "name='SampleMediaPlayback' type='application/x-shockwave-flash' "
            + "classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' > "
            + "<param name='movie' value='swfs/SampleMediaPlayback.swf' />  "
            + "<param name='quality' value='high' /> "
            + "<param name='bgcolor' value='#000000' /> "
            + "<param name='allowfullscreen' value='true' />  "
            + "<param name='flashvars'  " + "value= '&src="
            + location
            + "&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'/> "
            + "<embed src='swfs/SampleMediaPlayback.swf' width='350' height='200' "
            + "id='SampleMediaPlayback' quality='high' bgcolor='#000000' "
            + "name='SampleMediaPlayback' allowfullscreen='true'  "
            + "pluginspage='http://www.adobe.com/go/getflashplayer'  "
            + "flashvars='&src="
            + location
            + "&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'  "
            + "type='application/x-shockwave-flash'> </embed> "
            + "</object></li>" +
            "<li><label>用户名：</label><span>"
            + data.name
            + "</span></li><label>手机：</label><span>"
            + data.publishName
            + "</span></li><li><label>位置：</label><span>"
            + data.userLongitude
            + ","
            + data.userLatitude
            + "</span></li><li><label>描述：</label><span>我正在巡逻，有事可以call我...</span></li>" +
            "<li><label class='label_information' onclick=\"message('" + data.uid + "','" + data.name + "'," + data.publishName +")\">发送信息</label></li>" +
            "</ul>"
    }

    if (data.isPublish == "0") {
        var title_cons = "直播实况"
    } else {
        var title_cons = "人员信息"
    }
    if (data.liveModle == "0" && data.isPublish != "0") {
        var title_cons = "飞机信息"
    }
        layer.open({
            content :marker.content,
            skin : 'layui-layer-molv',
            shade : 0,
            btnAlign : 'c',
            tipsMore : true,
            type : 1,
            title : title_cons,
            zIndex : layer.zIndex,
            success : function(layero) {
                layer.setTop(layero);
            }
        });


}


//在线列表
function textDiv() {
    if($('.left_div').hasClass("left_width")){
        $('.left_div').removeClass('left_width');
    }else{
        $('.left_div').addClass('left_width');
    }
}


