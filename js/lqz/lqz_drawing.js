// 全选
var name_array = [];
function chk() {
    var all = document.getElementById("all");
    var mychk = document.getElementsByName("check_name");
    if (all.checked == true) {
        name_array = [];
        if (mychk.length) {
            for (var i = 0; i < mychk.length; i++) {
                mychk[i].checked = true;
            }
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
//单选按钮
function checkByOne(e) {
    var mychk = document.getElementsByName("check_name");
    console.log(mychk);
    if (e.checked == false) {
        $("#all").prop('checked', false);
    }else {
        var count = $("input[name='check_name']:checkbox:checked").length;
        if (count == $("input[name='check_name']:checkbox").length) {
            $("#all").prop('checked', true);
        }
    }
};
callback1();
// 审核信息列表
information();
function information(e) {
    var region = $("#hot_city").val();
	$("#city_sx").val()==''||$("#city_sx").val()==undefined?region=$("#hot_city").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_sx").val():region=$("#area").val();
    var apply_tel = $('.user_name').val();
    var start_time=$("#start_time").val();
    var end_time=$("#end_time").val();
    // 未审核
    sendAjax({
		"url":"fire/level/findLevelByCondition",
		"data":{"current_page":1,"region":region,"per_page":20,"status":0,"apply_tel":apply_tel,"start_time":start_time,"end_time":end_time},
        "callback":function(result){
            if (result.code=="s_ok") {
                var num='';
				if (result.var.data.length<1) {
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
                            $("#complete_track").html('');
                            sendAjax({
                                "url":"fire/level/findLevelByCondition",
                                "data":{"current_page":p,"region":region,"per_page":20,"status":0,"apply_tel":apply_tel,"start_time":start_time,"end_time":end_time},
                                "callback":function(result){
                                    if(result.code=='s_ok'){
                                        var result = result.var.data;
                                        for (var i = 0; i < result.length; i++) {
                                            $("#complete_report2").append(
                                                "<tr><td><input type=\"checkbox\" name=\"check_name\" onclick=\"checkByOne(e)\" data-name=\"" + result[i].id + "\"></td><td>" + result[i].apply_name + "</td><td>" + result[i].region_name + "</td><td>" + result[i].apply_reason + "</td><td>" + result[i].apply_start_time + "——" + result[i].apply_end_time + "</td><td><a class='mr-5' onclick='report_index("+result[i].id+")'>详情</a></td></tr>"
                                            );
                                        }
                                    }else{
                                        layer.msg(result.var);
                                    }

                                }
                            })

                        }
                    });
                    for (var i = 0; i < result.length; i++) {
                        $("#complete_report2").append(
                            "<tr><td><input type=\"checkbox\" name=\"check_name\" onclick=\"checkByOne(e)\" data-name=\"" + result[i].id + "\"></td><td>" + result[i].apply_name + "</td><td>" + result[i].region_name + "</td><td>" + result[i].apply_reason + "</td><td>" + result[i].apply_start_time + "——" + result[i].apply_end_time + "</td><td><a class='mr-5' onclick='report_index("+result[i].id+")'>详情</a></td></tr>"
                        );
                    };
                }
			}else{
				layer.msg(result.var);
			}
        },
        error: function(result) {
            layer.msg(result.var);
        }
    });
    // 已审核
    sendAjax({
		"url":"fire/level/findLevelByCondition",
		"data":{"current_page":1,"region":region,"per_page":20,"status":1,"apply_tel":apply_tel,"start_time":start_time,"end_time":end_time},
        "callback":function(result){
            if (result.code=="s_ok") {
                var num = '';
                //总条数
                if (result.var.total == 0) {
                    $(".track_total").html(0);
                    $("#complete_track").html('');
                    num = 1;
                } else {
                    $("#complete_track").html('');
                    $(".track_total").html(result.var.total);
                    num = result.var.total;
                    var result = result.var.data;
                    //分页
                    $(".track_page").createPage({
                        pageCount: Math.ceil(num / 20),
                        current: 1,
                        backFn: function (p) {
                            sendAjax({
                                "url": "fire/level/findLevelByCondition",
                                "data": {
                                    "current_page": p,
                                    "region": region,
                                    "per_page": 20,
                                    "status": 1,
                                    "apply_tel": apply_tel,
                                    "start_time": start_time,
                                    "end_time": end_time
                                }, "callback": function (result) {
                                    if(result.code=='s_ok'){
                                        $("#complete_track").html('');
                                        var result = result.data;
                                        for (var i = 0; i < result.length; i++) {
                                            $("#complete_track").append(
                                                "<tr><td>" + result[i].apply_name + "</td><td>" + result[i].region_name + "</td><td>" + result[i].apply_reason + "</td><td>" + result[i].apply_start_time + "——" + result[i].apply_end_time + "</td><td>" + result[i].appr_time + "</td><td>" + result[i].appr_name + "</td><td><a class='mr-5' onclick='report_index(" + result[i].id + ")'>详情</a></td></tr>"
                                            );
                                        }
                                    }else{
                                        layer.msg(result.var);
                                    }

                                }
                            })
                        }
                    });
                    for (var i = 0; i < result.length; i++) {
                        $("#complete_track").append(
                            "<tr><td>" + result[i].apply_name + "</td><td>" + result[i].region_name + "</td><td>" + result[i].apply_reason + "</td><td>" + result[i].apply_start_time + "——" + result[i].apply_end_time + "</td><td>" + result[i].appr_time + "</td><td>" + result[i].appr_name + "</td><td><a class='mr-5' onclick='report_index(" + result[i].id + ")'>详情</a></td></tr>"
                        );
                    }
                }
            }else{
                layer.msg(result.var);
            }

        },
        error: function(result) {
            layer.msg(result.var);
        }
    });
    //已拒绝  "status":-1
    sendAjax({
        "url":"fire/level/findLevelByCondition",
        "data":{"current_page":1,"region":region,"per_page":20,"status":-1,"apply_tel":apply_tel,"start_time":start_time,"end_time":end_time},
        "callback":function(result){
            if (result.code=="s_ok") {
                var num = '';
                //总条数
                if (result.var.total == 0) {
                    $(".track_total2").html(0);
                    $("#complete_track3").html('');
                    num = 1;
                } else {
                    $("#complete_track3").html('');
                    $(".track_total2").html(result.var.total);
                    num = result.var.total;
                    var result = result.var.data;
                    //分页
                    $(".track_page").createPage({
                        pageCount: Math.ceil(num / 20),
                        current: 1,
                        backFn: function (p) {
                            sendAjax({
                                "url": "fire/level/findLevelByCondition",
                                "data": {
                                    "current_page": p,
                                    "region": region,
                                    "per_page": 20,
                                    "status": 1,
                                    "apply_tel": apply_tel,
                                    "start_time": start_time,
                                    "end_time": end_time
                                }, "callback": function (result) {
                                    if(result.code=='s_ok'){
                                        $("#complete_track3").html('');
                                        var result = result.data;
                                        for (var i = 0; i < result.length; i++) {
                                            $("#complete_track3").append(
                                                "<tr><td>" + result[i].apply_name + "</td><td>" + result[i].apply_tel+"</td><td>"+ result[i].region_name + "</td><td>" + result[i].apply_reason + "</td><td>" + result[i].apply_start_time + "——" + result[i].apply_end_time + "</td><td>" + result[i].rebut_reason + "</td><td>" + result[i].appr_name +"</td><td>"+result[i].appr_time+ "</td><td><a class='mr-5' onclick='report_index(" + result[i].id + ")'>详情</a></td></tr>"
                                            );
                                        }
                                    }else{
                                        layer.msg(result.var);
                                    }

                                }
                            })
                        }
                    });
                    for (var i = 0; i < result.length; i++) {
                        $("#complete_track3").append(
                            "<tr><td>" + result[i].apply_name + "</td><td>" +result[i].apply_tel+"</td><td>"+ result[i].region_name + "</td><td>" + result[i].apply_reason + "</td><td>" + result[i].apply_start_time + "——" + result[i].apply_end_time + "</td><td>" + result[i].rebut_reason +"</td><td>" + result[i].appr_name +"</td><td>"+result[i].appr_time+ "</td><td><a class='mr-5' onclick='report_index(" + result[i].id + ")'>详情</a></td></tr>"
                        );
                    }
                }
            }else{
                layer.msg(result.var);
            }


        },
        error: function(result) {
            layer.msg(result.var);
        }
    })
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
    var audit_name = name_array;
    // console.log(typeof audit_name);
    layer.confirm("已经提交请假申请，是否批准?", {
        btn: ['同意', '拒绝'],
        skin: 'layui-layer-molv',
        title: '审核批准',
        btnAlign: 'c'
    }, function() {
        sendAjax({
            "url":"fire/level/examineLevel",
            "data":{"id[]":audit_name,"status":"1"},
            "callback":function(result){
                if (result.code == "s_ok") {
                    layer.msg("审核批准成功！");
                    document.getElementById("all").checked = false;
                    information();
                } else {
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
    }, function() {
        var audit=`驳回原因：<input type="text" class="form-control form-boxed" value='' id="rebutReason" style='margin: 10px auto;width: 90%;'>`
        layer.confirm(audit, {
            btn: ['确定', '取消'],
            skin: 'layui-layer-molv',
            title: '驳回',
            btnAlign: 'c'
        }, function() {
            var rebutReson=$("#rebutReason").val();
            sendAjax({
                "url":"fire/level/examineLevel",
                "data":{"id[]":audit_name,"status":"-1","rebut_reason":rebutReson},"callback":function(result){
                    
                    if (result.code == "s_ok") {
                        layer.msg("审核驳回成功！");
                        document.getElementById("all").checked = false;
                        information();
                    } else {
                        layer.msg(result.var)
                    }
                },
                error: function() {
                    layer.alert("请求失败,重新试试!", {
                        skin: 'layui-layer-molv',
                        closeBtn: 0,
                        anim: 4,
                        btnAlign: 'c'
                    });
                }
            })
        }, function() {
            name_array = [];
        });
    });
};
//详情
function report_index(id) {
    sendAjax({
		"url":"fire/level/getLevelById",
		"data":{"id":id},
        "callback":function(result){
            if (result.code=="s_ok") {
                var result=result.var;
                if(result.appr_uid==''){
                   result.appr_name='';
                }
                var add_resources ="<ul class=\"form_sub form_sub_release\" style=\"width:568px\"><li><label>请假人</label><input type=\"text\" class=\"form-control form-boxed \" readonly value=\""+result.apply_name+"\"><label>区域</label><input type=\"text\" class=\"form-control form-boxed \" readonly value=\""+result.region_name+"\"></li><li><label>请假时间</label><input type=\"text\" readonly class=\"form-control form-boxed\" value=\""+result.apply_start_time+" —— "+result.apply_end_time+"\" style='width:404px'></li><li><label>批准时间</label><input type=\"text\" readonly class=\"form-control form-boxed\" value=\""+result.appr_time+"\"><label>审批人</label><input type=\"text\" readonly class=\"form-control form-boxed\" value=\""+result.appr_name+"\"></li><li><label>请假说明</label><textarea class=\"form-control form-boxed remove_disabled\" readonly>"+result.apply_reason+"</textarea></li></ul>"
                layer.alert(''+add_resources+'', {
                    type: 1,
                    closeBtn: 1, //关闭按钮
                    anim: 2,
                    skin: 'layui-layer-molv', 
                    btnAlign: 'c',
                    area: ['600px', '300px;'],
                    title:'请假详情',
                    shadeClose: true, //开启遮罩关闭
                });
            }else{
                layer.msg(result.var);
            }
        },error:function(result){
            layer.msg(result.var);
        }
    });
}
