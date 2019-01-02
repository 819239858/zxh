//基本地图加载
var map = new AMap.Map("distributionMap", {
    resizeEnable: true,
    zoom:8
});
var type= new AMap.MapType({
    defaultType:1,
    showRoad:true
});
map.addControl(type);
//查询
callback1();
function showFireHot_two(){

  var region=($("#city").val()==''||$("#city").val()==undefined)?$("#hot_city").val():($("#area").val()==''||$("#area").val()==undefined)?$("#city").val():$("#area").val();
  var type= $("#fire_type").val();
  var per_page=$("#numberBySearch").val();
  if(per_page==''){
      per_page=100
  }else{
      per_page=$("#numberBySearch").val();
  }
  addBeiJing();
  sendAjax({
    "url":"fire/fire_barrier/getDistributionDiagramList",
    "data":{"current_page": 1, "region":region,"per_page":per_page,"type":type},
      "callback":function(data){
        if (data.code=="s_ok") {
          map.clearMap();
          var data =data.var;
          if (data.FireBarrier_RS!="") {perform(data.FireBarrier_RS,"barrier.png","FireBarrier_RS")}//带
          if (data.FireControlTeam_RS!="") {perform(data.FireControlTeam_RS,"fireTeam.png","FireControlTeam_RS")}//消
          if (data.FireWatchtower_RS!="") {perform(data.FireWatchtower_RS,"tower.png","FireWatchtower_RS")}//塔
          if (data.FireMaterialReserve_RS!="") {perform(data.FireMaterialReserve_RS,"material.png","FireMaterialReserve_RS")}//物资
          if (data.FireOffice_RS!="") {perform(data.FireOffice_RS,"fireOffice.png","FireOffice_RS")}//防
        }else{
          layer.alert("网络不好，请刷新试试！", {
            skin: 'layui-layer-molv' 
            ,closeBtn: 0,anim: 4,btnAlign: 'c'
          });
        };
      }
  });
};

function perform(result,images,type) {
  for (var j = 0; j < result.length; j++) {
    var lnglatXY= result[j].location.replace(/[;]/g,'').split(",");
    var marker = new AMap.Marker({
      position: lnglatXY,
      icon:'img/wj/'+images,
      map: map
    });

    marker.setLabel({
      offset: new AMap.Pixel(-50, -20),
      content: result[j].region_name+'；'+result[j].phone
    });
    addHotMarkerClick_two(marker,result[j],type);
  }
};
//marker点击事件
function addHotMarkerClick_two(marker,data,type){
    marker.content ='<div>'+
    '<p style="color:#030303;font-size:14px;">区域:<span style="color:#999da8;margin-left:6px;">'+data.region_name+'</span></p>'+
    '<p style="color:#030303;font-size:14px;">位置:<span style="color:#999da8;margin-left:6px;">'+data.location+'</span></p>'+
    '<p style="color:#030303;font-size:14px;">管理人:<span style="color:#999da8;margin-left:6px;">'+data.administrator+'</span></p>'+
    '<p style="color:#030303;font-size:14px;">联系电话:<span style="color:#999da8;margin-left:6px;">'+data.phone+'</span></p>'+
    '<p style="color:#030303;font-size:14px;">成立时间:<span style="color:#999da8;margin-left:6px;">'+data.established_time+'</span></p>'+
    '<p style="color:#030303;font-size:14px;">录入时间:<span style="color:#999da8;margin-left:6px;">'+data.input_time+'</span></p>'+
    '<a href="javascript:;" class=\"ml-5\">详情</a></div>'
    AMap.event.addListener(marker, 'click', function() {
      infoWindow.setContent(marker.content);
      infoWindow.open(map, marker.getPosition());
      $(".ml-5").click(function() {
        if (type=="FireOffice_RS") { report_index(data);}
        if (type=="FireMaterialReserve_RS") { report_index2(data);}
        if (type=="FireWatchtower_RS") { report_index3(data);}
        if (type=="FireControlTeam_RS") { report_index4(data);}
        if (type=="FireBarrier_RS") { report_index1(data);}
      });
    });
};
var list=[];



// 办公室详情
function report_index(result) {
    sendAjax({
        "url": "fire/fire_office/getOfficeById",
        "data": {"id": result.id},
        "callback": function (element) {
            if (element.code == "s_ok") {
                var result = element.var;
                var userLevel = sessionStorage.getItem("userLevel");
                if(userLevel!='1'){
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btnAlign: 'c',
                        area: ['650px', '700px;'],
                        title:"防火办公室详情",
                        shadeClose: true,
                        content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label>" +
                        "<select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" style=\"display:none\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" disabled/></li>" +
                        "<li id=\"upload_a\">" +
                        "<label>当日值班人员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName4\" class=\"upFileBtn1\"></a>" +
                        "<label>防火室办公成员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName3\" class=\"upFileBtn1\"></a></li>" +
                        "<li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" disabled class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\"><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" disabled id=\"phone\"></li><li><label style=\"vertical-align:middle;\">视频流地址</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"rtmp\" style=\"display:none\"><div id=\"rtmp_two\" style=\"vertical-align:middle;display:inline-block\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\" style=\"display:none\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li>" +
                        "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> " +
                        "<input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user()\"></li></ul>"
                     // content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=''>城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" style=\"display:none\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" disabled/></li>" +
                     //    "<li id=\"upload_a\">" +
                     //    "<label>当日值班人员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName4\" class=\"upFileBtn1\"></a>" +
                     //    "<label>防火室办公成员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName3\" class=\"upFileBtn1\"></a></li>" +
                     //    "<li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" disabled class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\"><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" disabled id=\"phone\"></li><li><label style=\"vertical-align:middle;\">视频流地址</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"rtmp\" style=\"display:none\"><div id=\"rtmp_two\" style=\"vertical-align:middle;display:inline-block\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\" style=\"display:none\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li>" +
                     //    "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> " +
                     //    "<input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user()\"></li></ul>"
                    });
                }else{
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btnAlign: 'c',
                        area: ['650px', '700px;'],
                        title:"防火办公室详情",
                        shadeClose: true,
                        content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" style=\"display:none\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" disabled/></li>" +
                        "<li id=\"upload_a\">" +
                        "<label>当日值班人员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName4\" class=\"upFileBtn1\"></a>" +
                        "<label>防火室办公成员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName3\" class=\"upFileBtn1\"></a></li>" +
                        "<li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" disabled class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\"><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" disabled id=\"phone\"></li><li><label style=\"vertical-align:middle;\">视频流地址</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"rtmp\" style=\"display:none\"><div id=\"rtmp_two\" style=\"vertical-align:middle;display:inline-block\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\" style=\"display:none\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li>" +
                        "<li style=\"padding-left: 30%\">" +
                        "<input type=\"button\" value=\"取消\" class=\"report\" onclick=\"closeBtn()\"></li></ul>"
                    // content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=''>城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" style=\"display:none\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" disabled/></li>" +
                    //     "<li id=\"upload_a\">" +
                    //     "<label>当日值班人员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName4\" class=\"upFileBtn1\"></a>" +
                    //     "<label>防火室办公成员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName3\" class=\"upFileBtn1\"></a></li>" +
                    //     "<li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" disabled class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\"><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" disabled id=\"phone\"></li><li><label style=\"vertical-align:middle;\">视频流地址</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"rtmp\" style=\"display:none\"><div id=\"rtmp_two\" style=\"vertical-align:middle;display:inline-block\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\" style=\"display:none\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li>" +
                    //     "<li style=\"padding-left: 30%\">" +
                    //     "<input type=\"button\" value=\"取消\" class=\"report\" onclick=\"closeBtn()\"></li></ul>"
                    });
                }
                //将id保存，用与后面的编辑，传id
                sessionStorage.setItem("office_id",result.id);
                var publishName=result.video_stream_addr;
                var html = "<object width='430' height='150' id='SampleMediaPlayback' "+
                    "name='SampleMediaPlayback' type='application/x-shockwave-flash' "+
                    "classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' > "+
                    "<param name='movie' value='swfs/SampleMediaPlayback.swf' />  "+
                    "<param name='quality' value='high' /> "+
                    "<param name='bgcolor' value='#000000' /> "+
                    "<param name='allowfullscreen' value='true' />  "+
                    "<param name='flashvars'  "+
                    "value= '&src="+publishName+"&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'/> "+
                    "<embed src='swfs/SampleMediaPlayback.swf' width='380' height='230' "+
                    "id='SampleMediaPlayback' quality='high' bgcolor='#000000' "+
                    "name='SampleMediaPlayback' allowfullscreen='true'  "+
                    "pluginspage='http://www.adobe.com/go/getflashplayer'  "+
                    "flashvars='&src="+publishName+"&autoHideControlBar=true&streamType=live&autoPlay=true&verbose=true'  "+
                    "type='application/x-shockwave-flash'> </embed> "+
                    "</object>";

                var all_citys=localStorage.getItem('all_city');
                $('#province').html(all_citys);

                $("#rtmp_two").html(html);
                $("#latLngs").val(result.location);
                $("#buildTime").val(result.established_time);
                $("#inputTime").val(result.input_time);
                $("#desc").val(result.desc);
                $("#rtmp").val(result.video_stream_addr);
                $("#manage").val(result.administrator);
                $("#phone").val(result.phone);
                list=[];
                img_del=[];
                if (result.image_path.length>0) {
                    var images=result.image_path;
                    for (var i = 0; i < images.length; i++) {
                        $("#imgBox").append("<img src="+Public_address+'uploads/'+images[i].path+" onerror=\"this.style=&quot;display:none&quot;\" class=\"imgbig\">");
                        list.push(images[i].id);
                    }
                }
                $("#province option[value='" +(result.region).substr(0,4)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,4),$("#province"));
                $("#city_two option[value='" +(result.region).substr(0,6)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,6),$("#city_two"));
                $("#area option[value='" +(result.region).substr(0,9)+ "']").prop("selected", "selected");

                $("#upload_a").hide();
                if(result.current_person_path.length>0 && result.office_person_path.length>0){
                    $("#upload_a").before("<li id=\"upload_b\"><label>当日值班人员</label><a href="+Public_address+'uploads/'+result.current_person_path[0].path+" style=\"width:175px;display:inline-block;\" target=\"_blank\">下载</a>" +
                        "<label>防火室办公成员</label><a href="+Public_address+'uploads/'+result.office_person_path[0].path+" style=\"width:175px;display:inline-block;\" target=\"_blank\">下载</a></li>");
                }else if(result.current_person_path.length>0 && result.office_person_path.length == 0 ){
                    $("#upload_a").before("<li id=\"upload_b\"><label>当日值班人员</label><a href="+Public_address+'uploads/'+result.current_person_path[0].path+" style=\"width:175px;display:inline-block;\" target=\"_blank\">下载</a>" +
                        "<label>防火室办公成员</label><a href="+Public_address+'uploads/'+result.office_person+" style=\"width:175px;display:inline-block;\" target=\"_blank\">"+result.office_person+"</a></li>");
                }else if(result.current_person_path.length == 0 && result.office_person_path.length>0){
                    $("#upload_a").before("<li id=\"upload_b\"><label>当日值班人员</label><a href="+Public_address+'uploads/'+result.current_person+" style=\"width:175px;display:inline-block;\" target=\"_blank\">"+result.current_person+"</a>" +
                        "<label>防火室办公成员</label><a href="+Public_address+'uploads/'+result.office_person_path[0].path+" style=\"width:175px;display:inline-block;\" target=\"_blank\">下载</a></li>");
                }
                $("#photoName1").takungaeImgup({
                    formData: {
                        "path": "user_image",
                        "file_ext":"image"
                    },
                    url:"fire/upload/fileUpload",
                    id:"imgBox"
                });
                $("#photoName4").takungaeImgup({
                    formData: {
                        "path": "user_image",
                        "file_ext":"image"
                    },
                    url:"fire/upload/fileUpload",
                    id:"videoname"
                });
                $("#photoName3").takungaeImgup({
                    formData: {
                        "path": "user_image",
                        "file_ext":"image"
                    },
                    url:"fire/upload/fileUpload",
                    id:"docname"
                });
            } else {
                layer.msg(element.var);
            }
        },
        error(element){
            layer.msg(element);
        }
    })
};

// 办公室--编辑的保存
function disabled_user() {
    $(document).find(".form_sub_release").find(".remove_disabled").attr({"disabled":"disabled","style":"background-color:#f2f2f2"});
    $(".enter_map_two").hide();
    $(document).find(".form_sub_release").find(".upFileBtn").attr("style","display:none");
    $(document).find(".form_sub_release").find(".fileInput").attr("style","display:none");
    $("#upload_a").hide();$("#upload_b").show();
    $("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_two").val():region=$("#area").val();
    var location=$("#latLngs").val().replace(/[;]/g,'').replace(/[ ]/g,"");
    var builder_time=$("#buildTime").val();
    var video_stream_addr=$("#rtmp").val();
    var desc=$("#desc").val();
    var manage=$("#manage").val();
    var tel=$("#phone").val();
    if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(tel))) {
        layer.msg("手机号填写的格式不对，请正确填写");
        return false;
    }
    var id=sessionStorage.getItem("office_id");
    var current_person=videoName;
    var office_person=videoName;

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
    if (region!=''&&location!=''&&builder_time!=''&&manage!=''&&tel!='') {
        sendAjax({
            "url":"fire/fire_office/editOffice",
            "data":{"region": region, "location":location,"established_time":builder_time,"id":id,
                "video_stream_addr":video_stream_addr,"desc":desc,"administrator":manage,"phone":tel,
                "current_person":current_person,"office_person":office_person,"office_image":img},
            "callback":function(data){
                if (data.code=="s_ok") {
                    layer.closeAll('page');
                    imgName=[];
                    layer.alert("<img src='img/lqz/ok.png'><br>保存成功<br>", {
                        skin: 'layui-layer-molv',closeBtn: 0,anim: 4,btnAlign: 'c'
                    });
                }else{
                    layer.msg(data.var);
                    imgName=[];
                }
            },error(data){
                layer.msg(data);
            }
        });
    }
};
// 办公室-编辑
function remove_disabled() {
    $("body").find(".form_sub_release").find(".remove_disabled").removeAttr("disabled").removeAttr("style");
    $("#upload_a").show();$("#upload_b").hide();$(".enter_map_two").show();
    $("body").find(".form_sub_release").find(".upFileBtn").removeAttr("style");
    $("body").find(".form_sub_release").find(".fileInput").removeAttr("style");
    $("#rtmp_two").hide();
    $("#imgBox img").removeClass("imgbig");$("#imgBox img").addClass("up-section");
    callback1();
};

// 隔火带详情
function report_index1(result) {
    sendAjax({
        "url":"fire/fire_barrier/getFireBarrierInfo",
        "data":{"id": result.id},
        "callback":function(element){
            if (element.code=="s_ok"){
                var result= element.var;
                var userLevel = sessionStorage.getItem("userLevel");
                if(userLevel!='1'){
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btnAlign: 'c',
                        area: ['650px', '450px;'],
                        title:"防火隔离带信息",
                        shadeClose: true,
                        content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>长度(米)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" disabled value=\"\" id=\"length\"><label>宽度(米)<i style='color:red'>*</i></label><input type=\"text\" disabled class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"width\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" disabled id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li>" +
                        "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled_min()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick='disabled_user_min("+result.id+")'></li></ul>"
                    // content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>长度(米)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" disabled value=\"\" id=\"length\"><label>宽度(米)<i style='color:red'>*</i></label><input type=\"text\" disabled class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"width\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" disabled id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li>" +
                    //     "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled_min()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick='disabled_user_min("+result.id+")'></li></ul>"
                    });

                }else{
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btnAlign: 'c',
                        area: ['650px', '450px;'],
                        title:"防火隔离带信息",
                        shadeClose: true,
                        content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>长度(米)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" disabled value=\"\" id=\"length\"><label>宽度(米)<i style='color:red'>*</i></label><input type=\"text\" disabled class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"width\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" disabled id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li>" +
                        "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"取消\" class=\"report\" onclick='closeBtn()'></li></ul>"
                    // content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>长度(米)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" disabled value=\"\" id=\"length\"><label>宽度(米)<i style='color:red'>*</i></label><input type=\"text\" disabled class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"width\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" disabled id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li>" +
                    //     "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"取消\" class=\"report\" onclick='closeBtn()'></li></ul>"
                    });
                }
                var all_city=localStorage.getItem('all_city');
                $('#province').html(all_city);

                $("#latLngs").val(result.location);
                $("#buildTime").val(result.established_time);
                $("#inputTime").val(result.input_time);
                $("#desc").val(result.describe);
                $("#length").val(result.length);
                $("#width").val(result.width);
                $("#manage").val(result.administrator);
                $("#phone").val(result.phone);
                list=[];
                img_del=[];
                if (result.image_path.length>0) {
                    var images=result.image_path;
                    for (var i = 0; i < images.length; i++) {
                        $("#imgBox1").append("<img src="+Public_address+'uploads/'+images[i].path+" onerror=\"this.style=&quot;display:none&quot;\" class=\"imgbig\">");
                        list.push(images[i].id);
                    }
                }
                $("#province option[value='" +(result.region).substr(0,4)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,4),$("#province"));
                $("#city_two option[value='" +(result.region).substr(0,6)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,6),$("#city_two"));
                $("#area option[value='" +(result.region).substr(0,9)+ "']").prop("selected", "selected");
                $("#photoName2").takungaeImgup({
                    formData: {
                        "path": "user_image",
                        "file_ext":"image"
                    },
                    url:"fire/upload/fileUpload",
                    id:"imgBox1"
                });
            }else{
                layer.msg(element.var);
            }
        },
        error(element){
            layer.msg(element);
        }
    })
};
// 隔火带-保存
function disabled_user_min(id) {
    var region=$("#province").val();
    $("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_two").val():region=$("#area").val();
    var location=$("#latLngs").val().replace(/[;]/g,'').replace(/[ ]/g,"");
    var established_time=$("#buildTime").val();
    var long=$("#length").val();
    var width=$("#width").val();
    var describe=$("#desc").val();
    var administrator=$("#manage").val();
    var phone=$("#phone").val();
    if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(phone))) {
        layer.msg("手机号填写的格式不对，请正确填写");
        return false;
    }
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
    if (region!=''&&location!=''&&established_time!=''&&long!=''&&width!=''&&administrator!=''&&phone!='') {
        sendAjax({
            "url":"fire/fire_barrier/editFireBarrier",
            "data":{"id":id,"region":region,"location":location,"established_time":established_time,
                "length":long,"width":width,"describe":describe,"team_image":img,
                "administrator":administrator,"phone":phone},
            "callback":function(data){
                if (data.code=="s_ok") {
                    layer.closeAll('page');
                    layer.msg('保存成功');
                    imgName=[];
                }else{
                    layer.msg(data.var);imgName=[];
                }
            },error(data){
                layer.msg(data);
            }
        });
    }
};
//隔火带- 编辑
function remove_disabled_min() {
    $("body").find(".form_sub_release").find(".remove_disabled").removeAttr("disabled").removeAttr("style");
    $("#upload_a").show();$("#upload_b").hide();$(".enter_map_two").show();
    $("body").find(".form_sub_release").find(".upFileBtn").removeAttr("style");
    $("body").find(".form_sub_release").find(".fileInput").removeAttr("style");
    $("#imgBox1 img").removeClass("imgbig");$("#imgBox1 img").addClass("up-section");
};

// 消防队伍详情
function report_index4(result) {
    sendAjax({
        "url":"fire/fire_Control_Team/getFireControlTeamInfo",
        "data":{"id": result.id},
        "callback":function(element){
            if (element.code=="s_ok"){
                var result= element.var;
                var userLevel = sessionStorage.getItem("userLevel");

                if(userLevel!='1'){
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btnAlign: 'c',
                        area: ['650px', '480px;'],
                        title:"消防队伍信息",
                        shadeClose: true,
                        content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>队伍名称<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamName\" disabled><label>队伍人数<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamNo\" disabled></li><li><label>性质</label><select id=\"teamLevel\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"><option value=\"0\">专业</option><option value=\"1\">半专业</option><option value=\"2\">业余</option></select></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" disabled id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li>" +
                       "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled_per()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user_per("+result.id+")\"></li></ul>"
                    // content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>队伍名称<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamName\" disabled><label>队伍人数<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamNo\" disabled></li><li><label>性质</label><select id=\"teamLevel\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"><option value=\"0\">专业</option><option value=\"1\">半专业</option><option value=\"2\">业余</option></select></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" disabled id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li>" +
                    //     "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled_per()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user_per("+result.id+")\"></li></ul>"
                    });
                }else{
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btnAlign: 'c',
                        area: ['650px', '480px;'],
                        title:"消防队伍信息",
                        shadeClose: true,
                        content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>队伍名称<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamName\" disabled><label>队伍人数<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamNo\" disabled></li><li><label>性质</label><select id=\"teamLevel\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"><option value=\"0\">专业</option><option value=\"1\">半专业</option><option value=\"2\">业余</option></select></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" disabled id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li>" +
                        "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"取消\" class=\"report\" onclick=\"closeBtn()\"></li></ul>"
                   // content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>队伍名称<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamName\" disabled><label>队伍人数<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamNo\" disabled></li><li><label>性质</label><select id=\"teamLevel\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"><option value=\"0\">专业</option><option value=\"1\">半专业</option><option value=\"2\">业余</option></select></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" disabled id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li>" +
                   //     "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"取消\" class=\"report\" onclick=\"closeBtn()\"></li></ul>"
                    });
                }
                var all_city=localStorage.getItem('all_city');
                $('#province').html(all_city);


                $("#latLngs").val(result.location);
                $("#buildTime").val(result.established_time);
                $("#inputTime").val(result.create_time);
                $("#desc").val(result.describe);
                $("#manage").val(result.administrator);
                $("#phone").val(result.phone);
                $("#teamName").val(result.team_name);
                $("#teamNo").val(result.team_num);
                $("#teamLevel").get(0).selectedIndex=result.team_nature;
                list=[];
                img_del=[];
                if (result.image_path.length>0) {
                    var images=result.image_path;
                    for (var i = 0; i < images.length; i++) {
                        $("#imgBox1").append("<img src="+Public_address+'uploads/'+images[i].path+" onerror=\"this.style=&quot;display:none&quot;\" class=\"imgbig\">");
                        list.push(images[i].id);
                    }
                }
                $("#province option[value='" +(result.region).substr(0,4)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,4),$("#province"));
                $("#city_two option[value='" +(result.region).substr(0,6)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,6),$("#city_two"));
                $("#area option[value='" +(result.region).substr(0,9)+ "']").prop("selected", "selected");
                $("#photoName2").takungaeImgup({
                    formData: {
                        "path": "user_image",
                        "file_ext":"image"
                    },
                    url:"fire/upload/fileUpload",
                    id:"imgBox1"
                });
            }else{
                layer.msg(element.var);
            }
        },
        error(element){
            layer.msg(element);
        }
    })
}
// 消防队伍-保存
function disabled_user_per(id) {
    var region=$("#province").val();
    $("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_two").val():region=$("#area").val();
    var position=$("#latLngs").val().replace(/[;]/g,'').replace(/[ ]/g,"");
    var set_time=$("#buildTime").val();
    var describe=$("#desc").val();
    var admin=$("#manage").val();
    var admin_tel=$("#phone").val();
    if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(admin_tel))) {
        layer.msg("手机号填写的格式不对，请正确填写");
        return false;
    }

    if(img_del.length>0){
        //说明：修改中有删除图片
        for(var x=0;x<img_del.length;x++){
            list.splice(img_del[x],1);
        }
    }
    if(imgName.length>0){
        //说明：修改中有添加图片
        for(var y=0;y<imgName.length;y++){
            list.push(imgName[y]);
        }
    }
    var img=list;
    var team_name=$("#teamName").val();
    var team_num=$("#teamNo").val();
    var team_nature=$("#teamLevel").val();
    if (region!=''&&position!=''&&set_time!=''&&team_num!=''&&team_name!=''&&admin!=''&&admin_tel!='') {
        sendAjax({
            "url":"fire/fire_Control_Team/editFireControlTeam",
            "data":{"id":id,"region":region,"location":position,"established_time":set_time,"team_name":team_name,
                "team_num":team_num,"describe":describe,"team_image":img,
                "administrator":admin,"phone":admin_tel,"team_nature":team_nature},
            "callback":function(data){
                if (data.code=="s_ok") {
                    layer.closeAll('page');
                    layer.msg('保存成功');
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
        layer.alert("请完善消防队伍信息", {
            skin: 'layui-layer-molv',
            title:'温馨提示',
            closeBtn: 0,anim: 4,btnAlign: 'c'
        });
    }
}
// 消防队伍-编辑
function remove_disabled_per() {
    $("body").find(".form_sub_release").find(".remove_disabled").removeAttr("disabled").removeAttr("style");
    $("#upload_a").show();$("#upload_b").hide();$(".enter_map_two").show();
    $("body").find(".form_sub_release").find(".upFileBtn").removeAttr("style");
    $("body").find(".form_sub_release").find(".fileInput").removeAttr("style");
    $("#imgBox1 img").removeClass("imgbig");$("#imgBox1 img").addClass("up-section");
}

// 瞭望塔详情
function report_index3(result) {
    sendAjax({
        "url":"fire/fire_watchtower/getFireWatchtowerInfo",
        "data":{"id": result.id},
        "callback":function(element){
            if (element.code=="s_ok"){
                var result= element.var;
                var userLevel = sessionStorage.getItem("userLevel");
                if(userLevel!='1'){
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btnAlign: 'c',
                        area: ['650px', '500px;'],
                        title:"瞭望塔信息",
                        shadeClose: true,
                        content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设年份<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>高度(米)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"height\" disabled>" +
                        "<label>建设海拔(米)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"altitude\" disabled></li><li><label>覆盖范围(公里)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"radius\" disabled><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" class=\"Wdate remove_disabled form-control\" value=\"\" id=\"established_time\" onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" disabled></li>" +
                        "<li><label>装载设备</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"eqps\" disabled style=\"width: 150px;\"></textarea><label>描述</label><textarea style=\"width: 175px;\" class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li>" +
                        "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled_two()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user_two("+result.id+")\"></li></ul>"
                    // content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设年份<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>高度(米)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"height\" disabled>" +
                    //     "<label>建设海拔(米)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"altitude\" disabled></li><li><label>覆盖范围(公里)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"radius\" disabled><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" class=\"Wdate remove_disabled form-control\" value=\"\" id=\"established_time\" onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" disabled></li>" +
                    //     "<li><label>装载设备</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"eqps\" disabled style=\"width: 150px;\"></textarea><label>描述</label><textarea style=\"width: 175px;\" class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li>" +
                    //     "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled_two()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user_two("+result.id+")\"></li></ul>"
                    });
                }else{
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btnAlign: 'c',
                        area: ['650px', '500px;'],
                        title:"瞭望塔信息",
                        shadeClose: true,
                        content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设年份<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>高度(米)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"height\" disabled>" +
                        "<label>建设海拔(米)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"altitude\" disabled></li><li><label>覆盖范围(公里)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"radius\" disabled><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" class=\"Wdate remove_disabled form-control\" value=\"\" id=\"established_time\" onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" disabled></li>" +
                        "<li><label>装载设备</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"eqps\" disabled style=\"width: 150px;\"></textarea><label>描述</label><textarea style=\"width: 175px;\" class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li>" +
                        "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"取消\" class=\"report\" onclick=\"closeBtn()\"></li></ul>"
                    // content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设年份<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>高度(米)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"height\" disabled>" +
                    //     "<label>建设海拔(米)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"altitude\" disabled></li><li><label>覆盖范围(公里)<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"radius\" disabled><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" class=\"Wdate remove_disabled form-control\" value=\"\" id=\"established_time\" onclick=\"WdatePicker({dateFmt:'yyyy-MM'})\" disabled></li>" +
                    //     "<li><label>装载设备</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"eqps\" disabled style=\"width: 150px;\"></textarea><label>描述</label><textarea style=\"width: 175px;\" class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li>" +
                    //     "<li style=\"padding-left: 30%\"><input type=\"button\" value=\"取消\" class=\"report\" onclick=\"closeBtn()\"></li></ul>"
                    });
                }
                var all_city=localStorage.getItem('all_city');
                $('#province').html(all_city);

                $("#latLngs").val(result.location);
                $("#buildTime").val(result.create_year);
                $("#inputTime").val(result.create_time);
                $("#desc").val(result.describe);
                $("#eqps").val(result.loading_equipment);
                $("#manage").val(result.administrator);
                $("#phone").val(result.phone);
                $("#height").val(result.height);
                $("#altitude").val(result.create_elevation);
                $("#radius").val(result.coverage_area);
                $("#established_time").val(result.established_time);
                list=[];
                img_del=[];
                if (result.image_path.length>0) {
                    var images=result.image_path;
                    for (var i = 0; i < images.length; i++) {
                        $("#imgBox1").append("<img src="+Public_address+'uploads/'+images[i].path+" onerror=\"this.style=&quot;display:none&quot;\" class=\"imgbig\">");
                        list.push(images[i].id);
                    }
                }
                $("#province option[value='" +(result.region).substr(0,4)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,4),$("#province"));
                $("#city_two option[value='" +(result.region).substr(0,6)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,6),$("#city_two"));
                $("#area option[value='" +(result.region).substr(0,9)+ "']").prop("selected", "selected");
                $("#photoName2").takungaeImgup({
                    formData: {
                        "path": "user_image",
                        "file_ext":"image"
                    },
                    url:"fire/upload/fileUpload",
                    id:"imgBox1"
                });
            }else{
                layer.msg(element.var);
            }
        },
        error(element){
            layer.msg(element);
        }
    })
}
// 瞭望塔=保存
function disabled_user_two(id) {
    var region=$("#province").val();
    $("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_two").val():region=$("#area").val();
    var location=$("#latLngs").val().replace(/[;]/g,'').replace(/[ ]/g,"");
    var create_year=$("#buildTime").val();
    var describe=$("#desc").val();
    var administrator=$("#manage").val();
    var phone=$("#phone").val();
    if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(phone))) {
        layer.msg("手机号填写的格式不对，请正确填写");
        return false;
    }

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
    var loading_equipment=$("#eqps").val();
    var coverage_area=$("#radius").val();
    var height=$("#height").val();
    var create_elevation=$("#altitude").val();
    var established_time=$("#established_time").val();
    var data={"id":id,"region":region,"location":location,
        "create_year":create_year,"loading_equipment":loading_equipment,
        "coverage_area":coverage_area,"describe":describe,'team_image':img,
        "administrator":administrator,"phone":phone,"height":height,
        "create_elevation":create_elevation,"established_time":established_time};
    if (region!=''&&location!=''&&create_year!=''&&height!=''&&create_elevation!=''&&administrator!=''&&phone!=''&&established_time!='') {
        sendAjax({
            'url':"fire/fire_watchtower/editFireWatchtower",
            contentType:"application/json;charset=utf-8",
            'data':data,
            'callback':function(data){
                if (data.code=="s_ok") {
                    layer.closeAll('page');
                    layer.msg('保存成功');
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
        layer.alert("请完善瞭望台信息", {
            skin: 'layui-layer-molv',
            title:'温馨提示',
            closeBtn: 0,anim: 4,btnAlign: 'c'
        });
    }
}
// 瞭望塔=编辑
function remove_disabled_two() {
    $("body").find(".form_sub_release").find(".remove_disabled").removeAttr("disabled").removeAttr("style");
    $("#upload_a").show();$("#upload_b").hide();$(".enter_map_two").show();
    $("body").find(".form_sub_release").find(".upFileBtn").removeAttr("style");
    $("body").find(".form_sub_release").find(".fileInput").removeAttr("style");
    $("#imgBox1 img").removeClass("imgbig");$("#imgBox1 img").addClass("up-section");
}

// 物资储备库详情
function report_index2(result){
    sendAjax({
        "url":"fire/fire_material_reserve/getFireMaterialReserveInfo",
        "data":{"id": result.id},"callback":function(element){
            if (element.code=="s_ok"){
                var result= element.var;
                var userLevel = sessionStorage.getItem("userLevel");
                if(userLevel!='1'){
                    layer.open({
                        type: 1,
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        skin: 'layui-layer-molv',
                        btnAlign: 'c',
                        area: ['1000px', '700px;'],
                        title:'查看物资储备库信息',
                        shadeClose: true, //开启遮罩关闭
                        content:"<table class=\"detail_info\"><tr><td><ul class=\"add_office\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select></li><li><label>录入时间<i style='color:red'>*</i></label><input class='' id=\"detail_inputTime\" type=\"text\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\" disabled></li><li><label>职务</label><input id=\"detail_duty\" class=\"remove_disabled\" type=\"text\" disabled></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class='' disabled id=\"detail_latLngs\" disabled style='margin-right:2px;'><input disabled style='width:82px;height:30px;border:none;background:#addc9d;color:#fff;display:none;' class=\"enter_map_two remove_disabled\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#detail_latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设面积(平方米)<i style='color:red'>*</i></label><input disabled id=\"detail_buildArea\" class=\"remove_disabled\" type=\"text\"></li><li><label>联系电话<i style='color:red'>*</i></label><input disabled id=\"detail_phone\" class=\"remove_disabled\" type=\"text\"></li><li><label>成立时间<i style='color:red'>*</i></label><input disabled id=\"detail_buildtime\" class=\"remove_disabled\"  type=\"text\" onclick=\"WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\"></li><li><label>管理人<i style='color:red'>*</i></label><input id=\"detail_manager\" disabled type=\"text\" class=\"remove_disabled\"></li><li style=\"height:110px;\"><label style=\"margin-top:-85px;\">描述</label><textarea disabled class=\"remove_disabled\" id=\"detail_desc\" style=\"width:190px;height:100px;top:20px;resize: none;\"/></li><li style=\"height:80px;width:900px;\"><label style=\"margin-top:5px;\">图片上传</label><input type=\"file\" id=\"detail_photoName1\" class=\"upFileBtn hide_it\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput hide_it\" id=\"detail_img\" src=\"img/LK/tjtp.png\" onclick=\"$('#detail_photoName1').click()\">" +
                        "<div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul></td><td><ul class=\"add_material\" ><li><label>GPS<i style='color:red'>*</i></label><input disabled id=\"detail_gps\" class=\"remove_disabled\" type=\"text\"></li><li><label>油锯<i style='color:red'>*</i></label><input disabled id=\"detail_yj\" class=\"remove_disabled\" type=\"text\"></li><li><label>水泵<i style='color:red'>*</i></label><input disabled id=\"detail_sb\" class=\"remove_disabled\" type=\"text\"></li><li><label>大斧<i style='color:red'>*</i></label><input disabled id=\"detail_df\" class=\"remove_disabled\" type=\"text\"></li><li><label>砍刀<i style='color:red'>*</i></label><input disabled id=\"detail_kd\" class=\"remove_disabled\" type=\"text\"></li><li><label>服装<i style='color:red'>*</i></label><input disabled id=\"detail_fz\" class=\"remove_disabled\" type=\"text\"></li><li><label>帐篷<i style='color:red'>*</i></label><input disabled id=\"detail_zp\" class=\"remove_disabled\" type=\"text\"></li><li><label>睡袋<i style='color:red'>*</i></label><input disabled id=\"detail_sd\" class=\"remove_disabled\" type=\"text\"></li><li><label>其他<i style='color:red'>*</i></label><input disabled id=\"detail_qt\" class=\"remove_disabled\" type=\"text\"></li><li><label>无人机<i style='color:red'>*</i></label><input disabled id=\"detail_wrj\" class=\"remove_disabled\" type=\"text\"></li><li><label>割灌机<i style='color:red'>*</i></label><input disabled id=\"detail_ggj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风速仪<i style='color:red'>*</i></label><input disabled id=\"detail_fsy\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>消防铲<i style='color:red'>*</i></label><input disabled id=\"detail_xfc\" class=\"remove_disabled\" type=\"text\"></li><li><label>发电机<i style='color:red'>*</i></label><input disabled id=\"detail_fdj\" class=\"remove_disabled\" type=\"text\"></li><li><label>点火机<i style='color:red'>*</i></label><input disabled id=\"detail_dhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>通讯车<i style='color:red'>*</i></label><input class=\"remove_disabled\" disabled id=\"detail_txc\" type=\"text\"></li><li><label>车载台<i style='color:red'>*</i></label><input disabled id=\"detail_czt\" class=\"remove_disabled\"type=\"text\"></li><li><label>运兵车<i style='color:red'>*</i></label><input disabled id=\"detail_ybc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水车<i style='color:red'>*</i></label><input disabled id=\"detail_mhsc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水枪<i style='color:red'>*</i></label><input disabled id=\"detail_mhsq\" class=\"remove_disabled\" type=\"text\"></li><li><label>二三号工具<i style='color:red'>*</i></label><input disabled id=\"detail_eshgj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风力灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_flmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>余火探测仪<i style='color:red'>*</i></label><input disabled id=\"detail_yhtcy\" class=\"remove_disabled\" type=\"text\"></li><li><label>手持对讲机<i style='color:red'>*</i></label><input disabled id=\"deatil_scdjj\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>风水灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_fsmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>高压细水雾灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_gyxswmhj\" class=\"remove_disabled\" type=\"text\"></li></ul></td></tr></table>" +
                        "<div class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled_home()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user_home("+result.id+")\"></div>"
                   // content:"<table class=\"detail_info\"><tr><td><ul class=\"add_office\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select></li><li><label>录入时间<i style='color:red'>*</i></label><input class='' id=\"detail_inputTime\" type=\"text\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\" disabled></li><li><label>职务</label><input id=\"detail_duty\" class=\"remove_disabled\" type=\"text\" disabled></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class='' disabled id=\"detail_latLngs\" disabled style='margin-right:2px;'><input disabled style='width:82px;height:30px;border:none;background:#addc9d;color:#fff;display:none;' class=\"enter_map_two remove_disabled\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#detail_latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设面积(平方米)<i style='color:red'>*</i></label><input disabled id=\"detail_buildArea\" class=\"remove_disabled\" type=\"text\"></li><li><label>联系电话<i style='color:red'>*</i></label><input disabled id=\"detail_phone\" class=\"remove_disabled\" type=\"text\"></li><li><label>成立时间<i style='color:red'>*</i></label><input disabled id=\"detail_buildtime\" class=\"remove_disabled\"  type=\"text\" onclick=\"WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\"></li><li><label>管理人<i style='color:red'>*</i></label><input id=\"detail_manager\" disabled type=\"text\" class=\"remove_disabled\"></li><li style=\"height:110px;\"><label style=\"margin-top:-85px;\">描述</label><textarea disabled class=\"remove_disabled\" id=\"detail_desc\" style=\"width:190px;height:100px;top:20px;resize: none;\"/></li><li style=\"height:80px;width:900px;\"><label style=\"margin-top:5px;\">图片上传</label><input type=\"file\" id=\"detail_photoName1\" class=\"upFileBtn hide_it\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput hide_it\" id=\"detail_img\" src=\"img/LK/tjtp.png\" onclick=\"$('#detail_photoName1').click()\">" +
                   //      "<div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul></td><td><ul class=\"add_material\" ><li><label>GPS<i style='color:red'>*</i></label><input disabled id=\"detail_gps\" class=\"remove_disabled\" type=\"text\"></li><li><label>油锯<i style='color:red'>*</i></label><input disabled id=\"detail_yj\" class=\"remove_disabled\" type=\"text\"></li><li><label>水泵<i style='color:red'>*</i></label><input disabled id=\"detail_sb\" class=\"remove_disabled\" type=\"text\"></li><li><label>大斧<i style='color:red'>*</i></label><input disabled id=\"detail_df\" class=\"remove_disabled\" type=\"text\"></li><li><label>砍刀<i style='color:red'>*</i></label><input disabled id=\"detail_kd\" class=\"remove_disabled\" type=\"text\"></li><li><label>服装<i style='color:red'>*</i></label><input disabled id=\"detail_fz\" class=\"remove_disabled\" type=\"text\"></li><li><label>帐篷<i style='color:red'>*</i></label><input disabled id=\"detail_zp\" class=\"remove_disabled\" type=\"text\"></li><li><label>睡袋<i style='color:red'>*</i></label><input disabled id=\"detail_sd\" class=\"remove_disabled\" type=\"text\"></li><li><label>其他<i style='color:red'>*</i></label><input disabled id=\"detail_qt\" class=\"remove_disabled\" type=\"text\"></li><li><label>无人机<i style='color:red'>*</i></label><input disabled id=\"detail_wrj\" class=\"remove_disabled\" type=\"text\"></li><li><label>割灌机<i style='color:red'>*</i></label><input disabled id=\"detail_ggj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风速仪<i style='color:red'>*</i></label><input disabled id=\"detail_fsy\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>消防铲<i style='color:red'>*</i></label><input disabled id=\"detail_xfc\" class=\"remove_disabled\" type=\"text\"></li><li><label>发电机<i style='color:red'>*</i></label><input disabled id=\"detail_fdj\" class=\"remove_disabled\" type=\"text\"></li><li><label>点火机<i style='color:red'>*</i></label><input disabled id=\"detail_dhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>通讯车<i style='color:red'>*</i></label><input class=\"remove_disabled\" disabled id=\"detail_txc\" type=\"text\"></li><li><label>车载台<i style='color:red'>*</i></label><input disabled id=\"detail_czt\" class=\"remove_disabled\"type=\"text\"></li><li><label>运兵车<i style='color:red'>*</i></label><input disabled id=\"detail_ybc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水车<i style='color:red'>*</i></label><input disabled id=\"detail_mhsc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水枪<i style='color:red'>*</i></label><input disabled id=\"detail_mhsq\" class=\"remove_disabled\" type=\"text\"></li><li><label>二三号工具<i style='color:red'>*</i></label><input disabled id=\"detail_eshgj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风力灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_flmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>余火探测仪<i style='color:red'>*</i></label><input disabled id=\"detail_yhtcy\" class=\"remove_disabled\" type=\"text\"></li><li><label>手持对讲机<i style='color:red'>*</i></label><input disabled id=\"deatil_scdjj\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>风水灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_fsmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>高压细水雾灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_gyxswmhj\" class=\"remove_disabled\" type=\"text\"></li></ul></td></tr></table>" +
                   //      "<div class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled_home()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user_home("+result.id+")\"></div>"
                    });
                }else{
                    layer.open({
                        type: 1,
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        skin: 'layui-layer-molv',
                        btnAlign: 'c',
                        area: ['1000px', '700px;'],
                        title:'查看物资储备库信息',
                        shadeClose: true, //开启遮罩关闭
                        content:"<table class=\"detail_info\"><tr><td><ul class=\"add_office\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select></li><li><label>录入时间<i style='color:red'>*</i></label><input class='' id=\"detail_inputTime\" type=\"text\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\" disabled></li><li><label>职务</label><input id=\"detail_duty\" class=\"remove_disabled\" type=\"text\" disabled></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class='' disabled id=\"detail_latLngs\" disabled style='margin-right:2px;'><input disabled style='width:82px;height:30px;border:none;background:#addc9d;color:#fff;display:none;' class=\"enter_map_two remove_disabled\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#detail_latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设面积(平方米)<i style='color:red'>*</i></label><input disabled id=\"detail_buildArea\" class=\"remove_disabled\" type=\"text\"></li><li><label>联系电话<i style='color:red'>*</i></label><input disabled id=\"detail_phone\" class=\"remove_disabled\" type=\"text\"></li><li><label>成立时间<i style='color:red'>*</i></label><input disabled id=\"detail_buildtime\" class=\"remove_disabled\"  type=\"text\" onclick=\"WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\"></li><li><label>管理人<i style='color:red'>*</i></label><input id=\"detail_manager\" disabled type=\"text\" class=\"remove_disabled\"></li><li style=\"height:110px;\"><label style=\"margin-top:-85px;\">描述</label><textarea disabled class=\"remove_disabled\" id=\"detail_desc\" style=\"width:190px;height:100px;top:20px;resize: none;\"/></li><li style=\"height:80px;width:900px;\"><label style=\"margin-top:5px;\">图片</label><input type=\"file\" id=\"detail_photoName1\" class=\"upFileBtn hide_it\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput hide_it\" id=\"detail_img\" src=\"img/LK/tjtp.png\" onclick=\"$('#detail_photoName1').click()\">" +
                        "<div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul></td><td><ul class=\"add_material\" ><li><label>GPS<i style='color:red'>*</i></label><input disabled id=\"detail_gps\" class=\"remove_disabled\" type=\"text\"></li><li><label>油锯<i style='color:red'>*</i></label><input disabled id=\"detail_yj\" class=\"remove_disabled\" type=\"text\"></li><li><label>水泵<i style='color:red'>*</i></label><input disabled id=\"detail_sb\" class=\"remove_disabled\" type=\"text\"></li><li><label>大斧<i style='color:red'>*</i></label><input disabled id=\"detail_df\" class=\"remove_disabled\" type=\"text\"></li><li><label>砍刀<i style='color:red'>*</i></label><input disabled id=\"detail_kd\" class=\"remove_disabled\" type=\"text\"></li><li><label>服装<i style='color:red'>*</i></label><input disabled id=\"detail_fz\" class=\"remove_disabled\" type=\"text\"></li><li><label>帐篷<i style='color:red'>*</i></label><input disabled id=\"detail_zp\" class=\"remove_disabled\" type=\"text\"></li><li><label>睡袋<i style='color:red'>*</i></label><input disabled id=\"detail_sd\" class=\"remove_disabled\" type=\"text\"></li><li><label>其他<i style='color:red'>*</i></label><input disabled id=\"detail_qt\" class=\"remove_disabled\" type=\"text\"></li><li><label>无人机<i style='color:red'>*</i></label><input disabled id=\"detail_wrj\" class=\"remove_disabled\" type=\"text\"></li><li><label>割灌机<i style='color:red'>*</i></label><input disabled id=\"detail_ggj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风速仪<i style='color:red'>*</i></label><input disabled id=\"detail_fsy\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>消防铲<i style='color:red'>*</i></label><input disabled id=\"detail_xfc\" class=\"remove_disabled\" type=\"text\"></li><li><label>发电机<i style='color:red'>*</i></label><input disabled id=\"detail_fdj\" class=\"remove_disabled\" type=\"text\"></li><li><label>点火机<i style='color:red'>*</i></label><input disabled id=\"detail_dhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>通讯车<i style='color:red'>*</i></label><input class=\"remove_disabled\" disabled id=\"detail_txc\" type=\"text\"></li><li><label>车载台<i style='color:red'>*</i></label><input disabled id=\"detail_czt\" class=\"remove_disabled\"type=\"text\"></li><li><label>运兵车<i style='color:red'>*</i></label><input disabled id=\"detail_ybc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水车<i style='color:red'>*</i></label><input disabled id=\"detail_mhsc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水枪<i style='color:red'>*</i></label><input disabled id=\"detail_mhsq\" class=\"remove_disabled\" type=\"text\"></li><li><label>二三号工具<i style='color:red'>*</i></label><input disabled id=\"detail_eshgj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风力灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_flmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>余火探测仪<i style='color:red'>*</i></label><input disabled id=\"detail_yhtcy\" class=\"remove_disabled\" type=\"text\"></li><li><label>手持对讲机<i style='color:red'>*</i></label><input disabled id=\"deatil_scdjj\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>风水灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_fsmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>高压细水雾灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_gyxswmhj\" class=\"remove_disabled\" type=\"text\"></li></ul></td></tr></table>" +
                        "<div class=\"background_user_information\"><input type=\"button\" value=\"取消\" class=\"report submit\" onclick=\"closeBtn()\"></div>"
                    // content:"<table class=\"detail_info\"><tr><td><ul class=\"add_office\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select></li><li><label>录入时间<i style='color:red'>*</i></label><input class='' id=\"detail_inputTime\" type=\"text\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\" disabled></li><li><label>职务</label><input id=\"detail_duty\" class=\"remove_disabled\" type=\"text\" disabled></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class='' disabled id=\"detail_latLngs\" disabled style='margin-right:2px;'><input disabled style='width:82px;height:30px;border:none;background:#addc9d;color:#fff;display:none;' class=\"enter_map_two remove_disabled\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#detail_latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设面积(平方米)<i style='color:red'>*</i></label><input disabled id=\"detail_buildArea\" class=\"remove_disabled\" type=\"text\"></li><li><label>联系电话<i style='color:red'>*</i></label><input disabled id=\"detail_phone\" class=\"remove_disabled\" type=\"text\"></li><li><label>成立时间<i style='color:red'>*</i></label><input disabled id=\"detail_buildtime\" class=\"remove_disabled\"  type=\"text\" onclick=\"WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\"></li><li><label>管理人<i style='color:red'>*</i></label><input id=\"detail_manager\" disabled type=\"text\" class=\"remove_disabled\"></li><li style=\"height:110px;\"><label style=\"margin-top:-85px;\">描述</label><textarea disabled class=\"remove_disabled\" id=\"detail_desc\" style=\"width:190px;height:100px;top:20px;resize: none;\"/></li><li style=\"height:80px;width:900px;\"><label style=\"margin-top:5px;\">图片</label><input type=\"file\" id=\"detail_photoName1\" class=\"upFileBtn hide_it\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput hide_it\" id=\"detail_img\" src=\"img/LK/tjtp.png\" onclick=\"$('#detail_photoName1').click()\">" +
                    //     "<div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul></td><td><ul class=\"add_material\" ><li><label>GPS<i style='color:red'>*</i></label><input disabled id=\"detail_gps\" class=\"remove_disabled\" type=\"text\"></li><li><label>油锯<i style='color:red'>*</i></label><input disabled id=\"detail_yj\" class=\"remove_disabled\" type=\"text\"></li><li><label>水泵<i style='color:red'>*</i></label><input disabled id=\"detail_sb\" class=\"remove_disabled\" type=\"text\"></li><li><label>大斧<i style='color:red'>*</i></label><input disabled id=\"detail_df\" class=\"remove_disabled\" type=\"text\"></li><li><label>砍刀<i style='color:red'>*</i></label><input disabled id=\"detail_kd\" class=\"remove_disabled\" type=\"text\"></li><li><label>服装<i style='color:red'>*</i></label><input disabled id=\"detail_fz\" class=\"remove_disabled\" type=\"text\"></li><li><label>帐篷<i style='color:red'>*</i></label><input disabled id=\"detail_zp\" class=\"remove_disabled\" type=\"text\"></li><li><label>睡袋<i style='color:red'>*</i></label><input disabled id=\"detail_sd\" class=\"remove_disabled\" type=\"text\"></li><li><label>其他<i style='color:red'>*</i></label><input disabled id=\"detail_qt\" class=\"remove_disabled\" type=\"text\"></li><li><label>无人机<i style='color:red'>*</i></label><input disabled id=\"detail_wrj\" class=\"remove_disabled\" type=\"text\"></li><li><label>割灌机<i style='color:red'>*</i></label><input disabled id=\"detail_ggj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风速仪<i style='color:red'>*</i></label><input disabled id=\"detail_fsy\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>消防铲<i style='color:red'>*</i></label><input disabled id=\"detail_xfc\" class=\"remove_disabled\" type=\"text\"></li><li><label>发电机<i style='color:red'>*</i></label><input disabled id=\"detail_fdj\" class=\"remove_disabled\" type=\"text\"></li><li><label>点火机<i style='color:red'>*</i></label><input disabled id=\"detail_dhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>通讯车<i style='color:red'>*</i></label><input class=\"remove_disabled\" disabled id=\"detail_txc\" type=\"text\"></li><li><label>车载台<i style='color:red'>*</i></label><input disabled id=\"detail_czt\" class=\"remove_disabled\"type=\"text\"></li><li><label>运兵车<i style='color:red'>*</i></label><input disabled id=\"detail_ybc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水车<i style='color:red'>*</i></label><input disabled id=\"detail_mhsc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水枪<i style='color:red'>*</i></label><input disabled id=\"detail_mhsq\" class=\"remove_disabled\" type=\"text\"></li><li><label>二三号工具<i style='color:red'>*</i></label><input disabled id=\"detail_eshgj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风力灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_flmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>余火探测仪<i style='color:red'>*</i></label><input disabled id=\"detail_yhtcy\" class=\"remove_disabled\" type=\"text\"></li><li><label>手持对讲机<i style='color:red'>*</i></label><input disabled id=\"deatil_scdjj\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>风水灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_fsmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>高压细水雾灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_gyxswmhj\" class=\"remove_disabled\" type=\"text\"></li></ul></td></tr></table>" +
                    //     "<div class=\"background_user_information\"><input type=\"button\" value=\"取消\" class=\"report submit\" onclick=\"closeBtn()\"></div>"
                    });
                }
                var all_city=localStorage.getItem('all_city');
                $('#province').html(all_city);

                $("#detail_inputTime").val(result.input_time);
                $("#detail_duty").val(result.duty);
                $('#detail_latLngs').val(result.location);
                $('#detail_buildArea').val(result.construction_area);
                $('#detail_phone').val(result.phone);
                $('#detail_buildtime').val(result.established_time);
                $('#detail_manager').val(result.administrator);
                $('#detail_desc').val(result.describe);
                $('#detail_gps').val(result.gps);
                $('#detail_yj').val(result.chain_saw);
                $('#detail_sb').val(result.water_pump);
                $('#detail_df').val(result.broadax);
                $('#detail_kd').val(result.hacking_knife);
                $('#detail_fz').val(result.clothing);
                $('#detail_zp').val(result.tent);
                $('#detail_sd').val(result.sleeping_bag);
                $('#detail_qt').val(result.rests);
                $('#detail_wrj').val(result.uav);
                $('#detail_ggj').val(result.brush_cutter);
                $('#detail_fsy').val(result.anemograph);
                $('#detail_xfc').val(result.fire_shovel);
                $('#detail_fdj').val(result.dynamo);
                $('#detail_dhj').val(result.dynamo_exploder);
                $('#detail_txc').val(result.communication_van);
                $('#detail_czt').val(result.vehicular_locating_set);
                $('#detail_ybc').val(result.troop_crawler);
                $("#detail_mhsc").val(result.fire_fighting_water_wheel);
                $('#detail_mhsq').val(result.fire_hoses);
                $('#detail_eshgj').val(result.two_three_tool);
                $('#detail_flmhj').val(result.pneumatic_extinguisher);
                $('#detail_yhtcy').val(result.residual_fire_detector);
                $('#deatil_scdjj').val(result.handheld_radio_equipment);
                $('#detail_fsmhj').val(result.pneumatic_extinguisher);
                $('#detail_gyxswmhj').val(result.high_pressure_mist_extinguisher);
                list=[];
                img_del=[];
                if (result.image_path.length>0) {
                    var images=result.image_path;
                    for (var i = 0; i < images.length; i++) {
                        $("#imgBox").append("<img src="+Public_address+'uploads/'+images[i].path+" onerror=\"this.style=&quot;display:none&quot;\" class=\"imgbig\">");
                        list.push(images[i].id);
                    }
                }
                $("#province option[value='" +(result.region).substr(0,4)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,4),$("#province"));
                $("#city_two option[value='" +(result.region).substr(0,6)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,6),$("#city_two"));
                $("#area option[value='" +(result.region).substr(0,9)+ "']").prop("selected", "selected");
                //点击上传图片
                $("#detail_photoName1").takungaeImgup({
                    formData: {
                        "path": "user_image",
                        "file_ext":"image"
                    },
                    url:"fire/upload/fileUpload",
                    id:"imgBox"
                });
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
};
//普通用户的取消按钮
function closeBtn() {
    layer.closeAll('page');
}
//物资储备库-编辑
function remove_disabled_home() {
    $(".enter_map_two").show();$("#detail_latLngs").css("width","105px");
    $("body").find(".detail_info").find(".remove_disabled").removeAttr("disabled");
    $("#detail_photoName1").removeClass('hide_it');
    $('select').removeAttr("style");
    $('#detail_img').removeClass('hide_it');
    $("#imgBox img").removeClass("imgbig");$("#imgBox img").addClass("up-section");
};
//物资储备库-保存
function disabled_user_home(id){
    var region=$("#province").val();
    $("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_two").val():region=$("#area").val();
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
    var add_info={
        "id":id,
        "region":region,
        "location":$("#detail_latLngs").val().replace(/[;]/g,'').replace(/[ ]/g,""),
        "established_time":$('#detail_buildtime').val(),
        "administrator":$('#detail_manager').val(),
        "duty":$('#detail_duty').val(),
        "phone":$('#detail_phone').val(),
        "gps":$('#detail_gps').val(),
        "chain_saw":$('#detail_yj').val(),
        "water_pump":$("#detail_sb").val(),
        "broadax":$('#detail_df').val(),
        "hacking_knife":$('#detail_kd').val(),
        "clothing":$('#detail_fz').val(),
        "tent":$('#detail_zp').val(),
        "sleeping_bag":$('#detail_sd').val(),
        "rests":$('#detail_qt').val(),
        "uav":$('#detail_wrj').val(),
        "brush_cutter":$('#detail_ggj').val(),
        "anemograph":$('#detail_fsy').val(),
        "fire_shovel":$('#detail_xfc').val(),
        "dynamo":$('#detail_fdj').val(),
        "dynamo_exploder":$('#detail_dhj').val(),
        "fire_fighting_water_wheel":$('#detail_mhsc').val(),
        "two_three_tool":$('#detail_eshgj').val(),
        "pneumatic_extinguisher":$('#detail_flmhj').val(),
        "residual_fire_detector":$('#detail_yhtcy').val(),
        "handheld_radio_equipment":$('#deatil_scdjj').val(),
        "wind_water_fire_extinguisher":$('#detail_fsmhj').val(),
        "high_pressure_mist_extinguisher":$('#detail_gyxswmhj').val(),
        "describe":$('#detail_desc').val(),
        "communication_van":$('#detail_txc').val(),
        "vehicular_locating_set":$('#detail_czt').val(),
        "troop_crawler":$("#detail_ybc").val(),
        "fire_hoses":$("#detail_mhsq").val(),
        "team_image":img,
        "construction_area":$("#detail_buildArea").val(),
        "duty":$("#detail_duty").val()
    };
    if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(add_info.phone))) {
        layer.msg("手机号填写的格式不对，请正确填写");
        return false;
    }
    if(add_info.city!=''&&add_info.latlng!=''&&add_info.buildTime!=''&&add_info.inputTime!=''&&add_info.buildArea!=''&&add_info.manager!=''&&add_info.phone!=''&&add_info.gps!=''&&add_info.yj!==''&&add_info.sb!=''&&add_info.df!=''&&add_info.kd!=''&&add_info.fz!=''&&add_info.zp!=''&&add_info.sd!=''&&add_info.qt!=''&&add_info.wrj!=''&&add_info.ggj!=''&&add_info.fsy!=''&&add_info.xfc!=''&&add_info.fdj!=''&&add_info.dhj!=''&&add_info.mhsc!=''&&add_info.eshgj!=''&&add_info.flmhj!=''&&add_info.yhtcy!=''&&add_info.scdjj!=''&&add_info.fsmhj!=''&&add_info.gyxswmhj!=''&&add_info.txc!=''&&add_info.czt!=''&&add_info.ybc!=''&&add_info.mhsq!=''){
        sendAjax({
            "url":"fire/fire_material_reserve/editFireMaterialReserve",
            "data":add_info,
            "callback":function(data){
                if (data.code=="s_ok") {
                    layer.closeAll('page');
                    layer.msg('保存成功');
                    imgName=[];

                }else{
                    layer.msg(data.var);imgName=[];
                }
            },
            error:function(e){
                console.log('错误');
                layer.msg("错误！！");
            }
        });
    }else{
        layer.alert("请完善物资储备库信息", {
            skin: 'layui-layer-molv',
            title:'温馨提示',
            closeBtn: 0,anim: 4,btnAlign: 'c'
        });
    }
};


var infoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(10, -30)
});
showFireHot_two();
