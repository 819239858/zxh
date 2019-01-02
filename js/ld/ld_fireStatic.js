var cityArr=[];
// cityArr.push($("#ld_city option:checked").html());
//当前年月
var myDate = new Date;
var year = myDate.getFullYear();
var month = myDate.getMonth()+1 > 9 ? myDate.getMonth()+1 : "0" + (myDate.getMonth()+1);
var next= myDate.getMonth()==12? myDate.getMonth():(myDate.getMonth()+1 > 9 ? myDate.getMonth()+1 : "0" + (myDate.getMonth()+1));
var myChart = echarts.init(document.getElementById('ld_fireManage'));
function statistical(){
	var first_city=localStorage.getItem('first_city');
	var first_number=localStorage.getItem('first_number');
	cityArr.push(first_city);
	//进入页面直接加载长沙市近一个月数据
	sendAjax({
		"url":"fire/fire/getFireCount",
		"data":{"begin_time":year+"-"+month,"end_time":year+"-"+next,"region[]":first_number,"type":$("#ld_content").val()},
		"callback":function(data){
			if (data.code=="s_ok") {
				if (data.var!='') {
					myChart.clear();
					startData(data.var);
				}else{
					layer.msg("统计无数据！");
				}
			}else{
				layer.msg(data.var);
			}
		},error:function(result){
			layer.msg("网络请求失败，请重新试试！");
		}
	})
}
statistical();
function startData(resArr){
    var first_city=localStorage.getItem('first_city');
	var changeAfter=sort(resArr,0);
	// 横轴
	var xArr=[year+'-'+month];
	// 系列数据 
	var staticData=getStaticData(xArr,changeAfter);
	// 系列
	var option = {
		title: {
			text:first_city+year+"年"+month+"月火情上报数统计图",
			left:'35%'
		},
		tooltip: {
			trigger: 'item',
			axisPointer: {       // 坐标指示器
				type: 'cross',     // 类型 line:直线指示器  'shadow' 阴影指示器 'cross' 十字准星指示器
				label: {
					backgroundColor: '#6a7985'          
				}
			},
			formatter: function (params) {
                var first_city=localStorage.getItem('first_city');
				var item=staticData.长沙市.showdata[params.dataIndex];

				var res='<div><p>'+first_city+'</p><p>'+
					params.name.substring(0,4)+'年'+params.name.substring(5)+
					'月</p><p>火灾上报数:'+params.data
					+'起</p><p>一般:'+item.fireLevel1
					+'起</p><p>较大:'+item.fireLevel2
					+'起</p><p>重大:'+item.fireLevel3
					+'起</p><p>特别重大:'+item.fireLevel4
					+'起</p></div>';
				return res;
			}
		},
		legend: {
			data:[],
			right:'12%'
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		toolbox: {
			feature: {
				dataView : {show: true, readOnly: false},
				magicType : {show: true, type: ['line', 'bar']},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data:xArr,
			name:"时间"
		},
		yAxis: {
			type: 'value',
			name:fireStaticMap.get($("#ld_content").val())
		},
		series: [{
			data: staticData.长沙市.data,
			type: 'line'
		}],
	};
	myChart.setOption(option);
};
// 下拉框多选start
var arr=[];var arrCity=[];
$("#citySel").click(function(event){
	event.stopPropagation(); 
	$(".listBox").slideToggle(10);
})
//下拉框选择
$("#cityList>li").each(function(){
	$(this).click(function(event){
		
		event.stopPropagation(); 
		// 再次点击删除
		for(var i=0;i<arr.length;i++){
			if( arr[i]==$(this).html() ){
					arr.splice(i,1);
					arrCity.splice(i,1);
					ld_handleSel(arr);
					return;
			}
		}
		// 最多只能选择3个
		if(arr.length<3){
			arr.push( $(this).html());
			arrCity.push( $(this).attr("data-value"));
			// 添加选中列表
			ld_handleSel(arr);
		}
		
	})
})
$("body").click(function(){
	$(".listBox").slideUp(10);
})
// 处理选中列表
function ld_handleSel(arr){
		$("#oselList").html("");
		var tag="";
		for (var i = 0; i < arr.length; i++) {
			tag+="<li><span>"+arr[i]+"</span><span class='delCity' style='cursor:pointer;'>x</span></li>";
		}
		
		$("#oselList").html(tag);
		// $("#oselList li:last-child").remove();
		// 添加删除选中列表事件
		$(".delCity").each(function(){
			$(this).click(function(event){
				event.stopPropagation(); 
				arr.splice( arr.indexOf( $(this).prev().html() ),1 );
				ld_handleSel(arr);
			})
	})
}
	

function search(){
	//市不能为空
	var city="";
	if(arr.length<=0){
		layer.alert("市不能为空!", {
			skin: 'layui-layer-molv',
			title:'温馨提示',
			closeBtn: 0,anim: 4,btnAlign: 'c'
		});
			return;
	} else{
		city=arrCity;
	}
	// 开始时间不能为空
	if($("#ld_startTime").val()==""){
		layer.alert("开始时间不能为空!", {
			skin: 'layui-layer-molv',
			title:'温馨提示',
			closeBtn: 0,anim: 4,btnAlign: 'c'
		});
		return;
	}
	// 结束时间不能为空
	if($("#ld_endTime").val()==""){
		layer.alert("结束时间不能为空!", {
			skin: 'layui-layer-molv',
			title:'温馨提示',
			closeBtn: 0,anim: 4,btnAlign: 'c'
		});
		return;
	}
	// 结束时间不得小于开始时间
		var s=parseInt($("#ld_startTime").val().substring(0,4))+parseInt( $("#ld_startTime").val().substring(5))/12;
		var e=parseInt($("#ld_endTime").val().substring(0,4))+parseInt( $("#ld_endTime").val().substring(5))/12;
		if(s>=e){
			layer.alert("开始时间必须小于结束时间!", {
			skin: 'layui-layer-molv',
			title:'温馨提示',
			closeBtn: 0,anim: 4,btnAlign: 'c'
		});
		return;
		}
	//时间范围十年之内
	if(e-s>10){
		layer.alert("最大时间范围为10年,请重新选择年月!!", {
			skin: 'layui-layer-molv',
			title:'温馨提示',
			closeBtn: 0,anim: 4,btnAlign: 'c'
		});
		return;
	}
	sendAjax({
		"url":"fire/fire/getFireCount",
		"data":{"begin_time":$("#ld_startTime").val(),"end_time":$("#ld_endTime").val(),"region[]":city,"type":$("#ld_content").val()},
		"callback":function(data){
			if (data.code=="s_ok") {
				myChart.clear();
				handelData(data.var);
			}
		},error:function(result){
			layer.msg(result.var);
		}
	})
}
$("#ld_search").click(function(){
	search();
});
// 折线系列
function Line(name,type,stack,data){
	this.name=name;
	this.type=type;
	this.stack=stack;
	this.data=data;
}
// 加载统计图
function handelData(resArr){
	var changeAfter=sort(resArr);
	// 横轴
	var xArr=getXArr();
	// 系列数据 
	var staticData=getStaticData(xArr,changeAfter);
	
	// 系列
	var seriesArr=[];
	for(var i=0;i<arr.length;i++){
		var line=new Line(arr[i],"line","总量"+i,staticData[arr[i]].data);
		
		seriesArr.push(line);
	}
	var option = {
		title: {
			text:arr.join(',')+$("#ld_startTime").val().substring(0,4)+'年'+$("#ld_startTime").val().substring(5)+'月至'+$("#ld_endTime").val().substring(0,4)+'年'+$("#ld_endTime").val().substring(5)+'月'+$("#ld_content option:checked").html()+'对比图',
			left:'14%'
		},
		tooltip: {
			trigger: 'item',
			axisPointer: {       // 坐标指示器
				type: 'cross',     // 类型 line:直线指示器  'shadow' 阴影指示器 'cross' 十字准星指示器
				label: {
					backgroundColor: '#6a7985'          
				}
			},
			formatter: function (params) {
				if($("#ld_content").val()=="0"){
					var item=staticData[params.seriesName].showdata[params.dataIndex];
					var res='<div><p>'+params.seriesName+'</p><p>'+
						params.name.substring(0,4)+'年'+params.name.substring(5)+
						'月</p><p>火灾上报数:'+params.data
						+'起</p><p>一般:'+item.fireLevel1
						+'起</p><p>较大:'+item.fireLevel2
						+'起</p><p>重大:'+item.fireLevel3
						+'起</p><p>特别重大:'+item.fireLevel4
						+'起</p></div>';
					return res;
				} else{
					var res='<div><p>'+params.seriesName+'</p><p>'+
					params.name.substring(0,4)+'年'+params.name.substring(5)+
					'月</p><p>'+fireStaticMap.get($("#ld_content").val())+':'+params.data
					+'</p>'
					return res;
				}
				
				}
		},
		legend: {
			data:arr,
			right:'12%'
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		toolbox: {
			feature: {
				dataView : {show: true, readOnly: false},
				magicType : {show: true, type: ['line', 'bar']},
				restore : {show: true},
				saveAsImage : {show: true}
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: xArr,
			name:"时间"
		},
		yAxis: {
			type: 'value',
			name:fireStaticMap.get($("#ld_content").val())
		},
		dataZoom: [
				{
					type: 'inside',
					start: 0,
					end: 30
				}, 
				{
					start: 0,
					end: 30,
					handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
					handleSize: '80%',
					handleStyle: {
						color: '#fff',
						shadowBlur: 3,
						shadowColor: 'rgba(0, 0, 0, 0.6)',
						shadowOffsetX: 2,
						shadowOffsetY: 2
					}
				}
			],
		series:seriesArr
	};
	myChart.setOption(option);
}
// 转化后台数据
function sort(resArr,status){
	var obj={};
	//初始化默认长沙市数据
	if(status==0){
		for(var i=0;i<cityArr.length;i++){
			obj[cityArr[i]]=[];
		}
		for(var j=0;j<resArr.length;j++){
			for(var k in obj){
				if(resArr[j].city==k){
					obj[k].push(resArr[j].data);
				}
			}
		}
	}else{
		for(var i=0;i<arr.length;i++){
			obj[arr[i]]=[];
		}
		for(var j=0;j<resArr.length;j++){
			for(var k in obj){
				if(resArr[j].city==k){
					obj[k].push(resArr[j].data);
			}
			}
		}
	}
	return obj;
}
// 横轴
function getXArr(){
	var xArr=[$("#ld_startTime").val()];
	var sYear=parseInt($("#ld_startTime").val().substring(0,4));
	var sMonth=parseInt( $("#ld_startTime").val().substring(5) );
	var eYear=parseInt($("#ld_endTime").val().substring(0,4));
	var eMonth=parseInt( $("#ld_endTime").val().substring(5) );
	var count=(eYear-sYear)*12+(eMonth-sMonth);
	for(var i=0;i<count;i++){
		var str="";
		sMonth=sMonth+1;
		if(sMonth==13){
			sMonth=1;
			sYear=sYear+1;
		}
		var m=sMonth>9?sMonth:"0"+sMonth;
		str=str+sYear+'-'+m;
		xArr.push(str);
	}
	return xArr;
}
//火情上报数
function Fireup(fireLevel1,fireLevel2,fireLevel3,fireLevel4){
	this.fireLevel1=fireLevel1;
	this.fireLevel2=fireLevel2;
	this.fireLevel3=fireLevel3;
	this.fireLevel4=fireLevel4;
}
// 统计数据
function getStaticData(xArr,changeAfter){
	var staticData={};
	for(var j in changeAfter){
		staticData[j]={showdata:[],data:[]};
		for(var k=0;k<xArr.length;k++){
				var flag=true;
				var obj=null;
				var chgeAfter=changeAfter[j][0];
				if(chgeAfter!=undefined){
                    for(var l=0;l<chgeAfter.length;l++){
                        if(xArr[k]==chgeAfter[l].time){
                            flag=false;
                            switch($("#ld_content").val()){
                                case "0":
                                    obj=new Fireup(chgeAfter[l].fireLevel1,chgeAfter[l].fireLevel2,chgeAfter[l].fireLevel3,chgeAfter[l].fireLevel4);
                                    staticData[j].data.push(chgeAfter[l].fireUploadNo);
                                    break;
                                case "1":
                                    staticData[j].data.push(chgeAfter[l].fire_area);
                                    break;
                                case "2":
                                    staticData[j].data.push(chgeAfter[l].death_people);
                                    break;
                                case "3":
                                    staticData[j].data.push(chgeAfter[l].bruise_people);
                                    break;
                                case "4":
                                    staticData[j].data.push(chgeAfter[l].financial_loss);
                                    break;
                            }
                            break;
                        }
                    }
				}
			if(flag){
					if($("#ld_content").val()=="0"){
						obj=new Fireup("0","0","0","0");
					}
					staticData[j].data.push("0");
			}
			staticData[j].showdata.push(obj);
		}
	}
	return staticData;
}
	
