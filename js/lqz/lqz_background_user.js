callback1();
//请求后台用户列表
function refresh1() {
    var city = $("#hot_city").val();
    $("#city_sx").val()==''||$("#city_sx").val()==undefined?city=$("#hot_city").val():$("#area").val()==''||$("#area").val()==undefined?city=$("#city_sx").val():city=$("#area").val();
    var user_name = $('.user_name').val();
    sendAjax({
        "url":"fire/user/getUserList",
        "data":{"current_page": 1, "region":city,"name": user_name, "mid":1,"per_page":20,"examine":1 },
        "callback":function(result){
            var num = '';
            if (result.code!="s_ok") {
                $(".complete_total").html(0);layer.msg('查询数据为空');
                num = 1;$("#complete_report").html('');
            } else {
                $("#complete_report").html('');
                $(".complete_total").html(result.var.total);
                num=result.var.total;
                //分页
                var result = result.var.data;
                $(".complete_page").createPage({
                    pageCount: Math.ceil(num / 20),
                    current: 1,
                    backFn: function(p) {
                        sendAjax({
                            "url":"fire/user/getUserList",
                            "data":{"current_page":p,"region":city,"name":user_name,"mid":1,"per_page":20,"examine":1},
                            "callback":function(result){
                                var result = result.var.data;
                                $("#complete_report").html('');
                                for (var i = 0; i < result.length; i++) {
                                    $("#complete_report").append("<tr><td>" + result[i].name + "</td><td class=\"lt\">" + result[i].tel + "</td><td>" + result[i].region_name + "</td><td>" + result[i].job + "</td><td>" + userLevel.get(result[i].level) + "</td><td>" + result[i].role + "</td><td><a class=\"mr-5\" onclick=\"report_index('" + result[i].uid + "')\">详情</a></td><td><label class=\"radio\" onclick=\" nodisable('" + result[i].uid + "')\"><input type=\"radio\" name=\"" + result[i].tel + "\" class=\"search\"/><span>是</span></label><label class=\"radio\" onclick=\" disable('" + result[i].uid + "')\"><input type=\"radio\" name=\"" + result[i].tel + "\" class=\"screening\"/><span>否</span></label></td>" +
                                       "<td><a class=\"mr-5\" onclick=\"reset_index('" + result[i].uid + "')\">重置密码</a></td></tr>");
                                    if (result[i].status=="0") {
                                        $("#complete_report").find(".screening").eq(i).prop("checked", true);
                                    }else{
                                        $("#complete_report").find(".search").eq(i).prop("checked", true);
                                    }
                                };
                            }
                        })
                    }
                });
                for (var i = 0; i < result.length; i++) {
                    $("#complete_report").append("<tr><td>" + result[i].name + "</td><td class=\"lt\">" + result[i].tel + "</td><td>" + result[i].region_name + "</td><td>" + result[i].job + "</td><td>" + userLevel.get(result[i].level) + "</td><td>" + result[i].role + "</td><td><a class=\"mr-5\" onclick=\"report_index('" + result[i].uid + "')\">详情</a></td><td><label class=\"radio\" onclick=\" nodisable('" + result[i].uid + "')\"><input type=\"radio\" name=\"" + result[i].tel + "\" class=\"search\"/><span>是</span></label><label class=\"radio\" onclick=\" disable('" + result[i].uid + "')\"><input type=\"radio\" name=\"" + result[i].tel + "\" class=\"screening\"/><span>否</span></label></td>" +
                        "<td><a class=\"mr-5\" onclick=\"reset_index('" + result[i].uid + "')\">重置密码</a></td></tr>");
                    if (result[i].status=="0") {
                        $("#complete_report").find(".screening").eq(i).prop("checked", true);
                    }else{
                        $("#complete_report").find(".search").eq(i).prop("checked", true);
                    }
                };
            }
        }
    })
};
refresh1();
//重置密码
function reset_index(id){
    console.log(id);
    var s_token = sessionStorage.getItem("s_token");//Public_address+data.url+'?s_token='+s_token
    sendAjax({
        "url": "fire/user/resetUserPassword",
        "data":{"uid":id},
        "callback":function(data){
            console.log(data);
            if(data.code=='s_ok'){
                layer.msg('已经重置密码，密码:123456');
            }else{
                layer.msg(data.var);
            }
        },
        error: function(e) {
            layer.alert("网络不好，请刷新试试！", {
                skin: 'layui-layer-molv',
                closeBtn: 0,
                anim: 4,
                btnAlign: 'c'
            });
        }
    })
}

//新增用户
var sum2 =[];
function news_user(e) {
    var news_user = "<ul class=\"form_sub form_sub_release\" style=\"width:568px\"><li><label>头像</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" accept=\"image/png,image/jpg,image/gif,image/JPEG\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\"><div id=\"imgBox\"></div>" +
        "<label>画区域</label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','1');layer.open({type: 2,title: '选中地图',shade: 0.8,area: ['700px', '455px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li>" +
        "</li><li><label>用户名<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"username\"><label>手机<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"userphone\"></li><li><label>密码<i style='color:red'>*</i></label><input type=\"password\" class=\"form-control form-boxed\" value=\"\" id=\"userpwd\"><i class=\"icon-lock\"></i><label style=\"width:82px;\">确认密码<i style='color:red'>*</i></label><input type=\"password\"  class=\"form-control form-boxed\" value=\"\" id=\"userpwd1\"><i class=\"icon-lock\"></i></li><li><label>管辖区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"street\" class=\"remove_disabled\"></select><label>职务<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"job\"></li><li><label>类型<i style='color:red'>*</i></label><div id=\"qx_yh\"><input type=\"checkbox\" checked>后台用户<input type=\"checkbox\">护林员<input type=\"checkbox\">消防员<input type=\"checkbox\">无人机<input type=\"checkbox\">载人机</div></li><li><label>角色</label><select id=\"character\" class=\"remove_disabled\" style=\"width:150px\"><option value=\"1\">一般用户</option><option value=\"2\">管理员</option></select></li></ul>";
     // var news_user = "<ul class=\"form_sub form_sub_release\" style=\"width:568px\"><li><label>头像</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" accept=\"image/png,image/jpg,image/gif,image/JPEG\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\"><div id=\"imgBox\"></div>" +
     //    "<label>画区域</label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','1');layer.open({type: 2,title: '选中地图',shade: 0.8,area: ['700px', '455px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li>" +
     //    "</li><li><label>用户名<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"username\"><label>手机<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"userphone\"></li><li><label>密码<i style='color:red'>*</i></label><input type=\"password\" class=\"form-control form-boxed\" value=\"\" id=\"userpwd\"><i class=\"icon-lock\"></i><label style=\"width:82px;\">确认密码<i style='color:red'>*</i></label><input type=\"password\" class=\"form-control form-boxed\" value=\"\" id=\"userpwd1\"><i class=\"icon-lock\"></i></li><li><label>管辖区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"><option value=\"43\">省</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"street\" class=\"remove_disabled\"></select><label>职务<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"job\"></li><li><label>类型<i style='color:red'>*</i></label><div id=\"qx_yh\"><input type=\"checkbox\" checked>后台用户<input type=\"checkbox\">护林员<input type=\"checkbox\">消防员<input type=\"checkbox\">无人机<input type=\"checkbox\">载人机</div></li><li><label>角色</label><select id=\"character\" class=\"remove_disabled\" style=\"width:150px\"><option value=\"1\">一般用户</option><option value=\"2\">管理员</option></select></li></ul>";
    layer.confirm('' + news_user + '', {
        type: 1,
        skin: 'layui-layer-molv', //样式类名
        closeBtn: 1, //关闭按钮
        anim: 2,
        btn: ['保存', '取消'],
        btnAlign: 'c',
        area: ['570px', '430px;'],
        title: "新增后台用户",
        shadeClose: true, //开启遮罩关闭
    }, function() {
        if(sum2==''){sum2.push(1)};
        var region=$("#province").val();
        $("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#street").val()==''||$("#street").val()==undefined?region=$("#city_two").val():region=$("#street").val();
        var tel= $("#userphone").val();
        var rid = $("#character").val();
        var name = $("#username").val();
        var pwd = $("#userpwd").val();
        
        var position=$("#latLngs").val();
        if (pwd.length<6||pwd.length>16) {
            layer.msg("密码长度为6-16位！");return false;
        }
        var pwd1 = $("#userpwd1").val();
        var imgHead = imgName.pop();
        // var imgHead = $("#photoName1")[0].files[0];
        var job=$("#job").val();
        if (name!=''&& tel!= '' && pwd != '' && pwd1 != ''&& job != '' ) {
            sendAjax({
                "url":"fire/user/addUser",
                "data":{"tel":tel,"password":pwd,"passwords":pwd1,"region":region,"name":name,"mids":sum2,"imgHead":imgHead,"job":job,"rid":rid,"position":position},
                "callback":function(data){
                    if (data.code == "s_ok") {
                        layer.msg('新增成功');
                        refresh1();sum2=[];
                        layer.closeAll('page');
                    } else {
                        layer.msg(data.var);
                    }
                },
                error: function(e) {
                    layer.alert("网络不好，请刷新试试！", {
                        skin: 'layui-layer-molv',
                        closeBtn: 0,
                        anim: 4,
                        btnAlign: 'c'
                    });
                }
            });
        } else {
            layer.alert("请完善新增后台用户信息!", {
                skin: 'layui-layer-molv',
                title: '温馨提示',
                closeBtn: 0,
                anim: 4,
                btnAlign: 'c'
            });
        }
    }, function() {
    });
    var all_citys=localStorage.getItem('Public_city');
    $('#province').html(all_citys);


    callback1();
    // 判断密码是否一致
    $("#userpwd1").blur(function() {
        if ($("#userpwd").val() == $("#userpwd1").val()) {
            $("#userpwd1").removeAttr("style");
        } else {
            $("#userpwd1").css("border-color", "red");
            layer.msg('密码输入不一致');
        }
    });
    //监听checkbox的value值
    $("#qx_yh input").change(function() {
        sum2 = [];
        $('#qx_yh input:checked').each(function(){ 
            sum2.push($(this).index()+1); 
        });
    })
    var isFser = true;
    $(".form_sub_release i").click(function() {
        if (isFser) {
            $(this).addClass("icon-unlock");
            $(this).prev().attr('type', 'text');
            isFser = false;
        } else {
            $(this).removeClass("icon-unlock");
            $(this).prev().attr('type', 'password');
            isFser = true;
        }
    });
    $("#photoName1").takungaeImgup({
        formData: {
            "path": "user_image",
            "file_ext":"image"
        },
        url:"fire/upload/fileUpload",
        id:"imgBox"
    });
}
// 后台用户详情
function report_index(fireId) {
    sendAjax({
        "url":"fire/user/getUserByUid",
        "data":{"uid":fireId},"callback":function(result){
            if (result.code == "s_ok") {
                var result = result.var;
                if(result.imgHeadUrl.length==0){
                    console.log('没有');
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btnAlign: 'c',
                        area: ['570px', '450px;'],
                        title: "后台用户详情",
                        shadeClose: true, //开启遮罩关闭
                        content: "<ul class=\"form_sub form_sub_release\" style=\"width:568px\"><li><label>头像</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" style=\"display:none\"><div id=\"imgBox\"><img class=\"imgbig\" src="+Public_address+'uploads/'+result.imgHead+" onerror=\"javascript:this.src='img/timg.png'\"></div></li>" +
                        "<li><label>画区域</label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','1');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"echo_map()\"/></li>" +
                        "<li><label>用户名<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"" + result.name + "\" id=\"username\" disabled><label>手机<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"" + result.tel + "\" id=\"userphone\" disabled></li><li id=\"password\"><label>密码<i style='color:red'>*</i></label><input type=\"password\" class=\"form-control form-boxed remove_disabled\" value=\"" + sessionStorage.getItem("paw") + "\" id=\"userpwd\" disabled><i class=\"icon-lock\"></i><label style=\"width:82px;\">确认密码<i style='color:red'>*</i></label><input type=\"password\" class=\"form-control form-boxed remove_disabled\" value=\"" + sessionStorage.getItem("paw") + "\" disabled id=\"userpwd1\"><i class=\"icon-lock\"></i></li><li><label>管辖区域<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"" + result.region_name + "\"  disabled><label>职务<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"" + result.job + "\" id=\"job\" disabled></li><li><label>类型<i style='color:red'>*</i></label><div id=\"qx_yh\" style=\"background-color:#f2f2f2\"><input type=\"checkbox\">后台用户<input type=\"checkbox\">护林员<input type=\"checkbox\">消防员<input type=\"checkbox\">无人机<input type=\"checkbox\">载人机</div></li><li><label>角色</label><select id=\"character\" style=\"width:150px;background-color:#f2f2f2\" class=\"\" disabled><option value='1'>一般用户</option><option value='2'>管理员</option><option>超级管理员</option></select><label>注册时间</label><input type=\"text \" id=\"creactTime\" disabled onclick=\"WdatePicker({dateFmt:yyyy-MM-dd})\" class=\"Wdate form-control\" value=\"" + result.create_time + "\"></li></li><li class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> <input type=\"button\" disabled value=\"保存\" class=\"report submit\" onclick=\"disabled_user('" + result.uid + "')\"></li></ul>"
                    });
                }else{
                    console.log('有');
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btnAlign: 'c',
                        area: ['570px', '450px;'],
                        title: "后台用户详情",
                        shadeClose: true, //开启遮罩关闭
                        content: "<ul class=\"form_sub form_sub_release\" style=\"width:568px\"><li><label>头像</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\" accept=\"image/png,image/jpg,image/gif,image/JPEG\" style=\"display:none\"> <img class=\"fileInput\" src=\"img/lqz/upimg.png\" style=\"display:none\"><div id=\"imgBox\"><img class=\"imgbig\" src="+Public_address+'uploads/'+result.imgHeadUrl[0].path+" onerror=\"javascript:this.src='img/timg.png'\"></div></li>" +
                        "<li><label>画区域</label><input type=\"text\" class=\"form-control form-boxed \" disabled id=\"latLngs\"  style=\"margin-right:2px;width:135px;\"><input class=\"enter_map_two\" type=\"button\" style=\"display:none\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','1');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /><input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"echo_map()\"/></li>" +
                        "<li><label>用户名<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"" + result.name + "\" id=\"username\" disabled><label>手机<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"" + result.tel + "\" id=\"userphone\" disabled></li><li id=\"password\"><label>密码<i style='color:red'>*</i></label><input type=\"password\" class=\"form-control form-boxed remove_disabled\" value=\"" + sessionStorage.getItem("paw") + "\" id=\"userpwd\" disabled><i class=\"icon-lock\"></i><label style=\"width:82px;\">确认密码<i style='color:red'>*</i></label><input type=\"password\" class=\"form-control form-boxed remove_disabled\" value=\"" + sessionStorage.getItem("paw") + "\" disabled id=\"userpwd1\"><i class=\"icon-lock\"></i></li><li><label>管辖区域<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed\" value=\"" + result.region_name + "\"  disabled><label>职务<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed remove_disabled\" value=\"" + result.job + "\" id=\"job\" disabled></li><li><label>类型<i style='color:red'>*</i></label><div id=\"qx_yh\" style=\"background-color:#f2f2f2\"><input type=\"checkbox\">后台用户<input type=\"checkbox\">护林员<input type=\"checkbox\">消防员<input type=\"checkbox\">无人机<input type=\"checkbox\">载人机</div></li><li><label>角色</label><select id=\"character\" style=\"width:150px;background-color:#f2f2f2\" class=\"\" disabled><option value='1'>一般用户</option><option value='2'>管理员</option><option>超级管理员</option></select><label>注册时间</label><input type=\"text \" id=\"creactTime\" disabled onclick=\"WdatePicker({dateFmt:yyyy-MM-dd})\" class=\"Wdate form-control\" value=\"" + result.create_time + "\"></li></li><li class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> <input type=\"button\" disabled value=\"保存\" class=\"report submit\" onclick=\"disabled_user('" + result.uid + "')\"></li></ul>"
                    });
                }



               
                $('#latLngs').val(result.position);
                $("#character").val(result.role); $("#qx_yh input").attr("disabled","disabled");
                //判断是否为当前用户，显示密码
                sessionStorage.getItem("uname")==result.tel?$("#password").show():$("#password").hide();
                sum2=[];
                for (let index = 0; index < result.mold.length; index++) {
                    sum2.push(result.mold[index].mid);
                    let element = result.mold[index].mid-1;
                    $("#qx_yh input")[element].checked = "checked";
                }
                // 判断密码是否一致
                $("#userpwd1").blur(function() {
                    if ($("#userpwd").val() == $("#userpwd1").val()) {
                        $("#userpwd1").removeAttr("style");
                    } else {
                        $("#userpwd1").css("border-color", "red");
                        layer.msg('密码输入不一致');
                    }
                });
                //监听checkbox的value值
                $("#qx_yh input").change(function() {
                    sum2 = [];
                    $('#qx_yh input:checked').each(function(){ 
                        sum2.push($(this).index()+1); 
                    });
                })
                var isFser = true;
                $(".form_sub_release i").click(function() {
                    if (isFser) {
                        $(this).addClass("icon-unlock");
                        $(this).prev().attr('type', 'text');
                        isFser = false;
                    } else {
                        $(this).removeClass("icon-unlock");
                        $(this).prev().attr('type', 'password');
                        isFser = true;
                    }
                });
                $("#photoName1").takungaeImgup({
                    formData: {
                        "path": "user_image",
                        "file_ext":"image"
                    },
                    url:"fire/upload/fileUpload",
                    id:"imgBox"
                });
            } else {
                layer.msg(result.var);
            }
        },
        error: function(result) {
            layer.msg("请求失败,重新试试");
        }
    });
}
// 保存
function disabled_user(fireId) {
    var rid = $("#character").val();
    var name = $("#username").val();
    var pwd = $("#userpwd").val();
    var pwd1 = $("#userpwd1").val();
    var imgHead = imgName.pop();
    var job=$("#job").val();
    var position=$("#latLngs").val();
    if (name != '' && rid != '' && pwd!=''&& pwd1 !=''&& imgHead!='') {
        sendAjax({
            "url":"fire/user/editUser",
            "data":{"uid":fireId,"name":name,"rid":rid,"mids":sum2,"imgHead":imgHead,"job":job,"position":position},
            "callback":function(data){
                if (data.code == "s_ok") {
                    layer.alert("<img src='img/lqz/ok.png'><br>保存成功<br>", {
                        skin: 'layui-layer-molv',
                        closeBtn: 0,
                        anim: 4,
                        btnAlign: 'c'
                    });
                    refresh1();
                    layer.closeAll('page');
                } else {
                    layer.msg(data.var);
                }
            },
            error: function(e) {
                layer.alert("网络不好，请刷新试试！", {
                    skin: 'layui-layer-molv',
                    closeBtn: 0,
                    anim: 4,
                    btnAlign: 'c'
                });
            }
        });
    } else {
        layer.alert("请完善编辑后台用户信息!", {
            skin: 'layui-layer-molv',
            title: '温馨提示',
            closeBtn: 0,
            anim: 4,
            btnAlign: 'c'
        });
    }
}
// 编辑
function remove_disabled() {
    $(document).find(".form_sub_release").find(".remove_disabled").removeAttr("disabled");
    $(document).find(".form_sub_release").find(".submit").removeAttr("disabled");
    $(document).find(".form_sub_release").find(".fileInput").removeAttr("style");
    $(document).find(".form_sub_release").find(".upFileBtn").removeAttr("style");
    $("#qx_yh input").removeAttr("disabled");$("#qx_yh").removeAttr("style");
    $("#imgBox img").removeClass("imgbig ");$("#imgBox img").addClass("up-section");
}
//禁用 
function disable(result) {
    layer.confirm("禁用后该账户无法使用，是否确认？", {
        btn: ['确认', '取消'],
        skin: 'layui-layer-molv',
        title: '温馨提示',
        btnAlign: 'c'
    }, function() {
        sendAjax({
            "url":"fire/user/editUserStatus",
            "data":{"uids": [result], "mid":1,"status":0 },"callback":function(result){
                
                if (result.code == "s_ok") {
                    layer.msg("禁用成功！");
                } else {
                    layer.msg(result.var);
                }
                refresh1();
            },
            error: function(result) {
                layer.alert("请求失败,重新试试!", {
                    skin: 'layui-layer-molv',
                    closeBtn: 0,
                    anim: 4,
                    btnAlign: 'c'
                });
            }
        })
    }, function() {
        refresh1();
    });
}
//取消禁用 
function nodisable(result) {
    layer.confirm("启用后该账户正常使用，是否确认？", {
        btn: ['确认', '取消'],
        skin: 'layui-layer-molv',
        title: '温馨提示',
        btnAlign: 'c'
    }, function() {
        sendAjax({
            "url":"fire/user/editUserStatus",
            "data":{"uids": [result], "mid":1,"status":1 },"callback":function(result){
                
                if (result.code == "s_ok") {
                    layer.msg("启用成功！");
                } else {
                    layer.msg(result.var);
                }
                refresh1();
            },
            error: function(result) {
                layer.alert("请求失败,重新试试!", {
                    skin: 'layui-layer-molv',
                    closeBtn: 0,
                    anim: 4,
                    btnAlign: 'c'
                });
            }
        })
    }, function() {
        refresh1();
    });
}

// 放大图片
$("body").on('click', '.imgbig', function() {
    var src = $(this).attr("src");
    var $h1 = "<img src=\"" + src + "\" style=\"height:98%;width:98%\">";
    layer.confirm('' + $h1 + '', {
        type: 0,
        anim: 7,
        skin: 'layui-layer-molv',
        title: '图片预览',
        area: ['570px', '500px;'],
        shadeClose: true,
        btnAlign: 'c'
    }, function() {
        event.preventDefault();
        event.stopPropagation();

    }, function() {});
});
// 回显地图
function echo_map() {
    var lnglatXY=[];
    layer.open({
        type: 1,
        skin: 'layui-layer-molv', //样式类名
        closeBtn: 1, //关闭按钮
        anim: 2,
        btnAlign: 'c',
        area: ['600px', '440px;'],
        title:"地图信息",
        shadeClose: true, //开启遮罩关闭
        content:"<div id=\"container\" style=\"width:600px;height:400px\"></div>",
        success:function(){
            var map = new AMap.Map("container", {
                resizeEnable: true,
                zoom:11
            });
            var type= new AMap.MapType({
                defaultType:1,
                showRoad:true
            });
            map.addControl(type);
            var latLngs=$("#latLngs").val()
            var lnglat=latLngs.split(";");
            lnglat.pop();
            for(var i=0;i<lnglat.length;i++){
                lnglatXY.push(JSON.parse('[' + String(lnglat[i]) + ']'));
            }
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
    })
};