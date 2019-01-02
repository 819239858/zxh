function report_index(index,fireId) {
    $("#index_main_context").load("lqz_fire_details.html");
    $("#index_titel").html("火情上报详情");
    localStorage.setItem("index_xq",index);
	localStorage.setItem("fireId_xq",fireId);
	sessionStorage.setItem("location","LK_html/qjgl/hzsq.html");
	sessionStorage.setItem("location_html","实时火情");
    //隐藏地图
    stopInterval();
};
// 点击弹框
function markerClick(marker,data){
	var info = [];
	info.push("<div style=\"width:360px;font-family:'微软雅黑' \"><div><span style=\"color:#262626;font-size:14px;\">火灾编号 : </span>"+'HZ'+data.id+"</div>");
	info.push("<div><span style=\"color:#262626;font-size:14px;\">区域 : </span>"+data.region_name+"</div>");
	info.push("<div><span style=\"color:#262626;font-size:14px\">等级 : </span>"+fireMaps.get(data.fire_level)+"<span style=\"color:#262626;font-size:14px;margin-left:20px\">火灾发生时间 : </span>"+data.happen_time+"</div> ");
	info.push("<div><span style=\"color:#262626;font-size:14px\">上报人 : </span>"+data.name+"<span style=\"color:#262626;font-size:14px;margin-left:20px\">火灾状态 : </span>"+fireStatus.get(data.status)+"</div> ");
	info.push("<div><span style=\"color:#262626;font-size:14px\">上报人电话: </span>"+data.tel+"</div> ");
	info.push("<div style=\"text-align:center\"><button style=\"width:100px;height:30px;border:none;border-radius:3px;color:#fff;background:#addc9d\" onclick=\"report_index("+data.status+","+data.id+")\">详情</button></div>")   
	info.push("</div>");
	marker.content = info.join("<br/>")	
	AMap.event.addListener(marker, 'click', function() {
		infoWindow.setContent(marker.content);
		infoWindow.open(map, marker.getPosition());
	});
}

var infoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(0, -20)
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
addBeiJing();
function search_btn_fire() {
	var region=$("#hot_city").val();
	$("#city_sx").val()==''||$("#city_sx").val()==undefined?region=$("#hot_city").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_sx").val():region=$("#area").val();
	var fire_level = $("#frie_type").val();
	var fire_type = $("#fireKind").val();
	var start_time = $("#a_start_time_fire").val();
	//实时火情的时候，从数据概要跳转的时候传2,3,4，如果不是就传4
    var fireNumber=sessionStorage.getItem("fireNumber");
    if(fireNumber == undefined){
        var status=4;
	}else{
    	var status=fireNumber;
	}
	if (start_time=='') {
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
        start_time = currentdate;
    }else{
        start_time = $('#a_start_time_fire').val();
    }
	var end_time = $("#a_end_time_fire").val();
	sendAjax({
		"url":"fire/fire/getFireUploadList",
		"data":{"current_page": 1,"per_page":100,"region":region,"fire_level":fire_level,
			"fire_type":fire_type,"start_time":start_time,"end_time":end_time,status:status},
		"callback":function(result){
			if (result.code=="s_ok") {
				map.clearMap();var num='';
				//如果是从数据概要跳转过来的页面，要清掉sessionStorage.getItem("fireNumber")
                sessionStorage.setItem("fireNumber",4);
				if (result.var.length<1) {
					layer.msg('查询数据为空');
					$("#table_tbody").html('');$("#data_total").html("找到：0条记录");
					$(".count_total").html(0);num=1;
				}else{
					$("#data_total").html("找到："+result.var.total+"条记录");
					$(".count_total").html(result.var.total);
					$("#table_tbody").html("");num=result.var.total;
					var data=result.var.data;
					if(data.length>0){
                        for(var i = 0;i<data.length;i++){
                            if (data[i].status=="1") {var images="fireing.gif"}
                            if (data[i].status=="2") {var images="zz.gif"}
                            if (data[i].status=="3") {var images="fired.gif"}
                            var lat = data[i].position;
                            var marker = new AMap.Marker({
                                position:lat.split(";")[0].split(","),
                                title: data[i].id,
                                icon:'img/'+images,
                                map: map
                            });
                            marker.setLabel({
                                offset: new AMap.Pixel(-60, -22),
                                content: data[i].region_name+ "；"+data[i].happen_time
                            });
                            markerClick(marker,data[i]);

                        };
					}
					$(".pagination").createPage({
						pageCount:Math.ceil(num/20),
						current:1,
						backFn:function(p){
							sendAjax({
								"url":"fire/fire/getFireUploadList",
								"data":{"current_page": p,"per_page":20,"region":region,"fire_level":fire_level,"fire_type":fire_type,"start_time":start_time,"end_time":end_time},
								"callback":function(result){
									$("#table_tbody").html('');
									var data=result.var.data;
									for(var i = 0;i<data.length;i++){
										if (data[i].status=="0") {var images="fireing.gif"}
										if (data[i].status=="1") {var images="zz.gif"}
										if (data[i].status=="2") {var images="fired.gif"}
										var lat = data[i].position;
										var marker = new AMap.Marker({
											position:lat.split(";")[0].split(","),
											title: data[i].id,
											icon:'img/'+images,
											map: map
										});
										marker.setLabel({
											offset: new AMap.Pixel(-60, -22),
											content: data[i].region_name+ "；"+data[i].happen_time
										});
										markerClick(marker,data[i]);

									}
								}
							})

						}
					});
				}
			} else{
                $("#data_total").html("找到：0条记录");
			}
		}
	});
}
search_btn_fire();



