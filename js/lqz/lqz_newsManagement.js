callback1();
var isFser10 = true;

// 点击选中指派对象
var ss = [];
var username = [];

function selected(e) {
    if ($(e).html() == "全部人") {
        username = [];
        ss = [];
        $("#userphone").attr("data-name", '');
        $("#userphone").val("");
        $("#userphone").val("全部人");
        $("#user_query").empty();
    }
    ss.push($(e).html());
    var sss = ss.join(",")
    $("#userphone").val(sss);
    $(e).remove();
    username.push($(e).attr("data-name"));
    var dataname = username.join(",");
    $("#userphone").attr("data-name", dataname);
    $(".screening").hide();
};
//发布新闻
function news_user() {
    imgName = [];
    var add_resources = "<ul class=\"form_sub form_sub_release\" style=\"width:750px\"><li><label><i style='color:red'>*</i>区域：</label>" +
        "<select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select>" +
        "<select id=\"village\" class=\"remove_disabled\"></select>" +
        "<label><i style='color:red'>*</i>新闻类型：</label><select id='newstype' class='remove_disabled'><option value='0'>防火动态</option><option value='1'>当前火情</option><option value='2'>火险预报</option><option value='3'>经验交流</option></select></li>" +
        "<li><label><i style='color:red'>*</i>新闻来源：</label><input type=\"text\" class=\"form-control form-boxed\" value='' id=\"userOrigin\"></li>" +
        "<li><label><i style='color:red'>*</i>新闻标题：</label><input type=\"text\" class=\"form-control form-boxed\" value='' id=\"usertitle\"></li>" +
        "<li><label><i style='color:red'>*</i>作者：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"" + sessionStorage.getItem('name') + "\" id=\"author\"></li>" +
        "<li><label>微缩图：</label><input type=\"file\" id=\"phouserphone1\" class=\"upFileBtn\"/>" +
        "<a class=\"fileInput\">微缩图</a><span id=\"imgBox\"></span></li>" +
        // "<li><label>添加附件：</label><input type=\"file\" id=\"phouserphone2\" class=\"upFileBtn\"/>" +
        // "<a class=\"fileInput\">添加附件</a>" +
        // "<i style='margin-left: 10px;font-size: 12px;color:red'>格式为：zip、doc、xls、ppt</i>" +
        // "<span class=\"videoname\"></span></li>" +
        "<li style='height: 370px;overflow: auto;'><label><i style='color:red'>*</i>新闻内容：</label><textarea id=\"edit\"></textarea></li><ul>"
    layer.confirm(add_resources, {
        type: 1,
        skin: 'layui-layer-molv', //样式类名
        closeBtn: 1, //关闭按钮
        anim: 2,
        btn: ['发布', '取消'],
        btnAlign: 'c',
        area: ['800px', '670px;'],
        title: "发布新闻",
        shadeClose: true, //开启遮罩关闭
    }, function () {
        layer.msg('正在发布中', {
            icon: 16,
            shade: 0.01,
            time: false
        });
        var region = $("#province").val();
        $("#city_two").val() == '' || $("#city_two").val() == undefined ? region = $("#province").val() : $("#village").val() == '' || $("#village").val() == undefined ? region = $("#city_two").val() : region = $("#village").val();
        var publishName = sessionStorage.getItem("uname");
        var author = $('#author').val();
        var origin = $('#userOrigin').val();
        var title = $('#usertitle').val();
        var content = $('#edit').val();
        var images = imgName.join();
        // var attchment = videoName.join();
        var newsType = $('#newstype').val();
        if (origin != '' && author != '' && content != '' && title != '' && region != '' && newsType != '') {
            sendAjax({
                "url": "fire/news/saveNews",
                "data": {
                    "region": region,
                    "publishName": publishName,
                    "author": author,
                    "title": title,
                    "source": origin,
                    "content": content,
                    // "attchment": attchment,
                    "news_type": newsType,
                    "images": images
                },
                "callback": function (data) {
                    layer.closeAll('dialog');
                    if (data.code == "s_ok") {
                        layer.closeAll('page');
                        layer.msg('发布成功');
                        information();
                    } else {
                        layer.msg('发布失败');
                    }
                },
                error: function (e) {
                    layer.msg("错误！！");
                }
            });
        } else {
            layer.closeAll('dialog');
            layer.alert("请完善新闻发布信息", {
                skin: 'layui-layer-molv',
                title: '温馨提示',
                closeBtn: 0,
                anim: 4,
                btnAlign: 'c'
            });
        }
    }, function () {});

    var all_citys = localStorage.getItem('Public_city');
    $('#province').html(all_citys);

    $('#edit').editable({
        imageUploadURL: 'fire/upload/imageUpload',
        inlineMode: false,
        language: "zh_cn",
        alwaysBlank: true
    })
    callback1();
    $("#phouserphone1").takungaeImgup({
        formData: {
            "path": "user_image",
            "file_ext": "image"
        },
        url: "fire/upload/fileUpload",
        id: "imgBox"
    });
    $("#phouserphone2").takungaevideoup({
        formData: {
            "path": "user_image",
            "file_ext": "image"
        },
        url: "fire/upload/fileUpload",
        id: "videoname"
    });
    //监听checkbox的value值 改变则执行下列操作
    $("#qx_yh input").change(function () {
        if ($(this).prop("checked")) {
            $(this).val(1);
            sum2 = '';
            $("#qx_yh input").each(function () {
                sum2 += $(this).val();
            });
        } else {
            $(this).val(0);
            sum2 = '';
            $("#qx_yh input").each(function () {
                sum2 += $(this).val();
            });
        }
    });

    // 判断密码是否一致
    $("#userpwd1").blur(function () {
        if ($("#userpwd").val() == $("#userpwd1").val()) {
            $("#userpwd1").removeAttr("style");
        } else {
            $("#userpwd1").css("border-color", "red");
            layer.msg('密码输入不一致');
        }
    });
    var isFser = true;
    $(".form_sub_release i").click(function () {
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
}

// 放大图片
$("body").on('click', '.imgbig', function () {
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
    }, function () {
        event.preventDefault();
        event.stopPropagation();
        layer.closeAll('dialog');
    }, function () {});
})
// 全选
var name_array = [];

function chk() {
    var all = document.getElementById("all");
    var mychk = document.getElementsByName("check_name");
    if (all.checked == true) {
        name_array = [];
        if (mychk.length > 0) {
            for (var i = 0; i < mychk.length; i++) {
                mychk[i].checked = true;
            }
        }
        mychk.chcked = true;
    } else {
        if (mychk.length > 0) {
            for (var i = 0; i < mychk.length; i++) {
                mychk[i].checked = false;
            }
        }
    }
};
// 审核信息列表
function information(e) {
    // var region=$("#hot_city").val();
    // region=$("#city_sx").val()==''||$("#city_sx").val()==undefined? $("#hot_city").val():($("#area").val()==''||$("#area").val()==undefined?$("#city_sx").val():$("#area").val());
    var region = $("#hot_city").val()
    var newsType = $('#news_type').val();
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var data_info = data_info2 = data_info3 = data_info4 = {
        "per_page": 20,
        "current_page": 1,
        "news_type": newsType,
        "region": region,
        "start_time": startTime,
        "end_time": endTime
    };
    var character = sessionStorage.getItem("userLevel");
    // if (character=="3") {//超级管理员
    //     if (isFser10) {
    //         isFser10=false;
    //         $(".tab-nav").html(`<li class="active">已指派</li><li class="">待指派</li>`);
    //         $(".report_btn_two").attr("onclick","assigned()");
    //         $(".report_btn_two").html(`<i class="icon-file-alt"></i>一键指派`); 
    //     }
    //     // 待指派
    //     data_info.isAssgin="0";
    //     list_two(data_info);
    //     // 已指派
    //     data_info2.isAssgin="1";
    //     list_one(data_info2);
    // }else 
    if (character == "1") {
        //普通用户
        if (isFser10) {
            isFser10 = false;
            $(".tab-nav").html(`<li class="active">已发布</li><li class="">待审核</li><li class="">已驳回</li>`);
        }
        $(".report_btn_two").remove();
        // 待指派
        // data_info2.status="0";
        // list_two(data_info2);

        // 待审核
        data_info3.status = "1";
        list_two(data_info3);

        // 已驳回
        data_info4.status = "-1";
        list_five(data_info4);
        // 已发布
        data_info.status = "2";
        list_one(data_info);
    } else { //管理员
        // 待审核
        data_info2.appr_status = "0";
        list_two(data_info2);
        // 审核通过
        data_info3.appr_status = "1";
        list_three(data_info3);
        // 审核驳回
        data_info4.appr_status = "-1";
        list_four(data_info4);
        // 本人发布
        data_info.is_status = "2";
        delete(data_info["appr_status"]);
        list_one(data_info);
    }
}
information();
//显示列表信息
function list_one(data_info) {
    sendAjax({
        "url": "fire/news/getNewsByCondition",
        "data": data_info,
        "callback": function (result) {
            if (result.code = 's_ok') {
                //总条数
                var num = '';
                if (result.var.total == 0) {
                    $(".complete_total1").html(0);
                    num = 1;
                    $("#complete_report1").html('');
                } else {
                    $("#complete_report1").html('');
                    $(".complete_total1").html(result.var.total);
                    num = result.var.total;
                    var result = result.var.data;
                    //分页
                    $(".complete_page1").createPage({
                        pageCount: Math.ceil(num / 20),
                        current: 1,
                        backFn: function (p) {
                            delete(data_info["current_page"]);
                            data_info["current_page"] = p;
                            sendAjax({
                                "url": "fire/news/getNewsByCondition",
                                "data": data_info,
                                "callback": function (result) {
                                    var result = result.var.data;
                                    $("#complete_report1").html('');
                                    if (result.length > 0) {
                                        for (var i = 0; i < result.length; i++) {
                                            if (result[i].images.length > 0) {
                                                $("#complete_report1").append(
                                                    "<tr><td>" + result[i].region_name + "</td><td><img src=" + Public_address + 'uploads/' + result[i].images[0].path + " onerror=\"this.style=&quot;display:none&quot;\"></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].create_time + "</td><td>" + result[i].publish_name + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                                                );
                                            } else {
                                                $("#complete_report1").append(
                                                    "<tr><td>" + result[i].region_name + "</td><td></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].create_time + "</td><td>" + result[i].publish_name + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                                                );
                                            }
                                        }
                                    }

                                }
                            })
                        }
                    });
                    if (result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].images.length > 0) {
                                $("#complete_report1").append(
                                    "<tr><td>" + result[i].region_name + "</td><td><img src=" + Public_address + 'uploads/' + result[i].images[0].path + " onerror=\"this.style=&quot;display:none&quot;\"></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].create_time + "</td><td>" + result[i].publish_name + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                                );
                            } else {
                                $("#complete_report1").append(
                                    "<tr><td>" + result[i].region_name + "</td><td></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].create_time + "</td><td>" + result[i].publish_name + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                                );
                            }
                        };
                    }

                }
            }
        },
        error: function (result) {
            layer.msg("网络错误，请重新再试！");
        }
    });
}

function list_two(data_info) {
    sendAjax({
        "url": "fire/news/getNewsByCondition",
        "data": data_info,
        "callback": function (result) {
            if (result.code = 's_ok') {
                //总条数
                var num = '';
                if (result.var.total == 0) {
                    $(".complete_total2").html(0);
                    $("#complete_report2").html('');
                    num = 1;
                } else {
                    $("#complete_report2").html('');
                    $(".complete_total2").html(result.var.total);
                    num = result.var.total;
                    var result = result.var.data;
                    //分页
                    $(".complete_page2").createPage({
                        pageCount: Math.ceil(num / 20),
                        current: 1,
                        backFn: function (p) {
                            delete(data_info["current_page"]);
                            data_info["current_page"] = p;
                            sendAjax({
                                "url": "fire/news/getNewsByCondition",
                                "data": data_info,
                                "callback": function (result) {
                                    $("#complete_report2").html('');
                                    var result = result.var.data;
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].images.length > 0) {
                                            $("#complete_report2").append(
                                                "<tr><td><input type=\"checkbox\" name=\"check_name\" data-name=\"" + result[i].id + "\"></td><td>" + result[i].region_name + "</td><td><img src=" + Public_address + 'uploads/' + result[i].images[0].path + " onerror=\"this.style=&quot;display:none&quot;\"></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                                            );
                                        } else {
                                            $("#complete_report2").append(
                                                "<tr><td><input type=\"checkbox\" name=\"check_name\" data-name=\"" + result[i].id + "\"></td><td>" + result[i].region_name + "</td><td></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                                            );
                                        }
                                    }
                                }
                            })
                        }
                    });

                    for (var i = 0; i < result.length; i++) {
                        if (result[i].images.length > 0) {
                            $("#complete_report2").append(
                                "<tr><td><input type=\"checkbox\" name=\"check_name\" data-name=\"" + result[i].id + "\"></td><td>" + result[i].region_name + "</td><td><img src=" + Public_address + 'uploads/' + result[i].images[0].path + " onerror=\"this.style=&quot;display:none&quot;\"></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                            );
                        } else {
                            $("#complete_report2").append(
                                "<tr><td><input type=\"checkbox\" name=\"check_name\" data-name=\"" + result[i].id + "\"></td><td>" + result[i].region_name + "</td><td></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                            );
                        }
                    };
                }
            } else {
                console.log('错误的');
            }
        },
        error: function (result) {
            layer.msg("网络错误，请重新再试！");
        }
    });
}

function list_three(data_info) {
    sendAjax({
        "url": "fire/news/getNewsByCondition",
        "data": data_info,
        "callback": function (result) {
            if (result.code = 's_ok') {
                //总条数
                var num = '';
                if (result.var.total == 0) {
                    $(".complete_total3").html(0);
                    $("#complete_report3").html('');
                    num = 1;
                } else {
                    $("#complete_report3").html('');
                    $(".complete_total3").html(result.var.total);
                    num = result.var.total;
                    var result = result.var.data;
                    //分页
                    $(".complete_page3").createPage({
                        pageCount: Math.ceil(num / 20),
                        current: 1,
                        backFn: function (p) {
                            delete(data_info["current_page"]);
                            data_info["current_page"] = p;
                            sendAjax({
                                "url": "fire/news/getNewsByCondition",
                                "data": data_info,
                                "callback": function (result) {
                                    $("#complete_report3").html('');
                                    var result = result.var.data;
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].images.length > 0) {
                                            $("#complete_report3").append(
                                                "<tr><td>" + result[i].region_name + "</td><td><img src=" + Public_address + 'uploads/' + result[i].images[0].path + " onerror=\"this.style=&quot;display:none&quot;\"></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].appr_name + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                                            );
                                        } else {
                                            $("#complete_report3").append(
                                                "<tr><td>" + result[i].region_name + "</td><td></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].appr_name + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                                            );
                                        }
                                    }
                                }
                            })

                        }
                    });
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].images.length > 0) {
                            $("#complete_report3").append(
                                "<tr><td>" + result[i].region_name + "</td><td><img src=" + Public_address + 'uploads/' + result[i].images[0].path + " onerror=\"this.style=&quot;display:none&quot;\"></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].appr_name + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                            );
                        } else {
                            $("#complete_report3").append(
                                "<tr><td>" + result[i].region_name + "</td><td></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].appr_name + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                            );
                        }
                    };
                }
            }
        },
        error: function (result) {
            layer.msg("网络错误，请重新再试！");
        }
    });
}

function list_four(data_info) {
    sendAjax({
        "url": "fire/news/getNewsByCondition",
        "data": data_info,
        "callback": function (result) {
            if (result.code = 's_ok') {
                //总条数
                var num = '';
                if (result.var.total == 0) {
                    $(".complete_total4").html(0);
                    $("#complete_report4").html('');
                    num = 1;
                } else {
                    $("#complete_report4").html('');
                    $(".complete_total4").html(result.var.total);
                    num = result.var.total;
                    var result = result.var.data;
                    //分页
                    $(".complete_page4").createPage({
                        pageCount: Math.ceil(num / 20),
                        current: 1,
                        backFn: function (p) {
                            $("#complete_report4").html('');
                            delete(data_info["current_page"]);
                            data_info["current_page"] = p;
                            sendAjax({
                                "url": "fire/news/getNewsByCondition",
                                "data": data_info,
                                "callback": function (result) {
                                    var result = result.var.data;
                                    for (var i = 0; i < result.length; i++) {
                                        if (Number(result[i].character) > 2) {
                                            result[i].character = "2"
                                        }
                                        $("#complete_report4").append(
                                            "<tr><td>" + result[i].region_name + "</td><td><img src=" + Public_address + result[i].images + " onerror=\"this.style=&quot;display:none&quot;\"></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].rebut_name + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a class=\"mr-5\" title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                                            // "<tr><td>" + result[i].region_name + "</td><td><img src=" + Public_address + result[i].images + " onerror=\"this.style=&quot;display:none&quot;\"></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].rebut_name + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a class=\"mr-5\" title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a><a title=\"编辑\" onclick=\"edit_data(" + result[i].id + ")\">编辑</a></td></tr>"
                                        );
                                    }
                                }
                            })

                        }
                    });
                    if (result.length > 0) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].images.length > 0) {
                                $("#complete_report4").append(
                                    "<tr><td>" + result[i].region_name + "</td><td><img src=" + Public_address + 'uploads/' + result[i].images[0].path + " onerror=\"this.style=&quot;display:none&quot;\"></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].rebut_name + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a class=\"mr-5\" title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a><a title=\"编辑\" onclick=\"edit_data(" + result[i].id + ")\">编辑</a></td></tr>"
                                );
                            }else {
                                $("#complete_report4").append(
                                    "<tr><td>" + result[i].region_name + "</td><td></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].rebut_name + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a class=\"mr-5\" title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a><a title=\"编辑\" onclick=\"edit_data(" + result[i].id + ")\">编辑</a></td></tr>"
                                );
                            }
                        };
                    }
                }
            }
        },
        error: function (result) {
            layer.msg("网络错误，请重新再试！");
        }
    });
}

function list_five(data_info) {
    sendAjax({
        "url": "fire/news/getNewsByCondition",
        "data": data_info,
        "callback": function (result) {
            if (result.code = 's_ok') {
                //总条数
                var num = '';
                if (result.var.total == 0) {
                    $(".complete_total3").html(0);
                    $("#complete_report3").html('');
                    num = 1;
                } else {
                    $("#complete_report3").html('');
                    $(".complete_total3").html(result.var.total);
                    num = result.var.total;
                    var result = result.var.data;
                    //分页
                    $(".complete_page3").createPage({
                        pageCount: Math.ceil(num / 20),
                        current: 1,
                        backFn: function (p) {
                            delete(data_info["current_page"]);
                            data_info["current_page"] = p;
                            sendAjax({
                                "url": "fire/news/getNewsByCondition",
                                "data": data_info,
                                "callback": function (result) {
                                    $("#complete_report3").html('');
                                    var result = result.var.data;
                                    for (var i = 0; i < result.length; i++) {
                                        if (result[i].images.length > 0) {
                                            $("#complete_report3").append(
                                                "<tr><td>" + result[i].region_name + "</td><td><img src=" + Public_address + 'uploads/' + result[i].images[0].path + " onerror=\"this.style=&quot;display:none&quot;\"></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].rebut_name + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                                            );
                                        } else {
                                            $("#complete_report3").append(
                                                "<tr><td>" + result[i].region_name + "</td><td></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].rebut_name + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                                            );
                                        }
                                    }
                                }
                            })

                        }
                    });
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].images.length > 0) {
                            $("#complete_report3").append(
                                "<tr><td>" + result[i].region_name + "</td><td><img src=" + Public_address + 'uploads/' + result[i].images[0].path + " onerror=\"this.style=&quot;display:none&quot;\"></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].rebut_name + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                            );
                        } else {
                            $("#complete_report3").append(
                                "<tr><td>" + result[i].region_name + "</td><td></td><td>" + news_Type.get(result[i].news_type) + "</td><td>" + result[i].title + "</td><td style=\"max-width: 500px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;\">" + result[i].content + "</td><td>" + result[i].rebut_name + "</td><td>" + result[i].create_time + "</td><td>" + result[i].author + "</td><td><a class=\"mr-5\" onclick=\"article(" + result[i].id + ")\">详情</a> <a title=\"删除\" onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>"
                            );
                        }
                    };
                }
            }
        },
        error: function (result) {
            layer.msg("网络错误，请重新再试！");
        }
    });
}

// 一键审核
function audit() {
    name_array = [];
    var input_checkbox = $("input[type='checkbox']");
    for (var i = 1; i < input_checkbox.length; i++) {
        if (input_checkbox[i].checked == true) {
            name_array.push(input_checkbox[i].getAttribute("data-name"));
        }
    }
    var audit_name = name_array.join(",");
    var audit = `<div>已经提交后台用户注册审核，是否通过?</div><i style="color:red">*</i>审核理由：<input type="text" class="form-control form-boxed" value='' id="rebutReason" style='margin: 10px auto;width: 90%;'>`

    layer.confirm(audit, {
        btn: ['同意', '拒绝'],
        skin: 'layui-layer-molv',
        title: '提示',
        btnAlign: 'c'
    }, function () {
        var rebutReason = $("#rebutReason").val();
        sendAjax({
            "url": "fire/news/examineNews",
            "data": {
                "id": audit_name,
                "rebut_reason": rebutReason,
                "status": "1"
            },
            "callback": function (result) {
                if (result.code == "s_ok") {
                    layer.msg("审核通过！");
                    document.getElementById("all").checked = false;
                    information();
                } else if (result.code == "no_accpet") {
                    layer.msg(result.var);
                } else {
                    layer.msg(result.var)
                }
            },
            error: function (result) {
                layer.alert("请求失败,重新试试!", {
                    skin: 'layui-layer-molv',
                    closeBtn: 0,
                    anim: 4,
                    btnAlign: 'c'
                });
            }
        })
    }, function () {
        var rebut_reason = $("#rebutReason").val();
        sendAjax({
            "url": "fire/news/examineNews",
            "data": {
                "id": audit_name,
                "rebut_reason": rebut_reason,
                "status": "-1"
            },
            "callback": function (result) {
                if (rebutReason == '') {
                    layer.msg("请填写驳回原因！");
                    return false;
                }
                if (result.code == "success") {
                    layer.msg("审核驳回！");
                    document.getElementById("all").checked = false;
                    information();
                } else if (result.code == "over_power") {
                    layer.msg(result.var);
                } else {
                    layer.msg(result.var)
                }
            },
            error: function (result) {
                layer.alert("请求失败,重新试试!", {
                    skin: 'layui-layer-molv',
                    closeBtn: 0,
                    anim: 4,
                    btnAlign: 'c'
                });
            }
        })

        name_array = [];
    });
};
// 一键指派
function assigned() {
    name_array = [];
    username = [];
    ss = [];
    var input_checkbox = $("input[type='checkbox']");
    for (var i = 1; i < input_checkbox.length; i++) {
        if (input_checkbox[i].checked == true) {
            name_array.push(input_checkbox[i].getAttribute("data-name"));
        }
    }
    var audit_name = name_array.join(",");
    var assigned = "<ul class=\"form_sub_release\" style='padding: 15px;'><li><label><i style='color:red'>*</i>指派人：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"\" id=\"userphone\" style='margin-bottom: 10px;width: 80%;display: inline-block;height: 25px;'><select id=\"people\" class=\"remove_disabled\"><option value='1'>后台用户</option></select>" +
        "<select  id='province' onchange=\"user_query(this)\"></select><select id='city_two' class=\"remove_disabled\" onchange=\"user_query(this)\"></select><select id='village' class=\"remove_disabled\" ></select></li><div id='user_query'></div></ul>"


    layer.confirm(assigned, {
        btn: ['确定', '取消'],
        skin: 'layui-layer-molv',
        title: '指派',
        area: ['600px', '400px;'],
        btnAlign: 'c'
    }, function () {
        var region = $("#province").val();
        $("#city_two").val() == '' || $("#city_two").val() == undefined ? region = $("#province").val() : $("#village").val() == '' || $("#village").val() == undefined ? region = $("#city_two").val() : region = $("#village").val();
        var userphone = $("#userphone").attr("data-name");
        sendAjax({
            "url": "fire/news/NewsToAssign",
            "data": {
                "id": audit_name,
                "region": region,
                "to_name": userphone
            },
            "callback": function (result) {
                if (result.code == "s_ok") {

                    layer.msg("指派成功！");
                    document.getElementById("all").checked = false;
                    information();
                } else if (result.code == "no_power") {
                    layer.msg(result.var);
                } else {
                    layer.msg(result.var)
                }
            },
            error: function (result) {
                layer.alert("请求失败,重新试试!", {
                    skin: 'layui-layer-molv',
                    closeBtn: 0,
                    anim: 4,
                    btnAlign: 'c'
                });
            }
        })
    }, function () {
        name_array = [];
    });

    var all_citys = localStorage.getItem('Public_city');
    $('#province').html(all_citys);


    user_query();
}
// 跳转新闻详情
function article(fireid) {
    sendAjax({
        "url": "fire/news/getNewsById",
        "data": {
            "id": fireid
        },
        "callback": function (result) {
            if (result.code == "s_ok") {
                var result = result.var;
                $("#editor_two h2").html(result.title);
                $("#editor_two .author span").html(result.author);
                $(".content_article").load(Public_address + "uploads/" + result.url);
                $("#article").show();
                $("#editor").hide();
                $(".container_box").hide();
                $("#index_titel").html("新闻详情");
            } else {
                layer.msg(result.var);
            }
        }
    })
};
// 返回新闻管理类别
function report_index_fh() {
    $(".container_box").show();
    $("#editor").hide();
    $("#article").hide();
    $("#index_titel").html("新闻管理");
};
//删除
function delete_data(fireid) {
    layer.confirm('确定要删除吗？', {
        btn: ['确定', '取消'],
        skin: 'layui-layer-molv',
        title: '提示',
        btnAlign: 'c'
    }, function () {
        sendAjax({
            "url": "fire/news/deleteNews",
            "data": {
                "id": fireid
            },
            "callback": function (result) {
                if (result.code == "s_ok") {
                    layer.closeAll('page');
                    layer.msg('删除成功');
                    information();
                } else {
                    layer.msg(result.msg);
                }
            }
        })
    })
}
//编辑
function edit_data(fireid) {
    imgName = [];
    isDel = false;
    var resultOne = "";
    sendAjax({
        "url": "fire/news/getNewsById",
        "data": {
            "id": fireid
        },
        "callback": function (result) {
            resultOne = result;
            if (result.code == "s_ok") {
                if (result.var.images.length > 0) {
                    var add_resources = "<ul class=\"form_sub form_sub_release\" style=\"width:750px\"><li><label><i style='color:red'>*</i>区域：</label>" +
                        "<select disabled id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select>" +
                        "<select disabled id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select>" +
                        "<select disabled id=\"village\" class=\"remove_disabled\"></select>" +
                        "<label><i style='color:red'>*</i>新闻类型：</label><select id='newstype' class='remove_disabled' value=\"" + result.var.news_type + "\"><option value='0'>防火动态</option><option value='1'>当前火情</option><option value='2'>火险预报</option><option value='3'>经验交流</option></select></li>" +
                        "<li><label><i style='color:red'>*</i>新闻来源：</label><input type=\"text\" class=\"form-control form-boxed\"  value=\"" + result.var.source + "\" id=\"userOrigin\"></li>" +
                        "<li><label><i style='color:red'>*</i>新闻标题：</label><input type=\"text\" class=\"form-control form-boxed\"  value=\"" + result.var.title + "\" id=\"usertitle\"></li>" +
                        "<li><label><i style='color:red'>*</i>作者：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"" + result.var.author + "\" id=\"author\"></li>" +
                        "<li><label>微缩图：</label>"+
                        "<input type=\"file\" id=\"phouserphone1\" class=\"upFileBtn\"/>" +
                        "<a class=\"fileInput\">微缩图</a><span id=\"imgBox\"><img class=\"up-section\" src=\"" + Public_address + 'uploads/' + result.var.images[0].path + "\"></img></span></li>" +
                        "<li style='height: 370px;overflow: auto;'><label><i style='color:red'>*</i>新闻内容：</label><textarea id=\"edit\"></textarea></li><ul>"
                } else {
                    var add_resources = "<ul class=\"form_sub form_sub_release\" style=\"width:750px\"><li><label><i style='color:red'>*</i>区域：</label>" +
                        "<select disabled id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select>" +
                        "<select disabled id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select>" +
                        "<select disabled id=\"village\" class=\"remove_disabled\"></select>" +
                        "<label><i style='color:red'>*</i>新闻类型：</label><select id='newstype' class='remove_disabled' value=\"" + result.var.news_type + "\"><option value='0'>防火动态</option><option value='1'>当前火情</option><option value='2'>火险预报</option><option value='3'>经验交流</option></select></li>" +
                        "<li><label><i style='color:red'>*</i>新闻来源：</label><input type=\"text\" class=\"form-control form-boxed\"  value=\"" + result.var.source + "\" id=\"userOrigin\"></li>" +
                        "<li><label><i style='color:red'>*</i>新闻标题：</label><input type=\"text\" class=\"form-control form-boxed\"  value=\"" + result.var.title + "\" id=\"usertitle\"></li>" +
                        "<li><label><i style='color:red'>*</i>作者：</label><input type=\"text\" class=\"form-control form-boxed\" value=\"" + result.var.author + "\" id=\"author\"></li>" +
                        "<li><label>微缩图：</label><input type=\"file\" id=\"phouserphone1\" class=\"upFileBtn\"/>" +
                        "<a class=\"fileInput\">微缩图</a><span id=\"imgBox\"></span></li>" +
                        "<li style='height: 370px;overflow: auto;'><label><i style='color:red'>*</i>新闻内容：</label><textarea id=\"edit\"></textarea></li><ul>"
                }

                layer.confirm(add_resources, {
                    type: 1,
                    skin: 'layui-layer-molv', //样式类名
                    closeBtn: 1, //关闭按钮
                    anim: 2,
                    btn: ['发布', '取消'],
                    btnAlign: 'c',
                    area: ['800px', '670px;'],
                    title: "编辑新闻",
                    shadeClose: true, //开启遮罩关闭
                }, function () {
                    layer.msg('正在发布中', {
                        icon: 16,
                        shade: 0.01,
                        time: false
                    });
                    var region = $("#province").val();
                    $("#city_two").val() == '' || $("#city_two").val() == undefined ? region = $("#province").val() : $("#village").val() == '' || $("#village").val() == undefined ? region = $("#city_two").val() : region = $("#village").val();
                    var publishName = sessionStorage.getItem("uname");
                    var author = $('#author').val();
                    var origin = $('#userOrigin').val();
                    var title = $('#usertitle').val();
                    var content = $('#edit').val();
                    if (result.var.images.length>0) {
                        if (isDel) {
                            var images = imgName.join();
                        }else {
                            var images = result.var.images[0].id;
                        }
                    }else {
                        var images = imgName.join();
                    }
                    // var attchment = videoName.join();
                    var newsType = $('#newstype').val();
                    if (origin != '' && author != '' && content != '' && title != '' && newsType != '') {
                        sendAjax({
                            "url": "fire/news/editNews",
                            "data": {
                                "publishName": publishName,
                                "author": author,
                                "title": title,
                                "source": origin,
                                "content": content,
                                // "attchment": attchment,
                                "news_type": newsType,
                                "images": images,
                                "id": result.var.id,
                            },
                            "callback": function (data) {
                                layer.closeAll('dialog');
                                if (data.code == "s_ok") {
                                    layer.closeAll('page');
                                    layer.msg('发布成功');
                                    information();
                                } else {
                                    layer.msg('发布失败');
                                }
                            },
                            error: function (e) {
                                layer.msg("错误！！");
                            }
                        });
                    } else {
                        layer.closeAll('dialog');
                        layer.alert("请完善新闻发布信息", {
                            skin: 'layui-layer-molv',
                            title: '温馨提示',
                            closeBtn: 0,
                            anim: 4,
                            btnAlign: 'c'
                        });
                    }
                }, function () {});
            }
        }
    })

    var all_citys = localStorage.getItem('Public_city');
    $('#province').html(all_citys);

    $("#province option[value='" + (resultOne.var.region).substr(0, 4) + "']").prop("selected", "selected");
    callback((resultOne.var.region).substr(0, 4), $("#province"));
    $("#city_two option[value='" + (resultOne.var.region).substr(0, 6) + "']").prop("selected", "selected");
    callback((resultOne.var.region).substr(0, 6), $("#city_two"));
    $("#village option[value='" + (resultOne.var.region).substr(0, 9) + "']").prop("selected", "selected");

    $('#edit').val(resultOne.var.content);

    $('#edit').editable({
        imageUploadURL: 'fire/upload/imageUpload',
        inlineMode: false,
        language: "zh_cn",
        alwaysBlank: true
    })
    callback1();
    $("#phouserphone1").takungaeImgup({
        formData: {
            "path": "user_image",
            "file_ext": "image"
        },
        url: "fire/upload/fileUpload",
        id: "imgBox"
    });
    $("#phouserphone2").takungaevideoup({
        formData: {
            "path": "user_image",
            "file_ext": "image"
        },
        url: "fire/upload/fileUpload",
        id: "videoname"
    });
    //监听checkbox的value值 改变则执行下列操作
    $("#qx_yh input").change(function () {
        if ($(this).prop("checked")) {
            $(this).val(1);
            sum2 = '';
            $("#qx_yh input").each(function () {
                sum2 += $(this).val();
            });
        } else {
            $(this).val(0);
            sum2 = '';
            $("#qx_yh input").each(function () {
                sum2 += $(this).val();
            });
        }
    });

    // 判断密码是否一致
    $("#userpwd1").blur(function () {
        if ($("#userpwd").val() == $("#userpwd1").val()) {
            $("#userpwd1").removeAttr("style");
        } else {
            $("#userpwd1").css("border-color", "red");
            layer.msg('密码输入不一致');
        }
    });
    var isFser = true;
    $(".form_sub_release i").click(function () {
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
}

// 搜索用户查询
function user_query(e, id, price) {
    if (id == undefined) {
        id = $("#people").val();
    }
    var region = $("#province").val();
    $("#city_two").val() == '' || $("#city_sx").val() == undefined ? region = $("#province").val() : $("#village").val() == '' || $("#village").val() == undefined ? region = $("#city_two").val() : region = $("#village").val();
    var dom = $(e).next();
    sendAjax({
        "url": "fire/region/getRegion",
        "data": {
            "parentId": region
        },
        "callback": function (data) {
            if (price != undefined) {
                // $(dom).next().children('option').remove();
            } else {
                $(dom).children('option').remove();
                $(dom).next("#village").children('option').remove();
                $(dom).append("<option></option>");
                if (data.code == "s_ok") {
                    $.each(data.var, function (i, element) {
                        var op = $("<option></option>").attr({
                            'value': element.id,
                        }).html(element.name);
                        $(dom).append(op);
                    });
                }
            }
        },
        error: function (e) {
            layer.msg("错误！！");
        }
    });
    sendAjax({
        "url": "fire/user/getUserByNameOrTel",
        "data": {
            "mold_type": id,
            "region": region
        },
        "callback": function (data) {
            if (data.code == "s_ok") {
                $("#user_query").children('span').remove();
                if (price != undefined) {
                    $("#userphone").attr("data-name", '');
                    $("#user_query").append("<span onclick=\"selected(this)\" data-name=\"43\">全部人</span>");
                } else {
                    $("#userphone").attr("data-name", '');
                    $("#user_query").append("<span onclick=\"selected(this)\" data-name=\"" + region + "\">全部人</span>");
                }
                if (data.var.length > 0) {
                    for (var i = 0; i < data.var.length; i++) {
                        $("#user_query").append("<span onclick=\"selected(this)\" data-name=\"" + data.var[i].tel + "\">" + data.var[i].name + "</span>");
                    }
                }
            } else if (data.var.length == 0) {
                layer.msg('查询数据为空');
                $("#user_query").children('span').remove();
            } else {
                layer.msg('查询失败');
            }
        }
    });
}