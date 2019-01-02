var isFirst=true;
var infoWindow = new AMap.InfoWindow({
  offset: new AMap.Pixel(16, -25)//窗体位置的偏移量
});

//基本地图加载
var map = new AMap.Map("container_map", {
    resizeEnable: true,
    zoom:8
});
var type= new AMap.MapType({
  defaultType:1,
  showRoad:true
});
map.addControl(type);
callback1();
// 点击弹框
function markerClick(marker,result){
  var publishName=result.video_stream_adr;
  marker.content='<div style="padding:5px;border-radius:6px;">'+
  '<object width=\'430\' height=\'150\' id=\'SampleMediaPlayback\' '+
  'name=\'SampleMediaPlayback\' type=\'application/x-shockwave-flash\' '+ 
  'classid=\'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\' > '+
  '<param name=\'movie\' value=\'swfs/SampleMediaPlayback.swf\' />  '+
  '<param name=\'quality\' value=\'high\' /> '+ 
  '<param name=\'bgcolor\' bgcolor=\'#000000\' /> '+ 
  '<param name=\'allowfullscreen\' value=\'true\' />  '+
  '<param name=\'flashvars\' '+
  'value= \'&src='+publishName+'&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true\'/> '+
  '<embed src=\'swfs/SampleMediaPlayback.swf\' width=\'380\' height=\'230\' '+ 
  'id=\'SampleMediaPlayback\' quality=\'high\' bgcolor=\'#000000\' '+ 
  'name=\'SampleMediaPlayback\' allowfullscreen=\'true\'  '+
  'pluginspage=\'http://www.adobe.com/go/getflashplayer\'  '+
  'flashvars=\'&src='+publishName+'&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true\'  '+
  'type=\'application/x-shockwave-flash\'> </embed> '+
  '</object>'+
  '<p style="color:#030303;font-size:14px;">设备名:<span style="color:#999da8;margin-left:6px;margin-right:100px">'+ result.device_name + '</span>录入人:<span style="color:#999da8;margin-left:6px;">'+result.input_name+'</span></p>'+
  '<p style="color:#030303;font-size:14px;">位置:<span style="color:#999da8;margin-left:6px;margin-right:30px;">'+result.region_name+'</span></p>'+
  '<p style="color:#030303;font-size:14px;">手机号:<span style="color:#999da8;margin-left:6px;">'+result.input_tel+'</span></p>'+
  '<p style="color:#030303;font-size:14px;">录入时间:<span style="color:#999da8;margin-left:6px;">'+result.create_time+'</span></p>'+
  '<p style="color:#030303;font-size:14px;">描述:<span style="color:#999da8;margin-left:6px;">'+result.floor_desc+'</span></p>'+
  '<a href="#" class="ml-5"  >详情</a></div>';
  AMap.event.addListener(marker, 'click', function() {
    infoWindow.setContent(marker.content);
    infoWindow.open(map, marker.getPosition());
    $(".ml-5").click(function() {
      report_index(result)
    });
  });
} 
// 新增弹框
function new_office() {
  // var add_resources ="<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"><option value=''>城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onclick=\"callback(value,this)\"></select><select id=\"area\" class=\"remove_disabled\" ></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" id=\"latLngs\" disabled style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>设备名<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"search_user\">" +
  //     "<label>推流名<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"rtmp\"></li><li>" +
  //     "<label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul>"
 var add_resources ="<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"city_two\" class=\"remove_disabled\" onclick=\"callback(value,this)\"></select><select id=\"area\" class=\"remove_disabled\" ></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" id=\"latLngs\" disabled style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>设备名<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"search_user\">" +
      "<label>推流名<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"rtmp\"></li><li>" +
      "<label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul>"
  layer.confirm(''+add_resources+'', {
    type: 1,
    closeBtn: 1, //关闭按钮
    anim: 2,
    skin: 'layui-layer-molv', 
    btn: ['保存','取消'],
    btnAlign: 'c',
    area: ['650px'],
    title:'录入地面监控点信息',
    shadeClose: true, //开启遮罩关闭
  }, function(){
    layer.msg('正在保存中', {
      icon: 16,shade: 0.01,time:false
    });
    var floor_region=$("#province").val();
    $("#city_two").val()==''||$("#city_two").val()==undefined?floor_region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?floor_region=$("#city_two").val():floor_region=$("#area").val();
    var location=$("#latLngs").val().replace(/[;]/g,'').replace(/[ ]/g,"");
    var floor_desc=$("#desc").val();
    var video_stream_adr=$("#rtmp").val();
    var device_name=$("#search_user").val();
    if (floor_region!=''&&location!=''&&device_name!=''&&video_stream_adr!='') {
      sendAjax({
        "url":"fire/floor_Monitor/saveFloorMonitor",
        "data":{"floor_region":floor_region,"location":location,"floor_desc":floor_desc,
            "floor_image":imgName,"video_stream_adr":video_stream_adr,"device_name":device_name},
          "callback":function(data){
            if (data.code=="s_ok") {
              layer.closeAll('dialog');
              layer.msg('保存成功');
              query();
              layer.closeAll('page');
                imgName=[];
            }else{
              layer.msg(data.var);imgName=[];
            } 
          },
          error:function(e){
            layer.msg("错误！！");
          }
      });
    }else{
      layer.alert("请完善地面监控点信息", {
        skin: 'layui-layer-molv',
        title:'温馨提示',
        closeBtn: 0,anim: 4,btnAlign: 'c'
      });
    }
  }, function(){
    layer.closeAll('page');
  });

    var all_city=localStorage.getItem('all_city');
    $('#province').html(all_city);
  $("#photoName1").takungaeImgup({
    formData: {
        "path": "monitoring_image",
        "file_ext":"image"
    },
    url:"fire/upload/fileUpload",
    id:"imgBox"
  });
  callback1();
}
var list=[];
// 详情
function report_index(result) {
    sendAjax({
        "url":"fire/floor_monitor/getFloorMonitorById",
        "data":{"id": result.id},
        "callback":function(result){
            if(result.code=='s_ok'){
              var userLevel = sessionStorage.getItem("userLevel");
              if(userLevel =='1'){
                layer.open({
                  type: 1,
                  skin: 'layui-layer-molv', //样式类名
                  closeBtn: 1, //关闭按钮
                  anim: 2,
                  btnAlign: 'c',
                  area: ['650px', '650px;'],
                  title:"地面监控点详情",
                  shadeClose: true,
                  content:"<ul class=\"form_sub form_sub_release\"><li><label>区域</label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2;\"></select><select id=\"city_two\" class=\"remove_disabled\" onclick=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2;\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2;\"></select><label>位置</label><input type=\"text\" class=\"form-control form-boxed\" id=\"latLngs\" disabled style=\"margin-right:2px;width:175px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li>" +
                  "<li><label>设备名</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+result.var.device_name+"\" id=\"search_user\" disabled>" +
                  "<label>录入人</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+result.var.input_name+"\" id=\"inputName\" disabled></li>" +
                  "<li><li id=\"rtmp_two\"><label>视频流</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+result.var.video_stream_adr+"\" id=\"videoStreamAdr\" disabled style=\"display:none\"></li>" +
                  "<label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea>" +
                  "<label>录入时间</label><input type=\"text\" class=\"form-control form-boxed\" value=\""+result.var.input_time+"\" id=\"inputTime\" disabled></li>" +
                  "<li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\" style=\"display:none\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul>" 
                  //"<li class=\"background_user_information\"><input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user("+result.var.id+")\"></li></ul>"
             //   content:"<ul class=\"form_sub form_sub_release\"><li><label>区域</label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2;\"><option value=\"\">城市</option><option value=\"4301\">长沙市</option><option value=\"4302\" >株洲市</option><option value=\"4303\">湘潭市</option><option value=\"4304\">衡阳市</option><option value=\"4305\">邵阳市</option><option value=\"4306\">岳阳市</option><option value=\"4307\">常德市</option><option value=\"4308\">张家界市</option><option value=\"4309\">益阳市</option><option value=\"4311\">永州市</option><option value=\"4310\">郴州市</option><option value=\"4312\">怀化市</option><option value=\"4313\">娄底市</option><option value=\"4331\">湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onclick=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2;\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2;\"></select><label>位置</label><input type=\"text\" class=\"form-control form-boxed\" id=\"latLngs\" disabled style=\"margin-right:2px;width:175px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li>" +
             //      "<li><label>设备名</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+result.var.device_name+"\" id=\"search_user\" disabled>" +
             //      "<label>录入人</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+result.var.input_name+"\" id=\"inputName\" disabled></li>" +
             //      "<li><li id=\"rtmp_two\"><label>视频流</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+result.var.video_stream_adr+"\" id=\"videoStreamAdr\" disabled style=\"display:none\"></li>" +
             //      "<label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea>" +
             //      "<label>录入时间</label><input type=\"text\" class=\"form-control form-boxed\" value=\""+result.var.input_time+"\" id=\"inputTime\" disabled></li>" +
             //      "<li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\" style=\"display:none\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li>" +
             //      "<li class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user("+result.var.id+")\"></li></ul>"
              });

              }else{
                layer.open({
                  type: 1,
                  skin: 'layui-layer-molv', //样式类名
                  closeBtn: 1, //关闭按钮
                  anim: 2,
                  btnAlign: 'c',
                  area: ['650px', '650px;'],
                  title:"地面监控点详情",
                  shadeClose: true,
                  content:"<ul class=\"form_sub form_sub_release\"><li><label>区域</label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2;\"></select><select id=\"city_two\" class=\"remove_disabled\" onclick=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2;\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2;\"></select><label>位置</label><input type=\"text\" class=\"form-control form-boxed\" id=\"latLngs\" disabled style=\"margin-right:2px;width:175px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li>" +
                  "<li><label>设备名</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+result.var.device_name+"\" id=\"search_user\" disabled>" +
                  "<label>录入人</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+result.var.input_name+"\" id=\"inputName\" disabled></li>" +
                  "<li><li id=\"rtmp_two\"><label>视频流</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+result.var.video_stream_adr+"\" id=\"videoStreamAdr\" disabled style=\"display:none\"></li>" +
                  "<label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea>" +
                  "<label>录入时间</label><input type=\"text\" class=\"form-control form-boxed\" value=\""+result.var.input_time+"\" id=\"inputTime\" disabled></li>" +
                  "<li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\" style=\"display:none\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li>" +
                  "<li class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user("+result.var.id+")\"></li></ul>"
             //   content:"<ul class=\"form_sub form_sub_release\"><li><label>区域</label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2;\"><option value=\"\">城市</option><option value=\"4301\">长沙市</option><option value=\"4302\" >株洲市</option><option value=\"4303\">湘潭市</option><option value=\"4304\">衡阳市</option><option value=\"4305\">邵阳市</option><option value=\"4306\">岳阳市</option><option value=\"4307\">常德市</option><option value=\"4308\">张家界市</option><option value=\"4309\">益阳市</option><option value=\"4311\">永州市</option><option value=\"4310\">郴州市</option><option value=\"4312\">怀化市</option><option value=\"4313\">娄底市</option><option value=\"4331\">湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onclick=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2;\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2;\"></select><label>位置</label><input type=\"text\" class=\"form-control form-boxed\" id=\"latLngs\" disabled style=\"margin-right:2px;width:175px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li>" +
             //      "<li><label>设备名</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+result.var.device_name+"\" id=\"search_user\" disabled>" +
             //      "<label>录入人</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+result.var.input_name+"\" id=\"inputName\" disabled></li>" +
             //      "<li><li id=\"rtmp_two\"><label>视频流</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+result.var.video_stream_adr+"\" id=\"videoStreamAdr\" disabled style=\"display:none\"></li>" +
             //      "<label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea>" +
             //      "<label>录入时间</label><input type=\"text\" class=\"form-control form-boxed\" value=\""+result.var.input_time+"\" id=\"inputTime\" disabled></li>" +
             //      "<li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\" style=\"display:none\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li>" +
             //      "<li class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user("+result.var.id+")\"></li></ul>"
              });

              }
                

                var all_city=localStorage.getItem('all_city');
                $('#province').html(all_city);

                var publishName=result.var.video_stream_adr;
                if(publishName!=''){
                    var html ='<div style="padding:5px;border-radius:6px;display:inline-block;vertical-align:middle;">'+ '<object width=\'430\' height=\'150\' id=\'SampleMediaPlayback\' '+ 'name=\'SampleMediaPlayback\' type=\'application/x-shockwave-flash\' '+ 'classid=\'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\' > '+ '<param name=\'movie\' value=\'swfs/SampleMediaPlayback.swf\' />  '+ '<param name=\'quality\' value=\'high\' /> '+ '<param name=\'bgcolor\' bgcolor=\'#000000\' /> '+ '<param name=\'allowfullscreen\' value=\'true\' />  '+ '<param name=\'flashvars\' '+
                        'value= \'&src='+publishName+'&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true\'/> '+
                        '<embed src=\'swfs/SampleMediaPlayback.swf\' width=\'380\' height=\'230\' '+
                        'id=\'SampleMediaPlayback\' quality=\'high\' bgcolor=\'#000000\' '+
                        'name=\'SampleMediaPlayback\' allowfullscreen=\'true\'  '+
                        'pluginspage=\'http://www.adobe.com/go/getflashplayer\'  '+
                        'flashvars=\'&src='+publishName+'&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true\'  '+
                        'type=\'application/x-shockwave-flash\'></embed>'+
                        '</object>';
                }else{
                    var html='<span style="color:red;">新增时没有填写推流名</span>';
                }
                $("#rtmp_two").append(html);
                $("#latLngs").val(result.var.location);
                $("#desc").val(result.var.floor_desc);
                list=[];
                img_del=[];
                if (result.var.floor_image.length>0) {
                    var images=result.var.floor_image;
                    for (var i = 0; i < images.length; i++) {
                        $("#imgBox").append("<img src="+Public_address+'uploads/'+images[i].path+"  onerror=\"this.style=&quot;display:none&quot;\" class=\"imgbig\">");
                        list.push(images[i].id);
                    }
                }
                $("#province option[value='" +(result.var.floor_region).substr(0,4)+ "']").prop("selected", "selected");
                callback((result.var.floor_region).substr(0,4),$("#province"));
                $("#city_two option[value='" +(result.var.floor_region).substr(0,6)+ "']").prop("selected", "selected");
                callback((result.var.floor_region).substr(0,6),$("#city_two"));
                $("#area option[value='" +(result.var.floor_region).substr(0,9)+ "']").prop("selected", "selected");
                //callback();
                $("#photoName1").takungaeImgup({
                    formData: {
                        "path": "monitoring_image",
                        "file_ext":"image"
                    },
                    url:"fire/upload/fileUpload",
                    id:"imgBox"
                });
            }else{
                layer.msg(result.var);
            }
        },
        error(element){
            layer.msg(element);
        }
    })
}
// 保存
function disabled_user(id) {
    var floor_region=$("#province").val();
    $("#city_two").val()==''||$("#city_two").val()==undefined?floor_region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?floor_region=$("#city_two").val():floor_region=$("#area").val();
    var location=$("#latLngs").val().replace(/[;]/g,'').replace(/[ ]/g,"");
    var floor_desc=$("#desc").val();
    if(img_del.length>0){
        //说明在修改中有删除图片
        for(var x=0;x<img_del.length;x++){
            list.splice(img_del[x],1);
        }
    }
    if(imgName.length>0){
        for(var y=0;y<imgName.length;y++){
            list.push(imgName[y]);
        }
    }
    var img=list;
    var video_stream_adr=$("#videoStreamAdr").val();
    var device_name=$("#search_user").val();
    sendAjax({
      "url":"fire/floor_monitor/editFloorMonitor",
      "data":{"id":id,"floor_region":floor_region,"location":location,"floor_desc":floor_desc,
          "floor_image":img,"video_stream_adr":video_stream_adr,"device_name":device_name},
      "callback":function(data){
        if (data.code=="s_ok") {
          layer.closeAll();
          layer.msg("保存成功");
          query();
          imgName=[];
        }else{
          imgName=[];
          layer.msg(data.var);
        }
       },error(data){
        layer.msg(data.var);
    }
  });
}
// 编辑
function remove_disabled() {
  $("body").find(".form_sub_release").find(".remove_disabled").removeAttr("disabled").removeAttr("style");
  $("#upload_a").show();$("#upload_b").hide();$(".enter_map_two").show();
  $("body").find(".form_sub_release").find(".upFileBtn").removeAttr("style");
  $("body").find(".form_sub_release").find(".fileInput").removeAttr("style");
  $("#rtmp_two object").hide();$("#imgBox img").removeClass("imgbig");$("#imgBox img").addClass("up-section");
  $("#rtmp_two input").show();
}
// 查询
query();
var markers=[];
function query() {
  var floor_region=$("#hot_city").val();
  $("#city").val()==''||$("#city").val()==undefined?floor_region=$("#hot_city").val():$("#area").val()==''||$("#area").val()==undefined?floor_region=$("#city").val():floor_region=$("#area").val();
  var device_name=$("#deviceName").val();
  var input_name=$("#userName").val();
  var start_time=$("#start_time").val();
  var end_time=$("#end_time").val();
  addBeiJing();
  sendAjax({
    "url":"fire/floor_monitor/getListFloorMonitorByCondition",
    "data":{"per_page":20,"current_page":1,"floor_region":Number(floor_region),"device_name":device_name,"start_time":start_time,"end_time":end_time,"input_name":input_name},"callback":function(data){
        $("#complete_report").html('');map.clearMap();
        if (data.code=="s_ok") {
          //总页数
          var num='';
          if(data.var.total=='0'){
              num=1;$(".complete_total").html(0);layer.msg('查询数据为空');
          }else{
            num=data.var.total;$(".complete_total").html(data.var.total);
            var result=data.var.data;
          
            $(".complete_page").createPage({
              pageCount:Math.ceil(num/20),
              current:1,
              backFn:function(p){
                sendAjax({
                  "url":"fire/floor_monitor/getListFloorMonitorByCondition",
                  "data":{"per_page":20,"current_page":p,"floor_region":Number(floor_region),"device_name":device_name,"start_time":start_time,"end_time":end_time,"input_name":input_name},"callback":function(data){
                    var result=data.var.data;
                    for(var i=0;i<result.length;i++){
                      
                      $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td class=\"lt\">" + result[i].location + "</td><td>" + result[i].device_name + "</td><td>" + result[i].input_name + "</td><td>" + result[i].create_time + "</td><td><a title=\"详情\" class=\"mr-5\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>");
                    }
                    $("#complete_report .mr-5").click(function() {
                      var index=$("#complete_report .mr-5").index(this);
                      report_index(result[index])
                    });
                    var userLevel = sessionStorage.getItem("userLevel");
                    if (userLevel=="1") {
                     
                      $("#complete_report .mr-5").siblings().hide();
                    }
                  }
                })
              }
            });
            for(var i=0;i<result.length;i++){
              $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td class=\"lt\">" + result[i].location + "</td><td>" + result[i].device_name + "</td><td>" + result[i].input_name + "</td><td>" + result[i].create_time + "</td><td><a title=\"详情\" class=\"mr-5\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>");
              var icon = new AMap.Icon({
                image:'img/LK/ground_icon.png',    
                size: new AMap.Size(76, 54)            
              });
              var lnglatXY=result[i].location.split(";");
              lnglatXY=JSON.parse('[' + String(lnglatXY[0]) + ']');
              //创建一个标记对象
              var marker = new AMap.Marker({       
                icon: icon,    
                position:lnglatXY,               
                zIndex: 300,
                title:result[i].city,        
                map:map                         
              });
              marker.setLabel({
                offset: new AMap.Pixel(-60, -20),
                content: result[i].region_name+'；'+result[i].device_name
              });
              markerClick(marker,result[i]);
            };
            $("#complete_report .mr-5").click(function() {
              var index=$("#complete_report .mr-5").index(this);
              report_index(result[index])
            });
            var userLevel = sessionStorage.getItem("userLevel");
            if (userLevel=="1") {
              console.log('普通用户');
              $("#complete_report .mr-5").siblings().hide();
            }
            map.setFitView();
          }
        }else{
          layer.msg('查询失败');
        }
      },
      error: function (e) {
          layer.alert("网络不好，请刷新试试！", {
          skin: 'layui-layer-molv' 
          ,closeBtn: 0,anim: 4,btnAlign: 'c'
        });
      }
  });
};

// 删除
function delete_data(id) {
  layer.confirm('确定要删除吗？',{
      btn: ['确定','取消'],
      skin: 'layui-layer-molv',
      title:'提示',
      btnAlign: 'c'
  }, function(){
    sendAjax({
      "url":"fire/floor_monitor/deleteFloorMonitor",
      "data":{"id":id},"callback":function(data){
          
          if (data.code=="s_ok"){
            layer.msg('删除成功');
            query();
            layer.closeAll('page');
            infoWindow.close();
          }else{
            layer.msg(data.var);
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
//地图和列表切换
$("#modeSwitch").click(function(){
    if($(this).val()=="切换成列表模式"){
        $("#container_map").hide();
        $(".container_table").show();
        $(this).val("切换成地图模式");
        $(".button-group").hide();
    }else{
        $("#container_map").show();
        $(".button-group").show();
        $(".container_table").hide();
        $(this).val("切换成列表模式");
    }
});
// 放大图片
$("body").on('click','.imgbig',function () {
    var src=$(this).attr("src");
    var $h1="<img src=\"" +src+ "\" style=\"height:98%;width:98%\">";
    layer.confirm(''+$h1+'', {
        type: 0,
        anim: 7,
        skin: 'layui-layer-molv',
        title:'图片预览',
        area: ['570px', '500px;'],
        shadeClose: true,
        btnAlign: 'c'
    }, function(){
        event.preventDefault();
        event.stopPropagation();
        layer.closeAll('dialog');
    }, function(){
    });
})

