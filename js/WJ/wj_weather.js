var a=$("body").find("#iframe_box").contents().find(".logo_menu_width");
function weather_click(){
   $(".box_address").attr("src","http://www.nmc.cn/publish/forecast/AHN.html");
};
function forest_click(){
   $(".box_address").attr("src","http://www.nmc.cn/publish/environment/forestfire-doc.html");
};
function satellite_click(){
   $(".box_address").attr("src","http://www.nmc.cn/publish/satellite/fy2.htm");
};
function rain_click(){
   $(".box_address").attr("src","http://www.nmc.cn/publish/observations/hourly-precipitation.html");
};
function traffic_click(){
  $(".box_address").attr("src","http://www.nmc.cn/publish/traffic.html");
};
function wind_click(){
    $(".box_address").attr("src","http://www.nmc.cn/publish/observations/hourly-winds.html");
}
