callback1();
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
// 点击弹框
function markerClick(marker,result){
	marker.content='<div style="border-radius:6px;padding:5px;">'+
	'<p style="color:#030303;font-size:14px;">队伍名称:<span style="color:#999da8;margin-left:6px;">'+ result.team_name + '</span></p>'+
	'<p style="color:#030303;font-size:14px;">人数:<span style="color:#999da8;margin-left:6px;">'+result.team_num+'</span></p>'+
	'<p style="color:#030303;font-size:14px;">性质:<span style="color:#999da8;margin-left:6px;">'+nature.get(result.team_nature)+'</span></p>'+
	'<p style="color:#030303;font-size:14px;">手机号:<span style="color:#999da8;margin-left:6px;">'+result.phone+'</span></p>'+
	'<p style="color:#030303;font-size:14px;">成立时间:<span style="color:#999da8;margin-left:6px;">'+result.create_time+'</span></p>'+
	'<a href="#" class=\"ml-5\">详情</a></div>'
	AMap.event.addListener(marker, 'click', function() {
		infoWindow.setContent(marker.content);
		infoWindow.open(map, marker.getPosition());
		$(".ml-5").click(function() {
			report_index(result)
		});
	});
}
// 模式切换
var listMap=100;
$("#tabModel").click(function(){
	if( $(this).val()=="切换成列表模式" ){
		$("#container_map").hide();
		$(".container_table_two").hide();
		$(".button-group").hide();
		$(".container_table").show();
		$(this).val("切换成地图模式");
        listMap=10;
        query();
	} else{
		$("#container_map").show();
		$(".button-group").show();
		$(".container_table_two").hide();
		$(".container_table").hide();
		$(this).val("切换成列表模式");
        listMap=$("#numberBySearch").val();
        query();
	}
})

// 新增弹框
function new_office() {
	//var add_resources ="<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"area\" class=\"remove_disabled\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\" disabled style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})\" class=\"Wdate remove_disabled form-control\" /><label>性质</label><select id=\"teamLevel\" class=\"remove_disabled\"><option value=\"0\">专业</option><option value=\"1\">半专业</option><option value=\"2\">业余</option></select></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"manage\"><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"phone\"></li><li><label>队伍名称<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"teamName\"><label>队伍人数<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"teamNo\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName1').click()\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul>"
	var add_resources ="<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"area\" class=\"remove_disabled\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\" disabled style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})\" class=\"Wdate remove_disabled form-control\" /><label>性质</label><select id=\"teamLevel\" class=\"remove_disabled\"><option value=\"0\">专业</option><option value=\"1\">半专业</option><option value=\"2\">业余</option></select></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"manage\"><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"phone\"></li><li><label>队伍名称<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"teamName\"><label>队伍人数<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"teamNo\"></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName1').click()\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul>"
	layer.confirm(''+add_resources+'', {
		type: 1,
		closeBtn: 1, //关闭按钮
		anim: 2,
		skin: 'layui-layer-molv', 
		btn: ['保存','取消'],
		btnAlign: 'c',
		area: ['650px', '480px;'],
		title:'录入消防队伍信息',
		shadeClose: true, //开启遮罩关闭
	}, function(){
		var region=$("#province").val();
		$("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_two").val():region=$("#area").val();
		var position=$("#latLngs").val().replace(/[;]/g,'').replace(/[ ]/g,"");
		var set_time=$("#buildTime").val();
		var describe=$("#desc").val();
		var admin=$("#manage").val();
		var admin_tel=$("#phone").val();
		// if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(admin_tel))) {                      
		// 	layer.msg("手机号填写的格式不对，请正确填写");
		// 	return false;
		// }
		var team_name=$("#teamName").val();
		var team_num=$("#teamNo").val();
		var team_nature=$("#teamLevel").val();
		if (region!=''&&position!=''&&set_time!=''&&team_num!=''&&team_name!=''&&admin!=''&&admin_tel!='') {
			sendAjax({
				"url":"fire/fire_Control_Team/addFireControlTeam",
				"data":{"region":region,"location":position,"established_time":set_time,"team_name":team_name,
					"team_num":team_num,"describe":describe,"team_image":imgName,"administrator":admin,
					"phone":admin_tel,"team_nature":team_nature},
				"callback":function(data){
				if (data.code=="s_ok") {
					layer.closeAll('page');
					layer.msg('保存成功');
					query();
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
	}, function(){layer.closeAll('page');});

	var all_city=localStorage.getItem('all_city');
    $('#province').html(all_city);

	callback1();
	$("#photoName1").takungaeImgup({
		formData: {
			"path": "user_image",
			"file_ext":"image"
		},
		url:"fire/upload/fileUpload",
		id:"imgBox"
	});
};
var list=[];
// 详情
function report_index(fireid) {
    
    sendAjax({
        "url":"fire/fire_Control_Team/getFireControlTeamInfo",
        "data":{"id": fireid.id},
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
                        //content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>队伍名称<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamName\" disabled><label>队伍人数<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamNo\" disabled></li><li><label>性质</label><select id=\"teamLevel\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"><option value=\"0\">专业</option><option value=\"1\">半专业</option><option value=\"2\">业余</option></select></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" disabled id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li><li class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user("+result.id+")\"></li></ul>"
                        content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>队伍名称<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamName\" disabled><label>队伍人数<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamNo\" disabled></li><li><label>性质</label><select id=\"teamLevel\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"><option value=\"0\">专业</option><option value=\"1\">半专业</option><option value=\"2\">业余</option></select></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" disabled id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li><li class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user("+result.id+")\"></li></ul>"
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
                        //content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>队伍名称<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamName\" disabled><label>队伍人数<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamNo\" disabled></li><li><label>性质</label><select id=\"teamLevel\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"><option value=\"0\">专业</option><option value=\"1\">半专业</option><option value=\"2\">业余</option></select></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" disabled id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li><li class=\"background_user_information\">" + "<input type=\"button\" value=\"取消\" class=\"report submit\" onclick=\"closeBtn()\"></li></ul>"
                        content:"<ul class=\"form_sub form_sub_release\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>成立时间<i style='color:red'>*</i></label><input type=\"text\" id=\"buildTime\" disabled onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate remove_disabled form-control\" /><label>录入时间<i style='color:red'>*</i></label><input type=\"text\" disabled id=\"inputTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" class=\"Wdate form-control\"/></li><li><label>管理者<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"manage\" disabled><label>电话<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"phone\" disabled></li><li><label>队伍名称<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamName\" disabled><label>队伍人数<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"\" id=\"teamNo\" disabled></li><li><label>性质</label><select id=\"teamLevel\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"><option value=\"0\">专业</option><option value=\"1\">半专业</option><option value=\"2\">业余</option></select></li><li><label>描述</label><textarea class=\"form-control form-boxed remove_disabled\" disabled id=\"desc\"></textarea></li><li><label>图片</label><input type=\"file\" id=\"photoName2\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" onclick=\"$('#photoName2').click()\" style=\"display:none\"><div id=\"imgBox1\" style=\"display:inline-block\"></div></li><li class=\"background_user_information\">" + "<input type=\"button\" value=\"取消\" class=\"report submit\" onclick=\"closeBtn()\"></li></ul>"
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
//普通用户的取消按钮
function closeBtn() {
    layer.closeAll('page');
}
  // 保存
function disabled_user(id) {
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
                map.clearMap();
				query();
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
  // 编辑
function remove_disabled() {
	$("body").find(".form_sub_release").find(".remove_disabled").removeAttr("disabled").removeAttr("style");
	$("#upload_a").show();$("#upload_b").hide();$(".enter_map_two").show();
	$("body").find(".form_sub_release").find(".upFileBtn").removeAttr("style");
	$("body").find(".form_sub_release").find(".fileInput").removeAttr("style");
	$("#imgBox1 img").removeClass("imgbig");$("#imgBox1 img").addClass("up-section");
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
			"url":"fire/fire_Control_Team/delFireControlTeam",
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
// 查询-消防队伍
query();
var num='';
function query() {
	var region = $("#city").val()==''||$("#city").val()==undefined?$("#hot_city").val():($("#village").val()==''||$("#village").val()==undefined?$("#city").val():$("#village").val());
	var  per_page=listMap;
	addBeiJing();
	sendAjax({
		"url":"fire/fire_Control_Team/getFireControlTeamList",
		"data":{"current_page": 1, "region":region,"per_page":per_page,},"callback":function(data){
			map.clearMap();
			if (data.code=="s_ok") {
				$("#complete_report").html('');
				//总条数
				if(data.var.total==0){
					$(".complete_total").html(''); num=1;layer.msg('查询数据为空');
				}else{
					var result=data.var.data;
                    var userLevel = sessionStorage.getItem("userLevel");
					$(".complete_total").html(data.var.total);num=data.var.total;
					$(".complete_page").createPage({
						pageCount:Math.ceil(num/10),
						current:1,
						backFn:function(p){
							sendAjax({
							"url":"fire/fire_Control_Team/getFireControlTeamList",
							"data":{"current_page": p, "region":$("#city").val()==''||$("#city").val()==undefined?$("#hot_city").val():($("#village").val()==''||$("#village").val()==undefined?$("#city").val():$("#village").val()),"per_page":10,},
							"callback":function(data){
								$(".complete_total").html(data.var.total);
								num=data.var.total;
								var result=data.var.data;
								$("#complete_report").html('');
								for(var i=0;i<result.length;i++){
                                    if(userLevel!='1'){
                                        $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td>" + result[i].location + "</td><td>" + result[i].team_name + "</td><td>" + result[i].team_num + "</td><td>" + nature.get(result[i].team_nature) + "</td><td>" + result[i].established_time + "</td><td>" + result[i].create_time + "</td><td><a class='mr-5'>详情</a> <a onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>");
                                    }else{
                                        $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td>" + result[i].location + "</td><td>" + result[i].team_name + "</td><td>" + result[i].team_num + "</td><td>" + nature.get(result[i].team_nature) + "</td><td>" + result[i].established_time + "</td><td>" + result[i].create_time + "</td><td><a class='mr-5'>详情</a></tr>");
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
                            $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td>" + result[i].location + "</td><td>" + result[i].team_name + "</td><td>" + result[i].team_num + "</td><td>" + nature.get(result[i].team_nature) + "</td><td>" + result[i].established_time + "</td><td>" + result[i].create_time + "</td><td><a class='mr-5'>详情</a> <a onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>");
                        }else{
                            $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td>" + result[i].location + "</td><td>" + result[i].team_name + "</td><td>" + result[i].team_num + "</td><td>" + nature.get(result[i].team_nature) + "</td><td>" + result[i].established_time + "</td><td>" + result[i].create_time + "</td><td><a class='mr-5'>详情</a></tr>");
                        }
						var icon = new AMap.Icon({
							image:'img/wj/fireTeam.png',    
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
						});
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
	// 数据统计
	sendAjax({
		"url":"fire/fire_Control_Team/getFireControlTeamCount",
		"data":{},"callback":function(data){
			
			if (data.code=="s_ok") {
				var result=data.var;
				$("#complete_report_two").html("");
				for(var i=0;i<result.length;i++){
					$("#complete_report_two").append("<tr><td>" + result[i].name + "</td><td>" + result[i].team_count + "</td><td>" + result[i].team_num + "</td></tr>");
				};
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
}
//点击查询的时候
function queryBtn() {
    listMap=$("#numberBySearch").val();
    query();
}

// 统计页面
function toStatic() {
	$(".container_table_two").show();
	$(".container_table").hide();
	$("#container_map").hide();
}
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
	  