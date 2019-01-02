//基本地图加载
var map = new AMap.Map("mapContainer", {
	resizeEnable: true,
	zoom: 13 
});
var type= new AMap.MapType({
    defaultType:1,
    showRoad:true
});
map.addControl(type);
var infoWindow = new AMap.InfoWindow({
	offset: new AMap.Pixel(16, -25)//窗体位置的偏移量
});
callback1();
addBeiJing();
//查询
var marker, lineArr = [];
$(".search_container").on('click','#search_btn_two',function() {
	var city = $("#hot_city option:checked").html()=="省"?'':$("#hot_city option:checked").html();
	var town = $("#city_sx option:checked").html();
	var village = $("#area option:checked").html();
	var tel=$('#userName').val();
	var type=$('#type').val();
	var time=$('#startTime').val();
	addBeiJing(city);
	if (time!='') {
		sendAjax({
			"url":"fire/receive_app_info/getPath",
			"data":{"city":city,"town":town,"village":village,"tel":tel,"time":time,"type":type},
			"callback":function(data){
				if (data.code=="s_ok") {
					var data=data.var;

					map.clearMap();
					if(data.hly!=''){
						if(data.hly!=undefined){
							var images="zd_03.png";var imageszd="zd_04.png";perform(data.hly);
						}
					}else{
						layer.msg('护林员轨迹为空');
					}
					if(data.fire!=''){
						if(data.fire!=undefined){
							var images="zd_15.png";var imageszd="zd_06.png";perform(data.fire);
						}
					}else{
						layer.msg('消防员轨迹为空');
					}
					if(data.drone!=''){
						if(data.drone!=undefined){
							var images="zd_10.png";var imageszd="zd_11.png";perform1(data.drone);
						}
					}else{
						layer.msg('无人机轨迹为空');
					}
					
					if(data.drone==''&&data.hly==''&&data.fire==''){
						layer.msg('查询轨迹为空');
						map.clearMap();
					}
					function perform(data) {
						for (var i=0;i<data.length;i++){
							if (data[i].obj.length>1 && data[i].obj[0].lng!='undefined') {
								marker1 = new AMap.Marker({//开始位置
									map: map,
									position: JSON.parse('[' + String(data[i].obj[0].lng) + ',' + String(data[i].obj[0].lat) + ']'),
									icon: "img/LK/"+images,
									offset: new AMap.Pixel(0, -30),
									autoRotation: false
								});
								marker1.setLabel({
									offset: new AMap.Pixel(-10, -20),
									content: data[i].name+';开始位置'
								});
								addHotMarkerClick_two(marker1,data[i].obj);

								marker = new AMap.Marker({//结束位置
									map: map,
									position:JSON.parse('[' + String(data[i].obj[0].lng) + ',' + String(data[i].obj[0].lat) + ']'),
									icon: "img/LK/"+imageszd,
									offset: new AMap.Pixel(0, -30),
									autoRotation: false
								});
								var dataobj=data[i].obj.pop();
								marker.setLabel({
									offset: new AMap.Pixel(-10, -20),
									content: data[i].name+';结束位置'
								});
								addHotMarkerClick(marker,data[i].obj.pop());
								var polyline = new AMap.Polyline({
									map: map,
									path: lineArr,
									strokeColor: "#F00",  //线颜色
									// strokeOpacity: 1,     //线透明度
									strokeWeight: 3,      //线宽
									// strokeStyle: "solid"  //线样式
								});
								var passedPolyline = new AMap.Polyline({
									map: map,
									// path: lineArr,
									strokeColor: "#F00",  //线颜色
									// strokeOpacity: 1,     //线透明度
									strokeWeight: 3,      //线宽
									// strokeStyle: "solid"  //线样式
								});
								marker.on('moving',function(e){
									passedPolyline.setPath(e.passedPath);
								});
								map.setFitView();
								marker.moveAlong(lineArr, 2500);
								lineArr = [];
							}
						}
					}
					function perform1(data) {
						for (var i=0;i<data.length;i++){
							var s_data=[];
							if (data[i].obj.length>2&&data[i].obj[0].droneLat!='undefined') {

								for (var index = 0; index < data[i].obj.length; index++) {
									if (data[i].obj[index].droneLat!=''&&data[i].obj[index].droneLng!='') {
										s_data.push(data[i].obj[index])
									}
								}
								marker1 = new AMap.Marker({//开始位置
									map: map,
									position: JSON.parse('[' + String(s_data[0].droneLng) + ',' + String(s_data[0].droneLat) + ']'),
									icon: "img/LK/"+images,
									offset: new AMap.Pixel(0, -30),
									autoRotation: false
								});
								marker2 = new AMap.Marker({//开始位置
									map: map,
									position: JSON.parse('[' + String(s_data[0].mobleLng) + ',' + String(s_data[0].mobleLat) + ']'),
									icon: "img/LK/user.png",
									offset: new AMap.Pixel(0, -30),
									autoRotation: false
								});
								marker2.setLabel({
									offset: new AMap.Pixel(-50, -20),
									content: s_data[0].publishName+';遥控器'
								});
								marker1.setLabel({
									offset: new AMap.Pixel(-50, -20),
									content: s_data[0].publishName+';开始位置'
								});
								addHotMarkerClick1_two(marker1,s_data);
								marker = new AMap.Marker({  //结束位置
									map: map,
									position: JSON.parse('[' + String(s_data.pop().droneLng) + ',' + String(s_data.pop().droneLat) + ']'),
									icon: "img/LK/"+imageszd,
									offset: new AMap.Pixel(0, -30),
									autoRotation: false
								});
								// var dataobj=data.obj.pop();
								marker.setLabel({
									offset: new AMap.Pixel(-50, -20),
									content: s_data[0].publishName+';结束位置'
								});
								addHotMarkerClick1(marker,s_data.pop());
								var polyline = new AMap.Polyline({
										map: map,
										path: lineArr,
										strokeColor: "#F00",  //线颜色
										// strokeOpacity: 1,     //线透明度
										strokeWeight: 3,      //线宽
										// strokeStyle: "solid"  //线样式
								});
								var passedPolyline = new AMap.Polyline({
									map: map,
									// path: lineArr,
									strokeColor: "#F00",  //线颜色
									// strokeOpacity: 1,     //线透明度
									strokeWeight: 3,      //线宽
									// strokeStyle: "solid"  //线样式
								});
								marker.on('moving',function(e){
									passedPolyline.setPath(e.passedPath);
								})
								map.setFitView();
								marker.moveAlong(lineArr, 2500);
								lineArr = [];
							}
						}
					}
				}else{
					layer.msg('您查询的时间无轨迹');map.clearMap();
				}
			}
		});
	}else{
		layer.open({
			content: '回放时间不能为空',
			skin: 'layui-layer-molv',
			scrollbar: false,btnAlign: 'c'
		});
	}
});

// 终点
function addHotMarkerClick(marker,data) {
  marker.content ="<ul class=\"mak_con\" style=\"width:320px\"><li><label class=\"title\">轨迹信息</label></li><li><label>用户名：</label><span>"+data.name+"</span></li><li><label>手机：</label><span>"+data.tel+"</span></li><li><label>结束时间：</label><span>"+data.time+"</span></li><li><label>结束位置：</label><span>"+data.lng+","+data.lat+"</span></li><li><label>结束区域：</label><span>"+data.city+data.town+data.village+"</span></li></ul>";
  AMap.event.addListener(marker, 'click', function() {
    infoWindow.setContent(marker.content);
    infoWindow.open(map, marker.getPosition());
  });
}
// 起点
function addHotMarkerClick_two(marker,data) {
  for (var i = 0; i < data.length; i++) {
    lineArr.push(JSON.parse('[' + String(data[i].lng) + ',' + String(data[i].lat) + ']'));
  }
  marker.content ="<ul class=\"mak_con\" style=\"width:320px\"><li><label class=\"title\">轨迹信息</label></li><li><label>用户名：</label><span>"+data[0].name+"</span></li><li><label>手机：</label><span>"+data[0].tel+"</span></li><li><label>开始时间：</label><span>"+data[0].time+"</span></li><li><label>出发位置：</label><span>"+data[0].lng+","+data[0].lat+"</span></li><li><label>出发区域：</label><span>"+data[0].city+data[0].town+data[0].village+"</span></li></ul>";
  AMap.event.addListener(marker, 'click', function() {
    infoWindow.setContent(marker.content);
    infoWindow.open(map, marker.getPosition());
  });
}
// 终点
function addHotMarkerClick1(marker,data) {
  marker.content ="<ul class=\"mak_con\" style=\"width:320px\"><li><label class=\"title\">轨迹信息</label></li><li><label>手机：</label><span>"+data.publishName+"</span></li><li><label>结束时间：</label><span>"+data.appRunTime+"</span></li><li><label>结束位置：</label><span>"+data.droneLng+","+data.droneLat+"</span></li><li><label>结束区域：</label><span>"+data.city+data.town+"</span></li></ul>";
  AMap.event.addListener(marker, 'click', function() {
    infoWindow.setContent(marker.content);
    infoWindow.open(map, marker.getPosition());
  });
}
// 起点
function addHotMarkerClick1_two(marker,data) {
  for (var i = 0; i < data.length; i++) {
    lineArr.push(JSON.parse('[' + String(data[i].droneLng) + ',' + String(data[i].droneLat) + ']'));
  }
  marker.content ="<ul class=\"mak_con\" style=\"width:320px\"><li><label class=\"title\">轨迹信息</label></li><li><label>手机：</label><span>"+data[0].publishName+"</span></li><li><label>开始时间：</label><span>"+data[0].appRunTime+"</span></li><li><label>出发位置：</label><span>"+data[0].droneLng+","+data[0].droneLat+"</span></li><li><label>出发区域：</label><span>"+data[0].city+data[0].town+"</span></li></ul>";
  AMap.event.addListener(marker, 'click', function() {
    infoWindow.setContent(marker.content);
    infoWindow.open(map, marker.getPosition());
  });
}
