//基本地图加载
var map = new AMap.Map("mapContainer", {
    resizeEnable: true,
    zoom:8
});
var type= new AMap.MapType({
    defaultType:1,
    showRoad:true
});
map.addControl(type);
var infoWindow = new AMap.InfoWindow({
  offset: new AMap.Pixel(16, -25)//窗体位置的偏移量
});
var isFire1=isFire2=isFire3=isFire4=true;
callback1();
showFireHot_two();

function showFireHot_two(){
    addBeiJing();
    var region=$("#fireArea").val();
    region=($("#city").val()==''||$("#city").val()==undefined)?$("#fireArea").val():($("#area").val()==''||$("#area").val()==undefined)?$("#city").val():$("#area").val();
    var hot_state=$('#hot_state').val();
    hot_state=hot_state==''?0:hot_state;
    var start_time=$('#start_time').val();
    var end_time=$('#end_time').val();//pageSize
    var per_page=$('#pageSize').val();
    sendAjax({
        "url":"fire/hot/getHotByCondition",
        "data":{"per_page":per_page,"current_page":1,"hot_status":hot_state,"region":region,
            "start_time":start_time,"end_time":end_time},
        "callback":function(data){
            if (data.code=="s_ok") {
                map.clearMap();
                $("#complete_report").html('');
                if(data.var.total==0){
                    layer.msg('查询数据为空');
                    $('.end_total').html(data.var.total);
                    return false;
                }
                //分页
                $(".end_total").html(data.var.total);var num=data.var.total;
                $(".complete_page").createPage({
                    pageCount:Math.ceil(num/20),
                    current:1,
                    backFn:function(p){
                        sendAjax({
                            "url":"fire/hot/getHotByCondition",
                            "data":{"per_page":per_page,"current_page":p,"hot_status":hot_state,"region":region,
                                  "start_time":start_time,"end_time":end_time},
                            "callback":function(data){
                                  var data=data.var.data;
                                  $("#complete_report").html('');
                                  for(var j=0;j<data.length;j++){
                                        data[j].hot_status=data[j].hot_status=='0'?'未确认':(data[j].hot_status=='1'?'确认中':'已确认');
                                        $("#complete_report").append("<tr><td>" + data[j].region_name + "</td><td>" + data[j].hot_latlng + "</td>><td>" + data[j].update_time + "</td><td>" + data[j].tel + "</td><td>" + data[j].hot_status+ "</td></tr>");
                                  }
                            }
                        })
                    }
                });
                var data=data.var.data;
                for(var i=0;i<data.length;i++){
                    data[i].hot_status=data[i].hot_status=='0'?'未确认':(data[i].hot_status=='1'?'确认中':'已确认');
                    $("#complete_report").append("<tr><td>" + data[i].region_name + "</td><td>" + data[i].hot_latlng + "</td>><td>" + data[i].update_time + "</td><td>" + data[i].tel + "</td><td>" + data[i].hot_status+ "</td></tr>");
                    if (data[i].hot_status=="未确认") {var images="firehot1.png"}
                    if (data[i].hot_status=="确认中") {var images="execution.png"}
                    if (data[i].hot_status=="已确认") {
                        // if (data[i].smoke=="") {images="confirmed.png"}
                        if (data[i].smoke=="" || data[i].smoke=="无") {var images="confirmed.png"}
                    }
                    var lnglatXY= data[i].hot_latlng.split(";");
                    lnglatXY=JSON.parse('[' + String(lnglatXY[0]) + ']');
                    var marker = new AMap.Marker({
                        position: lnglatXY,
                        icon:'img/lqz/'+images,
                        map: map
                    });
                    marker.setLabel({
                        offset: new AMap.Pixel(-70, -20),
                        content: data[i].region_name+"；"+data[i].hot_add_time.substring(0,16)
                    });
                    addHotMarkerClick_two(marker,data[i]);
                }
            }else{
                layer.msg(data.var);
            }
        }
    });
}

//卫星监测热点marker点击事件
function addHotMarkerClick_two(marker,data){
  if (data.hot_status=="未确认") {
    var userLevel = sessionStorage.getItem("userLevel");
    if(userLevel!='1'){
        marker.content ="<div class=\"form_sub marker_content\"><header class=\"header\">热点信息</header><ul><li><label>位置：</label><span>"+data.hot_latlng+"</span></li><li><label>区域：</label><span>"+data.region_name+"</span></li><li><label>录入时间：</label><span>"+data.hot_add_time+"</span></li><li><label>电话：</label><span>"+data.tel+"</span></li><li><label>状态：</label><span>未确认</span></li><li class=\"content\"><label>描述：</label><span>"+data.content+"</span></li><li><input type=\"button\" value=\"取消\" class=\"cancel\" id=\"cancel\" /><input type=\"button\" value=\"确定\" class=\"report submit\" onclick=\"confirm()\" /></li></ul></div>"
    }else{
        marker.content ="<div class=\"form_sub marker_content\"><header class=\"header\">热点信息</header><ul><li><label>位置：</label><span>"+data.hot_latlng+"</span></li><li><label>区域：</label><span>"+data.region_name+"</span></li><li><label>录入时间：</label><span>"+data.hot_add_time+"</span></li><li><label>电话：</label><span>"+data.tel+"</span></li><li><label>状态：</label><span>未确认</span></li></ul></div>"
    }
  }else if(data.hot_status=="确认中") {
      marker.content ="<div class=\"form_sub marker_content\"><header class=\"header\">热点信息</header><ul><li><label>位置：</label><span>"+data.hot_latlng+"</span></li><li><label>区域：</label><span>"+data.region_name+"</span></li><li><label>录入时间：</label><span>"+data.hot_add_time+"</span></li><li><label>电话：</label><span>"+data.tel+"</span></li><li class=\"serttime\"><label>开始确认时间：</label><span>"+data.create_time+"</span></li><li class=\"name\"><label>确认人：</label><span>"+data.addName+"</span></li><li><label>状态：</label><span>确认中</span></li></ul></div>"
  }else if(data.hot_status=="已确认") {
    if (data.smoke=="无") {   
     marker.content ="<div class=\"form_sub marker_content\"><header class=\"header\">热点信息</header><ul><li><label>位置：</label><span>"+data.hot_latlng+"</span></li><li><label>区域：</label><span>"+data.region_name+"</span></li><li><label>录入时间：</label><span>"+data.hot_add_time+"</span></li><li class=\"serttime\"><label>开始确认时间：</label><span>"+data.hot_receive_Time+"</span></li><li class=\"endtime\"><label>结束确认时间：</label><span>"+data.hot_complete_time+"</span></li><li><label>电话：</label><span>"+data.tel+"</span></li><li class=\"yesno\"><label>有无火情：</label><span>无</span></li><li class=\"name\"><label>确认人：</label><span>"+data.addName+"</span></li><li><label>状态：</label><span>已确认</span></li><li><input type=\"button\" value=\"详情\" class=\"cancel report\" onclick=\"details("+data.hot_id+")\" id=\"view_two\"/></li></ul></div>"
    }
    if (data.smoke=="") {              
      marker.content ="<div class=\"form_sub marker_content\"><header class=\"header\">热点信息</header><ul><li><label>位置：</label><span>"+data.hot_latlng+"</span></li><li><label>区域：</label><span>"+data.region_name+"</span></li><li><label>录入时间：</label><span>"+data.hot_add_time+"</span></li><li class=\"serttime\"><label>开始确认时间：</label><span>"+data.hot_receive_Time+"</span></li><li class=\"endtime\"><label>结束确认时间：</label><span>"+data.hot_complete_time+"</span></li><li><label>电话：</label><span>"+data.tel+"</span></li><li class=\"yesno\"><label>有无火情：</label><span>有</span></li><li class=\"name\"><label>确认人：</label><span>"+data.addName+"</span></li><li><label>状态：</label><span>已确认</span></li><li><input type=\"button\" value=\"查看\" class=\"cancel report\" onclick=\"view("+data.hot_id+")\" /></li></ul></div>"
    }
  }
  AMap.event.addListener(marker, 'click', function() {
    infoWindow.setContent(marker.content);
    infoWindow.open(map, marker.getPosition());
    sessionStorage.setItem("hot_id",data.hot_id);
    sessionStorage.setItem("hot_lng",data.hot_latlng);
  });
};
// 详情
function details(id) {
  sendAjax({
    "url":"fire/hot/getHotById",
    "data":{"id":id},"callback":function(data){
      if (data.code=="s_ok") {
        var result=data.var;
        var details ="<ul class=\"form_sub form_sub_release\"><li><label>位置</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\""+result.hot_latlng+"\"><label>区域</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\""+result.region_name+"\"></li><li><label>录入时间</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\""+result.update_time+"\" disabled><label>开始确认时间</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\""+result.hot_add_time+"\" disabled></li><li><label>结束确认时间</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\""+result.hot_complete_time+"\" disabled><label>有无火情</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\"无\" disabled></li><li><label>确认人</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\""+result.recv_name+"\" disabled><label>状态</label><input type=\"text\" class=\"form-control form-boxed\" disabled value='已确认' disabled></li><li><label>反馈内容</label><textarea class=\"form-control form-boxed remove_disabled\" disabled>"+result.feed_back+"</textarea></li><li id=\"upimg\"><label>反馈图片</label><img class=\"fileInput\" src="+Public_address+'uploads/'+result.images+"\" onerror=\"this.style=&quot;display:none&quot;\"></li></ul>"
        layer.confirm(''+details+'', {
          type: 1,
          skin: 'layui-layer-molv', //样式类名
          closeBtn: 1, //关闭按钮
          anim: 2,
          btn: ['关闭','取消'],
          btnAlign: 'c',
          area: ['650px', '450px;'],
          title:"热点详情",
          shadeClose: true, //开启遮罩关闭
        }, function(){
          layer.closeAll('page');
        }, function(){
          layer.closeAll('page');
        });
      }
    }
  });
}
function report_index(index,fireId) {
  $("#index_main_context").load("lqz_fire_details.html");
  $("#index_titel").html("火情上报详情");
  localStorage.setItem("index_xq",index);
  localStorage.setItem("fireId_xq",fireId);
  //隐藏地图
  stopInterval();
};
// 查看
function view(id) {
  sendAjax({
    "url":"fire/hot/getHotById",
    "data":{"id":id},"callback":function(data){
      if (data.code=="s_ok") {
        $("#index_main_context").load("lqz_fire_details.html");
        $("#index_titel").html("火情详情");
        localStorage.setItem("index_xq","0");
        localStorage.setItem("fireId_xq",data.var.fire_id);
      }
    }
  });
}

// 确认
function confirm() {
  ss=[];username=[];ss_sx=[];username1=[];
  //var confirm="<ul class=\"form_sub form_sub_release\"><li><label>任务名称</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\"地面巡护任务\"><label>任务类型</label><select  class=\"remove_disabled\"><option value=\"5\">热点核查</option></select></li><li><label>区域</label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"><option value=''>城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"village\" class=\"remove_disabled\" ></select><label>地图位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" id=\"latLngs2\" disabled></li><li><label>发布人</label><input type=\"text\" id=\"taskAddName\" class=\"form-control form-boxed\" disabled value=\"\"><label>任务截止时间<i style='color:red'>*</i></label><input type=\"text\" id=\"creactTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'%y-%M-%d {%H+1}:%m:%s'})\" class=\"Wdate remove_disabled form-control\" style=\"width:180px\" name=\"creactTime\" /></li><li style=\"position:relative;\"><label>指派对象<i style='color:red'>*</i></label><label class=\"radio\"><input type=\"radio\" value=\"search\" name=\"screening\" checked=\"checked\"/><span>搜索</span></label><label class=\"radio\"><input type=\"radio\" value=\"screening\" name=\"screening\"/><span>筛选</span></label><input id='toName' class='form-control form-boxed toName1' value='' onfocus='setStyle()'><div class=\"screening\"><select id=\"people\" class=\"remove_disabled\" onchange=\"user_query(this,value,value)\"><option value=\"2\">护林员</option><option value=\"3\">消防员</option></select><select  id=\"hot_city\" onchange=\"user_query(this)\"><option value='43'>省</option><option value=\"4301\">长沙市</option><option value=\"4302\" >株洲市</option><option value=\"4303\">湘潭市</option><option value=\"4304\">衡阳市</option><option value=\"4305\">邵阳市</option><option value=\"4306\">岳阳市</option><option value=\"4307\">常德市</option><option value=\"4308\">张家界市</option><option value=\"4309\">益阳市</option><option value=\"4311\">永州市</option><option value=\"4310\">郴州市</option><option value=\"4312\">怀化市</option><option value=\"4313\">娄底市</option><option value=\"4331\">湘西自治州</option></select><select  id=\"city_sx\" class='remove_disabled' onchange=\"user_query(this)\"></select><select id=\"area_sx\" class=\"remove_disabled\"></select></div><div id=\"user_query\"></div><div id=\"user_query1\"></div></li><li id=\"upimg\" style=\"width: 250px;\"><label>图片上传</label><input type=\"file\" name=\"photoName1\" id=\"photoName1\" class=\"upFileimg\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\"/><img class=\"fileInput\" src=\"img/lqz/sc.png\" onclick=\"$('#photoName1').click()\"/><div id=\"imgBox11\"></div></li></ul>";
  var confirm="<ul class=\"form_sub form_sub_release\"><li><label>任务名称</label><input type=\"text\" class=\"form-control form-boxed\" disabled value=\"地面巡护任务\"><label>任务类型</label><select  class=\"remove_disabled\"><option value=\"5\">热点核查</option></select></li><li><label>区域</label>" +
      "<select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"village\" class=\"remove_disabled\" ></select><label>地图位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" id=\"latLngs2\" disabled></li><li><label>发布人</label><input type=\"text\" id=\"taskAddName\" class=\"form-control form-boxed\" disabled value=\"\"><label>任务截止时间<i style='color:red'>*</i></label><input type=\"text\" id=\"creactTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'%y-%M-%d {%H+1}:%m:%s'})\" class=\"Wdate remove_disabled form-control\" style=\"width:180px\" name=\"creactTime\" /></li><li style=\"position:relative;\"><label>指派对象<i style='color:red'>*</i></label><label class=\"radio\"><input type=\"radio\" value=\"search\" name=\"screening\" checked=\"checked\"/><span>搜索</span></label><label class=\"radio\"><input type=\"radio\" value=\"screening\" name=\"screening\"/><span>筛选</span></label><input id='toName' class='form-control form-boxed toName1' value='' onfocus='setStyle()'><div class=\"screening\"><select id=\"people\" class=\"remove_disabled\" onchange=\"user_query(this,value,value)\"><option value=\"2\">护林员</option><option value=\"3\">消防员</option></select><select  id=\"hot_city\" onchange=\"user_query(this)\"></select><select  id=\"city_sx\" class='remove_disabled' onchange=\"user_query(this)\"></select><select id=\"area_sx\" class=\"remove_disabled\"></select></div><div id=\"user_query\"></div><div id=\"user_query1\"></div></li><li id=\"upimg\" style=\"width: 250px;\"><label>图片上传</label><input type=\"file\" name=\"photoName1\" id=\"photoName1\" class=\"upFileimg\" multiple accept=\"image/png,image/jpg,image/gif,image/JPEG\"/><img class=\"fileInput\" src=\"img/lqz/sc.png\" onclick=\"$('#photoName1').click()\"/><div id=\"imgBox11\"></div></li></ul>";
  layer.confirm(''+confirm+'', {
    type: 1,
    skin: 'layui-layer-molv', //样式类名
    closeBtn: 1, //关闭按钮
    anim: 2,
    btn: ['发布','取消'],
    btnAlign: 'c',
    area: ['650px','420px'],
    title:"发布任务",
    shadeClose: true, //开启遮罩关闭
  }, function(){
    layer.msg('正在发布中', {
      icon: 16,shade: 0.01,time:false
    });
    var task_type="5";
    var task_end_time=$('#creactTime').val();
    var task_region=$("#province").val();
    $("#city_two").val()==''||$("#city_two").val()==undefined?task_region=$("#province").val():$("#village").val()==''||$("#village").val()==undefined?task_region=$("#city").val():task_region=$("#village").val();
    var task_desc="此处为卫星监测疑似起火点，请派人前往确认！";
    var to_name=$('#toName').attr("data-name");
    if (to_name==undefined||to_name=='') {to_name=$('#toName').val();}
    var task_latlng=$('#latLngs2').val();
    var task_title="地面巡护任务";
    var hot_id=sessionStorage.getItem("hot_id");
    var task_result_image=imgName.join();
    var pointType='0';
    var task_obj=$('#people').val();
    if (toName!=''&& toName != null&&task_region!=''&&hot_id!=''&&task_end_time!=''){
      sendAjax({
        "url":"fire/task/addTask",
        "data":{"task_type":task_type,"task_end_time":task_end_time,"task_region":task_region,"task_latlng":task_latlng,"to_name":to_name,"task_title":task_title,"pointType":pointType,"task_desc":task_desc,"task_result_image":task_result_image,"hot_id":hot_id,"task_obj":task_obj},"callback":function(data){
          if (data.code=="s_ok") {
            layer.closeAll('dialog');
            layer.closeAll('page');
            user_query();
            layer.msg('发布成功');
          }else{
            layer.msg(data.var);
          }
        }
      });
      infoWindow.close();
    }else{
      layer.alert("请完善发布任务信息", {
        skin: 'layui-layer-molv',
        title:'温馨提示',
        closeBtn: 0,anim: 4,btnAlign: 'c'
      });
    }
  }, function(){
    layer.closeAll('page');
  });

    var all_citys=localStorage.getItem('all_city');
    var Public_city=localStorage.getItem('Public_city');
    $('#province').html(all_citys);
    $('#hot_city').html(Public_city);


  $("#photoName1").takungaeImgup({
    formData: {
        "path": "task_image",
        "file_ext":"image"
    },
    url:"fire/upload/fileUpload",
    id:"imgBox11"
  });
  var hot_lng=sessionStorage.getItem("hot_lng");
  $("#latLngs2").val(hot_lng);
  var name =sessionStorage.getItem("name");
  $("#taskAddName").val(name);
  $("body").find(".upFileimg").click(function(e){
    $("#user_query").hide();
    $(".screening").hide();
  })
}
// 搜索用户查询
function user_query(e,id,price) {
  // callback1();
  if (id==undefined) {
    id=$("#people").val();
  }
  var region=$("#hot_city").val();
  $("#city_sx").val()==''||$("#city_sx").val()==undefined?region=$("#hot_city").val():$("#area_sx").val()==''||$("#area_sx").val()==undefined?region=$("#city_sx").val():region=$("#area_sx").val();
  var dom = $(e).next();
  sendAjax({
    "url":"fire/region/getRegion",
    "data":{"parentId":region},"callback":function(data){
      if (price!=undefined) {
        // $(dom).next().children('option').remove();
      }else{
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
        }else{
            layer.msg(data.var);
        }
      } 
    },
    error: function(e) {
      layer.msg("错误！！");
    }
  });
  sendAjax({
    "url":"fire/user/getUserByNameOrTel",
    "data":{"mold_type":id,"region":region},"callback":function(data){
      if (data.code=="s_ok") {
        $("#user_query").children('span').remove();
        if (price!=undefined) {
          $("#toName").attr("data-name",'');
          $("#user_query").append("<span onclick=\"selected(this)\" data-name=\""+id+"_\">全部人</span>");
        }else{
          $("#toName").attr("data-name",'');
          $("#user_query").append("<span onclick=\"selected(this)\" data-name=\""+id+"_"+region+"\">全部人</span>");
        }
        for (var i = 0; i < data.var.length; i++) {
          $("#user_query").append("<span onclick=\"selected(this)\" data-name=\""+data.var[i].tel+"\">" + data.var[i].name + "</span>");
        }
      }else if (data.var.length==0){
        layer.msg('查询数据为空');
        $("#user_query").children('span').remove();
      }else{
        layer.msg(data.var);
      }
    }
  });
}
$("body").on('keyup', '.toName1', function() {
  var key = $("#toName").val();
  if (key != "") {
    sendAjax({
      "url":"fire/user/getUserByNameOrTel",
      "data":{"name":key},"callback":function(data){
          if(data.code=='s_ok'){
              if(data.var.length<1){
                  $("#user_query1").children('span').remove();
                  $("#user_query1").hide();
              }else{
                  $("#user_query1").children('span').remove();
                  $("#user_query1").show();
                  for (var i = 0; i < data.var.length; i++) {
                      $("#user_query1").append("<span onclick=\"selected_two(this)\" data-name=\"" + data.var[i].tel + "\">" + data.var[i].name + "</span>");
                  }
              }
          }else{
              layer.msg(data.var);
          }
      }
    });
  }else{
      $("#userName").attr("data-name", '');
  }
});
// 聚焦显示
function setStyle() {
  if($("input[value='screening']:checked").length>0){
    $(".screening").show();
    $("#user_query").show();
  }
}
// 点击选中指派对象
var ss=[];var username=[];
function selected(e) {
  if ($(e).html() == "全部人") {
    username = [];
    ss = [];
    $("#toName").attr("data-name",'');
    $("#toName").val("");
    $("#toName").val("全部人");
    $("#user_query").empty();
  }
  ss.push($(e).html());
  var sss=ss.join(",");
  $("#toName").val(sss);
  $(e).remove();
  username.push($(e).attr("data-name"));
  var dataname=username.join(",");
  $("#toName").attr("data-name",dataname);
  $(".screening").hide();
  $("#user_query").hide();
};
var ss_sx=[];var username1=[];
function selected_two(e) {
  $("#user_query1").hide();
  ss_sx.push($(e).html());
  var sss_sx=ss_sx.join(",");
  username1.push($(e).attr("data-name"));
  $("#toName").val(sss_sx);
  $("#toName").attr("data-name",username1);
  $(e).remove();
  username1=[];ss_sx=[];
};
// 筛选搜索切换
$("body").on('click','input[type="radio"]',function(){
  if ($(this).val()!="screening") {
    $(".screening").hide();
    $("#user_query").hide();
    $("#user_query1").show();
    $("#toName").val("");
    $("#toName").removeAttr("data-name");
    ss_sx=[];
    $("#toName").addClass("toName1");
  }else{
    $(".screening").show();
    $("#user_query").show();
    $("#user_query1").hide();
    $("#toName").val("");
    $("#toName").removeAttr("data-name");
    ss=[];username=[];
    $("#toName").removeClass("toName1");
  }
})


// 取消
$(".content-wrap").on('click','#cancel',function () {
  infoWindow.close();
})

// 选择导入、手动填入卫星监测热点状态变化
$("#input_hot").click(function(){
  if($('#input_hot li').is(':hidden')){
    $('#input_hot li').show(); 
    }else{
    $('#input_hot li').hide();
  }   
});
$("#input_hot").on("click","li",function(){
  $(this).addClass("on").siblings().removeClass("on");
})
// 录入卫星监测热点
function manual(){
  //var manual= "<ul class=\"form_sub\" style=\"width:280px\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" style=\"width:80px\"><option value=\"\">城市</option><option value=\"4301\">长沙市</option><option value=\"4302\" >株洲市</option><option value=\"4303\">湘潭市</option><option value=\"4304\">衡阳市</option><option value=\"4305\">邵阳市</option><option value=\"4306\">岳阳市</option><option value=\"4307\">常德市</option><option value=\"4308\">张家界市</option><option value=\"4309\">益阳市</option><option value=\"4311\">永州市</option><option value=\"4310\">郴州市</option><option value=\"4312\">怀化市</option><option value=\"4313\">娄底市</option><option value=\"4331\">湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" style=\"width:80px\"></select><select id=\"area\" class=\"remove_disabled\" style=\"width:80px\"></select></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" disabled id=\"latLngs\" style=\"width: 175px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地点',shadeClose: false,shade: 0.8,area: ['650px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li></ul>";
  var manual= "<ul class=\"form_sub\" style=\"width:280px\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" style=\"width:80px\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" style=\"width:80px\"></select><select id=\"area\" class=\"remove_disabled\" style=\"width:80px\"></select></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" disabled id=\"latLngs\" style=\"width: 175px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地点',shadeClose: false,shade: 0.8,area: ['650px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li></ul>";
  layer.confirm(''+manual+'', {
      type: 1,
      skin: 'layui-layer-molv', //样式类名
      closeBtn: 1, //关闭按钮
      anim: 2,
      btn: ['保存','取消'],
      btnAlign: 'c',
      area: ['330px', '200px;'],
      title:"手动录入",
      shadeClose: true, //开启遮罩关闭
    }, function(){
      var region=$("#province").val();
      $("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_two").val():region=$("#area").val();
      var latlng=$("#latLngs").val();
      var content="此处为卫星监测疑似起火点，是否派人前往确认？";
      var userName=sessionStorage.getItem("name");
      sendAjax({
        "url":"fire/hot/addHot",
        "data":{"region":region,"hot_latlng":latlng,"content":content},"callback":function(data){
          if (data.code=="s_ok") {
            layer.closeAll(); //关闭所有页面层
            layer.msg('录入成功');
            //重新查询一次，在地图上显示新加的图标
            showFireHot_two();
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
    });
    var all_citys=localStorage.getItem('all_city');
    $('#province').html(all_citys);
  callback1();
}

// 导入卫星监测热点文件
function impot(){
  layer.open({
    type: 1,
    skin: 'layui-layer-molv', //样式类名
    anim: 2,
    title:'导入卫星监测热点文件',
    area: ['300px', '100px;'],
    content:"<ul class=\"form_sub\"><li class=\"file_img\"><label>导入文件</label><input type=\"file\" style=\"display:inline-block\" class=\"file_impot\" id=\"file_impot\"></li></ul>"
  });

    $("#file_impot").takungaevideoup({
        formData: {
            "name": "hotfile",
            "path":"other"
        },
        url:"fire/hot/importHot",
        id:"wj",
    });
}

//数据置为空
$("body").on('keyup', '#toName', function() {
    var key = $("#toName").val();
    if (key == "") {
        $("#toName").attr("data-name",'');
        ss=[];username=[];ss_sx=[];username1=[];
    }
});

//地图和列表切换
$("#textSwitch").click(function(){
    if($(this).val()=="切换成列表模式"){
        $("#mapContainer").hide();
        $(".container_table").show();
        $(this).val("切换成地图模式");
        $(".button-group").hide();
    }else{
        $("#mapContainer").show();
        $(".container_table").hide();
        $(this).val("切换成列表模式");
        $(".button-group").show();
    }
});


