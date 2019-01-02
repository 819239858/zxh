var isFirst=isFirst_two=isFirst_there=isFirst4=isFirst5= true; 
var index_xq = localStorage.getItem("index_xq");
var fireId_xq = localStorage.getItem("fireId_xq");
$(".serial-number ul").on("click","li",function(){
	var index = $(this).index();
	$(this).addClass("progressing").siblings().removeClass("progressing");
	$(".form_sub").hide().eq(index).show();
	$(".enter_map").show();
	$(".tableDiv_fire #container").css("height","220px");
	if (index==4) {$("#container").hide();}
});

//三详情
function details(){
	sendAjax({
		"url":"fire/fire/getFireUploadInfo",
		"data":{"id":fireId_xq},
		"callback":function(result){
			if (result.code=="s_ok") {
				var data=result.var;
				// 上报详情
				if (data.length>0) {
					if (index_xq<2) {
						var op1 = 
						"<div class=\"right_move\"><label>1.监控设备</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\" id=\"materialSupply\" name=\"materialSupply\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div><div class=\"right_move\"><label>2.灭火装备</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div><div class=\"right_move\"><label>3.防护装备</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div><div class=\"right_move\"><label>4.通信设备</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div><div class=\"right_move\"><label>5.油&nbsp;&nbsp;料</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div><div class=\"right_move\"><label>6.食物和水</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div><div class=\"right_move\"><label>7.其他物资</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div>";
						$(".input_wz").append(op1);
					}
					
					// if (index_xq!=3) {
					// 	var form3="<li><input type=\"button\" value=\"取消\" class=\"cancel\" onclick=\"back()\"> <input type=\"button\" value=\"上报\" class=\"report submit\" id=\"btn3\" onclick=\"fsubmit_over()\"></li>";
					// 	$(".form_sub_three").append(form3);
					// }
					$('#form1 .fileInput').hide();
					var element = result.var[0];var lnglatXY=[];
					localStorage.setItem("var", element.id);
					if (element.position_type == "0") {
						var lnglat=element.position.split(";");
						lnglat.pop();
						for (var i = 0; i < lnglat.length; i++) {
							map.setZoomAndCenter(17, JSON.parse('[' + String(lnglat[i]) + ']'));
							marker(JSON.parse('[' + String(lnglat[i]) + ']'),0);
						}
						var lnglatXY=[];
					}
					if (element.position_type=="1") {
						var lnglat=element.position.split(";");
						lnglat.pop();
						for(var i=0;i<lnglat.length;i++){
							lnglatXY.push(JSON.parse('[' + String(lnglat[i]) + ']'));
						}
						marker(lnglatXY,1);
						map.setZoomAndCenter(16, lnglatXY[0]);
						var lnglatXY=[];
					}
					if (element.position_type=="2") {
						var lnglat=element.position.split(";");
						lnglat.pop();
						for(var i=0;i<lnglat.length;i++){
							lnglatXY.push(JSON.parse('[' + String(lnglat[i]) + ']'));
						}
						marker(lnglatXY,2);
						map.setZoomAndCenter(16, lnglatXY[0]);
						var lnglatXY=[];
					}
					$("#latLngs").val(element.position);
					$("#lnglat1").val(element.position);
					$("#lnglat2").val(element.position);
					$("#bianhao").val(fireId_xq);
					$("#creactTime").val(element.happen_time);
					$("#person_name").val(element.user_name);
					$("#fireMj").val(element.fire_area);
					$("#person_telephone").val(element.user_tel);
					$("#fireHj").html(element.environment);
					$("#fireCause").get(0).selectedIndex=element.fire_cause;
					$("#province option[value='" +(element.region).substr(0,4)+ "']").prop("selected", "selected");
					callback((element.region).substr(0,4),$("#province"))
					$("#city option[value='" +(element.region).substr(0,6)+ "']").prop("selected", "selected");
					callback((element.region).substr(0,6),$("#city"))
					$("#area option[value='" +(element.region).substr(0,9)+ "']").prop("selected", "selected");
					$("#fireLeve").get(0).selectedIndex=element.fire_level;
					$("#fireKind").get(0).selectedIndex=element.fire_type;
					if (element.image_path!=null&&element.image_path!='') {
						var images=element.image_path;
						for (var i = 0; i < images.length; i++) {
							$("#imgBox").append("<img src="+Public_address+'uploads/'+images[i].path+" onerror=\"this.style=&quot;display:none&quot;\" class='img_yl'>");
							// imgName.push(images[i].id);
						}
					}
					if (element.are_taken_file!='') {
						$(".videoname").append("<a href='javascript:;' onclick='drawing(this)' style='margin-left:20px;'>"+element.are_taken_file[0].folder_path+"</a>");
					}
					
					$("#describe").val(element.are_taken_file_describe);
					save(0);
					//追踪详情
					if (data.length>1) {
						$('#form2 .fileInput').hide();
						var element1 = result.var[1];
						var material=[];var commandGroup=[];
						if (element1.commander_member!='') {
							var materialSupply=element1.commander_member.split(",");
							for(var i=0;i<materialSupply.length;i++){
								commandGroup[i]=materialSupply[i].split("_");
								var op ="<input type=\"text\" class=\"form-control form-boxed remove_disabled commandGroupName\" placeholder=\"姓名\" value=\"" + commandGroup[i][0] + "\"><input type=\"text\" class=\"form-control form-boxed remove_disabled commandGroupName\" placeholder=\"职务\" value=\"" + commandGroup[i][1] + "\">";
								$(".add_comm_add").append(op);
							}
						}
						if (index_xq<2||element1.materials=='') {
							var op1 = 
							"<div class=\"right_move\"><label>1.监控设备</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\" id=\"materialSupply\" name=\"materialSupply\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div><div class=\"right_move\"><label>2.灭火装备</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div><div class=\"right_move\"><label>3.防护装备</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div><div class=\"right_move\"><label>4.通信设备</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div><div class=\"right_move\"><label>5.油&nbsp;&nbsp;料</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div><div class=\"right_move\"><label>6.食物和水</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div><div class=\"right_move\"><label>7.其他物资</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled number\" placeholder=\"数量\"></div>";
							$(".input_wz").append(op1);
							
						}
						// $("#btn2").attr('onclick',"fsubmit_chase_modify()");
						if (element1.materials!='') {
							var material=element1.materials.split(",");
							for(var i=0;i<material.length;i++){
								material[i]=material[i].split("_");
							}
							var op1 = "<div class=\"right_move\"><label>1.监控设备</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\" id=\"materialSupply\" value=\"" + material[0][0] + "\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"数量\" value=\"" + material[0][1] + "\"></div><div class=\"right_move\"><label>2.灭火装备</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\" value=\"" + material[1][0] + "\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"数量\" value=\"" + material[1][1] + "\"></div><div class=\"right_move\"><label>3.防护装备</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\" value=\"" + material[2][0] + "\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"数量\" value=\"" + material[2][1] + "\"></div><div class=\"right_move\"><label>4.通信设备</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\" value=\"" + material[3][0] + "\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"数量\" value=\"" + material[3][1] + "\"></div><div class=\"right_move\"><label>5.油&nbsp;&nbsp;料</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\" value=\"" + material[4][0] + "\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"数量\" value=\"" + material[4][1] + "\"></div><div class=\"right_move\"><label>6.食物和水</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\" value=\"" + material[5][0] + "\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"数量\" value=\"" + material[5][1] + "\"></div><div class=\"right_move\"><label>7.其他物资</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"名称\" value=\"" + material[6][0] + "\"> <input type=\"text\" class=\"form-control form-boxed remove_disabled\" placeholder=\"数量\" value=\"" + material[6][1] + "\"></div>";
							$(".input_wz").append(op1);
						}

						$("#weather").val(element1.trace_weather);
						$("#creactTime1").val(element1.trace_time);
						$("#chiefName").val(element1.commander_name);
						$("#chiefJob").val(element1.commander_job);
						$("#truckmanTeamName").val(element1.firemen_name);
						$("#truckmanNo").val(element1.firemen_num);
						$("#woodLandArea").get(0).selectedIndex=element1.woods_area;
						$("#mainTree").get(0).selectedIndex=element1.tree_species;
						$("#woodLandFirePostion").get(0).selectedIndex=element1.tree_fire;
						$("#fireStep").get(0).selectedIndex=element1.fire_level;
						$("#estimatedFireTime").get(0).selectedIndex=element1.quench_time;
						if (element1.are_taken_file!='') {
							$(".videoname1").append("<a href='javascript:;' onclick='drawing(this)' style='margin-left:20px;'>"+element1.are_taken_file[0].folder_path+"</a>");
						}
						$("#describe1").val(element1.are_taken_file_describe);
						if (element1.image_path!=null&&element1.image_path!='') {
							var images=element1.image_path;
							for (var i = 0; i < images.length; i++) {
								$("#imgBox1").append("<img src="+Public_address+'uploads/'+images[i].path+" onerror=\"this.style=&quot;display:none&quot;\" class='img_yl'>");
								// imgName.push(images[i].id);
							}
						}
						save(1);
						$('#commandGroup').css("visibility","hidden");
						$('#commandGroup_two').css("visibility","hidden");
						$(".cancel").click(function (){editor(1)});
					}
					// 结束详情
					if (data.length>2) {
						$('#form3 .fileInput').hide();
						var element2 = result.var[2];
						$("#creactTime2").val(element2.finish_time);
						$("#keepTime").val(element2.cost_time);
						$("#firearea").val(element2.fire_area);
						$("#destroyBuild").val(element2.destroy_build);
						$("#death").val(element2.death_people);
						$("#injured").val(element2.bruise_people);
						$("#economicLoss").val(element2.financial_loss);
						$("#reason").val(element2.danger_cause);
						$("#experience").val(element2.summarize);
						$("#hiddenDanger").get(0).selectedIndex=element2.hidden_danger;
						if (element2.are_taken_file!='') {
							$(".videoname2").append("<a href='javascript:;' onclick='drawing(this)' style='margin-left:20px;'>"+element2.are_taken_file[0].folder_path+"</a>");
							
						}
						$("#describe2").val(element2.are_taken_file_describe);
						if (element2.image_path!=null&&element2.image_path!='') {
							var images=element2.image_path;
							for (var i = 0; i < images.length; i++) {
								$("#imgBox2").append("<img src="+Public_address+'uploads/'+images[i].path+" onerror=\"this.style=&quot;display:none&quot;\" class='img_yl'>");
								// imgName.push(images[i].id);
							}
						}
						save(2);
						$(".cancel").click(function (){editor(2)});
					}
				}
			}
	    },
	    error:function(e){
	        layer.msg("网络错误！");
	    }
	});
}
details();
//林木损失计算
var calculate_p1=0;var treeType_values=[];var lossLevel_values=[];var lossArea_values=[];
$("#calculate_p1").click(function() {
	treeType_values=[];lossLevel_values=[];lossArea_values=[];calculate_p1=0;
	$("select[name='treeType']").each(function(index){  
		var morry = $("select[name='treeType']").eq(index).val()*$("select[name='lossLevel']").eq(index).val()*$("input[name='lossArea']").eq(index).val()/10000;
		calculate_p1+=morry;
		$("#forest_loss").val(calculate_p1.toFixed(3));
		treeType_values.push($(this).find("option:checked").text());
		lossLevel_values.push($("select[name='lossLevel']").eq(index).val());
		lossArea_values.push($("input[name='lossArea']").eq(index).val());
	})
});
//生态损失计算
$("#calculate_p2").click(function() {
	calculate_p2 = $("#kinds2").val()*$("#loss_area").val()/10000;
	$("#forest_loss2").val(calculate_p2.toFixed(3));
});
//救灾费用投入
// 第一个
//飞机
$("input[name='plane_input_price']").change(function() {
	var jzTotal = $("input[name='plane_input_time']").val()*$(this).val();
	$("input[name='plane_input_total']").val(jzTotal);
});
$("input[name='plane_input_time']").change(function() {
	var jzTotal = $("input[name='plane_input_price']").val()*$(this).val();
	$("input[name='plane_input_total']").val(jzTotal);
});
// 船舶
$("input[name='ship_input_price']").change(function() {
	var jzTotal = $("input[name='ship_input_time']").val()*$(this).val();
	$("input[name='ship_input_total']").val(jzTotal);
});
$("input[name='ship_input_time']").change(function() {
	var jzTotal = $("input[name='ship_input_price']").val()*$(this).val();
	$("input[name='ship_input_total']").val(jzTotal);
});
// 汽车
$("input[name='car_input_price']").change(function() {
	var jzTotal = $("input[name='car_input_time']").val()*$(this).val();
	$("input[name='car_input_total']").val(jzTotal);
	$("#pay_for_one").val(Number($("input[name='plane_input_total']").val())+Number($("input[name='ship_input_total']").val())+Number($("input[name='car_input_total']").val()));
});
$("input[name='car_input_time']").change(function() {
	var jzTotal = $("input[name='car_input_price']").val()*$(this).val();
	$("input[name='car_input_total']").val(jzTotal);
	$("#pay_for_one").val(Number($("input[name='plane_input_total']").val())+Number($("input[name='ship_input_total']").val())+Number($("input[name='car_input_total']").val()));
});
// 第二个
var calculate_p3=0;
$("#price").change(function() {
	calculate_p3 = $("#consumption").val()*$("#price").val();
	$("#combined1").val(calculate_p3);
	$("#pay_for_two").val(calculate_p3);
});
$("#consumption").change(function() {
	calculate_p3 = $("#price").val()*$("#consumption").val();
	$("#combined1").val(calculate_p3);
	$("#pay_for_two").val(calculate_p3);
});
// 第三个
var calculate_p4=0;
$("#price_two").change(function() {
	calculate_p4 = $("#costMaterial").val()*$("#price_two").val();
	$("#combined2").val(calculate_p4);
	$("#pay_for_there").val(calculate_p4);
});
$("#costMaterial").change(function() {
	calculate_p4 = $("#costMaterial").val()*$("#price_two").val();
	$("#combined2").val(calculate_p4);
	$("#pay_for_there").val(calculate_p4);
});
// 第四个
var calculate_p5=0;
$("input[name='food']").change(function() {
	calculate_p5= $("input[name='personTime']").val()*$("input[name='personAmount']").val()*(Number($("input[name='salary']").val())+Number($("input[name='food']").val()));
	$("input[name='personTotal']").val(calculate_p5);
	$("#pay_for_fove").val(calculate_p5);
});
$("input[name='personTime']").change(function() {
	calculate_p5= $("input[name='personTime']").val()*$("input[name='personAmount']").val()*(Number($("input[name='salary']").val())+Number($("input[name='food']").val()));
	$("input[name='personTotal']").val(calculate_p5);
	$("#pay_for_fove").val(calculate_p5);
});
$("input[name='personAmount']").change(function() {
	calculate_p5= $("input[name='personTime']").val()*$("input[name='personAmount']").val()*(Number($("input[name='salary']").val())+Number($("input[name='food']").val()));
	$("input[name='personTotal']").val(calculate_p5);
	$("#pay_for_fove").val(calculate_p5);
});
$("input[name='salary']").change(function() {
	calculate_p5= $("input[name='personTime']").val()*$("input[name='personAmount']").val()*(Number($("input[name='salary']").val())+Number($("input[name='food']").val()));
	$("input[name='personTotal']").val(calculate_p5);
	$("#pay_for_fove").val(calculate_p5);
});
//救灾费用投入
var calculate_p6=0;var calculate_p7=0;
$("#calculate_p3").click(function() {
	calculate_p6 = (Number($("#pay_for_one").val())+Number($("#pay_for_two").val())+Number($("#pay_for_there").val())+Number($("#pay_for_fove").val()))/10000;
	$("#forest_loss3").val(Math.floor(calculate_p6 * 1000) / 1000);
	
	calculate_p7=Number($("#forest_loss").val())+Number($("#forest_loss2").val())+Number($("#forest_loss3").val());
	$("#total_loss").val(calculate_p7.toFixed(3));
});
var assessment =localStorage.getItem("assessment");
if (assessment=="1") {
	$(".form_sub").hide().eq(3).show();
	$(".serial-number").find("li").eq(3).addClass("progressing").siblings().removeClass("progressing");
	$(".tableDiv_fire #container").css("height","0");
}else if(assessment=="2"){
	// 详情
	$(".form_sub").hide().eq(3).show();
	$(".serial-number").find("li").eq(3).addClass("progressing").siblings().removeClass("progressing");
	$(".tableDiv_fire #container").css("height","0");
	sendAjax({
        "url":"fire/fire_assess/getFireAssessInfo",
        "data":{"id":localStorage.getItem("fireId_xq")},
        "callback":function(data){
            if (data.code=="s_ok") {
				var result=data.var;
				sessionStorage.setItem("assessment_id",result.id);
				//林木损失
            	var treeType=result.treeType.split(",");
            	var lossLevel=result.lossLevel.split(",");
            	var lossArea=result.lossArea.split(",");
            	for (var i = 1; i < treeType.length; i++) {
            		$("#form4 .comm_add").before("<div><label>数种</label><select class=\"xla_k remove_disabled\" name=\"treeType\"><option value=\"1000\" data-name=\"香樟\">香樟</option><option value=\"500\" data-name=\"桉树\">桉树</option><option value=\"500\" data-name=\"杉木1-12年\">杉木1-12年</option><option value=\"1200\" data-name=\"杉木12-18年\">杉木12-18年</option><option value=\"1700\" data-name=\"杉木>20年\">杉木>20年</option><option value=\"200\" data-name=\"马尾松1-14年\">马尾松1-14年</option><option value=\"850\" data-name=\"马尾松14-18年\">马尾松14-18年</option><option value=\"1000\" data-name=\"马尾松>20年\">马尾松>20年</option></select><label>损失程度</label><select class=\"xla_k remove_disabled\" name=\"lossLevel\"><option value=\"0\">未烧伤</option><option value=\"0.1\">轻</option><option value=\"0.4\">中</option><option value=\"0.7\">重</option><option value=\"1\">全毁</option></select><label>损失材积(m3)</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" name=\"lossArea\"><i class='icon-remove' style='color:#01dacf;' onclick='sz_remove(this)'></i></div>");
            	};
            	for (var i = 0; i < treeType.length; i++) {
            		$("select[name='treeType']").eq(i).find("option[data-name='" +treeType[i]+ "']").prop("selected","selected");
            		$("input[name='lossArea']").eq(i).val(lossArea[i]);
            		$("select[name='lossLevel']").eq(i).find("option[value='" +lossLevel[i]+ "']").prop("selected", "selected");
				};
				$("#forest_loss").val(result.treeTotal);
            	//生态损失
				$("#kinds2 option[value='" +result.tree_type+ "']").prop("selected", "selected");
				$("#loss_area").val(result.fire_area);
				$("#forest_loss2").val(result.ecologicalLoss);
				// 救灾费用投入表1
				$("input[name='plane_input_time']").val(result.plane_input_time);
				$("input[name='plane_input_price']").val(result.plane_input_price);
				$("input[name='plane_input_total']").val(result.plane_input_total);
				$("input[name='ship_input_time']").val(result.ship_input_time);
				$("input[name='ship_input_price']").val(result.ship_input_price);
				$("input[name='ship_input_total']").val(result.ship_input_total);
            	$("input[name='car_input_time']").val(result.car_input_time);
				$("input[name='car_input_price']").val(result.car_input_price);
				$("input[name='car_input_total']").val(result.car_input_total);
				$("#pay_for_one").val(result.fire_input1);
				// 救灾费用投入表2
				$("#consumption").val(result.fuel_input_num);
				$("#price").val(result.fuel_input_price);
				$("#pay_for_two").val(result.fire_input2);
				$("#combined1").val(result.fire_input2);
				// 救灾费用投入表3
				$("#costMaterial").val(result.materials_input_num);
				$("#price_two").val(result.materials_input_price);
				$("#pay_for_there").val(result.fire_input3);
				$("#combined2").val(result.fire_input3);
				// 救灾费用投入表4
				$("input[name='personTime']").val(result.fire_input_time);
				$("input[name='personAmount']").val(result.fire_input_staff);
				$("input[name='salary']").val(result.fire_input_staff);
				$("input[name='food']").val(result.fire_input_staff);
				$("input[name='personTotal']").val(result.personTotal);
				$("#pay_for_fove").val(result.personTotal);
				
				//火灾总损失
            	$("#forest_loss3").val(result.jzCostInput);
				$("#total_loss").val(result.fireTotalLoss);
				if (result.fire_image!='') {
					$(".videoname").append("<a href='javascript:;' onclick='drawing(this)' style='margin-left:20px;'>"+result.fire_image[0].path+"</a>");
				}

				//JSON.stringify(data) == "{}"  判断对象是否为空的时候
            	if (JSON.stringify(result.video_path)!='{}') {
            		$("#video").show();
            		$("#video").attr("src",Public_address+'uploads/'+result.video_path.path);
				}
				$("#btn2").attr('onclick',"disabled_user()");
				$("#form4 input").attr("readonly","readonly");
				$(".photo3").hide();$("#btn10").show();
            	$("#form4 select").attr("disabled","disabled").css("background-color","#f5f5f5");
				$(".comm_add").hide();$(".calculate").hide();
				$(".cancel").val("返回上一页");
            }else{
            	layer.msg(data.var);
            }
       	},
       	error:function(result){
            layer.msg("网络错误！");
       	}
    });
}
// 编辑
function remove_disabled() {
  	$("#form4 input").removeAttr("readonly","readonly");$(".photo3").show();
	$("#form4 select").removeAttr("disabled","disabled").css("background-color","#fff");
	$(".comm_add").show();$(".calculate").show();$("#btn2").attr("onclick","disabled_user()")
	$("#btn10").hide();
}
//保存
function disabled_user() {
	var fire_id=sessionStorage.getItem("assessment_id");
	// 树木
	var treeType=treeType_values.join(",");
	var lossLevel= lossLevel_values.join(",");
	var lossArea= lossArea_values.join(",");
	var treeTotal= $("#forest_loss").val();
	// 生态
	var tree_type= $("#kinds2").val();
	var fire_area= $("#loss_area").val();
	var ecologicalLoss= $("#forest_loss2").val();
	// 救灾表一
	var plane_input_time=$("input[name='plane_input_time']").val();
	var plane_input_price=$("input[name='plane_input_price']").val();
	var plane_input_total=$("input[name='plane_input_total']").val();
	var ship_input_time=$("input[name='ship_input_time']").val();
	var ship_input_price=$("input[name='ship_input_price']").val();
	var ship_input_total=$("input[name='ship_input_total']").val();
	var car_input_time=$("input[name='car_input_time']").val();
	var car_input_price=$("input[name='car_input_price']").val();
	var car_input_total=$("input[name='car_input_total']").val();
	var fire_input1=$("#pay_for_one").val();
	// 救灾表二
	var fuel_input_num = $("#consumption").val();
	var fuel_input_price = $("#price").val();
	var fire_input2= $("#pay_for_two").val();//救灾表二合计
	// 救灾表三
	var materials_input_num= $("#costMaterial").val();
	var materials_input_price= $("#price_two").val();
	var fire_input3= $("#pay_for_there").val();//救灾表三合计
	// 救灾表四
	var fire_input_time= $("input[name^='personTime']").val();
	var fire_input_staff= $("input[name^='personAmount']").val();
	var salary_standard= $("input[name^='salary']").val();
	var food_standard= $("input[name^='food']").val();
	var personTotal= $("#pay_for_fove").val();
	//总计
	var jzCostInput=$("#forest_loss3").val();
	var fireTotalLoss=$("#total_loss").val();
	var fire_image= imgName.pop();
	var fire_video= videoName.pop();
	if (treeTotal!=''&&ecologicalLoss!=''&&fireTotalLoss!=''&&fire_input1!=''&&fire_input2!=''&&fire_input3!=''&&personTotal!='') {
		sendAjax({
			"url":"fire/fire_assess/editFireAssess",
			"data":{"id":fire_id,"treeType":treeType,"lossLevel":lossLevel,"lossArea":lossArea,"treeTotal":treeTotal,"tree_type":tree_type,"fire_area":fire_area,"ecologicalLoss":ecologicalLoss,"plane_input_time":plane_input_time,"plane_input_price":plane_input_price,"plane_input_total":plane_input_total,"ship_input_time":ship_input_time,"ship_input_price":ship_input_price,"ship_input_total":ship_input_total,"car_input_time":car_input_time,"car_input_price":car_input_price,"car_input_total":car_input_total,"fire_input1":fire_input1,"fuel_input_num":fuel_input_num,"fuel_input_price":fuel_input_price,"fire_input2":fire_input2,"materials_input_num":materials_input_num,"materials_input_price":materials_input_price,"fire_input3":fire_input3,"fire_input_time":fire_input_time,"fire_input_staff":fire_input_staff,"salary_standard":salary_standard,"food_standard":food_standard,"personTotal":personTotal,"jzCostInput":jzCostInput,"fireTotalLoss":fireTotalLoss,"fire_image[]":fire_image,"fire_video":fire_video},
			"callback":function(data){
		      	if (data.code=='s_ok') {
		      		layer.alert("<img src='img/lqz/ok.png'><br>保存成功<br>", {
					  skin: 'layui-layer-molv' 
					  ,closeBtn: 0,anim: 4,btnAlign: 'c'
					});
					$(".remove_disabled").attr({"disabled":"disabled","background-color":"#e5e5e5"})
					save(3);
					back();
		      	}else{
		        	layer.msg(data.var);
		      	}
		    }
		});
	}else{
		layer.alert("请完善灾害评估信息!", {
            skin: 'layui-layer-molv',
            title:'温馨提示',
            closeBtn: 0,anim: 4,btnAlign: 'c'
        });
	}
}
function back() {
	$("#index_main_context").load("lqz_hazard_assessment.html");
	$("#index_titel").html("灾害评估");
}

$("#photoName_img").takungaevideoup({
	formData: {
		"path": "fire_are_taken",
		"file_ext":"other"
	},
	url:"fire/upload/fileUpload",
	id:"videoname"
});
$("#photoName_video").takungaevideoup({
	formData: {
		"path": "fire_are_taken",
		"file_ext":"other"
	},
	url:"fire/upload/fileUpload",
	id:"imgBox3"
});
// 添加更多树种
$(".comm_add").click(function() {
	$("#form4 .comm_add").before("<div><label>数种</label><select class=\"xla_k remove_disabled\" name=\"treeType\"><option value=\"1000\">香樟</option><option value=\"500\">桉树</option><option value=\"500\">杉木1-12年</option><option value=\"1200\">杉木12-18年</option><option value=\"1700\">杉木>20年</option><option value=\"200\">马尾松1-14年</option><option value=\"850\">马尾松14-18年</option><option value=\"1000\">马尾松>20年</option></select><label>损失程度</label><select class=\"xla_k remove_disabled\" name=\"lossLevel\"><option value=\"0\">未烧伤</option><option value=\"0.1\">轻</option><option value=\"0.4\">中</option><option value=\"0.7\">重</option><option value=\"1\">全毁</option></select><label>损失材积(m3)</label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" name=\"lossArea\"><i class='icon-remove' style='color:#01dacf;' onclick='sz_remove(this)'></i></div>");
});
function videoupFileBtn() {
	$('#photoName_video').click();
}
// 新增
function assessment_save(){
	var fire_id=localStorage.getItem("fireId_xq");
	// 树木
	var treeType=treeType_values.join(",");
	var lossLevel= lossLevel_values.join(",");
	var lossArea= lossArea_values.join(",");
	var treeTotal= $("#forest_loss").val();
	// 生态
	var tree_type= $("#kinds2").val();
	var fire_area= $("#loss_area").val();
	var ecologicalLoss= $("#forest_loss2").val();
	// 救灾表一
	var plane_input_time=$("input[name='plane_input_time']").val();
	var plane_input_price=$("input[name='plane_input_price']").val();
	var plane_input_total=$("input[name='plane_input_total']").val();
	var ship_input_time=$("input[name='ship_input_time']").val();
	var ship_input_price=$("input[name='ship_input_price']").val();
	var ship_input_total=$("input[name='ship_input_total']").val();
	var car_input_time=$("input[name='car_input_time']").val();
	var car_input_price=$("input[name='car_input_price']").val();
	var car_input_total=$("input[name='car_input_total']").val();
	var fire_input1=$("#pay_for_one").val();
	// 救灾表二
	var fuel_input_num = $("#consumption").val();
	var fuel_input_price = $("#price").val();
	var fire_input2= $("#pay_for_two").val();//救灾表二合计
	// 救灾表三
	var materials_input_num= $("#costMaterial").val();
	var materials_input_price= $("#price_two").val();
	var fire_input3= $("#pay_for_there").val();//救灾表三合计
	// 救灾表四
	var fire_input_time= $("input[name^='personTime']").val();
	var fire_input_staff= $("input[name^='personAmount']").val();
	var salary_standard= $("input[name^='salary']").val();
	var food_standard= $("input[name^='food']").val();
	var personTotal= $("#pay_for_fove").val();
	//总计
	var jzCostInput=$("#forest_loss3").val();
	var fireTotalLoss=$("#total_loss").val();
	var fire_image= imgName.pop();
	var fire_video= videoName.pop();
	if (treeTotal!=''&&ecologicalLoss!=''&&fireTotalLoss!=''&&fire_input1!=''&&fire_input2!=''&&fire_input3!=''&&personTotal!='') {
		sendAjax({
			"url":"fire/fire_assess/addFireAssess",
			"data":{"fire_id":fire_id,"treeType":treeType,"lossLevel":lossLevel,"lossArea":lossArea,"treeTotal":treeTotal,"tree_type":tree_type,"fire_area":fire_area,"ecologicalLoss":ecologicalLoss,"plane_input_time":plane_input_time,"plane_input_price":plane_input_price,"plane_input_total":plane_input_total,"ship_input_time":ship_input_time,"ship_input_price":ship_input_price,"ship_input_total":ship_input_total,"car_input_time":car_input_time,"car_input_price":car_input_price,"car_input_total":car_input_total,"fire_input1":fire_input1,"fuel_input_num":fuel_input_num,"fuel_input_price":fuel_input_price,"fire_input2":fire_input2,"materials_input_num":materials_input_num,"materials_input_price":materials_input_price,"fire_input3":fire_input3,"fire_input_time":fire_input_time,"fire_input_staff":fire_input_staff,"salary_standard":salary_standard,"food_standard":food_standard,"personTotal":personTotal,"jzCostInput":jzCostInput,"fireTotalLoss":fireTotalLoss,"fire_image[]":fire_image,"fire_video":fire_video},
			"callback":function(data){
		      	if (data.code=='s_ok') {
		      		layer.alert("<img src='img/lqz/ok.png'><br>保存成功<br>", {
					  skin: 'layui-layer-molv' 
					  ,closeBtn: 0,anim: 4,btnAlign: 'c'
					});
					$(".remove_disabled").attr({"disabled":"disabled","background-color":"#e5e5e5"})
					save(3);
					back();
		      	}else{
		        	layer.msg(data.var);
		      	}
		    }
		});
	}else{
		layer.alert("请完善灾害评估信息!", {
            skin: 'layui-layer-molv',
            title:'温馨提示',
            closeBtn: 0,anim: 4,btnAlign: 'c'
        });
	}
}

// 放大图片
// $("body").on('click','.img_yl',function () {
//     var src=$(this).attr("src");
//     var $h1="<img src=\"" +src+ "\" style=\"height:98%;width:98%\">";
//     layer.confirm(''+$h1+'', {
//         type: 0,
//         anim: 7,
//         skin: 'layui-layer-molv',
//         title:'图片预览',
//         area: ['570px', '500px;'],
//         shadeClose: true,
//         btnAlign: 'c'
//     }, function(){
//         event.preventDefault();
//         event.stopPropagation();
//         layer.closeAll('dialog');
//     }, function(){
//     });
// });

//删除树种
function sz_remove(e) {
	layer.confirm('确定要删除此树种吗？', {
		btn: ['确定','取消'],
		skin: 'layui-layer-molv',
		title:'温馨提示',
		btnAlign: 'c'
	}, function(){
		$(e).parent('div').remove();
		layer.msg("删除成功！")
	}, function(){
	});
}

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
