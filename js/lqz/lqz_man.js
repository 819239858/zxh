var map = new AMap.Map("container", {
    resizeEnable: true,
    zoom:12,
});
var type= new AMap.MapType({
    defaultType:1,
    showRoad:true
});
map.addControl(type);
// 获取file文件名
function getFileName(o){
    var pos=o.lastIndexOf("/");
    return o.substring(pos+1);
}
$("#container").hide();
// 保存
function save(index){
	$('.form_sub').eq(index).find(".form-control").attr({"disabled" : "disabled","style" : "background-color:#eee"});
	$('.form_sub').eq(index).find("select").attr({"disabled" : "disabled","style" : "background-color:#eee"});
	$('.form_sub').eq(index).find(".cancel").addClass('editor').val('编辑');
	$('.form_sub').eq(index).find(".cancel").attr({"onclick":"editor("+index+")"});
	$('.form_sub').eq(index).find(".enter_map").hide();$("#container").show();
	$('.form_sub').eq(index).find(".addOn").attr({"style":"background-color:#eee"});
	$('.form_sub').eq(index).find('.comm_add').hide();
	$('.form_sub').eq(index).find('.upFileBtn').attr({"disabled" : "disabled"});
	$('.form_sub').eq(index).find('.img_yl').removeClass("up-section");
	// $('.form_sub').eq(index).find('.img_yl').addClass("up-section1");
}
// 编辑
function editor(index){
	$('.fileInput').show();
	$('.form_sub').eq(index).find(".remove_disabled").removeAttr("disabled");
	$('.form_sub').eq(index).find(".remove_disabled").removeAttr("style");
	$('.form_sub').eq(index).find(".tab_form_sub .form_sub li").show();
	$("#container").hide();$(".enter_map").show();
	$('.form_sub').eq(index).find(".addOn").removeAttr("style");
	$('.form_sub').eq(index).find('.comm_add').show();
	$('.form_sub').eq(index).find('.upFileBtn').removeAttr("disabled");
	$('.form_sub').eq(index).find('.img_yl').addClass("up-section").removeClass("img_yl");
	// $('.form_sub').eq(index).find('.img_yl').removeClass("up-section1");
}
// 图片文件
$("#photoName1").takungaeImgup({
    formData: {
		"path": "fire_image",
		"file_ext":"image"
	},
	url:"fire/upload/fileUpload",
	id:"imgBox"
});
$("#photoName2").takungaeImgup({
    formData: {
		"path": "fire_image",
		"file_ext":"image"
	},
	url:"fire/upload/fileUpload",
	id:"imgBox1"
});
$("#photoName3").takungaeImgup({
    formData: {
		"path": "fire_image",
		"file_ext":"image"
	},
	url:"fire/upload/fileUpload",
	id:"imgBox2"
});
// 正射图压缩包
$("#videoName1").takungaevideoup({
	formData: {
		"path": "fire_are_taken",
		"file_ext":"other"
	},
	url:"fire/upload/fileUpload",
	id:"videoname"
});
$("#videoName2").takungaevideoup({
    formData: {
		"path": "fire_are_taken",
		"file_ext":"other"
	},
	url:"fire/upload/fileUpload",
	id:"videoname1"
});
$("#videoName3").takungaevideoup({
    formData: {
		"path": "fire_are_taken",
		"file_ext":"other"
	},
	url:"fire/upload/fileUpload",
	id:"videoname2"
});
// 添加火情提交
function fsubmit() {
	layer.msg('正在上报中', {
	  icon: 16,shade: 0.01,time:false
	});
	var happen_time = $("#creactTime").val();
	var region=$("#province").val();
	$("#city").val()==''||$("#city").val()==undefined?region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city").val():region=$("#area").val();
	var position_type =localStorage.getItem("pointTpye");
	var fire_level = $("#fireLeve").val();
	var fire_type = $("#fireKind").val();
	var fire_cause = $("#fireCause").val();
	var fire_area = $("#fireMj").val();
	var environment = $("#fireHj").val();

	var fire_image = imgName;
	var are_taken_file=videoName.pop();
	var are_taken_file_describe=$("#describe").val();
	var hot_id=sessionStorage.getItem("hot_id");
    var position = $("#latLngs").val();
	if (happen_time!=''&&position!=''&&region!='') {
		sendAjax({
			"url":"fire/fire/addFireUpload",
			"data":{"happen_time":happen_time,"region":region,"position":position,
				"position_type":position_type,"fire_level":fire_level,"fire_type":fire_type,
				"fire_cause":fire_cause,"fire_area":fire_area,
				"environment":environment,"fire_image":fire_image,
				"are_taken_file":are_taken_file,"are_taken_file_describe":are_taken_file_describe,
				"hot_id":hot_id},
			"callback":function(data){
			  	if (data.code=="s_ok") {
					layer.closeAll('dialog');
			        localStorage.setItem("var", data.var);
					layer.alert("<img src='img/lqz/ok.png'><br>保存成功<br>火灾编号为<span class='lv'>HZ"+data.var+"</span>", {
					  skin: 'layui-layer-molv',btnAlign: 'c'
					  ,closeBtn: 0,anim: 4,btnAlign: 'c'
					});
                    imgName = [];
					save(0);
					$("#bianhao").val(data.var);
					$("#bianhao").show();
					$('.form_sub').eq(0).find(".report").addClass('editor').val('保存');
					$('.form_sub').eq(0).find(".report").attr({"onclick" : "fsubmit_modify()"});
					var site= $("#latLngs").val();
					$('#lnglat1').val(site);
					$('#lnglat2').val(site);
					// 回显坐标
					var lnglatXY=[];
	    			if (position_type=="0") {
	    				var lnglat=position.split(";");
			    		lnglat.pop();
	    				for (var i = 0; i < lnglat.length; i++) {
	    					map.setZoomAndCenter(17, JSON.parse('[' + String(lnglat[i]) + ']'));
	    					marker(JSON.parse('[' + String(lnglat[i]) + ']'),0);
	    				}
	    				var lnglatXY=[];
	    			}
	    			if (position_type=="1") {
			    		var lnglat=position.split(";");
			    		lnglat.pop();
			    		for(var i=0;i<lnglat;i++){
			    			lnglatXY.push(JSON.parse('[' + String(lnglat[i]) + ']'));
			    		}
		    			marker(lnglatXY,1);
		    			map.setZoomAndCenter(16, lnglatXY[0]);
		    			var lnglatXY=[];
	    			}
	    			if (position_type=="2") {
	    				var lnglat=position.split(";");
			    		lnglat.pop();
			    		for(var i=0;i<lnglat.length;i++){
			    			lnglatXY.push(JSON.parse('[' + String(lnglat[i]) + ']'));
			    		}
		    			marker(lnglatXY,2);
		    			map.setZoomAndCenter(16, lnglatXY[0]);
		    			var lnglatXY=[];
	    			}	
				}else{
					layer.msg('保存失败:'+data.var)
				}
		    },
		    error:function(e){
		        layer.alert("网络不好，请刷新试试！", {
				  skin: 'layui-layer-molv' 
				  ,closeBtn: 0,anim: 4,btnAlign: 'c'
				});
		    }
		});
	}else{
		layer.alert("请完善火情上报信息", {
			skin: 'layui-layer-molv',
			title:'温馨提示',
			closeBtn: 0,anim: 4,btnAlign: 'c'
		});
	}
}
// 添加input
var n= 0;
$(".comm_add").click(function (){
	n++;
	n<10?$(".add_comm_add").append('<input type="text"  class="form-control form-boxed remove_disabled commandGroupName" placeholder="姓名" /><input type="text" class="form-control form-boxed remove_disabled commandGroupName" placeholder="职务" />'):layer.alert("不能超过10个", {skin: 'layui-layer-molv' ,closeBtn: 0,anim: 4 });
});
// 追踪火情提交
function fsubmit_chase(){
	// 判断数量必须为数字
	var value = $("#form2").find(".number");
	var reg=/^\d*$/;  
	for(var i =0;i < value.length;i++){
	    if(reg.test(value[i].value)==true){
		}else{
		    layer.alert("消防员队伍人数和物资数量必须为数字", {
				skin: 'layui-layer-molv',
				title:'温馨提示',
				closeBtn: 0,anim: 4,btnAlign: 'c'
			});
		    return false;
		}
	}
	// 物资
	var allInputs = $('.input_wz').find('input');
	var libIds = "";
	for (var i = 0; i < allInputs.length; i++) {
		if (allInputs[i].value=='') {
			allInputs[i].value=0;
		}
		if(i%2==0){
		    libIds += allInputs[i].value + "_";
		}else{
		    libIds += allInputs[i].value + ",";
		}
	};
	if (libIds.length > 0) {
        libIds = libIds.substr(0,libIds.length - 1);
    };
    var allInputs_one = $('.add_comm_add').find('input');
	var libIds_one = "";
	for (var i = 0; i < allInputs_one.length; i++) {
		if (allInputs_one[i].value=='') {
			allInputs_one[i].value=0;
		}
		if(i%2==0){
		    libIds_one += allInputs_one[i].value + "_";
		}else{
		    libIds_one += allInputs_one[i].value + ",";
		}
	};
	if (libIds_one.length > 0) {
        libIds_one = libIds_one.substr(0,libIds_one.length - 1);
    };
	var fire_id = Number(localStorage.getItem("var"));
	var trace_time = $("#creactTime1").val();
	var trace_weather = $("#weather").val();
	var woods_area = $("#woodLandArea").val();
	var tree_species = $("#mainTree").val();
	var tree_fire = $("#woodLandFirePostion").val();
	var fire_level = $("#fireStep").val();
	var commander_name = $("#chiefName").val();
	var commander_job= $("#chiefJob").val();
	var commander_member = libIds_one;
	var firemen_name = $("#truckmanTeamName").val();
	var firemen_num = $("#truckmanNo").val();
	var materials = libIds;
	var quench_time = $("#estimatedFireTime").val();
	var position = $("#lnglat1").val();
	var position_type =localStorage.getItem("pointTpye");

	var fire_image = imgName;
	var are_taken_file=videoName.pop();
	var are_taken_file_describe=$("#describe1").val();
    if (commander_name!=''&&commander_job!="") {
		if (fire_id=='') {
			layer.alert("请录入火情追踪信息", {
				skin: 'layui-layer-molv',
				title:'温馨提示',
				closeBtn: 0,anim: 4,btnAlign: 'c'
			});
		    return false;
		}
		sendAjax({
			"url":"fire/fire/addFireTrace",
			"data":{"fire_id":fire_id,"trace_time":trace_time,"position":position,
				"position_type":position_type,"fire_level":fire_level,"trace_weather":trace_weather,
				"woods_area":woods_area,"tree_species":tree_species,"tree_fire":tree_fire,
				"commander_name":commander_name,"commander_job":commander_job,
				"commander_member":commander_member,"firemen_name":firemen_name,"firemen_num":firemen_num,
				"materials":materials,"quench_time":quench_time,"fire_image":fire_image,
				"are_taken_file":are_taken_file,"are_taken_file_describe":are_taken_file_describe},
			"callback":function(data){
			  	if (data.code=="s_ok") {
					layer.alert("<img src='img/lqz/ok.png'><br>保存成功<br>", {
						skin: 'layui-layer-molv' 
						,closeBtn: 0,anim: 4,btnAlign: 'c'
					});
                    imgName = [];
					save(1);
					$('.form_sub').eq(1).find(".report").addClass('editor').val('保存');
					$('.form_sub').eq(1).find(".report").attr({"onclick" : "fsubmit_chase_modify()"});
				}else{
					layer.msg(data.var)
				}
			},
			error:function(e){
				layer.alert("网络不好，请刷新试试！", {
					skin: 'layui-layer-molv' 
					,closeBtn: 0,anim: 4,btnAlign: 'c'
				});
			}
		});
		
	}else{
		layer.alert("请完善火情追踪信息", {
			skin: 'layui-layer-molv',
			title:'温馨提示',
			closeBtn: 0,anim: 4,btnAlign: 'c'
		});
	}
}
// 火情结束上报
function fsubmit_over(){
	var fire_id = Number(localStorage.getItem("var"));
	var finish_time = $("#creactTime2").val();
	var position = $("#lnglat2").val();
	var position_type =localStorage.getItem("pointTpye");
	var cost_time = $("#keepTime").val();
	var fire_area = $("#firearea").val();
	var destroy_build = $("#destroyBuild").val();
	var death_people = $("#death").val();
	var bruise_people = $("#injured").val();
	var financial_loss = $("#economicLoss").val();
	var hidden_danger= $("#hiddenDanger").val();
	var danger_cause = $("#reason").val();
	var summarize = $("#experience").val();

	var fire_image = imgName;
	var are_taken_file=videoName.pop();
	var are_taken_file_describe=$("#describe2").val();
    if (finish_time!=''&&cost_time!=""&&fire_area!=""&&destroy_build!=""&&death_people!=""&&bruise_people!=""&&financial_loss!="") {
		if (fire_id=='') {
			layer.alert("请录入火情结束信息", {
				skin: 'layui-layer-molv',
				title:'温馨提示',
				closeBtn: 0,anim: 4,btnAlign: 'c'
			});
		    return false;
		}
		sendAjax({
			"url":"fire/fire/addFireFinish",
			"data":{"fire_id":fire_id,"finish_time":finish_time,"position":position,"position_type":position_type,
				"cost_time":cost_time,"fire_area":fire_area,"destroy_build":destroy_build,"death_people":death_people,
				"bruise_people":bruise_people,"financial_loss":financial_loss,"hidden_danger":hidden_danger,
				"danger_cause":danger_cause,"summarize":summarize,"fire_image":fire_image,
				"are_taken_file":are_taken_file,"are_taken_file_describe":are_taken_file_describe},
			"callback":function(data){
			  	if (data.code=="s_ok") {
					layer.alert("<img src='img/lqz/ok.png'><br>保存成功<br>", {
						skin: 'layui-layer-molv' 
						,closeBtn: 0,anim: 4,btnAlign: 'c'
					});
                    imgName = [];
					save(1);
					$('.form_sub').eq(1).find(".report").addClass('editor').val('保存');
					$('.form_sub').eq(1).find(".report").attr({"onclick" : "fsubmit_chase_modify()"});
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
		
	}else{
		layer.alert("请完善火情结束信息", {
			skin: 'layui-layer-molv',
			title:'温馨提示',
			closeBtn: 0,anim: 4,btnAlign: 'c'
		});
	}
}
$(".serial-number ul").on("click","li",function(){
    var index = $(this).index();
    $(this).addClass("progressing").siblings().removeClass("progressing");
    $(".form_sub").hide().eq(index).show();
    // $("#container").hide();
    $(".enter_map").show();
});

// 上报火情修改
function fsubmit_modify() {
	var happen_time = $("#creactTime").val();
	var region=$("#province").val();
	$("#city").val()==''||$("#city").val()==undefined?region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city").val():region=$("#area").val();
	var position = $("#latLngs").val();
	var position_type =localStorage.getItem("pointTpye");
	var fire_level = $("#fireLeve").val();
	var fire_type = $("#fireKind").val();
	var fire_cause = $("#fireCause").val();
	var fire_area = $("#fireMj").val();
	var environment = $("#fireHj").val();
	var fireId_xq = $("#bianhao").val();

    if(img_del1.length>0){
        //说明在修改中有删除图片
        for(var x=0;x<img_del1.length;x++){
            list1.splice(img_del1[x],1);
        }
    }
    if(imgName.length>0){
        for(var y=0;y<imgName.length;y++){
            list1.push(imgName[y]);
        }
    }
    var img=list1;

	var fire_image = img;
	var are_taken_file=videoName.pop();
	var are_taken_file_describe=$("#describe").val();
	var hot_id=sessionStorage.getItem("hot_id");
	if (happen_time!=''&&position!=''&&region!='') {
		sendAjax({
			"url":"fire/fire/editFireUpload",
			"data":{"id":fireId_xq,"happen_time":happen_time,"region":region,"position":position,"position_type":position_type,"fire_level":fire_level,"fire_type":fire_type,"fire_cause":fire_cause,"fire_area":fire_area,"environment":environment,"fire_image":fire_image,"are_taken_file":are_taken_file,"are_taken_file_describe":are_taken_file_describe,"hot_id":hot_id},"callback":function(data){
			  	if (data.code=="s_ok") {
					layer.closeAll('dialog');
			        localStorage.setItem("var", data.var);
					layer.alert("<img src='img/lqz/ok.png'><br>保存成功<br>火灾编号为<span class='lv'>HZ"+data.var+"</span>", {
					  skin: 'layui-layer-molv',btnAlign: 'c',closeBtn: 0,anim: 4,btnAlign: 'c'
					});
                    imgName = [];
					save(0);
					//删除热点id
                    sessionStorage.removeItem('hot_id');
					$("#bianhao").val(data.var);
					$("#bianhao").show();
					$('.form_sub').eq(0).find(".report").addClass('editor').val('保存');
					$('.form_sub').eq(0).find(".report").attr({"onclick" : "fsubmit_modify()"});
					var site= $("#latLngs").val();
					$('#lnglat1').val(site);
					$('#lnglat2').val(site);
					// 回显坐标
					var lnglatXY=[];
	    			if (position_type=="0") {
	    				var lnglat=position.split(";");
			    		lnglat.pop();
	    				for (var i = 0; i < lnglat.length; i++) {
	    					map.setZoomAndCenter(17, JSON.parse('[' + String(lnglat[i]) + ']'));
	    					marker(JSON.parse('[' + String(lnglat[i]) + ']'),0);
	    				}
	    				var lnglatXY=[];
	    			}
	    			if (position_type=="1") {
			    		var lnglat=position.split(";");
			    		lnglat.pop();
			    		for(var i=0;i<lnglat;i++){
			    			lnglatXY.push(JSON.parse('[' + String(lnglat[i]) + ']'));
			    		}
		    			marker(lnglatXY,1);
		    			map.setZoomAndCenter(16, lnglatXY[0]);
		    			var lnglatXY=[];
	    			}
	    			if (position_type=="2") {
	    				var lnglat=position.split(";");
			    		lnglat.pop();
			    		for(var i=0;i<lnglat.length;i++){
			    			lnglatXY.push(JSON.parse('[' + String(lnglat[i]) + ']'));
			    		}
		    			marker(lnglatXY,2);
		    			map.setZoomAndCenter(16, lnglatXY[0]);
		    			var lnglatXY=[];
	    			}	
				}else{
					layer.msg('保存失败:'+data.var)
				}
		    },
		    error:function(e){
		        layer.alert("网络不好，请刷新试试！", {
				  skin: 'layui-layer-molv' 
				  ,closeBtn: 0,anim: 4,btnAlign: 'c'
				});
		    }
		});
	}else{
		layer.alert("请完善火情上报信息", {
			skin: 'layui-layer-molv',
			title:'温馨提示',
			closeBtn: 0,anim: 4,btnAlign: 'c'
		});
	}
}
// 追踪火情修改
function fsubmit_chase_modify(){
	// 判断数量必须为数字
	var value = $("#form2").find(".number");
	var reg=/^\d*$/;  
	for(var i =0;i < value.length;i++){
	    if(reg.test(value[i].value)==true){
		}else{
		    layer.alert("消防员队伍人数和物资数量必须为数字", {
				skin: 'layui-layer-molv',
				title:'温馨提示',
				closeBtn: 0,anim: 4,btnAlign: 'c'
			});
		    return false;
		}
	}
	// 物资
	var allInputs = $('.input_wz').find('input');
	var libIds = "";
	for (var i = 0; i < allInputs.length; i++) {
		if (allInputs[i].value=='') {
			allInputs[i].value=0;
		}
		if(i%2==0){
		    libIds += allInputs[i].value + "_";
		}else{
		    libIds += allInputs[i].value + ",";
		}
	};
	if (libIds.length > 0) {
        libIds = libIds.substr(0,libIds.length - 1);
    };
    var allInputs_one = $('.add_comm_add').find('.commandGroupName');
	var libIds_one = "";
	for (var i = 0; i < allInputs_one.length; i++) {
		if (allInputs_one[i].value=='') {
			allInputs_one[i].value=0;
		}
		if(i%2==0){
		    libIds_one += allInputs_one[i].value + "_";
		}else{
		    libIds_one += allInputs_one[i].value + ",";
		}
	};
	if (libIds_one.length > 0) {
        libIds_one = libIds_one.substr(0,libIds_one.length - 1);
    };
	var trace_time = $("#creactTime1").val();
	var trace_weather = $("#weather").val();
	var woods_area = $("#woodLandArea").val();
	var tree_species = $("#mainTree").val();
	var tree_fire = $("#woodLandFirePostion").val();
	var fire_level = $("#fireStep").val();
	var commander_name = $("#chiefName").val();
	var commander_job= $("#chiefJob").val();
	var commander_member = libIds_one;
	var firemen_name = $("#truckmanTeamName").val();
	var firemen_num = $("#truckmanNo").val();
	var materials = libIds;
	var quench_time = $("#estimatedFireTime").val();
	var position = $("#lnglat1").val();
	var position_type =localStorage.getItem("pointTpye");

    if(img_del2.length>0){
        //说明在修改中有删除图片
        for(var x=0;x<img_del2.length;x++){
            list2.splice(img_del2[x],1);
        }
    }
    if(imgName.length>0){
        for(var y=0;y<imgName.length;y++){
            list2.push(imgName[y]);
        }
    }
    var img=list2;

    var fire_image = img;
	var are_taken_file=videoName.pop();
	var are_taken_file_describe=$("#describe1").val();
    if (commander_name!=''&&commander_job!="") {
		sendAjax({
			"url":"fire/fire/editFireTrace",
			"data":{"id":fireId_xq,"trace_time":trace_time,"position":position,"position_type":position_type,"fire_level":fire_level,"trace_weather":trace_weather,"woods_area":woods_area,"tree_species":tree_species,"tree_fire":tree_fire,"commander_name":commander_name,"commander_job":commander_job,"commander_member":commander_member,"firemen_name":firemen_name,"firemen_num":firemen_num,"materials":materials,"quench_time":quench_time,"fire_image":fire_image,"are_taken_file":are_taken_file,"are_taken_file_describe":are_taken_file_describe},"callback":function(data){
			  	if (data.code=="s_ok") {
					layer.alert("<img src='img/lqz/ok.png'><br>保存成功<br>", {
						skin: 'layui-layer-molv',closeBtn: 0,anim: 4,btnAlign: 'c'
					});
                    imgName = [];
					save(1);
					$('.form_sub').eq(1).find(".report").addClass('editor').val('保存');
					$('.form_sub').eq(1).find(".report").attr({"onclick" : "fsubmit_chase_modify()"});
				}else{
					layer.msg(data.var)
				}
			},
			error:function(e){
				layer.alert("网络不好，请刷新试试！", {
					skin: 'layui-layer-molv' 
					,closeBtn: 0,anim: 4,btnAlign: 'c'
				});
			}
		});
	}else{
		layer.alert("请完善火情追踪信息", {
			skin: 'layui-layer-molv',
			title:'温馨提示',
			closeBtn: 0,anim: 4,btnAlign: 'c'
		});
	}
}

// 点击返回
function back() {
	$("#index_main_context").load("wj_fireInfoList.html");
	$("#index_titel").html("火情信息");
}
function marker(lnglatXY,pointTpye){
	map.clearMap();
	if (pointTpye==0) {
		console.log(lnglatXY);
		console.log(pointTpye);
		var marker = new AMap.Marker({
			icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
			position: lnglatXY,
			map: map
		});
		marker.setMap(map);
		map.setFitView(10);// 执行定位
	}
	if (pointTpye==1) {
		map.clearMap();
	    var polyline = new AMap.Polyline({
	        path:lnglatXY,          //设置线覆盖物路径
	        strokeColor: "#4196e1", //线颜色
	        strokeOpacity: 1,       //线透明度
	        strokeWeight: 5,        //线宽
	        strokeStyle: "solid",   //线样式
	        strokeDasharray: [10, 5] //补充线样式
	    });
	    polyline.setMap(map);
	    map.setFitView(10);// 执行定位
	}
	if (pointTpye==2) {
		map.clearMap();
	    var polygon = new AMap.Polygon({
	        path: lnglatXY,//设置多边形边界路径
	        strokeColor: "#4196e1", //线颜色
	        strokeOpacity: 1, //线透明度
	        strokeWeight: 2,    //线宽
	        fillColor: "#4196e1", //填充色
	        fillOpacity: 0.35//填充透明度
	    });
	    polygon.setMap(map);
	    map.setFitView(10);// 执行定位
	}
}
callback1();
// 回显正射图
function drawing(path) {
	var fileName=$(path).html();
	var imageLayerArr = [];
    layer.open({
        type: 1,
        skin: 'layui-layer-molv', //样式类名
        closeBtn: 1, //关闭按钮
        anim: 2,
        btnAlign: 'c',
        area: ['800px', '600px;'],
        title:"正射图",
        shadeClose: true, //开启遮罩关闭
        content:"<div id='container1' style='width:800px;height:560px'></div>",
        success:function(){
            var map = new AMap.Map("container1", {
		        resizeEnable: true,
		        zoom:15
		    });
		    var type= new AMap.MapType({
		      defaultType:0,
		      showRoad:true
		    });
			map.addControl(type);
			sendAjax({
				"url":"fire/upload/openZip",
				"data":{"zoom":map.getZoom(),"path":fileName},"callback":function(data){
					if (data.code=="s_ok") {
						for(var i=0;i<imageLayerArr.length;i++){
							imageLayerArr[i].setMap(null);
						}
						imageLayerArr = [];
						var data=data.var;
						map.setZoomAndCenter(14, JSON.parse('[' + String(data[0].west) + ',' + String(data[0].south) + ']'));
						for(var i=0;i<data.length;i++){
							var a = new AMap.LngLat(data[i].west, data[i].south);
							var b = new AMap.LngLat(data[i].east, data[i].north);
							var bounds = new AMap.Bounds(a,b);
							var imageLayer = new AMap.ImageLayer({
								url: Public_address+data[i].href,
								bounds: bounds,
								zoom: map.getZoom()
							});
							imageLayerArr.push(imageLayer);
							imageLayer.setMap(map);
						}
					}else{
						layer.msg(data.var)
					}
		        }
			});
            AMap.event.addListener(map,'zoomend',function(){
				try{
					sendAjax({
						"url":"fire/upload/openZip",
						"data":{"zoom":map.getZoom(),"path":fileName},"callback":function(data){
							if (data.code=="s_ok") {
								for(var i=0;i<imageLayerArr.length;i++){
									imageLayerArr[i].setMap(null);
								}
								imageLayerArr = [];
								var data=data.var;
								for(var i=0;i<data.length;i++){
									var a = new AMap.LngLat(data[i].west, data[i].south);
									var b = new AMap.LngLat(data[i].east, data[i].north);
									var bounds = new AMap.Bounds(a,b);
									var imageLayer = new AMap.ImageLayer({
										url: Public_address+data[i].href,
										bounds: bounds,
										zoom: map.getZoom()
									}); 
									imageLayerArr.push(imageLayer);
									imageLayer.setMap(map);
								}
							}else{
								layer.msg(data.var);
							};
				        }
					});
				}catch(e){
				  layer.msg(e);
				}
			});
        }
    })  
}
