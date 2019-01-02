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
  marker.content='<div style="padding:5px;border-radius:6px;">'+
  '<p style="color:#030303;font-size:14px;">区域:<span style="color:#999da8;margin-left:6px;">'+ result.region_name + '</span></p>'+
  '<p style="color:#030303;font-size:14px;">位置:<span style="color:#999da8;margin-left:6px;">'+result.location+'</span></p>'+
  '<p style="color:#030303;font-size:14px;">手机号:<span style="color:#999da8;margin-left:6px;">'+result.phone+'</span></p>'+
  '<p style="color:#030303;font-size:14px;">成立时间:<span style="color:#999da8;margin-left:6px;">'+result.established_time+'</span></p>'+
  '<p style="color:#030303;font-size:14px;line-height: 30px;">录入时间:<span style="color:#999da8;margin-left:6px;">'+result.input_time+'</span></p>'+
  '<a href="#" class=\"ml-5\">详情</a></div>'
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
  var add_resources ="<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"area\" class=\"remove_disabled\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" id=\"latLngs\" disabled style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d '})\" class=\"Wdate remove_disabled form-control\" />" +
      "<label>视频流地址</label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"rtmp\"></li>" +
      "<li><label>当日值班人员</label><a href=\"javascript:;\" class=\"upload\">" +
      "<img class=\"fileInput1\" src=\"img/LK/tjtp.png\">" +
      "<input type=\"file\" id=\"photoName4\" class=\"upFileBtn1\"></a>" +
      "<label>防火室办公成员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\">" +
      "<input type=\"file\" id=\"photoName3\" class=\"upFileBtn1\"></a></li>" +
      "<li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"manage\"><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"phone\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\"></textarea></li><li>" +
      "<label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\">" +
      "<div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul>"
  // var add_resources ="<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"><option value=''>城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"area\" class=\"remove_disabled\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" id=\"latLngs\" disabled style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d '})\" class=\"Wdate remove_disabled form-control\" />" +
  //     "<label>视频流地址</label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"rtmp\"></li>" +
  //     "<li><label>当日值班人员</label><a href=\"javascript:;\" class=\"upload\">" +
  //     "<img class=\"fileInput1\" src=\"img/LK/tjtp.png\">" +
  //     "<input type=\"file\" id=\"photoName4\" class=\"upFileBtn1\"></a>" +
  //     "<label>防火室办公成员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\">" +
  //     "<input type=\"file\" id=\"photoName3\" class=\"upFileBtn1\"></a></li>" +
  //     "<li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"manage\"><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"phone\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\"></textarea></li><li>" +
  //     "<label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\">" +
  //     "<div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul>"
  layer.confirm(''+add_resources+'', {
    type: 1,
    closeBtn: 1, //关闭按钮
    anim: 2,
    skin: 'layui-layer-molv', 
    btn: ['保存','取消'],
    btnAlign: 'c',
    area: ['650px'],
    title:'新增防火办公室',
    shadeClose: true, //开启遮罩关闭
  }, function(){
    console.log('点击保存');
    var region=$("#province").val();
    $("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_two").val():region=$("#area").val();
    var location=$("#latLngs").val().replace(/[;]/g,'').replace(/[ ]/g,"");
    var builder_time=$("#buildTime").val();
    var video_stream_addr=$("#rtmp").val();
    var desc=$("#desc").val();
    var manage=$("#manage").val();
    var tel=$("#phone").val();
    // if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(tel))) {                      
    //   layer.msg("手机号填写的格式不对，请正确填写");
    //   return false;
    // }
    console.log(videoName);
    var current_person=videoName[0];
    var office_person=videoName[1];

    var office_image=imgName;

    if (region!=''&&location!=''&&builder_time!=''&&manage!=''&&tel!='') {
      sendAjax({
        "url":"fire/fire_office/saveOffice",
        "data":{"region": region,"location":location,
            "established_time":builder_time,"video_stream_addr":video_stream_addr,
            "desc":desc,"administrator":manage,"phone":tel,"current_person[]":current_person,
            "office_person[]":office_person,"office_image":office_image},
        "callback":function(data){
          if (data.code=="s_ok"){
            layer.closeAll('page');
            layer.msg('保存成功');
            query();
            imgName=[];
            videoName=[];
          }else{
            layer.msg(data.var);
            imgName=[];
            videoName=[];
          }
        },
        error:function(e){
          layer.msg("错误！！");
        }
      });
    }else{
      layer.alert("请完善防火办公室信息", {
        skin: 'layui-layer-molv',
        title:'温馨提示',
        closeBtn: 0,anim: 4,btnAlign: 'c'
      });
    }
  }, function(){
    layer.closeAll('page');
  });

    var all_citys=localStorage.getItem('all_city');
    $('#province').html(all_citys);

  callback1();
  $("#photoName1").takungaeImgup({
    formData: {
        "path": "user_image",
        "file_ext":"image"
    },
    url:"fire/upload/fileUpload",
    id:"imgBox"
  });
  $("#photoName4").takungaeExceloup({
    formData: {
        "path": "user_image",
        "file_ext":"image"
    },
    url:"fire/upload/fileUpload",
    id:"videoname"
  });
  $("#photoName3").takungaeExceloup({
    formData: {
        "path": "user_image",
        "file_ext":"image"
    },
    url:"fire/upload/fileUpload",
    id:"docname"
  });
}
var list=[];
// 详情
function report_index(fireid) {
    sendAjax({
        "url": "fire/fire_office/getOfficeById",
        "data": {"id": fireid.id},
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
                        content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" style=\"display:none\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" disabled/></li>" +
                        "<li id=\"upload_a\">" +
                        "<label>当日值班人员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName4\" class=\"upFileBtn1\"></a>" +
                        "<label>防火室办公成员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName3\" class=\"upFileBtn1\"></a></li>" +
                        "<li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" disabled class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\"><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" disabled id=\"phone\"></li><li><label style=\"vertical-align:middle;\">视频流地址</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"rtmp\" style=\"display:none\"><div id=\"rtmp_two\" style=\"vertical-align:middle;display:inline-block\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\" style=\"display:none\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li><li class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> " +
                        "<input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user()\"></li></ul>"
                    // content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=''>城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" style=\"display:none\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" disabled/></li>" +
                    //     "<li id=\"upload_a\">" +
                    //     "<label>当日值班人员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName4\" class=\"upFileBtn1\"></a>" +
                    //     "<label>防火室办公成员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName3\" class=\"upFileBtn1\"></a></li>" +
                    //     "<li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" disabled class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\"><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" disabled id=\"phone\"></li><li><label style=\"vertical-align:middle;\">视频流地址</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"rtmp\" style=\"display:none\"><div id=\"rtmp_two\" style=\"vertical-align:middle;display:inline-block\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\" style=\"display:none\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li><li class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> " +
                    //     "<input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user()\"></li></ul>"
                    });
                }else{
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btnAlign: 'c',
                        area: ['650px', '670px'],
                        title:"防火办公室详情",
                        shadeClose: true,
                        content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" style=\"display:none\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" disabled/></li>" +
                        "<li id=\"upload_a\">" +
                        "<label>当日值班人员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName4\" class=\"upFileBtn1\"></a>" +
                        "<label>防火室办公成员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName3\" class=\"upFileBtn1\"></a></li>" +
                        "<li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" disabled class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\"><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" disabled id=\"phone\"></li><li><label style=\"vertical-align:middle;\">视频流地址</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"rtmp\" style=\"display:none\"><div id=\"rtmp_two\" style=\"vertical-align:middle;display:inline-block\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\" style=\"display:none\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li><li class=\"background_user_information\">" +
                        "<input type=\"button\" value=\"取消\" class=\"report\" onclick=\"closeBtn()\"></li></ul>"
                    // content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=''>城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" style=\"display:none\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\" disabled/></li>" +
                    //     "<li id=\"upload_a\">" +
                    //     "<label>当日值班人员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName4\" class=\"upFileBtn1\"></a>" +
                    //     "<label>防火室办公成员</label><a href=\"javascript:;\" class=\"upload\"><img class=\"fileInput1\" src=\"img/LK/tjtp.png\"><input type=\"file\" id=\"photoName3\" class=\"upFileBtn1\"></a></li>" +
                    //     "<li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" disabled class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\"><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" disabled id=\"phone\"></li><li><label style=\"vertical-align:middle;\">视频流地址</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"rtmp\" style=\"display:none\"><div id=\"rtmp_two\" style=\"vertical-align:middle;display:inline-block\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\" disabled></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\" style=\"display:none\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li><li class=\"background_user_information\">" +
                    //     "<input type=\"button\" value=\"取消\" class=\"report\" onclick=\"closeBtn()\"></li></ul>"
                    });
                }
                var all_citys=localStorage.getItem('all_city');
                $('#province').html(all_citys);
                //将id保存，用与后面的编辑，传id
                sessionStorage.setItem("office_id",fireid.id);
                var publishName=result.video_stream_addr;
                if(publishName==''){
                    var html='无';
                }else{
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
                }
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
                callback((result.region).substr(0,4),$("#province"))
                $("#city_two option[value='" +(result.region).substr(0,6)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,6),$("#city_two"))
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
                $("#photoName4").takungaeExceloup({
                    formData: {
                        "path": "user_image",
                        "file_ext":"image"
                    },
                    url:"fire/upload/fileUpload",
                    id:"videoname"
                });
                $("#photoName3").takungaeExceloup({
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
}
//普通用户的取消按钮
function closeBtn() {
    layer.closeAll('page');
}
// 编辑的保存
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
          query();
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
}
// 编辑
function remove_disabled() {
  $("body").find(".form_sub_release").find(".remove_disabled").removeAttr("disabled").removeAttr("style");
  $("#upload_a").show();$("#upload_b").hide();$(".enter_map_two").show();
  $("body").find(".form_sub_release").find(".upFileBtn").removeAttr("style");
  $("body").find(".form_sub_release").find(".fileInput").removeAttr("style");
  $("#rtmp_two").hide();
  $("#imgBox img").removeClass("imgbig");$("#imgBox img").addClass("up-section");
  callback1();
}
// 查询-防火办公室
var listMap=100;
query();
function query() {
 
  var city = $("#city").val()==''||$("#city").val()==undefined?$("#hot_city").val():($("#village").val()==''||$("#village").val()==undefined?$("#city").val():$("#village").val());

  var  per_page=listMap;
  addBeiJing();
  //請求分頁的接口
  sendAjax({
    "url":"fire/fire_office/getOfficeByCondition",
    "data":{"current_page": 1, "region":city,"per_page":per_page,},"callback":function(data){
        map.clearMap();var num='';
        var userLevel = sessionStorage.getItem("userLevel");
        if (data.code=="s_ok") {
          $("#complete_report").html('');
          //总条数
          if(data.var.total==0){
            $(".complete_total").html(0); num=1;layer.msg('查询数据为空');
          }else{
            var result=data.var.data;
            $(".complete_total").html(data.var.total);num=data.var.total;
            $(".complete_page").createPage({
              pageCount:Math.ceil(num/10),
              current:1,
              backFn:function(p){
                sendAjax({
                  "url":"fire/fire_office/getOfficeByCondition",
                  "data":{"current_page": p, "region":$("#city").val()==''||$("#city").val()==undefined?$("#hot_city").val():($("#village").val()==''||$("#village").val()==undefined?$("#city").val():$("#village").val()),"per_page":10,},"callback":function(data){
                    var result=data.var.data;
                    $(".complete_total").html(data.var.total);
                    $("#complete_report").html('');
                    for(var i=0;i<result.length;i++){
                        if(userLevel!='1'){
                            $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td>" + result[i].location + "</td>><td>" + result[i].input_name + "</td><td>" + result[i].established_time + "</td><td>" + result[i].create_time + "</td><td><a class='mr-5'>详情</a> <a onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>");
                        }else{
                            $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td>" + result[i].location + "</td>><td>" + result[i].input_name + "</td><td>" + result[i].established_time + "</td><td>" + result[i].create_time + "</td><td><a class='mr-5'>详情</a></td></tr>");
                        }
                    }
                    $("#complete_report .mr-5").click(function() {
                      var index=$("#complete_report .mr-5").index(this);
                      report_index(result[index])
                    });
                  }
                })
              }
            });
            for(var i=0;i<result.length;i++){
                if(userLevel!='1'){
                    $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td>" + result[i].location + "</td>><td>" + result[i].input_name + "</td><td>" + result[i].established_time + "</td><td>" + result[i].create_time + "</td><td><a class='mr-5'>详情</a> <a onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>");
                }else{
                    $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td>" + result[i].location + "</td>><td>" + result[i].input_name + "</td><td>" + result[i].established_time + "</td><td>" + result[i].create_time + "</td><td><a class='mr-5'>详情</a></td></tr>");
                }
                var icon = new AMap.Icon({
                image:'img/wj/fireOffice.png',    
                size: new AMap.Size(76, 54)            
              });
              var lnglatXY=result[i].location.replace(/[;]/g,'').split(",");
              //创建一个标记对象
              var marker = new AMap.Marker({       
                icon: icon,    
                position:lnglatXY,               
                zIndex: 300,
                title:result[i].region_name,        
                map:map                         
              })
              marker.setLabel({
                offset: new AMap.Pixel(-50, -20),
                content: result[i].region_name+'；'+result[i].phone
              });
              markerClick(marker,result[i]);
            };
            $("#complete_report .mr-5").click(function() {
              var index=$("#complete_report .mr-5").index(this);
              report_index(result[index])
            }); 
            map.setFitView();
          }
        }else{
          layer.msg(data.var);
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
//点击查询的时候
function queryBtn() {
    listMap=$("#numberBySearch").val();
    query();
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
      "url":"fire/fire_office/deleteOffice",
      "data":{"id": Number(fireid)},"callback":function(element){
        if (element.code=="s_ok"){
          layer.closeAll('page');
          layer.msg('删除成功');
          query();
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
//地图和列表切换
$("#modeSwitch").click(function(){
    if($(this).val()=="切换成列表模式"){
        $("#container_map").hide();
        $(".container_table").show();
        $(".button-group").hide();
        $(this).val("切换成地图模式");
        listMap=10;
        query();
    }else{
        $("#container_map").show();
        $(".button-group").show();
        $(".container_table").hide();
        $(this).val("切换成列表模式");
        listMap=$("#numberBySearch").val();
        query();
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