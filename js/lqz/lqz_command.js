//基本地图加载
var layoutImgs='';var isFser11=true;
var map2 = new AMap.Map("container_map", {
    resizeEnable: true,
    layers: [
        new AMap.TileLayer.Satellite(),
        new AMap.TileLayer.RoadNet()
    ],
    zoom:8
});

var map = new AMap.Map("container_map1", {
    resizeEnable: true,
    layers: [
        new AMap.TileLayer.Satellite(),
        new AMap.TileLayer.RoadNet()
    ],
    zoom:13
});

callback1();
var img_sec='img/lqz/scene.png';
// 遍历图片
$("#toolkit").on("click","li",function(){
  var index = $(this).index();
  $(this).addClass("progressing").siblings().removeClass("progressing");
  var src=$(this).find("img").attr("src");
  img_sec=src;
});
var markers = []
AMap.event.addDomListener(document.getElementById('clearMarker'), 'click', function() {
  map2.remove(markers);
}, false);

// 地图打点
map2.on('click', function(e) {
  var lnglatXY=new Array();
  lnglatXY.push(e.lnglat.getLng());
  lnglatXY.push(e.lnglat.getLat());
  var marker = new AMap.Marker({
    content: "<img src='"+img_sec+"'/>",
    position: lnglatXY,
    map: map2,
    draggable: true,//拖拽
    cursor: 'move',
  });
  
  var contextMenu = new AMap.ContextMenu();  //创建右键菜单
  //右键删除
  contextMenu.addItem("删除", function() {
     marker.setMap(null);
  }, 0);
  //旋转标注
  var ang=90;
  contextMenu.addItem("旋转标注", function() {
    marker.setAngle(ang);
    ang+=90;
  }, 1);
  //右键放大
  contextMenu.addItem("放大标注", function() {
    marker.setContent("<img src='"+img_sec+"' class='imgicon'/>");
  }, 2);
  //复原
  contextMenu.addItem("复原", function() {
    marker.setContent("<img src='"+img_sec+"' />");
    marker.setAngle(0);
  }, 3);
  map2.setCenter(marker.getPosition());
  //绑定鼠标右击事件——弹出右键菜单
  marker.on('rightclick', function(e) {
      contextMenu.open(map2, e.lnglat);
  });
  marker.setMap(map2);
  map2.setFitView(10);
  markers.push(marker);
})
// 地图选择
$("#input_hot").click(function(){
  if($('#input_hot li').is(':hidden')){
    $('#input_hot li').show(); 
    }else{
    $('#input_hot li').hide();
  }   
});
$("#input_hot").on("click","li",function(){
  $(this).addClass("on").siblings().removeClass("on");
  var index = $(this).index();
  $(".map_choose").hide().eq(index-1).show();
  if (index==1) {
    $("#release_hot").attr("onclick","takeScreenshot()")
  }
  if (index==2) {
    $("#release_hot").attr("onclick","takeScreenshot_two()")
  }
  if (index==3) {
    $("#release_hot").attr("onclick","takeScreenshot_there()")
  }
})
// 正射图加载
/* var imageLayerArr = [];
function addMapZoomed(){
  if (isFser11) {
    isFser11=false;
    $.ajax({
        url : "getImageSize.htm",
        type : "post",
        dataType : "json",
        data:{
            "zoom":13
        },
        //async:false,
        success : function(data) {
          for(var i=0;i<imageLayerArr.length;i++){
              imageLayerArr[i].setMap(null);
          }
          imageLayerArr = [];
          for(var i=0;i<data.length;i++){
              var a = new AMap.LngLat(data[i].west, data[i].south);
              var b = new AMap.LngLat(data[i].east, data[i].north);
              var bounds = new AMap.Bounds(a,b);
              var imageLayer = new AMap.ImageLayer({
                    url: "google_tiles"+data[i].imagePath,
                    bounds: bounds,
                    zoom: map.getZoom()
                }); 
                imageLayerArr.push(imageLayer);
                imageLayer.setMap(map);
          }
        }
    });
  }
  AMap.event.addListener(map,'zoomend',function(){
    try{
      $.ajax({
        url : "getImageSize.htm",
        type : "post",
        dataType : "json",
        data:{
            "zoom":map.getZoom()
        },
        //async:false,
        success : function(data) {
          for(var i=0;i<imageLayerArr.length;i++){
              imageLayerArr[i].setMap(null);
          }
          imageLayerArr = [];
          for(var i=0;i<data.length;i++){
              var a = new AMap.LngLat(data[i].west, data[i].south);
              var b = new AMap.LngLat(data[i].east, data[i].north);
              var bounds = new AMap.Bounds(a,b);
              var imageLayer = new AMap.ImageLayer({
                    url: "google_tiles"+data[i].imagePath,
                    bounds: bounds,
                    zoom: map.getZoom()
                }); 
                imageLayerArr.push(imageLayer);
                imageLayer.setMap(map);
          }
        }
      });  
    }catch(e){
      layer.msg(""+e+"");
    }
  });
} */

// 跳转扑火指挥
function report_index() {
  $("#index_main_context").load("lqz_command.html");
  $("#index_titel").html("扑火指挥");
};
// 查询
showFireHot_two();
function showFireHot_two() {
    var region=$("#hot_city").val();
    $("#city_sx").val()==''||$("#city_sx").val()==undefined?region=$("#hot_city").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_sx").val():region=$("#area").val();
    var name=$("#userName").val();
    var begin_time = $('#start_time').val();
    var end_time = $('#end_time').val();
    sendAjax({
      "url":"fire/fire_tactics/getFireTacticsList",
      "data":{"per_page":10,"current_page":1,"region":region,"begin_time":begin_time,"name":name,"end_time":end_time},
      "callback":function(result){
        if (result.code=="s_ok") {
          var data = result.var.data;
          var num = '';
          $("#complete_report").html('');
          if (result.var.total==0) {
            layer.msg('查询数据为空');
            num = 1;
            $(".end_total").html(0);
          } else {
            $(".end_total").html(result.var.total);
            num = result.var.total;
            $(".complete_page").createPage({
                pageCount: Math.ceil(num / 10),
                current: 1,
                backFn: function(p) {
                  sendAjax({
                    "url":"fire/fire_tactics/getFireTacticsList",
                    "data":{"per_page":10,"current_page":p,"region":region,"begin_time":begin_time,"name":name,"end_time":end_time},
                    "callback":function(result){
                      $("#complete_report").html('');
                      var data = result.var.data;
                      for (var i = 0; i < data.length; i++) {
                        var layoutImg;
                        if (data[i].image_path!='') {
                          layoutImg=data[i].image_path[0].path;
                        }else{
                          layoutImg='img/timg.png';
                        }
                        $("#complete_report").append("<tr><td>" + data[i].name + "</td><td>" + data[i].region_name + "</td><td>" + data[i].create_time + "</td><td>" + data[i].user_name + "</td><td><img src="+Public_address+'uploads/'+layoutImg+" onerror=\"javascript:this.src='img/timg.png'\" class=\"imgbig\"></td><td><a class=\"mr-5\" onclick=\"detail(" + data[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + data[i].id + ")\">删除</a></td></tr>");
                        var userLevel = sessionStorage.getItem("userLevel");
                        if (userLevel=="1") {
                          $("#complete_report .mr-5").siblings().hide();
                        }
                      };
                    }
                  })
                }
            });
            for (var i = 0; i < data.length; i++) {
              var layoutImg;
              if (data[i].image_path!='') {
                layoutImg=data[i].image_path[0].path;
              }else{
                layoutImg='img/timg.png';
              }
              $("#complete_report").append("<tr><td>" + data[i].name + "</td><td >" + data[i].region_name + "</td><td>" + data[i].create_time + "</td><td>" + data[i].user_name + "</td><td><img src="+Public_address+'uploads/'+layoutImg+" onerror=\"javascript:this.src='img/timg.png'\" class=\"imgbig\"></td><td><a class=\"mr-5\" onclick=\"detail(" + data[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + data[i].id + ")\">删除</a></td></tr>");
              var userLevel = sessionStorage.getItem("userLevel");
              if (userLevel=="1") {
                $("#complete_report .mr-5").siblings().hide();
              }
            };
          }
        }
      }
    });
}
//详情
function detail(firid){
  sendAjax({
    "url":"fire/fire_tactics/getFireTacticsinfo",
    "data":{"id":firid},
    "callback":function(result){
      if (result.code=="s_ok") {
        var data=result.var;
        var xq="<div style='height: 400px;overflow: scroll;'><ul class=\"form_sub form_sub_release\" id=\"form_sub_release\"><li><label>名称</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\""+data.name+"\" id=\"name\" disabled></li><li><label>位置</label><input type=\"text\" value=\""+data.position+"\" class=\"form-control form-boxed remove_disabled\" disabled id=\"latLngs\" style=\"margin: 0 2px;\"><input class=\"enter_map\" type=\"button\" value=\"回显位置\" onclick=\"echo_map('"+data.position+"',"+data.position_type+")\" style='width: 65px;border:none;background: #addc9d;color: #fff;'></li><li><label>区域</label>" +
            "<select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" disabled class=\"remove_disabled\" onchange=\"callback(value,this)\" style=\"background-color:#eee\"></select><select id=\"street\" class=\"remove_disabled\" disabled style=\"background-color:#eee\"></select></li><li><label>图片描述</label><textarea class='form-control form-boxed remove_disabled' id='desc' disabled>"+data.content+"</textarea></li><li id=\"layoutImg\"></li>" +
            "</ul></div>";
        layer.confirm(xq,{
          type: 1,
          skin: 'layui-layer-molv', //样式类名
          closeBtn: 1, //关闭按钮
          anim: 2,
          btn: ['再次绘制','取消'],
          btnAlign: 'c',
          area: ['600px','auto'],
          title:"扑火指挥信息",
          shadeClose: true, //开启遮罩关闭
        }, function(){
          layer.closeAll('page');
          $("#container_map").show();$(".container_table").hide();$(".menu").hide();$("#input_hot").show();
          $("#toolkit").show();$("#toolkit_top").show();
          $("#release_hot").html("绘制保存").attr("onclick","takeScreenshot("+data.id+")");
        });

        var all_citys=localStorage.getItem('Public_city');
        $('#province').html(all_citys);

        if (data.image_path!='') {
          var images=data.image_path;
          for (var i = 0; i < images.length; i++) {
            $("#form_sub_release").append("<li><label>第"+(i+1)+"次排布缩列图</label><img src="+Public_address+'uploads/'+images[i].path+" class='imgbig' style='padding:10px' ></li>");
          }
        }
        $("#province option[value='" +(data.region).substr(0,4)+ "']").prop("selected", "selected");
        callback((data.region).substr(0,4),$("#province"));
        $("#city_two option[value='" +(data.region).substr(0,6)+ "']").prop("selected", "selected");
        callback((data.region).substr(0,6),$("#city_two"));
        $("#street option[value='" +(data.region).substr(0,9)+ "']").prop("selected", "selected");
      }
    }
  })
}

//删除记录
function delete_data(fireid){
    layer.confirm('确定要删除吗？', {
        btn: ['确定','取消'],
        skin: 'layui-layer-molv',
        title:'提示',
        btnAlign: 'c'
    }, function(){
      sendAjax({
        "url":"fire/fire_tactics/delFireTactics",
        "data":{"id":fireid},"callback":function(result){
          if (result.code=="s_ok") {
            layer.msg("删除成功");
            showFireHot_two();
          }else{
            layer.msg(result.var);
          }
         },error:function(result){
          layer.msg("删除失败,重新试试");
         }
      })
    }, function(){
      
    });
}
//地图和列表切换
$("#modeSwitch").click(function(){
  if($(this).val()=="绘制排布缩略图"){
    $("#container_map").show();
    $(".container_table").hide();
    $(".button-group").show();
    $(".menu").hide();
    $("#input_hot").show();
    $("#toolkit").show();
    $("#toolkit_top").show();
  }
});
// 切换侧边工具箱
var isHiden=isFser= true;
$('#toolkit_top').click(function(){
    if(isHiden){
        $('#toolkit').animate({right:'+=170px'});
    }else{
        $('#toolkit').animate({right:'-=170px'}); 
    }
    isHiden = !isHiden;
});
// 地图下载图片
function takeScreenshot(firid) {
  html2canvas(document.querySelector("#container_map"), {
    useCORS : true,
    // foreignObjectRendering : true,
    allowTaint :false,
    onrendered: function(canvas){
      layer.msg('上传排布缩略图中', {
        icon: 16,shade: 0.01,time:false
      });
      var type = 'png';
      var imgData = canvas.toDataURL(type);
      var _fixType = function(type) {
          type = type.toLowerCase().replace(/jpg/i, 'jpeg');
          var r = type.match(/png|jpeg|bmp|gif/)[0];
          return 'image/' + r;
      };
      // 加工image data，替换mime type
      imgData = imgData.replace(_fixType(type),'image/octet-stream');
      var saveFile = function(data, filename){
          var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
          save_link.href = data;
          // 上传图片
          function getBlobBydataURI(dataURI,type) { 
            var binary = atob(dataURI.split(',')[1]); 
            var array = []; 
            for(var i = 0; i < binary.length; i++) { 
              array.push(binary.charCodeAt(i)); 
            } 
            return new Blob([new Uint8Array(array)], {type:type }); 
          } 
          var $Blob= getBlobBydataURI(data,'image/png');
          var formData = new FormData(); 
          formData.append("file[]", $Blob ,+Date.parse(new Date())+".png");
          formData.append("path", "command_img");
          formData.append("file_ext", "image");
          var images=Date.parse(new Date())+".png";
          //组建XMLHttpRequest 上传文件 
          var request = new XMLHttpRequest();
          //上传地址 
          var s_token = sessionStorage.getItem("s_token");
          request.open("POST", Public_address+"fire/upload/fileUpload"+'?s_token='+s_token); 
          request.onreadystatechange=function() { 
            if (request.readyState==4) { 
              if(request.status==200){
                layer.closeAll('dialog');
                var command_img=JSON.parse(request.responseText);
                var image_s=command_img.var[0];
                if (firid!=null) {
                  sendAjax({
                    "url":"fire/fire_tactics/editFireTactics",
                    "data":{"id":firid,"tactics_image":image_s},"callback":function(result){
                      if (result.code=="s_ok") {
                        layer.closeAll('page');
                        layer.msg('修改成功');
                        showFireHot_two();
                        $("#container_map").hide();
                        $(".container_table").show();
                        $(".button-group").hide();
                        $(".menu").show();
                        $("#input_hot").hide();
                        $("#toolkit").hide();
                        $("#toolkit_top").hide();
                      }else{
                        layer.msg(result.var);
                      }
                    },error:function(result){
                      layer.msg("修改失败,重新试试");
                    }
                  })
                }else{
                  //var sc="<ul class=\"form_sub form_sub_release\" id=\"form_sub_release\"><li><label>名称<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"name\"></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\" style=\"margin: 0 2px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));}})\"/></li><li><label>区域<i style='color:red'>*</i></label><select id=\"province\"   onchange=\"callback(value,this)\"><option value=\"43\">省</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\"  class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"street\" class=\"remove_disabled\" ></select></li><li><label>图片描述</label><textarea class='form-control form-boxed remove_disabled' id='desc'></textarea></li><li><label>图片<i style='color:red'>*</i></label><div id=\"imgBox\" style=\"display:inline-block\"><img src="+data+"  class=\"imgbig\" style=\"padding:10px\"></div></li></ul>"
                  var sc="<ul class=\"form_sub form_sub_release\" id=\"form_sub_release\"><li><label>名称<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"name\"></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\" style=\"margin: 0 2px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));}})\"/></li><li><label>区域<i style='color:red'>*</i></label>" +
                      "<select id=\"province\"   onchange=\"callback(value,this)\"></select><select id=\"city_two\"  class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"street\" class=\"remove_disabled\" ></select></li><li><label>图片描述</label><textarea class='form-control form-boxed remove_disabled' id='desc'></textarea></li><li><label>图片<i style='color:red'>*</i></label><div id=\"imgBox\" style=\"display:inline-block\"><img src="+data+"  class=\"imgbig\" style=\"padding:10px\"></div></li></ul>"
                  layer.confirm(''+sc+'', {
                    type: 1,
                    skin: 'layui-layer-molv', //样式类名
                    closeBtn: 1, //关闭按钮
                    anim: 2,
                    btnAlign: 'c',
                    area: ['600px'],
                    btn: ['发布','取消'],
                    title:"发布扑火指挥信息",
                    shadeClose: true, //开启遮罩关闭
                  }, function(){
                    var name=$("#name").val();
                    var region=$("#city_two").val()==''||$("#city_two").val()==undefined?$("#province").val():($("#street").val()==''||$("#street").val()==undefined?$("#city_two").val():$("#street").val());
                    var content=$("#desc").val();
                    var tactics_image=command_img.var[0];
                    var postiontype=localStorage.getItem("pointTpye");
                    var position=$('#latLngs').val();
                    if (name!=''&&region!=''&&tactics_image!=''&&postiontype!='') {
                      sendAjax({
                        "url":"fire/fire_tactics/addFireTactics",
                        "data":{"name":name,"tactics_image":tactics_image,"position_type":postiontype,"region":region,"content":content,"position":position},
                        "callback":function(result){
                          if (result.code=="s_ok") {
                            layer.closeAll('page');
                            layer.msg('发布成功');
                            showFireHot_two();
                            $("#container_map").hide();
                            $(".container_table").show();
                            $(".button-group").hide();
                            $(".menu").show();
                            $("#input_hot").hide();
                            $("#toolkit").hide();
                            $("#toolkit_top").hide();
                          }else{
                            layer.msg(result.var);
                          }
                        },
                        error : function(e) {
                          layer.msg("上传失败!");
                        }
                      });
                    }else{
                      layer.alert("请完善扑火指挥信息", {
                        skin: 'layui-layer-molv',
                        title:'温馨提示',
                        closeBtn: 0,anim: 4,btnAlign: 'c'
                      });
                    }
                  });
                    var all_citys=localStorage.getItem('Public_city');
                    $('#province').html(all_citys);
                  callback1();
                }
              }else{ 
                layer.msg("上传失败"); 
              } 
            } 
          };
          request.send(formData); 
      };
      // 下载后的问题名
      var filename =(new Date()).getTime() + '.' + type;
      // download
      saveFile(imgData,filename);
    },
    height:850
  });
};

// 放大图片
$("body").on('click','.imgbig',function () {
    var src=$(this).attr("src");
    var $h1="<img src=\"" +src+ "\" style='width:100%'>";
    layer.alert(''+$h1+'', {
        type: 0,
        anim: 7,
        skin: 'layui-layer-molv',
        title:'图片预览',
        area: ['800px','540px'],
        shadeClose: true,
        btnAlign: 'c'
    }, function(){
        event.preventDefault();
        event.stopPropagation();
        layer.closeAll('dialog');
    }, function(){
    });
});

// 回显地图
function echo_map(latLngs,pointTpye) {
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
        let map = new AMap.Map("container1",{
            resizeEnable: true,
            zoom:11
        });
        let type= new AMap.MapType({
            defaultType:1,
            showRoad:true
        });
        map.addControl(type);
        map.clearMap();
        var lnglatXY=[];
        if (pointTpye=="0") {
          var lnglat=latLngs.split(";");
          lnglat=lnglat[0].split(",");
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