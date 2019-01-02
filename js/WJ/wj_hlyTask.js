$(function(){
    //当前年月
    var myDate = new Date;
    var year = myDate.getFullYear();
    var month = myDate.getMonth()+1 > 9 ? myDate.getMonth()+1 : "0" + (myDate.getMonth()+1);
    var next=myDate.getMonth()+2 > 9 ? myDate.getMonth()+2 : "0" + (myDate.getMonth()+2);
    //统计城市
    var arr=[];
    arr.push($("#ld_city option:checked").html());
    //进入页面直接加载长沙市近一个月数据
    sendAjax({
        "url":"fire/task/countTaskData",
        "data":{"start_time":year+"-"+month,"end_time":year+"-"+next,"task_region":$("#ld_city").val(),"type":$("#ld_content").val(),"mid_type":"1"},"callback":function(data){
            if (data.code=="s_ok") {
                handle(data);
            }
        },error:function(result){
            layer.msg(result.var);
        }
    })
    // 折线系列
    function Line(name,type,stack,data){
        this.name=name;
        this.type=type;
        this.stack=stack;
        this.data=data;
     }
    // 加载统计图
    function handle(allArr){
        var myChart = echarts.init(document.getElementById('ld_fireManage'));
        //横轴
        if($("#ld_startTime").val()==''){
            var xArr=[];
            xArr.push(year+"-"+month);
        }else{
            var xArr=getXArr();
        }
        // 系列数据 
        var staticData= getStaticData(xArr,allArr);
        // 系列
        var seriesArr=[];
        
        for(var i=0;i<arr.length;i++){
            var line=new Line(arr[i],"line","总量"+i,staticData.data);
            seriesArr.push(line);
        }
        //任务类型统计数据
        function taskType(finish5,finish6,finish7,finish8,finish9,finish10,finish11,finish12,total,total5,total6,total7,total8,total9,total10,total11,total12){
            this.finish5=finish5;
            this.finish6=finish6;
            this.finish7=finish7;
            this.finish8=finish8;
            this.finish9=finish9;
            this.finish10=finish10;
            this.finish11=finish11;
            this.finish12=finish12;
            this.total=total;
            this.total5=total5;
            this.total6=total6;
            this.total7=total7;
            this.total8=total8;
            this.total9=total9;
            this.total10=total10;
            this.total11=total11;
            this.total12=total12;
            this.count5=finish5==0 && total5==0 ? 0 : finish5/total5*100;
            this.count6=finish6==0 && total6==0 ? 0 : finish6/total6*100;
            this.count7=finish7==0 && total7==0 ? 0 : finish7/total7*100;
            this.count8=finish8==0 && total8==0 ? 0 : finish8/total8*100;
            this.count9=finish9==0 && total9==0 ? 0 : finish9/total9*100;
            this.count10=finish10==0 && total10==0 ? 0 : finish10/total10*100;
            this.count11=finish11==0 && total11==0 ? 0 : finish11/total11*100;
            this.count12=finish12==0 && total12==0 ? 0 : finish12/total12*100;
        };
        //指派对象统计数据
        function assignObject(finish0,finish1,finish2,finish3,total,total0,total1,total2,total3){
            this.finish0=finish0;
            this.finish1=finish1;
            this.finish2=finish2;
            this.finish3=finish3;
            this.total=total;
            this.total0=total0;
            this.total1=total1;
            this.total2=total2;
            this.total3=total3;
            this.count0=finish0==0 && total0==0 ? 0 : finish0/total0*100;
            this.count1=finish1==0 && total1==0 ? 0 : finish1/total1*100;
            this.count2=finish2==0 && total2==0 ? 0 : finish2/total2*100;
            this.count3=finish3==0 && total3==0 ? 0 : finish3/total3*100;
        };
    //统计数据解析
        function getStaticData(xArr,allArr){
            var staticData={showdata:[],data:[]};
            var static=allArr.var;
            for(var j=0;j<xArr.length;j++){
                var flag=true;
                var obj=null;
                
                for(var h=0;h<static.length;h++){
                    if(xArr[j]==static[h].time){
                        flag=false;
                        staticData.data.push(static[h].total);
                        switch($('#ld_content').val()){
                            case "":
                                obj=new taskType(static[h].finish5,static[h].finish6,static[h].finish7,static[h].finish8,static[h].finish9,static[h].finish10,static[h].finish11,static[h].finish12,static[h].total,static[h].total5,static[h].total6,static[h].total7,static[h].total8,static[h].total9,static[h].total10,static[h].total11,static[h].total12);
                                break;
                            case "1":
                                obj=new assignObject(static[h].finish0,static[h].finish1,static[h].finish2,static[h].finish3,static[h].total,static[h].total0,static[h].total1,static[h].total2,static[h].total3);
                                break;
                        }
                    }
                }
                if(flag){
                    staticData.data.push(0);
                    if($('#ld_content').val()==""){
                        obj=new taskType(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
                    }else{
                        obj=new assignObject(0,0,0,0,0,0,0,0,0);
                    }
                }
                staticData.showdata.push(obj);
            }
            return staticData;
        };
        //统计内容
        var countContent='';
        if($('#ld_content').val()==""){
            countContent="任务类型"
        }else{
            countContent="指派对象"
        }
        //标题
        if($("#ld_startTime").val()==''){
            var title=year+"年"+month+"月"+countContent+"统计图"
        }else{
            var title=$("#ld_city option:checked").html()+$("#ld_startTime").val().substring(0,4)+'年'+$("#ld_startTime").val().substring(5)+'月至'+$("#ld_endTime").val().substring(0,4)+'年'+$("#ld_endTime").val().substring(5)+'月护林员'+countContent+"统计图"
        }
        var option = {
            title: {
                    text:title,
                    left:'30%'
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
                    var item=staticData.showdata[params.dataIndex];
                   
                        var res='<div><p>'+params.name.substring(0,4)+'年'+params.name.substring(5)+
                            '月总计'+params.data+'条</p>'+
                            '<p>森林火灾调查:<span style="color:#fff;">'+item.total0+'</span>(完成率:'+(item.count0).toFixed(2)+'%'+')</p>'+
                            '<p>林业有害生物:<span style="color:#fff;">'+item.total1+'</span>(完成率:'+(item.count1).toFixed(2)+'%'+')</p>'+
                            '<p>破坏森林资源调查:<span style="color:#fff;">'+item.total2+'</span>(完成率:'+(item.count2).toFixed(2)+'%'+')</p>'+
                            '<p>偷猎野生动物调查:<span style="color:#fff;">'+item.total3+'</span>(完成率:'+(item.count3).toFixed(2)+'%'+')</p>'
                            ;
                    return res;
                    
                }
            },
            legend: {
                data:arr,
                right:'14%'
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
                name:"任务数量(条)"
            },
            series:seriesArr,
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
        };
        myChart.setOption(option);	
    };
    //横轴
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
       //查询
       $("#ld_search").click(function(){
          //开始时间不能为空
          if($("#ld_startTime").val()==''){
            layer.open({
                content: '开始时间不能为空',
                skin: 'layui-layer-molv',
                scrollbar: false,btnAlign: 'c'
              });
            return;
          }
          //结束时间不能为空
          if($("#ld_endTime").val()==''){
            layer.open({
                content: '结束时间不能为空',
                skin: 'layui-layer-molv',
                scrollbar: false,btnAlign: 'c'
              });
            return;
          }
          // 结束时间不得小于开始时间
          var s=parseInt($("#ld_startTime").val().substring(0,4))+parseInt( $("#ld_startTime").val().substring(5))/12;
          var e=parseInt($("#ld_endTime").val().substring(0,4))+parseInt( $("#ld_endTime").val().substring(5))/12;
            if(s>=e){
                layer.open({
                    content: '开始时间必须小于结束时间!',
                    skin: 'layui-layer-molv',
                    scrollbar: false,btnAlign: 'c'
                  });
                return;
            }
          //时间范围十年之内
          if(e-s>10){
            layer.open({
                content: '最大时间范围为10年,请重新选择年月!',
                skin: 'layui-layer-molv',
                scrollbar: false,btnAlign: 'c'
              });
            return;
          }
        sendAjax({
            "url":"fire/task/countTaskData",
            "data":{"start_time":$("#ld_startTime").val(),"end_time":$("#ld_endTime").val(),"task_region":$("#ld_city").val(),"type":$("#ld_content").val(),"mid_type":"1"},"callback":function(data){
                
                if (data.code=="s_ok") {
                    
                    handle(data);
                }
            },error:function(result){
                layer.msg(result.var);
            }
        })
       })
    })