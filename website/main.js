$(function(){
    // 导航
    $(".nav li").click(function() {
        var index=$(".nav li").index();
        $(this).addClass("cur").siblings().removeClass("cur");
    });
    listNewsBy("0",'#article1',"6");
    listNewsBy("1",'#article2',"8");
    listNewsBy("2",'#article3',"8");
    listNewsBy("3",'#article4',"8");
    // 新闻
    function listNewsBy(newsType,dom,pageSize) {
        $.ajax({
            url : Public_address+"fire/news/listNewByCondition",
            type : "post",
            dataType : "json",
            data: {"current_page":"1","status":"2","news_type":newsType,"per_page":pageSize},
            async:false,
            success : function(data) {
                if (data.code=="s_ok") {
                    if (data.var.total!=0) {
                        var result=data.var.data;
                        for (let i = 0; i < result.length; i++) {
                            $(dom).append(
                                `<li><a href="javascript:;">${result[i].title}</a><span>${(result[i].create_time).substring(5,10)}</span></li>`
                            );
                            if (newsType=="0") {
                                $("#slideBox .hd ul").append("<li></li>");
                                $("#slideBox .td ul").append(`<li>${result[i].title}</li>`);
                                $("#slideBox .bd ul").append(
                                   ` <li><a href="javascript:;" target="_blank"><img src="${Public_address}uploads/${result[i].images}" onerror="javascript:this.src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1531720302143&di=592689f37e84f0021576a35ecf9fec5f&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsx%2Ftransform%2Fw453h248%2F20180305%2FYkrt-fxipenn1275047.png'" /></a></li>`
                                );
                                jQuery(".slideBox").slide({mainCell:".bd ul",autoPlay:true, interTime:5000});
                                $("#slideBox .bd ul").on("click","li",function() {
                                    var index=$("#slideBox .bd ul").find("li").index(this);
                                    disable(result[index]);
                                })
                            }
                        };
                        var index=0;
                        if (newsType=="0") {
                            setInterval(() => {
                                index++;
                                if (index > result.length) {index = 0;}
                                $("#slideBox .td ul li").eq(index).fadeIn(1000).siblings().fadeOut(0);
                            }, 5000);
                        };
                        $(dom).on("click","li",function() {
                            var index=$(dom).find("li").index(this);
                            disable(result[index]);
                        });
                    }
                }else{
                    alert("发生错误！")
                }
            }
        });
    }
    // 视频
    $.ajax({
        url : Public_address+"fire/history_video/listVideoByCondition",
        type : "post",
        dataType : "json",
        data: {"current_page": 1,"per_page":20},
        async:false,
        success : function(data) {
            if (data.code=="s_ok") {
                var result = data.var.data;
                for (let i = 0; i < result.length; i++) {
                    $(".picList").append(
                        `<li>
                            <div class="pic">
                                <video src="${Public_address}uploads/${result[i].path}" controls="controls"></video>
                            </div>
                            <div class="title"><a href="javascript:;">${result[i].video_name}</a></div>
                        </li>`
                    );
                    jQuery(".picScroll-left").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",autoPlay:false,vis:3,trigger:"click"});
                }
            };
        }
    })
});

//防火新闻
function menu1() {
    $("#main").load("website/fire_information.html");
    $(".nav_link").show().find("span").html("防火新闻");
};
//火险预报
function menu2() {
    $("#main").load("website/fire_forecast.html");
    $(".nav_link").show().find("span").html("火险预报");
};
//当前火情
function menu3() {
    $("#main").load("website/fire_current.html");
    $(".nav_link").show().find("span").html("当前火情");
};
//防火知识
function menu4() {
    $("#main").load("website/fire_knowledge.html");
    $(".nav_link").show().find("span").html("防火知识");
};
//返回
function returnMenu(){
    var str = $(".nav_link").show().find("span").html();
    if (str=="防火新闻") {
        $("#main").load("website/fire_information.html");
    }else if (str=="火险预报") {
        $("#main").load("website/fire_forecast.html");
    }else if (str=="当前火情") {
        $("#main").load("website/fire_current.html");
    }else if (str=="防火知识") {
        $("#main").load("website/fire_knowledge.html");
    }
}
// 跳转详情
function disable(result) {
    $("#main").load("website/information_details.html",function(){
        $(".details_title").html(result.title);
        $(".details_name").html("上传者："+result.author);
        $(".details_date").html("上传时间："+result.create_time);
        $(".details_content").load(Public_address+"uploads/"+result.url);
    });
    $("#main").addClass("tab-nav");
};
