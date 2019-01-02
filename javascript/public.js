$(function(){
	'use strict';
	//左侧导航菜单效果
	$('.side-menu li dt').click(function(){
		$(this).parents('li').addClass('open');
		$(this).parents('.side-menu').find('.InitialPage').removeClass('active');
		$(this).parents('li').siblings().removeClass('open');
	});
	$('.side-menu dd').click(function(){
		$(this).addClass('active').siblings().removeClass('active');
	});
	$('.side-menu li').each(function(){
		//判断链接相当（当前页面导航样式）
		if($(this).find('a').attr('href') == window.location.pathname){
			$(this).addClass('open');
			$(this).siblings().find('.InitialPage').removeClass('active');
			$('.InitialPage').removeClass('active');
		}else if($('.side-menu h2 a').attr('href') == window.location.pathname){
			$('.InitialPage').addClass('active');
		}   
	});
    //Tab选项卡.
    $('.tab-nav li').click(function(){
    	var liIndex = $('.tab-nav li').index(this);
    	$(this).addClass('active').siblings().removeClass('active');
    	$(this).parents(".card").find('.tab-cont').eq(liIndex).fadeIn().siblings('.tab-cont').hide();
    });
    //Button下拉菜单
    $('.btn-drop-group .btn').click(function(e){
    	$(this).siblings('.drop-list').show();
    	$(this).parent().siblings().find('.drop-list').hide();
    	$(document).one('click', function(){
	        $('.btn-drop-group .drop-list').hide();
	    });
	    e.stopPropagation();
    });
	//点击list将当前值复制于button
    $('.btn-drop-group .drop-list li').click(function(){
    	$(this).parent().parent().hide();
    });
    $("#wsbg").click(function() {
        $(this).siblings().find('ul').hide();
	    $(this).find("ul").toggle()
	});
	$("#wsbg ul li").click(function() {
	    $("#wsbg ul").toggle();
	});
	$("#yqlj").click(function() {
        $(this).siblings().find('ul').hide();
	    $(this).find("ul").toggle()
	});
	$("#yqlj ul li").click(function() {
	    $("#yqlj ul").toggle();
	});
	$("#grzx").click(function() {
        $(this).siblings().find('ul').hide();
	    $(this).find("ul").toggle()
	});
	$("#grzx ul li").click(function() {
	    $("#grzx ul").toggle();
	});
	$("#tzlist").click(function() {
        $(this).siblings().find('ul').hide();
	    $(this).find("ul").toggle();
	});
	$("#tzlist .list_listtz li").click(function() {
		$(".list_listtz").toggle();
		return false;
	});
	//左侧菜单收缩
	$('.top-hd .hd-lt').click(function(){
		$('.side-nav').toggleClass('hide');
		$('.top-hd,.main-cont,.btm-ft').toggleClass('switchMenu');
		$('.top-hd .hd-lt a').toggleClass('icon-exchange');
		localStorage.setItem('setLayOut1','hide');
		localStorage.setItem('setLayOut2','switchMenu');
		localStorage.setItem('setLayOut3','icon-exchange');
		if(!$('.side-nav').hasClass('hide')){
			localStorage.removeItem('setLayOut1');
			localStorage.removeItem('setLayOut2');
			localStorage.removeItem('setLayOut3');
		}
	});
	$('.side-nav').addClass(localStorage.getItem('setLayOut1'));
	$('.top-hd,.main-cont,.btm-ft').addClass(localStorage.getItem('setLayOut2'));
	$('.top-hd .hd-lt a').addClass(localStorage.getItem('setLayOut3'));
	

	//弹出层基础效果（确认/取消/关闭）
	$('.JyesBtn').click(function(){
		$(this).parents('.dialog').hide();
		if($('.mask').attr('display','block')){
			$('.mask').hide();
		}
	});
	$('.JnoBtn,.JclosePanel').click(function(){
		$(this).parents('.dialog').hide();
		if($('.mask').attr('display','block')){
			$('.mask').hide();
		}
	});
	//基础弹出窗
	$('.JopenPanel').click(function(){
		$('.dialog').show();
		$('.dialog').css('box-shadow','0 0 30px #d2d2d2');
	});
	//带遮罩
	$('.JopenMaskPanel').click(function(){
		$('.dialog,.mask').show();
		$('.dialog').css('box-shadow','none');
	});
	$('.mask').click(function(){
		$(this).hide();
		$('.dialog').hide();
	});
	//自动关闭消息窗口
	$('.Jmsg').click(function(){
		$('dialog').show().delay(5000).hide(0);
	});	
	//安全退出
	$('#JsSignOut').click(function(){
		layer.confirm('确定登出管理中心？', {
		  title:'系统提示',
		  btn: ['确定','取消'],
		  skin: 'layui-layer-molv',
		}, function(){
			sendAjax({
				"url":"fire/auth/loginOut",
				"data":{"client":1},"callback":function(data){
					if (data.code=='s_ok') {
						sessionStorage.clear();
						$("#error_msg").html("");
						location.href = '/HNLYT/index2.html';
					}
				},
				error: function() {
				 	layer.alert("网络不好，请刷新试试！", {
		            	skin: 'layui-layer-molv' ,closeBtn: 0,anim: 4,btnAlign: 'c'
		          	});
				}
			});
		  
		});
	});
});
$("#wsbg").click(function() {
    $(this).find("ul").toggle();
});
$("#wsbg ul li").click(function() {
    $("#wsbg ul").toggle();
});
$("#yqlj").click(function() {
    $(this).find("ul").toggle();
});
$("#yqlj ul li").click(function() {
    $("#yqlj ul").toggle();
});
$("#grzx").click(function() {
    $(this).find("ul").toggle();
});
$("#grzx ul li").click(function() {
    $("#grzx ul").toggle();
});
$("#tzlist").click(function() {
    $(this).find("ul").toggle();
});
$("#tzlist .list_listtz li").click(function() {
	$("#tzlist .list_listtz").toggle();
	return false;
});
//公共地址   Public_address+"/"+ uploads
//  Public_address="http://192.168.8.56:8800/";   //本地访问谢勇服务器
//Public_address="http://112.35.44.168:92/";  //陆望辉地址
// Public_address="http://218.77.104.15:20010/";  //服务器地址
Public_address="http://134.175.247.171:88/";



Public_city=`<option value="43">省</option>
    <option value="4301">长沙市</option>
    <option value="4302">株洲市</option>
    <option value="4303">湘潭市</option>
    <option value="4304">衡阳市</option>
    <option value="4305">邵阳市</option>
    <option value="4306">岳阳市</option>
    <option value="4307">常德市</option>
    <option value="4308">张家界市</option>
    <option value="4309">益阳市</option>
    <option value="4311">永州市</option>
    <option value="4310">郴州市</option>
    <option value="4312">怀化市</option>
    <option value="4313">娄底市</option>
	<option value="4331">湘西自治州</option>`;
//邮件/卫星热点/地面监控任务的时候---城市带43	
all_city=`<option value="43">城市</option>
    <option value="4301">长沙市</option>
    <option value="4302">株洲市</option>
    <option value="4303">湘潭市</option>
    <option value="4304">衡阳市</option>
    <option value="4305">邵阳市</option>
    <option value="4306">岳阳市</option>
    <option value="4307">常德市</option>
    <option value="4308">张家界市</option>
    <option value="4309">益阳市</option>
    <option value="4311">永州市</option>
    <option value="4310">郴州市</option>
    <option value="4312">怀化市</option>
    <option value="4313">娄底市</option>
    <option value="4331">湘西自治州</option>`;
list_city=`<li data-value="4301">长沙市</li>
		<li data-value="4302">株洲市</li>
		<li data-value="4303">湘潭市</li>
		<li data-value="4304">衡阳市</li>
		<li data-value="4305">邵阳市</li>
		<li data-value="4306">岳阳市</li>
		<li data-value="4307">常德市</li>
		<li data-value="4308">张家界市</li>
		<li data-value="4309">益阳市</li>
		<li data-value="4311">永州市</li>
		<li data-value="4310">郴州市</li>
		<li data-value="4312">怀化市</li>
		<li data-value="4313">娄底市</li>
		<li data-value="4331">湘西自治州</li>`;

		
//1，ld_fireStatic.js的57行 99行等无法动态改变，只能手动改（后台传值）
//2, zdzxqk.js 中的24行传的是地区名字，所以只要改了判断（all_city的第一项的html是否是城市，是就不用改）
//3, lqz_hly_statistical.js  529行（all_city的第一项的html是否是城市，是就不用改）
//4, wj_dataView.html链接的js文件不一样   wj_dataView(湖南)  fujian_dataView(福建)
//5, lqz_mail.js 460行/465
//6, wj_weather.html  链接的天气预报的位置，要进气象官网上查到响应地区的网页地址
//7, main.css的5行 和  index2.html的10行 index.html的12行  
//8，index.js    430行显示省级地区渲染  412
//9，javascript/pages/login.js  中的二維碼請求接口要改  写死的
//10,  上面132行退出登录
//11, ld_taskSatic.js  13行
//12,  map.html   56行
//13, wj_document.html  508行
//14， login.js  50行  是否登录的时候跳转一个新的页面(本地的与线上的不一致)



// Public_city=`<option value="35">省</option>
//     <option value="3501">福州市</option>
//     <option value="3502">厦门市</option>
//     <option value="3503">莆田市</option>
//     <option value="3504">三明市</option>
//     <option value="3505">泉州市</option>
//     <option value="3506">漳州市</option>
//     <option value="3507">南平市</option>
//     <option value="3508">龙岩市</option>
//     <option value="3509">宁德市</option>`;
// all_city=`<option value="">城市</option>
//     <option value="3501">福州市</option>
//     <option value="3502">厦门市</option>
//     <option value="3503">莆田市</option>
//     <option value="3504">三明市</option>
//     <option value="3505">泉州市</option>
//     <option value="3506">漳州市</option>
//     <option value="3507">南平市</option>
//     <option value="3508">龙岩市</option>
// 	<option value="3509">宁德市</option>`;
// list_city=`<li data-value="3501">福州市</li>
// 	<li data-value="3502">厦门市</li>
// 	<li data-value="3503">莆田市</li>
// 	<li data-value="3504">三明市</li>
// 	<li data-value="3505">泉州市</li>
// 	<li data-value="3506">漳州市</li>
// 	<li data-value="3507">南平市</li>
// 	<li data-value="3508">龙岩市</li>
// 	<li data-value="3509">宁德市</li>`;


first_cities='长沙市';
first_number='4301';
pro_setItem='湖南省';

// first_cities='福州市';
// first_number='3501';
// pro_setItem='福建省';

localStorage.setItem('setAllAddress','湖南省');
localStorage.setItem('Public_city',Public_city);
localStorage.setItem('list_city',list_city);
localStorage.setItem('all_city',all_city);
localStorage.setItem('first_city',first_cities);
localStorage.setItem('first_number',first_number);
localStorage.setItem('pro_setItem',pro_setItem);
