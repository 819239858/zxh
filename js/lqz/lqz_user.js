//请求后台用户列表
function refresh1() {
    var region = $("#hot_city").val();
    $("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#fireArea").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_two").val():region=$("#area").val();
    var name = $('.user_name').val();
    var mold = $('#mold').val();
    sendAjax({
        "url":"fire/user/getUserChatList",
        "data":{"current_page":1,"region":region,"per_page":20,"name":name,"mold":mold},
        "callback":function(result){
            var num = '';
            if (result.code=="s_ok") {
                $(".box1 .top_num").html(result.var.total);
                $(".box5 .top_num").html(result.var.personnel_num);
                if(result.var.total=='0'){
                    $(".box6 .top_num").html('0');
                    $(".box5 .top_num").html('0');
                }else{
                    $(".box6 .top_num").html(((result.var.personnel_num/result.var.total)*100).toFixed(2)+"%");
                }
                $("#complete_report").html('');
                //总条数
                if(result.var.total==0){
                    $(".complete_total").html(0);layer.msg('查询数据为空');
                    num = 1;
                } else {
                    $(".complete_total").html(result.var.total);
                    num = result.var.total;
                    //分页
                    var result = result.var.data;
                    $(".complete_page").createPage({
                        pageCount: Math.ceil(num / 20),
                        current: 1,
                        backFn: function(p) {
                            sendAjax({
                                "url":"fire/user/getUserChatList",
                                "data":{"current_page":p,"region":region,"per_page":20,"name":name,"mold":mold},"callback":function(result){
                                    var result = result.var.data;
                                    $("#complete_report").html('');
                                    for (var i = 0; i < result.length; i++) {
                                        $("#complete_report").append("<tr><td>" + result[i].name + "</td><td class=\"lt\">" + result[i].tel + "</td><td>" + result[i].region_name + "</td><td>" + result[i].job + "</td><td>" + result[i].midList + "</td><td>" + userLevel.get(result[i].rid) + "</td><td>" + character.get(result[i].rid) + "</td><td><img src=\"img/file.png\" onclick=\"mail(" + result[i].tel + ")\"><img src=\"img/info.png\" onclick=\"message('" + result[i].uid + "','" + result[i].name + "'," + result[i].tel + ")\"></td></tr>");
                                    };
                                }
                            })
                        }
                    });
                    for (var i = 0; i < result.length; i++) {
                        $("#complete_report").append("<tr><td>" + result[i].name + "</td><td class=\"lt\">" + result[i].tel + "</td><td>" + result[i].region_name + "</td><td>" + result[i].job + "</td><td>" + result[i].midList + "</td><td>" + userLevel.get(result[i].rid) + "</td><td>" + character.get(result[i].rid) + "</td><td><img src=\"img/file.png\" onclick=\"mail(" + result[i].tel + ")\"><img src=\"img/info.png\" onclick=\"message('" + result[i].uid + "','" + result[i].name + "'," + result[i].tel + ")\"></td></tr>");
                    };
                }
            }else{
                layer.msg(data.var);
            }
        },
        error: function(result) {
            layer.msg("网络错误！");
        }
    })
};
refresh1();

// 发送邮件
function mail(name,id) {
    //var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:750px\"><li><label><i style='color:red'>*</i>收件人：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"userphone\"><div id=\"user_query1\"></div><select id=\"people\" class=\"remove_disabled\" onchange=\"user_query(this,value,value)\"><option value='1'>后台用户</option><option value='3'>消防员</option><option value='2'>护林员</option><option value='4'>无人机</option><option value='5'>载人机</option></select><select  id=\"hot_city\" onchange=\"user_query(this)\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select  id=\"city_sx\" class=\"remove_disabled\" onchange=\"user_query(this)\"></select><select id=\"area_sx\" class=\"remove_disabled\" ></select><div id=\"user_query\"></div></li><li><label><i style='color:red'>*</i>主题：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"usertitle\"></li><li><label>添加附件：</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"/><a class=\"fileInput\">添加附件</a><i style='margin-left: 10px;font-size: 12px;color:red'>格式为：zip、doc、xls、ppt、pdf、rar</i><span class=\"videoname\"></span></li><li style='height: 370px;overflow: auto;'><textarea id=\"edit\"></textarea></li><li><label>发件人：</label><span>"+sessionStorage.getItem("uname")+"</span></li><ul>"
    var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:750px\"><li><label><i style='color:red'>*</i>收件人：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"userphone\"><div id=\"user_query1\"></div><select id=\"people\" class=\"remove_disabled\" onchange=\"user_query(this,value,value)\"><option value='1'>后台用户</option><option value='3'>消防员</option><option value='2'>护林员</option><option value='4'>无人机</option><option value='5'>载人机</option></select>" +
        "<select  id=\"hot_city\" onchange=\"user_query(this)\"></select><select  id=\"city_sx\" class=\"remove_disabled\" onchange=\"user_query(this)\"></select><select id=\"area_sx\" class=\"remove_disabled\" ></select><div id=\"user_query\"></div></li><li><label><i style='color:red'>*</i>主题：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"usertitle\"></li><li><label>添加附件：</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"/><a class=\"fileInput\">添加附件</a><i style='margin-left: 10px;font-size: 12px;color:red'>格式为：zip、doc、xls、ppt、pdf、rar</i><span class=\"videoname\"></span></li><li style='height: 320px;overflow: auto;'><textarea id=\"edit\"></textarea></li><li><label>发件人：</label><span>"+sessionStorage.getItem("uname")+"</span></li><ul>"
    layer.confirm(''+add_resources+'', {
        type: 1,
        closeBtn: 1, //关闭按钮
        anim: 2,
        skin: 'layui-layer-molv', 
        btn: ['发送','存草稿','返回'],
        btnAlign: 'c',
        area: ['800px', '650px;'],
        title:'发送邮件',
        shadeClose: true, //开启遮罩关闭
    }, function(){
        var sender = sessionStorage.getItem("uname");
        var receive = $('#userphone').attr("data-name");
        if (receive==undefined||receive=='') {receive=$('#userphone').val();}
        var theme =$('#usertitle').val();
        var content =$('#edit').val();
        var accessory=videoName.join();
        if (receive!=''&&content!=''&&theme!='') {
            sendAjax({
                "url":"fire/mail/sendMail",
                "data":{"id":id,"sender":sender,"theme":theme,"content":content,"accessory":accessory,"status":"1","receive":receive},"callback":function(result){
                    if (result.code=="s_ok") {
                        layer.closeAll('page');
                        layer.msg('发送成功');
                    }else{
                        layer.msg(result.var);
                    } 
                },
                error:function(e){
                    layer.msg("错误！！");
                }
            });
        }else{
            layer.alert("请完善邮件信息", {
            skin: 'layui-layer-molv',
            title:'温馨提示',
            closeBtn: 0,anim: 4,btnAlign: 'c'
            });
        }
    }, function(){
        var sender = sessionStorage.getItem("uname");
        var receive = $('#userphone').attr("data-name");
        if (receive==undefined||receive=='') {receive=$('#userphone').val();}
        var theme =$('#usertitle').val();
        var content =$('#edit').val();
        var accessory=videoName.join();
        sendAjax({
            "url":"fire/mail/sendMail",
            "data":{"id":id,"sender":sender,"theme":theme,"content":content,"accessory":accessory,"status":"0","receive":receive},"callback":function(result){
                if (result.code=="s_ok") {
                    layer.closeAll('page');
                    layer.msg('保存成功');
                    information();
                }else{
                    layer.msg(result.var);
                } 
            },
            error:function(e){
                layer.msg("错误！！");
            }
        });
    }, function(){
        layer.closeAll('page');
    });
    var all_citys=localStorage.getItem('Public_city');
    $('#hot_city').html(all_citys);
    if (name!=undefined) {$("#userphone").val(name).attr("disabled","disabled");$(".form_sub_release select").hide();}
    $('#edit').editable({inlineMode: false,language: "zh_cn",alwaysBlank: true})
    $("#photoName1").takungaevideoup({
        formData: {
            "path": "task_image",
            "file_ext":"image"
        },
        url:"fire/upload/fileUpload",
        id:"videoname"
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
})

