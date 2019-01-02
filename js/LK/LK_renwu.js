var infoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(16, -25) //窗体位置的偏移量
  });
  //创建地图
  var map = new AMap.Map("LK_Map", {
    resizeEnable: true,
    zoom: 10
  });
  var type= new AMap.MapType({
    defaultType:1,
    showRoad:true
  });
  map.addControl(type);
  //地图表格切换
  $("#qhwz").click(function() {
    if ($(this).find("span").html() == "切换成列表模式") {
        $(".Lk_tab").css("display", "block");
        $("#LK_Map").css("display", "none");
        $(".button-group").hide();
        $(".renwu").css("position","relative").css("top","0");
        $(this).find("span").html("切换成地图模式");
    } else {
        $(".renwu").css("position","absolute").css("top","110px");
        $(".Lk_tab").css("display", "none");
        $("#LK_Map").css("display", "block");
        $(".button-group").show();
        $(this).find("span").html("切换成列表模式");
    }
  });
  callback1();
  addBeiJing();
  //发布任务 弹框
  function confirm() {
    ss=[];username=[];ss_sx=[];username1=[];
    var confirm="<ul class='form_sub form_sub_release'><li><label>任务名称</label>" +
        "<input type=\"text\" class=\"form-control form-boxed\" disabled value='航空监测任务'" +
        "><label>任务类型</label><select class='remove_disabled' id='task_type' style='width:147px;'>" +
        "<option value='8'>森林火灾调查</option><option value='9'>林业有害生物</option>" +
        "<option value='10'>破坏森林资源调查</option><option value='11'>偷猎野生动物调查</option><option value='12'>空中喷洒</option></select></li>" +
        "<li><label>区域</label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\">" +
        "</select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select>" +
        "<select id=\"village\" class=\"remove_disabled\" ></select><label>地图位置<i style='color:red'>*</i></label>" +
        "<input type=\"text\" class=\"form-control form-boxed\" id=\"latLngs2\" disabled>" +
        "<input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs2').val(localStorage.getItem('site'));}})\" /></li>" +
        "<li><label>发布人</label><input type='text' id='taskAddName' class=\"form-control form-boxed\" disabled value=\"\">" +
        "<label>任务截止时间<i style='color:red'>*</i></label>" +
        "<input type=\"text\" id=\"creactTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'%y-%M-%d {%H+1}:%m:%s'})\" class=\"Wdate remove_disabled form-control\" style=\"width:180px\" name=\"creactTime\" /></li>" +
        "<li style=\"position:relative;\"><label>指派对象<i style='color:red'>*</i></label><label class=\"radio\"><input type=\"radio\" value=\"search\" name=\"screening\" checked=\"checked\"/><span>搜索</span></label>" +
        "<label class=\"radio\"><input type=\"radio\" value=\"screening\" name=\"screening\"/><span>筛选</span></label><input id='toName' class='form-control form-boxed toName1' value='' onfocus='setStyle()'><div class=\"screening\"><select id=\"people\" class=\"remove_disabled\" onchange=\"user_query(this,value,value)\">" +
        "<option value='4'>无人机</option><option value='5'>载人机</option></select><select  id=\"hot_city\" onchange=\"user_query(this)\">" +
        "</select>" +
        "<select  id=\"city_sx\" class='remove_disabled' onchange=\"user_query(this)\"></select>" +
        "<select id=\"area_sx\" class=\"remove_disabled\"></select></div><div id=\"user_query\">" +
        "</div><div id=\"user_query1\"></div></li><li><label>任务描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\"></textarea></li>" +
        "<li id=\"upimg\" style=\"width: 590px;\"><label>图片上传</label><input type=\"file\" name=\"photoName1\" id=\"photoName1\" class=\"upFileimg\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"/><img class=\"fileInput\" src=\"img/lqz/sc.png\" onclick=\"$('#photoName1').click()\"/><div id=\"imgBox11\"></div></li></ul>";
 // var confirm="<ul class='form_sub form_sub_release'><li><label>任务名称</label>" +
 //        "<input type=\"text\" class=\"form-control form-boxed\" disabled value='航空监测任务'" +
 //        "><label>任务类型</label><select class='remove_disabled' id='task_type' style='width:147px;'>" +
 //        "<option value='8'>森林火灾调查</option><option value='9'>林业有害生物</option>" +
 //        "<option value='10'>破坏森林资源调查</option><option value='11'>偷猎野生动物调查</option><option value='12'>空中喷洒</option></select></li>" +
 //        "<li><label>区域</label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\">" +
 //        "<option value=''>城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option>" +
 //        "<option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option>" +
 //        "<option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option>" +
 //        "<option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option>" +
 //        "<option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option>" +
 //        "</select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select>" +
 //        "<select id=\"village\" class=\"remove_disabled\" ></select><label>地图位置<i style='color:red'>*</i></label>" +
 //        "<input type=\"text\" class=\"form-control form-boxed\" id=\"latLngs2\" disabled>" +
 //        "<input class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs2').val(localStorage.getItem('site'));}})\" /></li>" +
 //        "<li><label>发布人</label><input type='text' id='taskAddName' class=\"form-control form-boxed\" disabled value=\"\">" +
 //        "<label>任务截止时间<i style='color:red'>*</i></label>" +
 //        "<input type=\"text\" id=\"creactTime\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',minDate:'%y-%M-%d {%H+1}:%m:%s'})\" class=\"Wdate remove_disabled form-control\" style=\"width:180px\" name=\"creactTime\" /></li>" +
 //        "<li style=\"position:relative;\"><label>指派对象<i style='color:red'>*</i></label><label class=\"radio\"><input type=\"radio\" value=\"search\" name=\"screening\" checked=\"checked\"/><span>搜索</span></label>" +
 //        "<label class=\"radio\"><input type=\"radio\" value=\"screening\" name=\"screening\"/><span>筛选</span></label><input id='toName' class='form-control form-boxed toName1' value='' onfocus='setStyle()'><div class=\"screening\"><select id=\"people\" class=\"remove_disabled\" onchange=\"user_query(this,value,value)\">" +
 //        "<option value='4'>无人机</option><option value='5'>载人机</option></select><select  id=\"hot_city\" onchange=\"user_query(this)\"><option value='43'>省</option>" +
 //        "<option value=\"4301\">长沙市</option><option value=\"4302\" >株洲市</option><option value=\"4303\">湘潭市</option>" +
 //        "<option value=\"4304\">衡阳市</option><option value=\"4305\">邵阳市</option><option value=\"4306\">岳阳市</option>" +
 //        "<option value=\"4307\">常德市</option><option value=\"4308\">张家界市</option><option value=\"4309\">益阳市</option>" +
 //        "<option value=\"4311\">永州市</option><option value=\"4310\">郴州市</option><option value=\"4312\">怀化市</option>" +
 //        "<option value=\"4313\">娄底市</option><option value=\"4331\">湘西自治州</option></select>" +
 //        "<select  id=\"city_sx\" class='remove_disabled' onchange=\"user_query(this)\"></select>" +
 //        "<select id=\"area_sx\" class=\"remove_disabled\"></select></div><div id=\"user_query\">" +
 //        "</div><div id=\"user_query1\"></div></li><li><label>任务描述</label><textarea class=\"form-control form-boxed remove_disabled\" id=\"desc\"></textarea></li>" +
 //        "<li id=\"upimg\" style=\"width: 590px;\"><label>图片上传</label><input type=\"file\" name=\"photoName1\" id=\"photoName1\" class=\"upFileimg\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"/><img class=\"fileInput\" src=\"img/lqz/sc.png\" onclick=\"$('#photoName1').click()\"/><div id=\"imgBox11\"></div></li></ul>";
    layer.confirm(''+confirm+'', {
      type: 1,
      skin: 'layui-layer-molv', //样式类名
      closeBtn: 1, //关闭按钮
      anim: 2,
      btn: ['发布','取消'],
      btnAlign: 'c',
      area: ['650px','450px'],
      title:"发布任务",
      shadeClose: true, //开启遮罩关闭
    }, function(){
      layer.msg('正在发布中', {
        icon: 16,shade: 0.01,time:false
      });
      var task_type=$('#task_type').val();
      var task_end_time=$('#creactTime').val();
      // var task_region=$("#province").val();
      var task_region=$("#city_two").val()==''||$("#city_two").val()==undefined?$("#province").val():($("#village").val()==''||$("#village").val()==undefined?$("#city_two").val():$("#village").val());
      var to_name=$('#toName').attr("data-name");
      if (to_name==undefined||to_name=='') {to_name=$('#toName').val();}
      var task_latlng=$('#latLngs2').val();
      var task_title="航空监测任务";
      var desc=$("#desc").val();   //任务描叙
        var arry=[];
        if(imgName.length>0){
            for(var i=0;i<imgName.length;i++){
                if(String(imgName[i]).indexOf(",") != -1){
                    //含有，号时候----即imgName[i]="180,181"
                    var arry1=imgName[i].split(',');
                    arry=arry.concat(arry1);
                }else{
                    arry.push(imgName[i]);
                }
            }
        }
        var image=arry;


      var task_result_image=image;
      var pointType='0';
      var task_obj=$('#people').val();


      if (toName!=''&& toName != null&&task_region!=''&&task_end_time!=''){
        sendAjax({
          "url":"fire/task/addTask",
          "data":{"task_type":task_type,"task_end_time":task_end_time,
              "task_region":task_region,"task_latlng":task_latlng,
              "to_name":to_name,"task_title":task_title,"pointType":pointType,
              "task_images":task_result_image,"task_obj":task_obj,
              'task_desc':desc},
          "callback":function(data){
            if (data.code=="s_ok") {
              layer.closeAll('dialog');
              layer.closeAll('page');
              // user_query();
              layer.msg('发布成功');
              zdzx();
              imgName=[];
            }else{
              layer.msg(data.var);imgName=[];
            }
          }
        });
        infoWindow.close();
      }else{
        layer.alert("请完善发布任务信息", {
          skin: 'layui-layer-molv',
          title:'温馨提示',
          closeBtn: 0,anim: 4,btnAlign: 'c'
        });
      }
    }, function(){
      layer.closeAll('page');
    });



     var proBySet= localStorage.getItem('Public_city');
     var allBySet= localStorage.getItem('all_city');
     $('#province').html(allBySet);
     $('#hot_city').html(proBySet);

    $("#photoName1").takungaeImgup({
      formData: {
          "path": "task_image",
          "file_ext":"image"
      },
      url:"fire/upload/fileUpload",
      id:"imgBox11"
    });
    var name =sessionStorage.getItem("name");
    $("#taskAddName").val(name);
    $("body").find(".upFileimg").click(function(e){
      $("#user_query").hide();
      $(".screening").hide();
    })
  };
  // 搜索用户查询
  function user_query(e,id,price) {
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
          }else{
              layer.msg(data.var);
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
          $("#user_query").children('span').remove();
          if (price!=undefined) {
            $("#toName").attr("data-name",'');
            $("#user_query").append("<span onclick=\"selected(this)\" data-name=\"43\">全部人</span>");
          }else{
            $("#toName").attr("data-name",'');
            $("#user_query").append("<span onclick=\"selected(this)\" data-name=\""+region+"\">全部人</span>");
          }
          for (var i = 0; i < data.var.length; i++) {
            $("#user_query").append("<span onclick=\"selected(this)\" data-name=\""+data.var[i].tel+"\">" + data.var[i].name + "</span>");
          }
        }else if (data.var.length==0){
          layer.msg('查询数据为空');
          $("#user_query").children('span').remove();
        }else{
          layer.msg(data.var);
        }
      }
    });
  }
  $("body").on('keyup', '.toName1', function() {
    var key = $("#toName").val();
    if (key != "") {
      sendAjax({
      "url":"fire/user/getUserByNameOrTel",
      "data":{"name":key},"callback":function(data){
          if(data.code=='s_ok'){
              if(data.var.length<1){
                  $("#user_query1").children('span').remove();
                  $("#user_query1").hide();
              }else{
                  $("#user_query1").children('span').remove();
                  $("#user_query1").show();
                  for (var i = 0; i < data.var.length; i++) {
                      $("#user_query1").append("<span onclick=\"selected_two(this)\" data-name=\"" + data.var[i].tel + "\">" + data.var[i].name + "</span>");
                  }
              }
          }else{
              layer.msg(data.var);
          }
      }
      });
    }else{
      $("#userName").attr("data-name", '');
    }
  });
  // 聚焦显示
function setStyle() {
  if($("input[value='screening']:checked").length>0){
    $(".screening").show();
    $("#user_query").show();
  }
}
  // 点击选中指派对象
  var ss=[];var username=[];
  function selected(e) {
    if ($(e).html() == "全部人") {
      username = [];
      ss = [];
    //   $("#toName").attr("data-name",'');
      $("#toName").val("");
      $("#toName").val("全部人");
      $("#user_query").empty();
    }
    //存在的时候不添加，不存在的时候添加
    if(ss.indexOf($(e).html())==-1){
        ss.push($(e).attr("data-name"));
    }

    var sss=ss.join(",");
    $("#toName").val(sss);
    console.log($("#toName").val());
    // $(e).remove();
    username.push($(e).attr("data-name"));
    var dataname=username.join(",");
    $("#toName").attr("data-name",dataname);
    $(".screening").hide();
    $("#user_query").hide();
  };
  var ss_sx=[];var username1=[];
  function selected_two(e) {
    $("#user_query1").hide();
      if(ss_sx.indexOf($(e).html())==-1){
          ss_sx.push($(e).attr("data-name"));
      }
    var sss_sx=ss_sx.join(",");
    username1.push($(e).attr("data-name"));
    $("#toName").val(sss_sx);
    $("#toName").attr("data-name",username1);
    // $(e).remove();
    username1=[];ss_sx=[];
  };
  // 筛选搜索切换
  $("body").on('click', 'input[type="radio"]', function() {
    if ($(this).val() != "screening") {
        $(".screening").hide();
        $("#user_query").hide();
        $("#user_query1").show();
        $("#toName").val("");
        $("#toName").removeAttr("data-name");
        ss_sx = [];
        $("#toName").addClass("toName1");
    } else {
        $(".screening").show();
        $("#user_query").show();
        $("#user_query1").hide();
        $("#toName").val("");
        $("#toName").removeAttr("data-name");
        ss = [];
        username = [];
        $("#toName").removeClass("toName1");
    }
  });
  
  // 发布任务 关闭
  $('.gb').click(function() {
    $("#fb_a").css("display", "none");
    $("#fb_b").css("display", "none")
  });
  //详情弹框
  $('.mr-5').click(function() {
    $("#fb_b").css("display", "block")
  });
  //取消
  $('.shanchu').click(function() {
  $(".tanchu").css("display", "block")
  });
  $('.tanchu_qx').click(function() {
    $(".tanchu").css("display", "none")
  });
  //详情
  function toCenter(task_id,task_status) {
    sendAjax({
        "url":"fire/task/getTaskById",
        "data":{"task_id":task_id},"callback":function(data){
            sessionStorage.setItem("hot_id", data.var.hot_id);
            var result=data.var;
            //状态处理
            var bt = [];
            var bn = '';
            var mian = [];
            switch (task_status) {
                case 0:
                    bt = ['接受/拒绝', '取消'];
                    mian = ['700px', '530px;'];
                    bn = function() {
                        layer.confirm('您将接受/拒绝此任务，是否确认', {
                            skin: 'layui-layer-molv',
                            title: '温馨提示',
                            btnAlign: 'c',
                            area: ['550px', '160px'], //宽高
                            time: 30000, //20s后自动关闭
                            btn: ['确认','拒绝','取消'],
                        },function () {
                            //接受任务
                            sendAjax({
                                "url":"fire/task/acceptTask",
                                "data":{"task_id":task_id},
                                "callback":function(data){
                                    if (data.code == 's_ok') {
                                        layer.msg('接受成功', {
                                            icon: 1,
                                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                        }, function() {
                                            layer.closeAll('page');
                                            $("#dmrw_tbody").html('');
                                            zdzx();
                                        });
                                    } else {
                                        layer.msg(data.var);
                                    }
                                },
                                error: function(err) {
                                    layer.msg(data.var);
                                }
                            })
                        },function () {
                            //拒绝任务
                            layer.confirm('您将拒绝此任务，请填写拒绝理由', {
                                skin: 'layui-layer-molv',
                                title: '温馨提示',
                                btnAlign: 'c',
                                area: ['550px', '160px'], //宽高
                                time: 30000, //20s后自动关闭
                                btn: ['确认','取消'],
                                content:"<div style=\"margin:30px 0 0 30px;\"><label>拒绝理由：</label><input id=\"delInput\" style=\"width: 280px;\" /></div>"
                            },function () {
                                //提交拒绝理由
                                var refuse=$('#delInput').val();
                                sendAjax({
                                    "url":"fire/task/refuseTask",
                                    "data":{"task_id":task_id,'refuse_reason':refuse},
                                    "callback":function(data){
                                        if (data.code == 's_ok') {
                                            layer.msg('拒绝成功', {
                                                icon: 1,
                                                time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                            }, function() {
                                                layer.closeAll('page');
                                                $("#dmrw_tbody").html('');
                                                zdzx();
                                            });
                                        } else {
                                            layer.msg(data.var);
                                        }
                                    },
                                    error: function(err) {
                                        layer.msg(data.var);
                                    }
                                })
                            });
                        });
                    };
                    break;
                case 1:
                    //执行中
                    //如果是任务接受人就显示反馈按钮，如果不是的话
                    bt = ['去反馈', '取消'];
                    mian = ['600px', '530px;'];
                    bn = function() {
                        layer.open({
                            type: 1,
                            skin: 'layui-layer-molv', //样式类名
                            closeBtn: 1, //关闭按钮
                            anim: 2,
                            btn: ["完成", "取消"],
                            btn1: function() {
                                var task_result=$('input[name="payMethod"]:checked').val();
                                var task_result_image = imgName[0];
                                sendAjax({
                                      "url":"fire/task/feedBackTask",
                                      "data":{"task_id":task_id,"task_result_image":task_result_image,"task_result":task_result},
                                      "callback":function(data){
                                            if (data.code == 's_ok') {
                                                layer.msg('反馈成功', {
                                                    icon: 1,
                                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                                }, function() {
                                                    layer.closeAll('page');
                                                    $("#dmrw_tbody").html('');
                                                    zdzx();
                                                    if(data.var.task_result=="1"||data.var.task_result=="8"||data.var.task_result=="5"){
                                                        layer.confirm('是否前往火情信息上报火情？', {
                                                            btn: ['确定', '取消'],
                                                            skin: 'layui-layer-molv',
                                                            title: '温馨提示',
                                                            btnAlign: 'c'
                                                        }, function() {
                                                            layer.closeAll();
                                                            $("#index_main_context").load("lqz_fire_report.html");
                                                            $("#index_titel").html("火情上报");
                                                            //隐藏地图
                                                        }, function() {
  
                                                        });
                                                    }
                                                });
                                            } else{
                                                layer.msg(data.var, {
                                                    icon: 2,
                                                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                                                }, function() {
                                                    layer.closeAll('page');
                                                });
                                            }
                                        },
                                      error: function(err) {}
                                })
                            },
                            btn2: function() {},
                            btnAlign: 'c',
                            area: ['400px', '400px;'],
                            title: "反馈任务",
                            content: "<div style=\"margin:30px 0 0 30px;\"><table><tr style=\"display:block;\"><span>完成内容</span><div style=\"display:inline-block;vertical-align:middle;width:80%\"><input type='radio' name='payMethod' value='0' checked />林火<input type='radio' name='payMethod' value='1'/>草原火<input type='radio' name='payMethod' value='2'/>计划烧除<input type='radio' name='payMethod' value='3'/>农用火<input type='radio' name='payMethod' value='4'/>炼山<input type='radio' name='payMethod' value='5'/>灌木火<input type='radio' name='payMethod' value='6'/>工矿用火<input type='radio' name='payMethod' value='7'/>其他<input type='radio' name='payMethod' value='8'/>境外火<input type='radio' name='payMethod' value='9'/>未找到<input type='radio' name='payMethod' value='10'/>核查中</div></td></tr><tr style=\"display:block;margin-top:20px;\"><td><span>任务图片</span><div style=\"margin-left:3px;width:60px;height:60px;border-radius:3px;border:1px dashed #dddee1;position: relative;display:inline-block;vertical-align: middle;text-align:center;\"><input id='imgel' style='width:60px;height:60px;left:0px;top:0px;position:absolute;opacity:0;z-index:1330;' type='file'><img style=\"margin-top:20px\"src='img/LK/tjtp.png'></div><ul id=\"lookimg\"style=\"display:inline-block;\"></ul></td></tr></table></div>",
                        });
                        $("#imgel").takungaeImgup({
                          formData: {
                              "path": "task_image",
                              "file_ext":"image"
                          },
                          url:"fire/upload/fileUpload",
                          id:"lookimg"
                        });
                    };
                    break;
                    //已完成
                case 2:
                    bt = ['关闭', '取消'];
                    bn = function(index, layero) { layer.close(index); };
                    mian = ['600px', '530px;'];
                    break;
                    //已取消
                case -1:
                    bt = ['关闭', '取消'];
                    bn = function(index, layero) { layer.close(index); };
                    mian = ['600px', '530px;'];
                    break;
                    //已过期
                case -2:
                    layer.closeAll();
                    layer.confirm('此任务已经过期，是否重新发布', {
                        skin: 'layui-layer-molv',
                        title: '温馨提示',
                        btnAlign: 'c',
                        btn: ['确认', '取消'],
                        btn1: function() {
                            confirm();
                        }
                    });
                    break;
            };
            //弹窗
            if (task_status != "-2") {
                if(task_status =='0' && result.task_status=='-3'){
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btn: bt,
                        btn1: bn,
                        btn2: function() {},
                        btnAlign: 'c',
                        area: mian,
                        title: "任务信息",
                        success: function() {
                            if (task_status == '0') {
                                $("#fktDom").remove();
                                $("#fknrDom").remove();
                                $("#wcsjDom").remove();
                            } else if (task_status == '1') {
                                $("#fktDom").remove();
                                $("#fknrDom").remove();
                                $("#wcsjDom").remove();
                            }
                        },
                        shadeClose: true, //开启遮罩关闭
                        content: `<ul class="form_sub form_sub_release"><li><label>任务名称：</label><input type="text" class="form-control form-boxed" disabled value="${result.task_title}"><label>任务类型：</label><input type="text" class="form-control form-boxed" disabled value="${rewutype.get(result.task_type)}"></li><li><label>任务区域：</label><input type="text" class="form-control form-boxed" readonly value="${result.region_name}" ><label>地图位置：</label><input type="text" class="form-control form-boxed"  value="${result.task_latlng}" readonly><button onclick="dthx(this)" id='${result.task_latlng}' style="margin-left:3px;width:65px;border-radius:3px;background:#01dacf;color:#fff;border:none;padding:3px;">进入地图</button></li><li><label>发布人：</label><input type="text" class="form-control form-boxed" disabled value="${result.add_name}"><label>指派对象：</label><input type="text" class="form-control form-boxed" disabled value="${result.to_name}" ></li><li><label>接受人：</label><input type="text" class="form-control form-boxed" disabled value="${result.recv_name}"><label>发布时间：</label><input type="text" class="form-control form-boxed" value="${result.task_add_time}" disabled></li><li><label>截止时间：</label><input type="text" class="form-control form-boxed" disabled value="${result.task_end_time}"><label>状态：</label><input type="text" class="form-control form-boxed" value="${rewuStatus.get(result.task_status)}" disabled></li>
                        <li><label>任务描述：</label><textarea class="form-control form-boxed remove_disabled" readonly style='width: 146px;'>${result.task_desc}</textarea>
                        <label>反馈内容：</label><textarea class="form-control form-boxed remove_disabled" disabled style='width: 146px;'>${feedback.get(result.task_result)}</textarea></li>
                        <li><label>拒绝理由：</label><input  value="${result.refuse_reason}" type="text" class="form-control form-boxed" disabled /></li> 
                        <li id="task_img"><label>任务图片</label></li>
                        <li id="upimg"><label>反馈图片</label></li></ul>`
                    });
                }else{
                    layer.open({
                        type: 1,
                        skin: 'layui-layer-molv', //样式类名
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        btn: bt,
                        btn1: bn,
                        btn2: function() {},
                        btnAlign: 'c',
                        area: mian,
                        title: "任务信息",
                        success: function() {
                            if (task_status == '0') {
                                $("#fktDom").remove();
                                $("#fknrDom").remove();
                                $("#wcsjDom").remove();
                            } else if (task_status == '1') {
                                $("#fktDom").remove();
                                $("#fknrDom").remove();
                                $("#wcsjDom").remove();
                            }
                        },
                        shadeClose: true, //开启遮罩关闭
                        content: `<ul class="form_sub form_sub_release"><li><label>任务名称：</label><input type="text" class="form-control form-boxed" disabled value="${result.task_title}"><label>任务类型：</label><input type="text" class="form-control form-boxed" disabled value="${rewutype.get(result.task_type)}"></li><li><label>任务区域：</label><input type="text" class="form-control form-boxed" readonly value="${result.region_name}" ><label>地图位置：</label><input type="text" class="form-control form-boxed"  value="${result.task_latlng}" readonly><button onclick="dthx(this)" id='${result.task_latlng}' style="margin-left:3px;width:65px;border-radius:3px;background:#01dacf;color:#fff;border:none;padding:3px;">进入地图</button></li><li><label>发布人：</label><input type="text" class="form-control form-boxed" disabled value="${result.add_name}"><label>指派对象：</label><input type="text" class="form-control form-boxed" disabled value="${result.to_name}" ></li><li><label>接受人：</label><input type="text" class="form-control form-boxed" disabled value="${result.recv_name}"><label>发布时间：</label><input type="text" class="form-control form-boxed" value="${result.task_add_time}" disabled></li><li><label>截止时间：</label><input type="text" class="form-control form-boxed" disabled value="${result.task_end_time}"><label>状态：</label><input type="text" class="form-control form-boxed" value="${rewuStatus.get(result.task_status)}" disabled></li>
                        <li><label>任务描述：</label><textarea class="form-control form-boxed remove_disabled" readonly style='width: 146px;'>${result.task_desc}</textarea>
                        <label>反馈内容：</label><textarea class="form-control form-boxed remove_disabled" disabled style='width: 146px;'>${feedback.get(result.task_result)}</textarea></li>
                        <li id="task_img"><label>任务图片</label></li>
                        <li id="upimg"><label>反馈图片</label></li></ul>`
                    });
                }

                if (result.task_result_image.length>0) {
                  // var task_result_image=result.task_result_image.split(",");
                  for (let index = 0; index < result.task_result_image.length; index++) {
                    $("#upimg").append(`<img class="fileInput" style="width:40px;height:40px;" src="${Public_address}uploads/${result.task_result_image[index].path}" onerror="this.style='display:none;'"
                        class="imgbig" onclick="lookImg(src)">`)
                  }
                };
                if(result.task_images.length>0){
                    for (let i = 0; i < result.task_images.length; i++) {
                        $("#task_img").append(`<img class="fileInput" style="width:40px;height:40px;" src="${Public_address}uploads/${result.task_images[i].path}" onerror="this.style='display:none;'" 
                            class="imgbig" onclick="lookImg(src)">`)
                    }
                }

            }
        },
        error: function(err) {
          layer.msg("系统错误")
        },
    })
  };
  //点击详细信息的图片--预览
function lookImg(src) {
    var $h1="<img src=\"" +src+ "\" style=\"height:98%;width:98%\">";
    layer.confirm(''+$h1+'', {
        type: 0,
        anim: 0,
        btn: ['关闭'],
        skin: 'layui-layer-molv',
        title:'图片预览',
        area: ['570px', '500px;'],
        shadeClose: true,
        btnAlign: 'c'
    }, function(){
        layer.closeAll('dialog');
    });

}
  //取消任务
  function toRemove(task_status,task_id){
  if (task_status=="2") {
    layer.msg('已经完成的任务不可以取消！');
  }else{
    layer.confirm('确定要取消吗？', {
    btn: ['确定','取消'],
    skin: 'layui-layer-molv',
    title:'温馨提示',
    btnAlign: 'c'
    }, function(){
      sendAjax({
          "url":"fire/task/deleteTask",
          "data":{"task_id":task_id},"callback":function(data){
          if (data.code=='s_ok') {
              layer.msg('取消成功', {
              icon: 1,
              time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function(){
               zdzx();
            });  
          }else {
              layer.msg(data.var, {
              icon: 2,
              time: 2000 //2秒关闭（如果不配置，默认是3秒）
            }, function(){
            }); 
          } 
        },
        error:function(err){}
      });
    }, function(){
    });
  };
  }
  
  // 查询
  var images,num='';
  function zdzx(){
    var region=$("#fireArea").val();
    $("#city").val()==''||$("#city").val()==undefined?region=$("#fireArea").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city").val():region=$("#area").val();
    var task_status=$('.rwzt_select').val();
    var task_type=$('.rwlx_select').val();
    task_type=task_type==''?'8,9,10,11,12':$('.rwlx_select').val();
    sendAjax({
      "url":"fire/task/getTaskByCondition",
      "data":{"per_page":20,"current_page":1,"task_status":task_status,"task_region":region,
          "task_type":task_type,},
      "callback":function(data){
        map.clearMap();$("#dmrw_tbody").html("");
        if (data.code=="s_ok") {
          if(data.var.total==0){
            layer.msg('查询数据为空');$(".complete_total").html(0);num=1;
            return false;
          }
          $(".complete_total").html(data.var.total); 
          num=data.var.total;
          var data=data.var.data;
            var userLevel = sessionStorage.getItem("userLevel");
          for(var i=0;i<data.length;i++){
              if(userLevel!='1'){
                  $("#dmrw_tbody").append("<tr class=[cen'><td>"+data[i].task_id+"</td><td>"+data[i].region_name+"</td><td>"+rewutype.get(data[i].task_type)+"</td><td>"+data[i].add_name+"</td><td>"+data[i].recv_name+"</td><td>"+data[i].task_add_time+"</td><td>"+data[i].task_end_time+"</td><td class='taskStatus_overdue'>"+rewuStatus.get(data[i].task_status)+"</td><td><a onclick='toCenter(" + data[i].task_id + ","+data[i].task_status+");' style='color:#01dacf' href='javascript:'>"+'详情'+"</a><a onclick='toRemove("+data[i].task_status+","+data[i].task_id+");'  style='margin-left:10px;color:#01dacf'>取消</a></td></tr>");
              }else{
                  $("#dmrw_tbody").append("<tr class=[cen'><td>"+data[i].task_id+"</td><td>"+data[i].region_name+"</td><td>"+rewutype.get(data[i].task_type)+"</td><td>"+data[i].add_name+"</td><td>"+data[i].recv_name+"</td><td>"+data[i].task_add_time+"</td><td>"+data[i].task_end_time+"</td><td class='taskStatus_overdue'>"+rewuStatus.get(data[i].task_status)+"</td><td><a onclick='toCenter(" + data[i].task_id + ","+data[i].task_status+");' style='color:#01dacf' href='javascript:'>"+'详情'+"</a></td></tr>");
              }
            switch (data[i].task_status){
                case "0":
                images = 'rw01.png';
                break;
                case "1":
                images = 'rw02.png';
                break;
                case "2":
                images = 'rw03.png';
                break;
                case "-1":
                images = 'rw04.png';
                break;
                case "-2":
                images = 'rw04.png';
                break;
            }
            if (data[i].task_status!="-1") {
              var lnglatXY= data[i].task_latlng.split(";");
              lnglatXY=JSON.parse('[' + String(lnglatXY[0]) + ']')
              var marker = new AMap.Marker({
                position: lnglatXY,
                icon:'img/LK/'+images,
                map: map
              });
              marker.setLabel({
                offset: new AMap.Pixel(-70, -20),
                content: data[i].region_name+"；"+data[i].task_add_time.substring(0,16)
              });
              map.setFitView();
              addHotMarkerClick_two(marker,data[i]);
            }
          }
        }else{
          layer.msg(data.var);
        }
      }
    });
    $(".pagination").createPage({
        pageCount:Math.ceil(num/20),
        current:1,
        backFn:function(p){
          sendAjax({
            "url":"fire/task/getTaskByCondition",
            "data":{"per_page":20,"current_page":p,"task_status":task_status,
                "task_region":region,"task_type":task_type},
            "callback":function(data){
              var data=data.var.data;
              $("#dmrw_tbody").html("");
              for(var i=0;i<data.length;i++){
                  $("#dmrw_tbody").append("<tr class=[cen'><td>"+data[i].task_id+"</td><td>"+data[i].region_name+"</td><td>"+rewutype.get(data[i].task_type)+"</td><td>"+data[i].add_name+"</td><td>"+data[i].recv_name+"</td><td>"+data[i].task_add_time+"</td><td>"+data[i].task_end_time+"</td><td class='taskStatus_overdue'>"+rewuStatus.get(data[i].task_status)+"</td><td><a onclick='toCenter(" + data[i].task_id + ","+data[i].task_status+");' style='color:#01dacf' href='javascript:'>"+'详情'+"</a><a onclick='toRemove("+data[i].task_status+","+data[i].task_id+");'  style='margin-left:10px;color:#01dacf'>取消</a></td></tr>");
                switch (data[i].task_status){
                    case "0":
                    images = 'rw01.png';
                    break;
                    case "1":
                    images = 'rw02.png';
                    break;
                    case "2":
                    images = 'rw03.png';
                    break;
                    case "-1":
                    images = 'rw04.png';
                    break;
                    case "-2":
                    images = 'rw04.png';
                    break;
                }
                if (data[i].task_status!="-1") {
                  var lnglatXY= data[i].task_latlng.split(";");
                  lnglatXY=JSON.parse('[' + String(lnglatXY[0]) + ']')
                  var marker = new AMap.Marker({
                    position: lnglatXY,
                    icon:'img/LK/'+images,
                    map: map
                  });
                  marker.setLabel({
                    offset: new AMap.Pixel(-70, -20),
                    content: data[i].region_name+"；"+data[i].task_add_time.substring(0,16)
                  });
                  map.setFitView();
                  addHotMarkerClick_two(marker,data[i]);
                }
              }
            }
          })
        }
    })
  }
  zdzx();
  
  //卫星监测热点marker点击事件
  function addHotMarkerClick_two(marker,data){
      marker.content ="<div style=\"width:360px;font-family:'微软雅黑' \"><div><span style=\"color:#262626;font-size:14px;\">任务名称 : </span>" + data.task_title + "</div><br><div>"+"<span style=\"color:#262626;font-size:14px;\">区域 : </span>" + data.region_name +"</div><br><div><span style=\"color:#262626;font-size:14px\">类型 : </span>" + rewutype.get(data.task_type) + "<span style=\"color:#262626;font-size:14px;margin-left:30px\">发布时间 : </span>" + data.task_add_time + "</div><br><div><span style=\"color:#262626;font-size:14px\">发布人 : </span>" + data.add_name + "<span style=\"color:#262626;font-size:14px;margin-left:30px\">任务状态 : </span>" + rewuStatus.get(data.task_status) + "</div><br><div style=\"text-align:center\"><button style=\"width:100px;height:30px;border:none;border-radius:3px;color:#fff;background:#01dacf\" onclick='toCenter(" + data.task_id + ","+data.task_status+");'>详情</button></div>"
    AMap.event.addListener(marker, 'click', function() {
      infoWindow.setContent(marker.content);
      infoWindow.open(map, marker.getPosition());
    });
  };
  //回显任务点
  function dthx(obj) {
    layer.open({
        type: 1,
        skin: 'layui-layer-molv', //样式类名
        closeBtn: 1, //关闭按钮
        anim: 2,
        btnAlign: 'c',
        area: ['600px', '530px;'],
        title: "地图信息",
        shadeClose: true, //开启遮罩关闭
        content: "<div id=\"container\" style=\"width:600px;height:530px\"></div>",
        success: function() {
            
            var map = new AMap.Map("container", {
                resizeEnable: true,
                zoom: 11
            });
            var type= new AMap.MapType({
                defaultType:1,
                showRoad:true
            });
            map.addControl(type);
            map.clearMap();
            var latLngs = $(obj).attr("id");
            var lnglat = latLngs.split(";");
           
            var marker = new AMap.Marker({
                  icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                  position: JSON.parse('[' + String(lnglat[0]) + ']'),
                  map: map
            });
            marker.setMap(map);
            map.setZoomAndCenter(14, JSON.parse('[' + String(lnglat[0]) + ']'));// 执行定位
        }
    })
  }
  