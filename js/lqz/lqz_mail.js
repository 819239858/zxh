$(".search_area").on("click","li",function(){
    var index = $(this).index();
    $(this).addClass("progressing").siblings().removeClass("progressing");
    $(".mail_index").hide().eq(index+1).show();
});
function sj() {
    $(".mail_index").hide().eq(1).show();
    $(".search_area li").addClass("progressing").eq(0).siblings().removeClass("progressing");
}

// 点击选中指派对象
var ss=[];var username=[];

var text=[];

// 首页----显示已读邮件，未读邮件
function index1() {
    sendAjax({
        "url":"fire/mail/getMailCount",
        "data":{},"callback":function(result){
           
            if(result.code='s_ok'){
                var result=result.var;
                $(".title1").html(result.receive_count);
                if(result.unread_count=='undefined' || result.unread_count==null){
                    $(".tz2 span").html('0');
                    $(".title2").html('0');
                    $("#tongz").html('0');
                }else{
                    $(".tz2 span").html(result.unread_count);
                    $(".title2").html(result.unread_count);
                    $("#tongz").html(result.unread_count);
                }
            }else{
                layer.msg("请求失败，稍后重试！");
            }
        },
        error: function(e) {
            layer.msg("请求失败，稍后重试！");
        }
    });
}
index1();
information();
function information(e) {
    var title=$(".search_user").val();
    // 收件箱
    sendAjax({
        "url":"fire/mail/getInbox",
        "data":{"theme":title,"per_page": 20,"current_page": 1},"callback":function(result){
            if(result.code='s_ok'){
                //总条数
                var num = '';
                if (result.var.total == 0) {
                    $(".complete_total1").html(0);
                    $("#complete_report2").html('');
                    num = 1;
                } else {
                    $("#complete_report2").html('');
                    $(".complete_total1").html(result.var.total);
                    num = result.var.total;
                    var result = result.var.data;
                    //分页
                    $(".complete_page1").createPage({
                        pageCount: Math.ceil(num / 20),
                        current: 1,
                        backFn: function(p) {
                            $("#complete_report2").html('');
                            sendAjax({
                                "url":"fire/mail/getInbox",
                                "data":{"theme":title,"per_page": 20,"current_page": p},"callback":function(result){
                                    var result = result.var.data;
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].status=='0') {isReply='未读'}else{isReply='已读'}
                                        if (result[i].other_path.length==0) {attach=''}else{attach='<i class="icon-file" style="color:#01dacf"></i>'}
                                        $("#complete_report2").append(
                                            "<tr><td><input type=\"checkbox\" onclick=\"single_check(this)\" name=\"check_name\"  data-name=\"" + result[i].id + "\"></td><td>" + isReply + "</td><td>" + result[i].theme + "</td><td>" + result[i].sender_name + "</td><td>" + result[i].region_name + "</td><td>" + attach + "</td><td>" + result[i].create_time + "</td><td><a class=\"mr-5\">详情</a><a onclick=\"new_office(" + result[i].sender_tel + ")\">回复</a></td></tr>"
                                        );
                                    }
                                    $("#complete_report2 .mr-5").click(function() {
                                        var index=$("#complete_report2 .mr-5").index(this);
                                        report_index(result[index],"1")
                                    });
                                }
                            })

                        }
                    });
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].status=='0') {isReply='未读'}else{isReply='已读'}
                        if (result[i].other_path.length==0) {attach=''}else{attach='<i class="icon-file" style="color:#01dacf"></i>'}
                        $("#complete_report2").append(
                            "<tr><td><input type=\"checkbox\" onclick=\"single_check(this)\"  name=\"check_name\"  data-name=\"" + result[i].id + "\"></td><td>" + isReply + "</td><td>" + result[i].theme + "</td><td>" + result[i].sender_name + "</td><td>" + result[i].region_name + "</td><td>" + attach + "</td><td>" + result[i].create_time + "</td><td><a class=\"mr-5\">详情</a><a onclick=\"new_office(" + result[i].sender_tel + ")\">回复</a></td></tr>"
                        );
                    }
                    $("#complete_report2 .mr-5").click(function() {
                        var index=$("#complete_report2 .mr-5").index(this);
                        report_index(result[index],"1")
                    });
                }
            }
        },
        error: function(result) {
            layer.msg(result);
        }
    });
    // 发件箱
    sendAjax({
        "url":"fire/mail/getOutbox",
        "data":{"theme":title,"per_page": 20,"current_page": 1,"status":"1"},"callback":function(result){
            if(result.code='s_ok'){
                //总条数
                if (result.var.total == 0) {
                    $(".track_total").html(0);
                    $("#complete_track").html('');
                    num = 1;
                } else {
                    $("#complete_track").html('');
                    $(".track_total").html(result.var.total);
                    var num = '';
                    num = result.var.total;
                    var result = result.var.data;
                    //分页
                    $(".track_page").createPage({
                        pageCount: Math.ceil(num / 20),
                        current: 1,
                        backFn: function(p) {
                            sendAjax({
                                "url":"fire/mail/getOutbox",
                                "data":{"theme":title,"per_page": 20,"current_page": p,"status":"1"},"callback":function(result){
                                    $("#complete_track").html('');
                                    var result = result.var.data;
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].other_path=='') {attach=''}else{attach='<i class="icon-file" style="color:#01dacf"></i>'}
                                        $("#complete_track").append(
                                            "<tr><td><input type=\"checkbox\" onclick=\"single_check_send(this)\" name=\"check_name1\"  data-name=\"" + result[i].id + "\"></td><td>" + result[i].theme + "</td><td>" + result[i].recipient_name + "</td><td>" + result[i].region_name + "</td><td>" + attach + "</td><td>" + result[i].create_time + "</td><td><a class=\"mr-5\">详情</a></td></tr>"
                                        );
                                    }
                                    $("#complete_track .mr-5").click(function() {
                                        var index=$("#complete_track .mr-5").index(this);
                                        report_index(result[index],"2")
                                    });
                                }
                            })
                        }
                    });
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].other_path=='') {attach=''}else{attach='<i class="icon-file" style="color:#01dacf"></i>'}
                        $("#complete_track").append(
                            "<tr><td><input type=\"checkbox\" name=\"check_name1\" onclick=\"single_check_send(this)\" data-name=\"" + result[i].id + "\"></td><td>" + result[i].theme + "</td><td>" + result[i].recipient_name + "</td><td>" + result[i].region_name + "</td><td>" + attach + "</td><td>" + result[i].create_time + "</td><td><a class=\"mr-5\">详情</a></td></tr>"
                        );
                    }
                    $("#complete_track .mr-5").click(function() {
                        var index=$("#complete_track .mr-5").index(this);
                        report_index(result[index],"2")
                    });
                }
            }
        },
        error: function(result) {
            layer.msg(result);
        }
    });
    // 草稿箱
    sendAjax({
        "url":"fire/mail/getOutbox",
        "data":{"theme":title,"per_page": 20,"current_page": 1,"status":"0"},"callback":function(result){
            if(result.code='s_ok'){
                //总条数
                var num = '';
                if (result.var.total == 0) {
                    $(".complete_total2").html(0);
                    $("#complete_report3").html('');
                    num = 1;
                } else {
                    $("#complete_report3").html('');
                    $(".complete_total2").html(result.var.total);
                    num = result.var.total;
                    var result = result.var.data;
                    //分页
                    $(".complete_page2").createPage({
                        pageCount: Math.ceil(num / 20),
                        current: 1,
                        backFn: function(p) {
                            sendAjax({
                                "url":"fire/mail/getOutbox",
                                "data":{"theme":title,"per_page": 20,"current_page": p,"status":"0"},"callback":function(result){
                                    var result = result.var.data;
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].other_path=='') {attach=''}else{attach='<i class="icon-file" style="color:#01dacf"></i>'}
                                        $("#complete_report3").append(
                                            "<tr><td><input type=\"checkbox\" onclick=\"single_check_save(this)\" name=\"check_name2\"  data-name=\"" + result[i].id + "\"></td><td>" + result[i].theme + "</td><td>" + result[i].recipient_name + "</td><td>" + result[i].region_name + "</td><td>" + attach + "</td><td>" + result[i].create_time + "</td><td><a class=\"mr-5\">再次编辑</a></td></tr>"
                                        );
                                    };
                                    $("#complete_report3 .mr-5").click(function() {
                                        var index=$("#complete_report3 .mr-5").index(this);
                                        article(result[index]);
                                    });
                                }
                            })

                        }
                    });
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].other_path=='') {attach=''}else{attach='<i class="icon-file" style="color:#01dacf"></i>'}
                        $("#complete_report3").append(
                            "<tr><td><input type=\"checkbox\" name=\"check_name2\" onclick=\"single_check_save(this)\" data-name=\"" + result[i].id + "\"></td><td>" + result[i].theme + "</td><td>" + result[i].recipient_name + "</td><td>" + result[i].region_name + "</td><td>" + attach + "</td><td>" + result[i].create_time + "</td><td><a class=\"mr-5\">再次编辑</a></td></tr>"
                        );
                    };
                    $("#complete_report3 .mr-5").click(function() {
                        var index=$("#complete_report3 .mr-5").index(this);
                        article(result[index]);
                    });
                }
            }
        },
        error: function(result) {
            layer.msg(result);
        }
    });
    // 已删除
    sendAjax({
        "url":"fire/mail/getDelMail",
        "data":{"theme":title,"per_page": 20,"current_page": 1},"callback":function(result){
            //总条数
            var num = '';
            if (result.var.total == 0) {
                $(".complete_total3").html(0);
                $("#complete_report4").html('');
                num = 1;
            } else {
                $("#complete_report4").html('');
                $(".complete_total3").html(result.var.total);
                num = result.var.total;
                var result = result.var.data;
                //分页
                $(".complete_page3").createPage({
                    pageCount: Math.ceil(num / 20),
                    current: 1,
                    backFn: function(p) {
                        sendAjax({
                            "url":"fire/mail/getDelMail",
                            "data":{"theme":title,"per_page": 20,"current_page": p},"callback":function(result){
                                var result = result.var.data;
                                for (var i = 0; i < result.length; i++) {
                                    if (result[i].other_path=='') {attach=''}else{attach='<i class="icon-file" style="color:#01dacf"></i>'}
                                    $("#complete_report4").append(
                                        "<tr><td>" + result[i].recipient_tel + "</td><td>" + result[i].theme + "</td><td>" + attach + "</td><td>" + result[i].send_time + "</td><td><a class=\"mr-5\">详情</a></td></tr>"
                                    );
                                };
                                $("#complete_report4 .mr-5").click(function() {
                                    var index=$("#complete_report4 .mr-5").index(this);
                                    report_index1(result[index]);
                                });
                            }
                        })

                    }
                });
                for (var i = 0; i < result.length; i++) {
                    if (result[i].other_path=='') {attach=''}else{attach='<i class="icon-file" style="color:#01dacf"></i>'}
                    $("#complete_report4").append(
                        "<tr><td>" + result[i].recipient_tel + "</td><td>" + result[i].theme + "</td><td>" + attach + "</td><td>" + result[i].send_time + "</td><td><a class=\"mr-5\">详情</a></td></tr>"
                    );
                };
                $("#complete_report4 .mr-5").click(function() {
                    var index=$("#complete_report4 .mr-5").index(this);
                    report_index1(result[index]);
                });
            }
        },
        error: function(result) {
            layer.msg(result);
        }
    });
}
// 全选
var name_array = [];
function chk(all,mychk) {
    if (all.is(':checked')) {
            name_array = [];
            for (var i = 0; i < mychk.length; i++) {
                mychk[i].checked = true;
            }
        mychk.chcked = true;
    } else {
        if (mychk.length) {
            for (var i = 0; i < mychk.length; i++) {
                mychk[i].checked = false;
            }
        }
    }
};
//收件夹单选
function single_check(ths){
    if (ths.checked == false) {
        $('#all').prop('checked', false);
    }
    else {
        var count = $("input[name=check_name]:checkbox:checked").length;
        if (count == $("input[name=check_name]:checkbox").length) {
            $('#all').prop('checked',true);
        }
    }
};
// 已发送单选
function single_check_send(ths){
    if (ths.checked == false) {
        $('#all_all').prop('checked', false);
    }
    else {
        var count = $("input[name=check_name1]:checkbox:checked").length;
        if (count == $("input[name=check_name1]:checkbox").length) {
            $('#all_all').prop('checked',true);
        }
    }
};
// 草稿夹单选
function single_check_save(ths){
    if (ths.checked == false) {
        $('#all1').prop('checked', false);
    }
    else {
        var count = $("input[name=check_name2]:checkbox:checked").length;
        if (count == $("input[name=check_name2]:checkbox").length) {
            $('#all1').prop('checked',true);
        }
    }
};
// 删除收件箱
function audit(fireId) {
    var name_array = [];
    var input_checkbox = $("input[name='check_name']");
    for (var i = 0; i < input_checkbox.length; i++) {
        if (input_checkbox[i].checked == true) {
            name_array.push(input_checkbox[i].getAttribute("data-name"));
        }
    }
    layer.confirm("是否删除选中的邮件?", {
        btn: ['确定', '取消'],
        skin: 'layui-layer-molv',
        title: '提示',
        btnAlign: 'c'
    }, function() {
        if (fireId!=undefined) {
            name_array=fireId;
        }
        sendAjax({
            "url":"fire/mail/delInbox",
            "data":{"ids[]":name_array},"callback":function(result){
                if (result.code == "s_ok") {
                    layer.msg(result.var);
                    document.getElementById("all").checked = false;
                    information();
                }else {
                    layer.msg(result.var)
                }
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
    }, function(index, layero) {
        name_array = [];
    });
};
// 删除发件箱
function audit_two(fireId) {
    var name_array = [];
    var input_checkbox = $("input[name='check_name1']");
    for (var i = 0; i < input_checkbox.length; i++) {
        if (input_checkbox[i].checked == true) {
            name_array.push(input_checkbox[i].getAttribute("data-name"));
        }
    }
    layer.confirm("是否删除选中的邮件?", {
        btn: ['确定', '取消'],
        skin: 'layui-layer-molv',
        title: '提示',
        btnAlign: 'c'
    }, function() {
        if (fireId!=undefined) {
            name_array=fireId;
        }
        sendAjax({
            "url":"fire/mail/delOutbox",
            "data":{"ids[]":name_array},"callback":function(result){
                if (result.code == "s_ok") {
                    layer.msg(result.var);
                    document.getElementById("all_all").checked = false;
                    information();
                }else {
                    layer.msg(result.var)
                }
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
    }, function(index, layero) {
        name_array = [];
    });
};
//删除草稿箱
function audit_th(fireId) {
    var name_array = [];
    var input_checkbox = $("input[name='check_name2']");
   
    for (var i = 0; i < input_checkbox.length; i++) {
        if (input_checkbox[i].checked == true) {
            name_array.push(input_checkbox[i].getAttribute("data-name"));
        }
    }
    layer.confirm("是否删除选中的邮件?", {
        btn: ['确定', '取消'],
        skin: 'layui-layer-molv',
        title: '提示',
        btnAlign: 'c'
    }, function() {
        // if (fireId!=undefined) {
        //     name_array=fireId;
        // }
        sendAjax({
            "url":"fire/mail/delOutbox",
            "data":{"ids[]":name_array},"callback":function(result){
                if (result.code == "s_ok") {
                    layer.msg(result.var);
                    document.getElementById("all1").checked = false;
                    information();
                }else {
                    layer.msg(result.var)
                }
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
    }, function(index, layero) {
        name_array = [];
    });
}

// 邮件页面加载
$(function() {
    $(".toux").prepend("<img src="+Public_address+'uploads/'+sessionStorage.getItem('imageHead')+" onerror=\"javascript:this.src='img/timg.png'\" width='90px'>");
    // $(".toux").prepend("<img src="+Public_address+'uploads/'+sessionStorage.getItem('imageHead')+" onerror=\"javascript:this.src='img/fujian.png'\" width='90px'>");
    var msg = ["即使没有翅膀，心也要飞翔！","依心而行，无憾今生","此时的坚持，是为了下班时的喜悦","用心每一天，不忘初心，方能走远","拥抱阳光，转身心晴","积一时之跬步，臻千里之遥程","分享快乐，福己及人","微笑向前，遇见最美好的自己"];
    var name=sessionStorage.getItem('name');
    $(".introduction p span").html(name+"，"+msg[Math.floor(Math.random() * msg.length)]);
    var city= sessionStorage.getItem("liveCity");
    
    if (city=='湖南省'||city=='') {
        city='长沙市';
    }else if (city.length>3) {
        city=city.substring(3);
    }
    AMap.service('AMap.Weather', function() {
        var weather = new AMap.Weather();
        weather.getLive(city, function(err, data) {
            if (!err) {
                
                var str = [];
                if (data.weather=="多云"||data.weather=="阵雨") {$('.imgtq').attr('src','img/lqz/01.png')}
                if (data.weather=="晴") {$('.imgtq').attr('src','img/lqz/00.png')}
                if (data.weather=="阴") {$('.imgtq').attr('src','img/lqz/02.png')}
                if (data.weather=="小雨"||data.weather=="中雨"||data.weather=="大雨") {$('.imgtq').attr('src','img/lqz/03.png')}
                str.push('<div style="font-weight: bold;font-size:20px;margin-bottom: 10px;">实时天气' + '</div>');
                str.push('<span>城市/区：' + data.city + '</span>； ');
                str.push('<span>天气：' + data.weather + '</span>； ');
                str.push('<span>温度：' + data.temperature + '℃</span><br/>');
                str.push('<span>风向：' + data.windDirection + '</span>； ');
                if(data.windPower){
                    str.push('<span>风力：' + data.windPower + ' 级</span>； ');
                }
                str.push('<span>空气湿度：' + data.humidity + '</span>； ');
                $("#tq").html(str);
            }
        });
    })
});
// 发送邮件
function new_office(name,id) {
    text=[];
    if(name == undefined){
        var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:750px\"><li  class='label1'><label><i style='color:red'>*</i>收件人：</label><div type=\"text\" class=\"getPerMail\"  id=\"userphone\"></div><div id=\"user_query1\"></div><select id=\"people\" class=\"remove_disabled\" onchange=\"user_query(this,value,value)\"><option value='1'>后台用户</option><option value='3'>消防员</option><option value='2'>护林员</option><option value='4'>无人机</option><option value='5'>载人机</option></select>" +
            "<select id=\"hot_city\" onchange=\"user_query(this)\"></select><select  id=\"city_sx\" class=\"remove_disabled\" onchange=\"user_query(this)\"></select><select id=\"area_sx\" class=\"remove_disabled\" ></select><div id=\"user_query\"></div></li><li><label><i style='color:red'>*</i>主题：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"usertitle\"></li><li><label>添加附件：</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"/><a class=\"fileInput\">添加附件</a><i style='margin-left: 10px;font-size: 12px;color:red'>格式为：zip、doc、xls、ppt、pdf、rar</i><span class=\"videoname\"></span></li><li style='height: 320px;overflow: auto;'><textarea id=\"edit\"></textarea></li><li><label>发件人：</label><span>"+sessionStorage.getItem("name")+sessionStorage.getItem("uname")+"</span></li><ul>";
    }else{
        var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:750px\"><li  class='label1'><label><i style='color:red'>*</i>收件人：</label><input type=\"text\" class=\"form-control form-boxed\" class=\"userphoneSetInput\" value=\"\" id=\"userphone\">" +
            "<li><label><i style='color:red'>*</i>主题：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"usertitle\"></li><li><label>添加附件：</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"/><a class=\"fileInput\">添加附件</a><i style='margin-left: 10px;font-size: 12px;color:red'>格式为：zip、doc、xls、ppt、pdf、rar</i><span class=\"videoname\"></span></li><li style='height: 320px;overflow: auto;'><textarea id=\"edit\"></textarea></li><li><label>发件人：</label><span>"+sessionStorage.getItem("name")+sessionStorage.getItem("uname")+"</span></li><ul>"
    }
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
        // var receive = $('#userphone').attr("data-name");
        var receive = text.join(",");
        if(name==undefined){
            //发送邮件
            var receive = text.join(",");
        }else{
            //回复邮件的时候
            var receive = name;
        }
        var theme =$('#usertitle').val();
        var content =$('#edit').val();
        var accessory=videoName.join();
        if (receive!=''&&content!=''&&theme!='') {
            sendAjax({
                "url":"fire/mail/sendMail",
                "data":{"id":id,"sender":sender,"theme":theme,"content":content,"accessory":accessory,
                    "status":"1","receive":receive},
                "callback":function(result){
                    if (result.code=="s_ok") {
                        layer.closeAll('page');
                        layer.msg('发送成功');
                        text=[];
                        information();
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
        if(name==undefined){
            //发送邮件
            var receive = text.join(",");
        }else{
            //回复邮件的时候
            var receive = name;
        }
        var theme =$('#usertitle').val();
        var content =$('#edit').val();
        var accessory=videoName.join();
        sendAjax({
            "url":"fire/mail/sendMail",
            "data":{"id":id,"sender":sender,"theme":theme,"content":content,"accessory":accessory,"status":"0","receive":receive},
            "callback":function(result){
                if (result.code=="s_ok") {
                    layer.closeAll('page');
                    layer.msg('保存成功');
                    information();
                    text=[];
                }else{
                    layer.msg(result.var);
                } 
            },
            error:function(e){
                layer.msg("错误！！");
            }
        });
    }, function(){
        text=[];//清理掉之前选择的收件人
        layer.closeAll('page');
    });

    var all_citys=localStorage.getItem('all_city');
    $('#hot_city').html(all_citys);

    user_query('',1,1);
    if (name!=undefined) {$("#userphone").val(name).attr("disabled","disabled");$("select").hide();}
    $('#edit').editable({inlineMode: false,language: "zh_cn",alwaysBlank: true,contenteditable:true});
    $("#photoName1").takungaeOtherup({
        formData: {
            "path": "mail",
            "file_ext":"other"
        },
        url:"fire/upload/fileUpload",
        id:"videoname"
    });
}
// 继续编辑
function article(result) {
    text=[];
    if(result.other_path.length>0){
        // var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:750px\"><li><label><i style='color:red'>*</i>收件人：</label><input type=\"text\" class=\"form-control form-boxed\"  id=\"userphone\"><div id=\"user_query1\"></div><select id=\"people\" class=\"remove_disabled\" onchange=\"user_query(this,value,value)\"><option value='1'>后台用户</option><option value='3'>消防员</option><option value='2'>护林员</option><option value='4'>无人机</option><option value='5'>载人机</option></select>" +
        // "</li><li><label><i style='color:red'>*</i>主题：</label><input type=\"text\" class=\"form-control form-boxed\" value=\""+result.theme+"\" id=\"usertitle\"></li><li><label>添加附件：</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"/><a class=\"fileInput\">添加附件</a><i style='margin-left: 10px;font-size: 12px;color:red'>格式为：zip、doc、xls、ppt、pdf、rar</i><span class=\"videoname\"><a href=\"../uploads/"+result.other_path[0].path+"\" >"+result.other_path[0].path+"</a></span></li>" +
        // "<li><textarea id=\"edit\">"+"</textarea></li>" +
        // "<li><label>发件人：</label><span id=\"senderPer\">"+sessionStorage.getItem("uname")+"</span></li><ul>";
        
        // var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:750px\"><li class='label1'><label ><i style='color:red'>*</i>收件人：</label><div type=\"text\" class=\"getPerMail\"  id=\"userphone\"></div><div id=\"user_query1\"></div><select id=\"people\" class=\"remove_disabled\" onchange=\"user_query(this,value,value)\"><option value='1'>后台用户</option><option value='3'>消防员</option><option value='2'>护林员</option><option value='4'>无人机</option><option value='5'>载人机</option></select>" +
        // "<select id=\"hot_city\" onchange=\"user_query(this)\"></select><select  id=\"city_sx\" class=\"remove_disabled\" onchange=\"user_query(this)\"></select><select id=\"area_sx\" class=\"remove_disabled\" ></select><div id=\"user_query\"></div></li><li><label><i style='color:red'>*</i>主题：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"usertitle\"></li><li><label>添加附件：</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"/><a class=\"fileInput\">添加附件</a><i style='margin-left: 10px;font-size: 12px;color:red'>格式为：zip、doc、xls、ppt、pdf、rar</i><span class=\"videoname\"><a href=\"../uploads/"+result.other_path[0].path+"\" >"+result.other_path[0].path+"</a></span></li><li style='height: 320px;overflow: auto;'><textarea id=\"edit\"></textarea></li><li><label>发件人：</label><span>"+sessionStorage.getItem("name")+sessionStorage.getItem("uname")+"</span></li><ul>";
        var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:750px\"><li class='label1'><label ><i style='color:red'>*</i>收件人：</label><div type=\"text\" class=\"getPerMail\"  id=\"userphone\"></div><div id=\"user_query1\"></div><select id=\"people\" class=\"remove_disabled\" onchange=\"user_query(this,value,value)\"><option value='1'>后台用户</option><option value='3'>消防员</option><option value='2'>护林员</option><option value='4'>无人机</option><option value='5'>载人机</option></select>" +
        "<select id=\"hot_city\" onchange=\"user_query(this)\"></select><select  id=\"city_sx\" class=\"remove_disabled\" onchange=\"user_query(this)\"></select><select id=\"area_sx\" class=\"remove_disabled\" ></select><div id=\"user_query\"></div></li><li><label><i style='color:red'>*</i>主题：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"usertitle\"></li><li><label>添加附件：</label><span class=\"videoname\"><a href=\"../uploads/"+result.other_path[0].path+"\" >"+result.other_path[0].path+"</a></span></li><li style='height: 320px;overflow: auto;'><textarea id=\"edit\"></textarea></li><li><label>发件人：</label><span>"+sessionStorage.getItem("name")+sessionStorage.getItem("uname")+"</span></li><ul>";

    }else{
        var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:750px\"><li class='label1'><label><i style='color:red'>*</i>收件人：</label><div type=\"text\" class=\"getPerMail\"  id=\"userphone\"></div><div id=\"user_query1\"></div><select id=\"people\" class=\"remove_disabled\" onchange=\"user_query(this,value,value)\"><option value='1'>后台用户</option><option value='3'>消防员</option><option value='2'>护林员</option><option value='4'>无人机</option><option value='5'>载人机</option></select>" +
            "<select id=\"hot_city\" onchange=\"user_query(this)\"></select><select  id=\"city_sx\" class=\"remove_disabled\" onchange=\"user_query(this)\"></select><select id=\"area_sx\" class=\"remove_disabled\" ></select><div id=\"user_query\"></div></li><li><label><i style='color:red'>*</i>主题：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"usertitle\"></li><li><label>添加附件：</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"/><a class=\"fileInput\">添加附件</a><i style='margin-left: 10px;font-size: 12px;color:red'>格式为：zip、doc、xls、ppt、pdf、rar</i><span class=\"videoname\"></span></li><li style='height: 320px;overflow: auto;'><textarea id=\"edit\"></textarea></li><li><label>发件人：</label><span>"+sessionStorage.getItem("name")+sessionStorage.getItem("uname")+"</span></li><ul>";
    
    }
    
    
    layer.confirm(add_resources, {
        type: 1,
        closeBtn: 1, //关闭按钮
        anim: 2,
        skin: 'layui-layer-molv', 
        btn: ['发送','删除','返回'],
        btnAlign: 'c',
        area: ['800px', '650px;'],
        title:'发送邮件',
        shadeClose: true, //开启遮罩关闭
    }, function(){
        var sender = sessionStorage.getItem("uname");
        //var receive = $('#userphone').val();
        // var receive = $('#userphone').attr("data-name");
        // if (receive==undefined||receive=='') {receive=$('#userphone').val();}
        //邮件的时候，还有全部人的发送未完成

        var theme =$('#usertitle').val();
        var content =$('#edit').val();
         //result.other_path[0].other_path
        if(result.other_path.length>0){
            var accessory=result.other_path[0].id;
        }else{
            var accessory=videoName.join();
        }
        
            sendAjax({
                "url":"fire/mail/sendMail",
                "data":{"id":result.id,"sender":sender,"theme":theme,"content":content,"accessory":accessory,
                        "status":"1","receive":result.recipient_tel},
                "callback":function(result){
                    if (result.code=="s_ok") {
                        layer.closeAll('page');
                        layer.msg('发送成功');
                        information();
                        text=[];
                    }else{
                        layer.msg(result.var);
                    } 
                },
                error:function(e){
                    layer.msg("错误！！");
                }
            });
        
    }, function(){
        sendAjax({
            "url":"fire/mail/delOutbox",
            "data":{"ids[]":result.id},"callback":function(result){
                if (result.code == "s_ok") {
                    layer.msg(result.var);
                    document.getElementById("all").checked = false;
                    information();
                    text=[];
                    
                }else {
                    layer.msg(result.var)
                }
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
    }, function(){
       
    });

    $('#edit').val(result.content);
    $('#usertitle').val( result.theme);
    $('#senderPer').val(sessionStorage.getItem("name")+sessionStorage.getItem("uname"));
    //收件人
    // recipient_name:"邵阳市阳荣峰,张三丰"
    // recipient_tel:"15500000022,18684770665"
    if(result.recipient_name.indexOf(',')!=-1){
        //存在多个人的时候
        var name=result.recipient_name.split(',');
        var tel=result.recipient_tel.split(',');
        for(var i=0;i<name.length;i++){
            var html="<div class='setBoxSpanDel' onclick='delThis(this)' data-name=\""+tel[i]+"\"><span>"+name[i]+"</span><i >x</i></div>";
            text.push(tel[i]); 
            $("#userphone").append(html); 
        }
    }
    if(result.recipient_name !=''){
        var html="<div class='setBoxSpanDel' onclick='delThis(this)' data-name=\""+result.recipient_tel+"\"><span>"+result.recipient_name+"</span><i >x</i></div>";
            text.push(result.recipient_tel); 
            $("#userphone").append(html); 
    }

    var all_citys=localStorage.getItem('Public_city');
    $('#hot_city').html(all_citys);

    //$("#userphone").attr("disabled","disabled");
    //$("select").hide();
    $('#edit').editable({inlineMode: false,language: "zh_cn",alwaysBlank: true,contenteditable:true});

    $("#photoName1").takungaeOtherup({
        formData: {
            "path": "task_image",
            "file_ext":"image"
        },
        url:"fire/upload/fileUpload",
        id:"videoname"
    });
}

// 收件1+发件2邮件详情
function report_index(result,status) {
    
    if(status=="1"){
        sendAjax({
            "url":"fire/mail/getMailInfo",
            "data":{"id":result.id},"callback":function(result){
            if (result.code=="s_ok") {
                information();
                index1();  //点开详情的时候，页面最上面的提示要跟着改变
            } 
          },
          error:function(e){
            layer.msg("错误！！");
          }
        });
    }
    if(status=="1"){
        if(result.other_path.length>0){
        var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:100%;padding:20px\">" +
            "<li><label><i style='color:red'>*</i>收件人：</label><span>"+result.sender_name+"</span></li>" +
            "<li><label><i style='color:red'>*</i>主题：</label><span>"+result.theme+"</span></li>" +
            "<li><label><i style='color:red'>*</i>附件：</label><span class=\"videoname\"><a href="+Public_address+'uploads/'+result.other_path[0].path+" style='margin-left:20px;'>"+'下载'+"</a></span></li>" +
            "<li><label>内容：</label><div style='display:inline-block;width: 80%;height: 150px;overflow: auto;border: solid 1px #e5e5e5;padding: 5px;vertical-align: middle;'>"+result.content+"</div></li>" +
            "<li><label>发件人：</label><span>"+result.sender_tel+"</span></li><ul>";

        }else{
        var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:100%;padding:20px\">" +
            "<li><label><i style='color:red'>*</i>收件人：</label><span>"+result.sender_name+"</span></li>" +
            "<li><label><i style='color:red'>*</i>主题：</label><span>"+result.theme+"</span></li>" +
            "<li><label><i style='color:red'>*</i>附件：</label><span class=\"videoname\"><span  style='margin-left:20px;'>"+'无'+"</span></span></li>" +
            "<li><label>内容：</label><div style='display:inline-block;width: 80%;height: 150px;overflow: auto;border: solid 1px #e5e5e5;padding: 5px;vertical-align: middle;'>"+result.content+"</div></li>" +
            "<li><label>发件人：</label><span>"+result.sender_tel+"</span></li><ul>";
        }
    }else{
        if(result.other_path.length>0){
            var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:100%;padding:20px\">" +
                "<li><label><i style='color:red'>*</i>收件人：</label><span>"+result.recipient_name+"</span></li>" +
                "<li><label><i style='color:red'>*</i>主题：</label><span>"+result.theme+"</span></li>" +
                "<li><label><i style='color:red'>*</i>附件：</label><span class=\"videoname\"><a href="+Public_address+'uploads/'+result.other_path[0].path+" style='margin-left:20px;'>"+'下载'+"</a></span></li>" +
                "<li><label>内容：</label><div style='display:inline-block;width: 80%;height: 150px;overflow: auto;border: solid 1px #e5e5e5;padding: 5px;vertical-align: middle;'>"+result.content+"</div></li>" +
                "<li><label>发件人：</label><span>"+result.sender_tel+"</span></li><ul>";
    
            }else{
            var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:100%;padding:20px\">" +
                "<li><label><i style='color:red'>*</i>收件人：</label><span>"+result.recipient_name+"</span></li>" +
                "<li><label><i style='color:red'>*</i>主题：</label><span>"+result.theme+"</span></li>" +
                "<li><label><i style='color:red'>*</i>附件：</label><span class=\"videoname\"><span  style='margin-left:20px;'>"+'无'+"</span></span></li>" +
                "<li><label>内容：</label><div style='display:inline-block;width: 80%;height: 150px;overflow: auto;border: solid 1px #e5e5e5;padding: 5px;vertical-align: middle;'>"+result.content+"</div></li>" +
                "<li><label>发件人：</label><span>"+result.sender_tel+"</span></li><ul>";
            }
    }
   layer.confirm(''+add_resources+'', {
    type: 1,
    closeBtn: 1, //关闭按钮
    anim: 2,
    skin: 'layui-layer-molv', 
    btn: ['回复','删除','取消'],
    btnAlign: 'c',
    area: ['570px','500px'],
    title:'邮件详情',
    shadeClose: true, //开启遮罩关闭
    }, function(){
        layer.closeAll('page');
        if (status=="1") {
            new_office(result.sender_tel);
        }else if (status=="2") {
            new_office(result.recipient_tel);
        }
        
    }, function(){
        layer.closeAll('page');
        if (status=="1") {
            audit(result.id);
        }else if (status=="2") {
            audit_two(result.id);
        }
    }, function(){
        layer.closeAll('page');
    });

}
//删除箱详情
function report_index1(result) {
    // var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:100%;padding:20px\"><li><label><i style='color:red'>*</i>收件人：</label><span>"+result.recipient_tel+"</span></li><li><label><i style='color:red'>*</i>主题：</label><span>"+result.theme+"</span></li><li><label><i style='color:red'>*</i>附件：</label><span class=\"videoname\"><a href=\"../uploads/"+result.attach+"\" style='margin-left:20px;'>"+result.other_path[0].path+"</a></span></li>" +
    //     "<li><label>内容：</label><div style='display:inline-block;width: 80%;height: 150px;overflow: auto;border: solid 1px #e5e5e5;padding: 5px;vertical-align: middle;'>"+result.content+"</div></li>" +
    //     "<li><label>发件人：</label><span>"+result.sender_tel+"</span></li><ul>"
    if(result.other_path.length>0){
        var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:100%;padding:20px\">" +
            "<li><label><i style='color:red'>*</i>收件人：</label><span>"+result.recipient_tel+"</span></li>" +
            "<li><label><i style='color:red'>*</i>主题：</label><span>"+result.theme+"</span></li>" +
            "<li><label><i style='color:red'>*</i>附件：</label><span class=\"videoname\"><a href="+Public_address+'uploads/'+result.other_path[0].path+" style='margin-left:20px;'>"+'下载'+"</a></span></li>" +
            "<li><label>内容：</label><div style='display:inline-block;width: 80%;height: 150px;overflow: auto;border: solid 1px #e5e5e5;padding: 5px;vertical-align: middle;'>"+result.content+"</div></li>" +
            "<li><label>发件人：</label><span>"+result.sender_tel+"</span></li><ul>";

    }else{
        var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:100%;padding:20px\">" +
            "<li><label><i style='color:red'>*</i>收件人：</label><span>"+result.recipient_tel+"</span></li>" +
            "<li><label><i style='color:red'>*</i>主题：</label><span>"+result.theme+"</span></li>" +
            "<li><label><i style='color:red'>*</i>附件：</label><span class=\"videoname\"><span  style='margin-left:20px;'>"+'无'+"</span></span></li>" +
            "<li><label>内容：</label><div style='display:inline-block;width: 80%;height: 150px;overflow: auto;border: solid 1px #e5e5e5;padding: 5px;vertical-align: middle;'>"+result.content+"</div></li>" +
            "<li><label>发件人：</label><span>"+result.sender_tel+"</span></li><ul>";
    }
    layer.confirm(add_resources, {
    type: 1,
    closeBtn: 1, //关闭按钮
    anim: 2,
    skin: 'layui-layer-molv', 
    btn: ['确定'],
    btnAlign: 'c',
    area: ['570px','500px'],
    title:'邮件详情',
    shadeClose: true, //开启遮罩关闭
    }, function(){
        layer.closeAll('page');
    });
}

all=[];

// 搜索用户查询
function user_query(e,id,price) {
    // callback1();
    if (id==undefined) {
      id=$("#people").val();
    }
    var region=$("#hot_city").val();
    $("#city_sx").val()==''||$("#city_sx").val()==undefined?region=$("#hot_city").val():$("#area_sx").val()==''||$("#area_sx").val()==undefined?region=$("#city_sx").val():region=$("#area_sx").val();
    var dom = $(e).next();
    sendAjax({
      "url":"fire/region/getRegion",
      "data":{"parentId":region},"callback":function(data){
        if (price!=undefined) {
          // $(dom).next().children('option').remove();
        }else{
          $(dom).children('option').remove();
          $(dom).next("#area").children('option').remove();
          $(dom).next("#area_sx").children('option').remove();
          $(dom).next("#village").children('option').remove();
          $(dom).append("<option></option>");
          if (data.code=="s_ok") {
            $.each(data.var, function(i, element) {
              var op = $("<option></option>").attr({ 'value': element.id, }).html(element.name);
              $(dom).append(op);
            });
          }
        } 
      },
      error: function(e) {
        layer.msg("错误！！");
      }
    });
    sendAjax({
      "url":"fire/user/getUserByNameOrTel",
      "data":{"mold_type":id,"region":region},"callback":function(data){
        if (data.code=="s_ok") {
          $("#user_query").show();
          $("#user_query").children('span').remove();
          all=data.var;
          var city=$('#city_sx option:selected').text()==''?$('#hot_city option:selected').text():($('#area_sx option:selected').text()==''?$('#city_sx option:selected').text():$('#area_sx option:selected').text());
          if(city=='城市'){
            city='湖南省'
            }
          if (price!=undefined) {
            $("#userphone").attr("data-name",'');
            $("#user_query").append("<span onclick=\"selected(this)\" data-name=\"43\">"+city+"</span>");
          }else{
            $("#userphone").attr("data-name",'');
            $("#user_query").append("<span onclick=\"selected(this)\" data-name=\""+region+"\">"+city+"</span>");
          }
          for (var i = 0; i < data.var.length; i++) {
            $("#user_query").append("<span onclick=\"selected(this)\" data-name=\""+data.var[i].tel+"\">" + data.var[i].name + "</span>");
          }
        }else if (data.var.length==0){
          layer.msg('查询数据为空');
          $("#user_query").children('span').remove();
        }else{
          layer.msg('查询失败');
        }
      }
    });
}
// 搜索用户查询--点击
function selected(e) {
var number=e.getAttribute('data-name');
if(text.length<1){

    var html="<div class='setBoxSpanDel' onclick='delThis(this)' data-name=\""+number+"\"><span>"+e.innerHTML+"</span><i >x</i></div>";
    text.push(number); 
    $("#userphone").append(html); 
}else{
    if(text.indexOf(number)==-1){
        
        var html="<div class='setBoxSpanDel' onclick='delThis(this)' data-name=\""+number+"\"><span>"+e.innerHTML+"</span><i >x</i></div>";
        text.push(number); 
        $("#userphone").append(html); 
    }
}  
};

//收件人点击删除
function delThis(e){
    e.remove();
    var number=e.getAttribute('data-name');
    text.splice(text.indexOf(number),1); 
}

