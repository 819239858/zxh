// var Public_address="192.168.8.56:8800";
var session_id;var mds;
$(document).keypress(function(e) {  
    // 回车键事件  
   if(e.which == 13) {
		login();
   }  
});
reimg();
function login() {
	var name = Number($('#adminName').val());
	var pwd = $('#adminPwd').val();
	var code=$('#adminyzm').val();
	if(name==''){
		$("#error_msg").html("请输入账号");
	}else if(pwd==''){
		$("#error_msg").html("请输入密码");
	}else if(code==''){
		$("#error_msg").html("请输入验证码");
	}else{
		$('.mask,.dialog').hide();
		$.ajax({
			url : Public_address+"fire/auth/login", // Public_address+"fire/auth/login"
			type : "post",
			dataType : "json",
			data: {"tel":name,"password":pwd,"client":1,"verity_code":code,"session_id":session_id,"mds":mds},
			async:false,
			success : function(element) {
				console.log(element);
				if(element.code == "s_ok"){
					var name=element.var.name;//用户姓名
					// var appType=element.var.mold;//用户权限
					var userLevel=element.var.role[0].rid;//用户级别
					var city=element.var.region_name;//区域编号
					var imageHead=element.var.imgHead;//用户头像
					var region=element.var.region;
					var liveCity=element.var.region_info.this;  //地图上画区域
					sessionStorage.setItem("region",region);
					sessionStorage.setItem("liveCity",liveCity);
					sessionStorage.setItem("name",name);
					sessionStorage.setItem("uname",$('#adminName').val());
					sessionStorage.setItem("paw",$('#adminPwd').val());
					/*用户登录凭证开始*/
					sessionStorage.setItem("s_client",element.var.client);
					sessionStorage.setItem("s_token",element.var.s_token);
					sessionStorage.setItem("s_uid",element.var.uid);
					/*用户登录凭证结束*/
					sessionStorage.setItem("userLevel",userLevel);
					sessionStorage.setItem("imageHead",imageHead);
					sessionStorage.setItem("city",city);
					location.href='index.html';
				}else if(element.code == "error"){
					// $("#error_msg").html(element.var);
					console.log('错误');
					alert(element.var);
				}
			},
			error: function() {
				$("#error_msg").html("网络错误");
			}
		});
	}
}
function reimg() {
	$.ajax({
		url : "http://134.175.247.171:88/captcha.html",
		type : "get",
		dataType : "json",
		data: {},
		success:function(data) {
			$(".yzm").attr("src",data.img);
			session_id=data.session_id;
			mds=data.mds;
		},error:function(e){
			$("#error_msg").html("网络错误");
		}
	})
}

