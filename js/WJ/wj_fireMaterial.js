var infoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(4, -12)
});
//基本地图加载
var map = new AMap.Map("container_materialmap", {
    resizeEnable: true,
    zoom:8
});
var type= new AMap.MapType({
    defaultType:1,
    showRoad:true
});
map.addControl(type);
callback1();
// 点击弹框
function markerClick(marker,result){
    marker.content='<div style="background-color:#fff;border-radius:6px;padding-left: 20px;">'+
    '<p style="color:#030303;font-size:14px;line-height: 20px;">区域:<span style="color:#999da8;margin-left:6px;">'+result.region_name+'</span></p>'+
    '<p style="color:#030303;font-size:14px;line-height: 20px;">位置:<span style="color:#999da8;margin-left:6px;">'+result.location+'</span></p>'+
    '<p style="color:#030303;font-size:14px;line-height: 20px;">职务:<span style="color:#999da8;margin-left:6px;">'+result.duty+'</span></p>'+
    '<p style="color:#030303;font-size:14px;line-height: 20px;">管理人:<span style="color:#999da8;margin-left:6px;">'+result.administrator+'</span></p>'+
    '<p style="color:#030303;font-size:14px;line-height: 20px;">联系电话:<span style="color:#999da8;margin-left:6px;">'+result.phone+'</span></p>'+
    '<p style="color:#030303;font-size:14px;line-height: 20px;">成立时间:<span style="color:#999da8;margin-left:6px;">'+result.established_time+'</span></p>'+
    '<p style="color:#030303;font-size:14px;line-height: 20px;">录入时间:<span style="color:#999da8;margin-left:6px;">'+result.input_time+'</span></p>'+
    '<a href="#" class="ml-5" style="display: block;width:120px;height:28px;background-color:#01dacf;color:#fff;text-align: center;line-height:28px;font-size:14px;border-radius:4px;margin:8px auto 0 auto;">详情</a></div>'
    AMap.event.addListener(marker, 'click', function() {
        infoWindow.setContent(marker.content);
        infoWindow.open(map, marker.getPosition());
        $(".ml-5").click(function() {
            report_index(result.id)
        });
    });
}
var list=[];
//详情
function report_index(fireid){
    sendAjax({
        "url":"fire/fire_material_reserve/getFireMaterialReserveInfo",
        "data":{"id": fireid},"callback":function(element){
            if (element.code=="s_ok"){
                var result= element.var;
                var userLevel = sessionStorage.getItem("userLevel");
                if(userLevel!='1'){
                    layer.open({
                        type: 1,
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        skin: 'layui-layer-molv',
                        btnAlign: 'c',
                        area: ['1000px', '700px;'],
                        title:'查看物资储备库信息',
                        shadeClose: true, //开启遮罩关闭
                        //content:"<table class=\"detail_info\"><tr><td><ul class=\"add_office\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select></li><li><label>录入时间<i style='color:red'>*</i></label><input class='' id=\"detail_inputTime\" type=\"text\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\" disabled></li><li><label>职务</label><input id=\"detail_duty\" class=\"remove_disabled\" type=\"text\" disabled></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class='' disabled id=\"detail_latLngs\" disabled style='margin-right:2px;'><input disabled style='width:82px;height:30px;border:none;background:#01dacf;color:#fff;display:none;' class=\"enter_map_two remove_disabled\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#detail_latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设面积(平方米)<i style='color:red'>*</i></label><input disabled id=\"detail_buildArea\" class=\"remove_disabled\" type=\"text\"></li><li><label>联系电话<i style='color:red'>*</i></label><input disabled id=\"detail_phone\" class=\"remove_disabled\" type=\"text\"></li><li><label>成立时间<i style='color:red'>*</i></label><input disabled id=\"detail_buildtime\" class=\"remove_disabled\"  type=\"text\" onclick=\"WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\"></li><li><label>管理人<i style='color:red'>*</i></label><input id=\"detail_manager\" disabled type=\"text\" class=\"remove_disabled\"></li><li style=\"height:110px;\"><label style=\"margin-top:-85px;\">描述</label><textarea disabled class=\"remove_disabled\" id=\"detail_desc\" style=\"width:190px;height:100px;top:20px;resize: none;\"/></li><li style=\"height:80px;width:900px;\"><label style=\"margin-top:5px;\">图片上传</label><input type=\"file\" id=\"detail_photoName1\" class=\"upFileBtn hide_it\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput hide_it\" id=\"detail_img\" src=\"img/LK/tjtp.png\" onclick=\"$('#detail_photoName1').click()\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul></td><td><ul class=\"add_material\" ><li><label>GPS<i style='color:red'>*</i></label><input disabled id=\"detail_gps\" class=\"remove_disabled\" type=\"text\"></li><li><label>油锯<i style='color:red'>*</i></label><input disabled id=\"detail_yj\" class=\"remove_disabled\" type=\"text\"></li><li><label>水泵<i style='color:red'>*</i></label><input disabled id=\"detail_sb\" class=\"remove_disabled\" type=\"text\"></li><li><label>大斧<i style='color:red'>*</i></label><input disabled id=\"detail_df\" class=\"remove_disabled\" type=\"text\"></li><li><label>砍刀<i style='color:red'>*</i></label><input disabled id=\"detail_kd\" class=\"remove_disabled\" type=\"text\"></li><li><label>服装<i style='color:red'>*</i></label><input disabled id=\"detail_fz\" class=\"remove_disabled\" type=\"text\"></li><li><label>帐篷<i style='color:red'>*</i></label><input disabled id=\"detail_zp\" class=\"remove_disabled\" type=\"text\"></li><li><label>睡袋<i style='color:red'>*</i></label><input disabled id=\"detail_sd\" class=\"remove_disabled\" type=\"text\"></li><li><label>其他<i style='color:red'>*</i></label><input disabled id=\"detail_qt\" class=\"remove_disabled\" type=\"text\"></li><li><label>无人机<i style='color:red'>*</i></label><input disabled id=\"detail_wrj\" class=\"remove_disabled\" type=\"text\"></li><li><label>割灌机<i style='color:red'>*</i></label><input disabled id=\"detail_ggj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风速仪<i style='color:red'>*</i></label><input disabled id=\"detail_fsy\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>消防铲<i style='color:red'>*</i></label><input disabled id=\"detail_xfc\" class=\"remove_disabled\" type=\"text\"></li><li><label>发电机<i style='color:red'>*</i></label><input disabled id=\"detail_fdj\" class=\"remove_disabled\" type=\"text\"></li><li><label>点火机<i style='color:red'>*</i></label><input disabled id=\"detail_dhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>通讯车<i style='color:red'>*</i></label><input class=\"remove_disabled\" disabled id=\"detail_txc\" type=\"text\"></li><li><label>车载台<i style='color:red'>*</i></label><input disabled id=\"detail_czt\" class=\"remove_disabled\"type=\"text\"></li><li><label>运兵车<i style='color:red'>*</i></label><input disabled id=\"detail_ybc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水车<i style='color:red'>*</i></label><input disabled id=\"detail_mhsc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水枪<i style='color:red'>*</i></label><input disabled id=\"detail_mhsq\" class=\"remove_disabled\" type=\"text\"></li><li><label>二三号工具<i style='color:red'>*</i></label><input disabled id=\"detail_eshgj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风力灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_flmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>余火探测仪<i style='color:red'>*</i></label><input disabled id=\"detail_yhtcy\" class=\"remove_disabled\" type=\"text\"></li><li><label>手持对讲机<i style='color:red'>*</i></label><input disabled id=\"deatil_scdjj\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>风水灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_fsmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>高压细水雾灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_gyxswmhj\" class=\"remove_disabled\" type=\"text\"></li></ul></td></tr></table><div class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user("+result.id+")\"></div>"
                        content:"<table class=\"detail_info\"><tr><td><ul class=\"add_office\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select></li><li><label>录入时间<i style='color:red'>*</i></label><input class='' id=\"detail_inputTime\" type=\"text\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\" disabled></li><li><label>职务</label><input id=\"detail_duty\" class=\"remove_disabled\" type=\"text\" disabled></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class='' disabled id=\"detail_latLngs\" disabled style='margin-right:2px;'><input disabled style='width:82px;height:30px;border:none;background:#01dacf;color:#fff;display:none;' class=\"enter_map_two remove_disabled\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#detail_latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设面积(平方米)<i style='color:red'>*</i></label><input disabled id=\"detail_buildArea\" class=\"remove_disabled\" type=\"text\"></li><li><label>联系电话<i style='color:red'>*</i></label><input disabled id=\"detail_phone\" class=\"remove_disabled\" type=\"text\"></li><li><label>成立时间<i style='color:red'>*</i></label><input disabled id=\"detail_buildtime\" class=\"remove_disabled\"  type=\"text\" onclick=\"WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\"></li><li><label>管理人<i style='color:red'>*</i></label><input id=\"detail_manager\" disabled type=\"text\" class=\"remove_disabled\"></li><li style=\"height:110px;\"><label style=\"margin-top:-85px;\">描述</label><textarea disabled class=\"remove_disabled\" id=\"detail_desc\" style=\"width:190px;height:100px;top:20px;resize: none;\"/></li><li style=\"height:80px;width:900px;\"><label style=\"margin-top:5px;\">图片上传</label><input type=\"file\" id=\"detail_photoName1\" class=\"upFileBtn hide_it\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput hide_it\" id=\"detail_img\" src=\"img/LK/tjtp.png\" onclick=\"$('#detail_photoName1').click()\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul></td><td><ul class=\"add_material\" ><li><label>GPS<i style='color:red'>*</i></label><input disabled id=\"detail_gps\" class=\"remove_disabled\" type=\"text\"></li><li><label>油锯<i style='color:red'>*</i></label><input disabled id=\"detail_yj\" class=\"remove_disabled\" type=\"text\"></li><li><label>水泵<i style='color:red'>*</i></label><input disabled id=\"detail_sb\" class=\"remove_disabled\" type=\"text\"></li><li><label>大斧<i style='color:red'>*</i></label><input disabled id=\"detail_df\" class=\"remove_disabled\" type=\"text\"></li><li><label>砍刀<i style='color:red'>*</i></label><input disabled id=\"detail_kd\" class=\"remove_disabled\" type=\"text\"></li><li><label>服装<i style='color:red'>*</i></label><input disabled id=\"detail_fz\" class=\"remove_disabled\" type=\"text\"></li><li><label>帐篷<i style='color:red'>*</i></label><input disabled id=\"detail_zp\" class=\"remove_disabled\" type=\"text\"></li><li><label>睡袋<i style='color:red'>*</i></label><input disabled id=\"detail_sd\" class=\"remove_disabled\" type=\"text\"></li><li><label>其他<i style='color:red'>*</i></label><input disabled id=\"detail_qt\" class=\"remove_disabled\" type=\"text\"></li><li><label>无人机<i style='color:red'>*</i></label><input disabled id=\"detail_wrj\" class=\"remove_disabled\" type=\"text\"></li><li><label>割灌机<i style='color:red'>*</i></label><input disabled id=\"detail_ggj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风速仪<i style='color:red'>*</i></label><input disabled id=\"detail_fsy\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>消防铲<i style='color:red'>*</i></label><input disabled id=\"detail_xfc\" class=\"remove_disabled\" type=\"text\"></li><li><label>发电机<i style='color:red'>*</i></label><input disabled id=\"detail_fdj\" class=\"remove_disabled\" type=\"text\"></li><li><label>点火机<i style='color:red'>*</i></label><input disabled id=\"detail_dhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>通讯车<i style='color:red'>*</i></label><input class=\"remove_disabled\" disabled id=\"detail_txc\" type=\"text\"></li><li><label>车载台<i style='color:red'>*</i></label><input disabled id=\"detail_czt\" class=\"remove_disabled\"type=\"text\"></li><li><label>运兵车<i style='color:red'>*</i></label><input disabled id=\"detail_ybc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水车<i style='color:red'>*</i></label><input disabled id=\"detail_mhsc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水枪<i style='color:red'>*</i></label><input disabled id=\"detail_mhsq\" class=\"remove_disabled\" type=\"text\"></li><li><label>二三号工具<i style='color:red'>*</i></label><input disabled id=\"detail_eshgj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风力灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_flmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>余火探测仪<i style='color:red'>*</i></label><input disabled id=\"detail_yhtcy\" class=\"remove_disabled\" type=\"text\"></li><li><label>手持对讲机<i style='color:red'>*</i></label><input disabled id=\"deatil_scdjj\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>风水灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_fsmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>高压细水雾灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_gyxswmhj\" class=\"remove_disabled\" type=\"text\"></li></ul></td></tr></table><div class=\"background_user_information\"><input type=\"button\" value=\"编辑\" class=\"report\" onclick=\"remove_disabled()\"> <input type=\"button\" value=\"保存\" class=\"report submit\" onclick=\"disabled_user("+result.id+")\"></div>"
                    });
                }else{
                    layer.open({
                        type: 1,
                        closeBtn: 1, //关闭按钮
                        anim: 2,
                        skin: 'layui-layer-molv',
                        btnAlign: 'c',
                        area: ['1000px', '700px;'],
                        title:'查看物资储备库信息',
                        shadeClose: true, //开启遮罩关闭
                        content:"<table class=\"detail_info\"><tr><td><ul class=\"add_office\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select></li><li><label>录入时间<i style='color:red'>*</i></label><input class='' id=\"detail_inputTime\" type=\"text\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\" disabled></li><li><label>职务</label><input id=\"detail_duty\" class=\"remove_disabled\" type=\"text\" disabled></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class='' disabled id=\"detail_latLngs\" disabled style='margin-right:2px;'><input disabled style='width:82px;height:30px;border:none;background:#01dacf;color:#fff;display:none;' class=\"enter_map_two remove_disabled\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#detail_latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设面积(平方米)<i style='color:red'>*</i></label><input disabled id=\"detail_buildArea\" class=\"remove_disabled\" type=\"text\"></li><li><label>联系电话<i style='color:red'>*</i></label><input disabled id=\"detail_phone\" class=\"remove_disabled\" type=\"text\"></li><li><label>成立时间<i style='color:red'>*</i></label><input disabled id=\"detail_buildtime\" class=\"remove_disabled\"  type=\"text\" onclick=\"WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\"></li><li><label>管理人<i style='color:red'>*</i></label><input id=\"detail_manager\" disabled type=\"text\" class=\"remove_disabled\"></li><li style=\"height:110px;\"><label style=\"margin-top:-85px;\">描述</label><textarea disabled class=\"remove_disabled\" id=\"detail_desc\" style=\"width:190px;height:100px;top:20px;resize: none;\"/></li><li style=\"height:80px;width:900px;\"><label style=\"margin-top:5px;\">图片</label><input type=\"file\" id=\"detail_photoName1\" class=\"upFileBtn hide_it\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput hide_it\" id=\"detail_img\" src=\"img/LK/tjtp.png\" onclick=\"$('#detail_photoName1').click()\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul></td><td><ul class=\"add_material\" ><li><label>GPS<i style='color:red'>*</i></label><input disabled id=\"detail_gps\" class=\"remove_disabled\" type=\"text\"></li><li><label>油锯<i style='color:red'>*</i></label><input disabled id=\"detail_yj\" class=\"remove_disabled\" type=\"text\"></li><li><label>水泵<i style='color:red'>*</i></label><input disabled id=\"detail_sb\" class=\"remove_disabled\" type=\"text\"></li><li><label>大斧<i style='color:red'>*</i></label><input disabled id=\"detail_df\" class=\"remove_disabled\" type=\"text\"></li><li><label>砍刀<i style='color:red'>*</i></label><input disabled id=\"detail_kd\" class=\"remove_disabled\" type=\"text\"></li><li><label>服装<i style='color:red'>*</i></label><input disabled id=\"detail_fz\" class=\"remove_disabled\" type=\"text\"></li><li><label>帐篷<i style='color:red'>*</i></label><input disabled id=\"detail_zp\" class=\"remove_disabled\" type=\"text\"></li><li><label>睡袋<i style='color:red'>*</i></label><input disabled id=\"detail_sd\" class=\"remove_disabled\" type=\"text\"></li><li><label>其他<i style='color:red'>*</i></label><input disabled id=\"detail_qt\" class=\"remove_disabled\" type=\"text\"></li><li><label>无人机<i style='color:red'>*</i></label><input disabled id=\"detail_wrj\" class=\"remove_disabled\" type=\"text\"></li><li><label>割灌机<i style='color:red'>*</i></label><input disabled id=\"detail_ggj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风速仪<i style='color:red'>*</i></label><input disabled id=\"detail_fsy\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>消防铲<i style='color:red'>*</i></label><input disabled id=\"detail_xfc\" class=\"remove_disabled\" type=\"text\"></li><li><label>发电机<i style='color:red'>*</i></label><input disabled id=\"detail_fdj\" class=\"remove_disabled\" type=\"text\"></li><li><label>点火机<i style='color:red'>*</i></label><input disabled id=\"detail_dhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>通讯车<i style='color:red'>*</i></label><input class=\"remove_disabled\" disabled id=\"detail_txc\" type=\"text\"></li><li><label>车载台<i style='color:red'>*</i></label><input disabled id=\"detail_czt\" class=\"remove_disabled\"type=\"text\"></li><li><label>运兵车<i style='color:red'>*</i></label><input disabled id=\"detail_ybc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水车<i style='color:red'>*</i></label><input disabled id=\"detail_mhsc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水枪<i style='color:red'>*</i></label><input disabled id=\"detail_mhsq\" class=\"remove_disabled\" type=\"text\"></li><li><label>二三号工具<i style='color:red'>*</i></label><input disabled id=\"detail_eshgj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风力灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_flmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>余火探测仪<i style='color:red'>*</i></label><input disabled id=\"detail_yhtcy\" class=\"remove_disabled\" type=\"text\"></li><li><label>手持对讲机<i style='color:red'>*</i></label><input disabled id=\"deatil_scdjj\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>风水灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_fsmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>高压细水雾灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_gyxswmhj\" class=\"remove_disabled\" type=\"text\"></li></ul></td></tr></table><div class=\"background_user_information\">" +
                        "<input type=\"button\" value=\"取消\" class=\"report\" onclick=\"closeBtn()\"></div>"
                    // content:"<table class=\"detail_info\"><tr><td><ul class=\"add_office\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"><option value=\"\">城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\" disabled style=\"background-color:#f2f2f2\"></select><select id=\"area\" class=\"remove_disabled\" disabled style=\"background-color:#f2f2f2\"></select></li><li><label>录入时间<i style='color:red'>*</i></label><input class='' id=\"detail_inputTime\" type=\"text\" onclick=\"WdatePicker({dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\" disabled></li><li><label>职务</label><input id=\"detail_duty\" class=\"remove_disabled\" type=\"text\" disabled></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class='' disabled id=\"detail_latLngs\" disabled style='margin-right:2px;'><input disabled style='width:82px;height:30px;border:none;background:#01dacf;color:#fff;display:none;' class=\"enter_map_two remove_disabled\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#detail_latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设面积(平方米)<i style='color:red'>*</i></label><input disabled id=\"detail_buildArea\" class=\"remove_disabled\" type=\"text\"></li><li><label>联系电话<i style='color:red'>*</i></label><input disabled id=\"detail_phone\" class=\"remove_disabled\" type=\"text\"></li><li><label>成立时间<i style='color:red'>*</i></label><input disabled id=\"detail_buildtime\" class=\"remove_disabled\"  type=\"text\" onclick=\"WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\"></li><li><label>管理人<i style='color:red'>*</i></label><input id=\"detail_manager\" disabled type=\"text\" class=\"remove_disabled\"></li><li style=\"height:110px;\"><label style=\"margin-top:-85px;\">描述</label><textarea disabled class=\"remove_disabled\" id=\"detail_desc\" style=\"width:190px;height:100px;top:20px;resize: none;\"/></li><li style=\"height:80px;width:900px;\"><label style=\"margin-top:5px;\">图片</label><input type=\"file\" id=\"detail_photoName1\" class=\"upFileBtn hide_it\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput hide_it\" id=\"detail_img\" src=\"img/LK/tjtp.png\" onclick=\"$('#detail_photoName1').click()\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul></td><td><ul class=\"add_material\" ><li><label>GPS<i style='color:red'>*</i></label><input disabled id=\"detail_gps\" class=\"remove_disabled\" type=\"text\"></li><li><label>油锯<i style='color:red'>*</i></label><input disabled id=\"detail_yj\" class=\"remove_disabled\" type=\"text\"></li><li><label>水泵<i style='color:red'>*</i></label><input disabled id=\"detail_sb\" class=\"remove_disabled\" type=\"text\"></li><li><label>大斧<i style='color:red'>*</i></label><input disabled id=\"detail_df\" class=\"remove_disabled\" type=\"text\"></li><li><label>砍刀<i style='color:red'>*</i></label><input disabled id=\"detail_kd\" class=\"remove_disabled\" type=\"text\"></li><li><label>服装<i style='color:red'>*</i></label><input disabled id=\"detail_fz\" class=\"remove_disabled\" type=\"text\"></li><li><label>帐篷<i style='color:red'>*</i></label><input disabled id=\"detail_zp\" class=\"remove_disabled\" type=\"text\"></li><li><label>睡袋<i style='color:red'>*</i></label><input disabled id=\"detail_sd\" class=\"remove_disabled\" type=\"text\"></li><li><label>其他<i style='color:red'>*</i></label><input disabled id=\"detail_qt\" class=\"remove_disabled\" type=\"text\"></li><li><label>无人机<i style='color:red'>*</i></label><input disabled id=\"detail_wrj\" class=\"remove_disabled\" type=\"text\"></li><li><label>割灌机<i style='color:red'>*</i></label><input disabled id=\"detail_ggj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风速仪<i style='color:red'>*</i></label><input disabled id=\"detail_fsy\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>消防铲<i style='color:red'>*</i></label><input disabled id=\"detail_xfc\" class=\"remove_disabled\" type=\"text\"></li><li><label>发电机<i style='color:red'>*</i></label><input disabled id=\"detail_fdj\" class=\"remove_disabled\" type=\"text\"></li><li><label>点火机<i style='color:red'>*</i></label><input disabled id=\"detail_dhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>通讯车<i style='color:red'>*</i></label><input class=\"remove_disabled\" disabled id=\"detail_txc\" type=\"text\"></li><li><label>车载台<i style='color:red'>*</i></label><input disabled id=\"detail_czt\" class=\"remove_disabled\"type=\"text\"></li><li><label>运兵车<i style='color:red'>*</i></label><input disabled id=\"detail_ybc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水车<i style='color:red'>*</i></label><input disabled id=\"detail_mhsc\" class=\"remove_disabled\" type=\"text\"></li><li><label>灭火水枪<i style='color:red'>*</i></label><input disabled id=\"detail_mhsq\" class=\"remove_disabled\" type=\"text\"></li><li><label>二三号工具<i style='color:red'>*</i></label><input disabled id=\"detail_eshgj\" class=\"remove_disabled\" type=\"text\"></li><li><label>风力灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_flmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>余火探测仪<i style='color:red'>*</i></label><input disabled id=\"detail_yhtcy\" class=\"remove_disabled\" type=\"text\"></li><li><label>手持对讲机<i style='color:red'>*</i></label><input disabled id=\"deatil_scdjj\" class=\"remove_disabled\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>风水灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_fsmhj\" class=\"remove_disabled\" type=\"text\"></li><li><label>高压细水雾灭火机<i style='color:red'>*</i></label><input disabled id=\"detail_gyxswmhj\" class=\"remove_disabled\" type=\"text\"></li></ul></td></tr></table><div class=\"background_user_information\">" +
                    //     "<input type=\"button\" value=\"取消\" class=\"report\" onclick=\"closeBtn()\"></div>"
                    });
                }
                var all_citys=localStorage.getItem('all_city');
                $('#province').html(all_citys);

                $("#detail_inputTime").val(result.input_time);
                $("#detail_duty").val(result.duty);
                $('#detail_latLngs').val(result.location);
                $('#detail_buildArea').val(result.construction_area);
                $('#detail_phone').val(result.phone);
                if(result.established_time.length>14){
                    $('#detail_buildtime').val(result.established_time.substring(0,10));
                }else{
                    $('#detail_buildtime').val(result.established_time);
                }
                $('#detail_manager').val(result.administrator);
                $('#detail_desc').val(result.describe);
                $('#detail_gps').val(result.gps);
                $('#detail_yj').val(result.chain_saw);
                $('#detail_sb').val(result.water_pump);
                $('#detail_df').val(result.broadax);
                $('#detail_kd').val(result.hacking_knife);
                $('#detail_fz').val(result.clothing);
                $('#detail_zp').val(result.tent);
                $('#detail_sd').val(result.sleeping_bag);
                $('#detail_qt').val(result.rests);
                $('#detail_wrj').val(result.uav);
                $('#detail_ggj').val(result.brush_cutter);
                $('#detail_fsy').val(result.anemograph);
                $('#detail_xfc').val(result.fire_shovel);
                $('#detail_fdj').val(result.dynamo);
                $('#detail_dhj').val(result.dynamo_exploder);
                $('#detail_txc').val(result.communication_van);
                $('#detail_czt').val(result.vehicular_locating_set);
                $('#detail_ybc').val(result.troop_crawler);
                $("#detail_mhsc").val(result.fire_fighting_water_wheel);
                $('#detail_mhsq').val(result.fire_hoses);
                $('#detail_eshgj').val(result.two_three_tool);
                $('#detail_flmhj').val(result.pneumatic_extinguisher);
                $('#detail_yhtcy').val(result.residual_fire_detector);
                $('#deatil_scdjj').val(result.handheld_radio_equipment);
                $('#detail_fsmhj').val(result.pneumatic_extinguisher);
                $('#detail_gyxswmhj').val(result.high_pressure_mist_extinguisher);
                list=[];
                img_del=[];
                if (result.image_path.length>0) {
                    var images=result.image_path;
                    for (var i = 0; i < images.length; i++) {
                        $("#imgBox").append("<img src="+Public_address+'uploads/'+images[i].path+" onerror=\"this.style=&quot;display:none&quot;\" class=\"imgbig\">");
                        list.push(images[i].id);
                    }
                }
                $("#province option[value='" +(result.region).substr(0,4)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,4),$("#province"));
                $("#city_two option[value='" +(result.region).substr(0,6)+ "']").prop("selected", "selected");
                callback((result.region).substr(0,6),$("#city_two"));
                $("#area option[value='" +(result.region).substr(0,9)+ "']").prop("selected", "selected");
                //点击上传图片
                $("#detail_photoName1").takungaeImgup({
                    formData: {
                        "path": "user_image",
                        "file_ext":"image"
                    },
                    url:"fire/upload/fileUpload",
                    id:"imgBox"
                });
            }else{
                layer.msg(element.var);
            }
        },
        error:function(e){
            layer.alert("网络不好，请刷新试试！", {
                skin: 'layui-layer-molv' 
                ,closeBtn: 0,anim: 4,btnAlign: 'c'
            });
        }
    });
};
//普通用户的取消按钮
function closeBtn() {
    layer.closeAll('page');
}
//新增
function add_material(){
    //var new_material="<table><tr><td><ul class=\"add_office\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"><option value=''>城市</option><option value='4301'>长沙市</option><option value='4302'>株洲市</option><option value='4303'>湘潭市</option><option value='4304'>衡阳市</option><option value='4305'>邵阳市</option><option value='4306'>岳阳市</option><option value='4307'>常德市</option><option value='4308'>张家界市</option><option value='4309'>益阳市</option><option value='4311'>永州市</option><option value='4310'>郴州市</option><option value='4312'>怀化市</option><option value='4313'>娄底市</option><option value='4331'>湘西自治州</option></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"area\" class=\"remove_disabled\"></select></li><li><label>职务<i style='color:red'>*</i></label><input id=\"add_duty\"  type=\"text\"></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" id=\"latLngs\" disabled style=\"margin-right:2px;width:105px;\"><input style=\"width:82px;height:30px;border:none;background:#01dacf;color:#fff;\" class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设面积(平方米)<i style='color:red'>*</i></label><input id=\"add_buildArea\" onkeyup=\"if(!/^[0-9]+(.[0-9]{0,9})?$/.test(this.value)){alert('只能输入数字');this.value='';}\" type=\"text\"></li><li><label>联系电话<i style='color:red'>*</i></label><input id=\"add_phone\" type=\"text\"></li><li><label>成立时间<i style='color:red'>*</i></label><input id=\"add_buildtime\" type=\"text\" onclick=\"WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\"></li><li><label>管理人<i style='color:red'>*</i></label><input id=\"add_manager\" type=\"text\"></li><li style=\"height:110px;\"><label style=\"margin-top:-85px;\">描述</label><textarea id=\"add_desc\" style=\"width:190px;height:100px;top:20px;resize: none;\"/></li><li style=\"height:80px;width:900px;\"><label style=\"margin-top:5px;\">图片上传</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul></td><td><ul class=\"add_material\" ><li><label>GPS<i style='color:red'>*</i></label><input id=\"add_gps\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>油锯<i style='color:red'>*</i></label><input id=\"add_yj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>水泵<i style='color:red'>*</i></label><input id=\"add_sb\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>大斧<i style='color:red'>*</i></label><input id=\"add_df\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>砍刀<i style='color:red'>*</i></label><input id=\"add_kd\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>服装<i style='color:red'>*</i></label><input id=\"add_fz\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>帐篷<i style='color:red'>*</i></label><input id=\"add_zp\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>睡袋<i style='color:red'>*</i></label><input id=\"add_sd\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>其他<i style='color:red'>*</i></label><input id=\"add_qt\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>无人机<i style='color:red'>*</i></label><input id=\"add_wrj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>割灌机<i style='color:red'>*</i></label><input id=\"add_ggj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>风速仪<i style='color:red'>*</i></label><input id=\"add_fsy\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>消防铲<i style='color:red'>*</i></label><input id=\"add_xfc\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>发电机<i style='color:red'>*</i></label><input id=\"add_fdj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>点火机<i style='color:red'>*</i></label><input id=\"add_dhj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>通讯车<i style='color:red'>*</i></label><input id=\"add_txc\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>车载台<i style='color:red'>*</i></label><input id=\"add_czt\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>运兵车<i style='color:red'>*</i></label><input id=\"add_ybc\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>灭火水车<i style='color:red'>*</i></label><input id=\"add_mhsc\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>灭火水枪<i style='color:red'>*</i></label><input id=\"add_mhsq\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>二三号工具<i style='color:red'>*</i></label><input id=\"add_eshgj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>风力灭火机<i style='color:red'>*</i></label><input id=\"add_flmhj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>余火探测仪<i style='color:red'>*</i></label><input id=\"add_yhtcy\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>手持对讲机<i style='color:red'>*</i></label><input id=\"add_scdjj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>风水灭火机<i style='color:red'>*</i></label><input id=\"add_fsmhj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>高压细水雾灭火机<i style='color:red'>*</i></label><input onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\"id=\"add_gyxswmhj\"type=\"text\"></li></ul></td></tr></table>"
    var new_material="<table><tr><td><ul class=\"add_office\"><li><label>区域<i style='color:red'>*</i></label><select id=\"province\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"city_two\" class=\"remove_disabled\" onchange=\"callback(value,this)\"></select><select id=\"area\" class=\"remove_disabled\"></select></li><li><label>职务<i style='color:red'>*</i></label><input id=\"add_duty\"  type=\"text\"></li><li><label>位置<i style='color:red'>*</i></label><input type=\"text\" class=\"form-control form-boxed \" id=\"latLngs\" disabled style=\"margin-right:2px;width:105px;\"><input style=\"width:82px;height:30px;border:none;background:#01dacf;color:#fff;\" class=\"enter_map_two\" type=\"button\" value=\"进入地图\" onclick=\"sessionStorage.setItem('hidebtn','2');layer.open({type: 2,title: '选中地图',shadeClose: false,shade: 0.8,area: ['700px', '450px;'],content: 'map.html',cancel: function(){$('#latLngs').val(localStorage.getItem('site'));sessionStorage.removeItem('hidebtn');}})\" /></li><li><label>建设面积(平方米)<i style='color:red'>*</i></label><input id=\"add_buildArea\" onkeyup=\"if(!/^[0-9]+(.[0-9]{0,9})?$/.test(this.value)){alert('只能输入数字');this.value='';}\" type=\"text\"></li><li><label>联系电话<i style='color:red'>*</i></label><input id=\"add_phone\" type=\"text\"></li><li><label>成立时间<i style='color:red'>*</i></label><input id=\"add_buildtime\" type=\"text\" onclick=\"WdatePicker({skin:'whyGreen',dateFmt:'yyyy-MM-dd',maxDate:'%y-%M-%d'})\" style=\"height:24px;width:190px;border:1px solid #a1b6cb;\"></li><li><label>管理人<i style='color:red'>*</i></label><input id=\"add_manager\" type=\"text\"></li><li style=\"height:110px;\"><label style=\"margin-top:-85px;\">描述</label><textarea id=\"add_desc\" style=\"width:190px;height:100px;top:20px;resize: none;\"/></li><li style=\"height:80px;width:900px;\"><label style=\"margin-top:5px;\">图片上传</label><input type=\"file\" id=\"photoName1\" class=\"upFileBtn\"  accept=\"image/png,image/jpg,image/gif,image/JPEG\"><img class=\"fileInput\" src=\"img/LK/tjtp.png\" onclick=\"$('#photoName1').click()\"><div id=\"imgBox\" style=\"display:inline-block\"></div></li></ul></td><td><ul class=\"add_material\" ><li><label>GPS<i style='color:red'>*</i></label><input id=\"add_gps\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>油锯<i style='color:red'>*</i></label><input id=\"add_yj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>水泵<i style='color:red'>*</i></label><input id=\"add_sb\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>大斧<i style='color:red'>*</i></label><input id=\"add_df\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>砍刀<i style='color:red'>*</i></label><input id=\"add_kd\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>服装<i style='color:red'>*</i></label><input id=\"add_fz\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>帐篷<i style='color:red'>*</i></label><input id=\"add_zp\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>睡袋<i style='color:red'>*</i></label><input id=\"add_sd\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>其他<i style='color:red'>*</i></label><input id=\"add_qt\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>无人机<i style='color:red'>*</i></label><input id=\"add_wrj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>割灌机<i style='color:red'>*</i></label><input id=\"add_ggj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>风速仪<i style='color:red'>*</i></label><input id=\"add_fsy\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>消防铲<i style='color:red'>*</i></label><input id=\"add_xfc\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>发电机<i style='color:red'>*</i></label><input id=\"add_fdj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>点火机<i style='color:red'>*</i></label><input id=\"add_dhj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>通讯车<i style='color:red'>*</i></label><input id=\"add_txc\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>车载台<i style='color:red'>*</i></label><input id=\"add_czt\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>运兵车<i style='color:red'>*</i></label><input id=\"add_ybc\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>灭火水车<i style='color:red'>*</i></label><input id=\"add_mhsc\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>灭火水枪<i style='color:red'>*</i></label><input id=\"add_mhsq\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>二三号工具<i style='color:red'>*</i></label><input id=\"add_eshgj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>风力灭火机<i style='color:red'>*</i></label><input id=\"add_flmhj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>余火探测仪<i style='color:red'>*</i></label><input id=\"add_yhtcy\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>手持对讲机<i style='color:red'>*</i></label><input id=\"add_scdjj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li></ul></td><td><ul class=\"add_material\"><li><label>风水灭火机<i style='color:red'>*</i></label><input id=\"add_fsmhj\" onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\" type=\"text\"></li><li><label>高压细水雾灭火机<i style='color:red'>*</i></label><input onkeyup=\"if(!/^[0-9]*$/.test(this.value)){alert('只能输入整数');this.value='';}\"id=\"add_gyxswmhj\"type=\"text\"></li></ul></td></tr></table>"
    layer.confirm(''+new_material+'', {
        type: 1,
        closeBtn: 1, //关闭按钮
        anim: 2,
        skin: 'layui-layer-molv', 
        btn: ['保存','取消'],
        btnAlign: 'c',
        area: ['1000px', '700px;'],
        title:'新增物资储备库信息',
        shadeClose: true, //开启遮罩关闭
      },function(){
        var region=$("#province").val();
		$("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_two").val():region=$("#area").val();

		var add_info={
            "region":region,
            "location":$("#latLngs").val().replace(/[;]/g,'').replace(/[ ]/g,""),
            "established_time":$('#add_buildtime').val(),
            "administrator":$('#add_manager').val(),
            "duty":$('#add_duty').val(),
            "phone":$('#add_phone').val(),
            "gps":$('#add_gps').val(),
            "chain_saw":$('#add_yj').val(),
            "water_pump":$("#add_sb").val(),
            "broadax":$('#add_df').val(),
            "hacking_knife":$('#add_kd').val(),
            "clothing":$('#add_fz').val(),
            "tent":$('#add_zp').val(),
            "sleeping_bag":$('#add_sd').val(),
            "rests":$('#add_qt').val(),
            "uav":$('#add_wrj').val(),
            "brush_cutter":$('#add_ggj').val(),
            "anemograph":$('#add_fsy').val(),
            "fire_shovel":$('#add_xfc').val(),
            "dynamo":$('#add_fdj').val(),
            "dynamo_exploder":$('#add_dhj').val(),
            "fire_fighting_water_wheel":$('#add_mhsc').val(),
            "two_three_tool":$('#add_eshgj').val(),
            "pneumatic_extinguisher":$('#add_flmhj').val(),
            "residual_fire_detector":$('#add_yhtcy').val(),
            "handheld_radio_equipment":$('#add_scdjj').val(),
            "wind_water_fire_extinguisher":$('#add_fsmhj').val(),
            "high_pressure_mist_extinguisher":$('#add_gyxswmhj').val(),
            "describe":$('#add_desc').val(),
            "communication_van":$('#add_txc').val(),
            "vehicular_locating_set":$('#add_czt').val(),
            "troop_crawler":$("#add_ybc").val(),
            "fire_hoses":$("#add_mhsq").val(),
            "team_image":imgName,
            "construction_area":$("#add_buildArea").val(),
            "duty":$("#add_duty").val()
        };
        if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(add_info.phone))) {
          layer.msg("手机号填写的格式不对，请正确填写");
          return false;
        }
        if(add_info.city!=''&&add_info.latlng!=''&&add_info.buildTime!=''&&add_info.inputTime!=''&&add_info.buildArea!=''&&add_info.manager!=''&&add_info.phone!=''&&add_info.gps!=''&&add_info.yj!==''&&add_info.sb!=''&&add_info.df!=''&&add_info.kd!=''&&add_info.fz!=''&&add_info.zp!=''&&add_info.sd!=''&&add_info.qt!=''&&add_info.wrj!=''&&add_info.ggj!=''&&add_info.fsy!=''&&add_info.xfc!=''&&add_info.fdj!=''&&add_info.dhj!=''&&add_info.mhsc!=''&&add_info.eshgj!=''&&add_info.flmhj!=''&&add_info.yhtcy!=''&&add_info.scdjj!=''&&add_info.fsmhj!=''&&add_info.gyxswmhj!=''&&add_info.txc!=''&&add_info.czt!=''&&add_info.ybc!=''&&add_info.mhsq!=''){
            sendAjax({
				"url":"fire/fire_material_reserve/addFireMaterialReserve",
				"data":add_info,"callback":function(data){
				if (data.code=="s_ok") {
                    layer.closeAll('page');
                    query();
                    layer.msg('保存成功');
                    imgName=[];
                  }else{
                    layer.msg(data.var);imgName=[];
                  } 
                },
                error:function(e){
                    layer.msg("错误！！");
                }
            });
        }else{
            layer.alert("请完善物资储备库信息", {
                skin: 'layui-layer-molv',
                title:'温馨提示',
                closeBtn: 0,anim: 4,btnAlign: 'c'
            });
        }
      }, function(){
        layer.closeAll('page');
      });
    var all_citys=localStorage.getItem('all_city');
    $('#province').html(all_citys);
      callback1();
      $("#photoName1").takungaeImgup({
		formData: {
			"path": "user_image",
			"file_ext":"image"
		},
		url:"fire/upload/fileUpload",
		id:"imgBox"
	});
};
//查询-物资储备库
var listMap=100;
query();
var num='';
function query() {
    //console.log($("#city").val());
	//var region = $("#hot_city").val();
	var region=($("#city").val()==''||$("#city").val()==undefined)?$("#hot_city").val():($("#village").val()==''||$("#village").val()==undefined)?$("#city").val():$("#village").val();
    addBeiJing();
	var per_page=listMap;
	sendAjax({
		"url":"fire/fire_material_reserve/getFireMaterialReserveList",
		"data":{"current_page": 1, "region":region,"per_page":per_page,},
        "callback":function(data){
			map.clearMap();
			
			if (data.code=="s_ok") {
				$("#complete_report").html('');
				//总条数
				if(data.var.total==0){
					$(".end_total").html(0); num=1;layer.msg('查询数据为空');
				}else{
					var result=data.var.data;
					$(".end_total").html(data.var.total);num=data.var.total;
                    var userLevel = sessionStorage.getItem("userLevel");
					$(".complete_page").createPage({
						pageCount:Math.ceil(num/10),
						current:1,
						backFn:function(p){
							sendAjax({
							"url":"fire/fire_material_reserve/getFireMaterialReserveList",
							"data":{"current_page": p, "region":($("#city").val()==''||$("#city").val()==undefined)?$("#hot_city").val():($("#village").val()==''||$("#village").val()==undefined)?$("#city").val():$("#village").val(),"per_page":10,},
                            "callback":function(data){
                                var result=data.var.data;
                                
                                $("#complete_report").html('');
                                $(".end_total").html(data.var.total);
								for(var i=0;i<result.length;i++){
                                    if(userLevel!='1'){
                                        $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td>" + result[i].location + "</td>><td>" + result[i].construction_area + "</td><td>" + result[i].administrator + "</td><td>" + result[i].phone + "</td><td>" + result[i].established_time + "</td><td>" + result[i].input_time + "</td><td><a class='mr-5' onclick=\"report_index(" + result[i].id + ")\">详情</a> <a onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>");
                                    }else{
                                        $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td>" + result[i].location + "</td>><td>" + result[i].construction_area + "</td><td>" + result[i].administrator + "</td><td>" + result[i].phone + "</td><td>" + result[i].established_time + "</td><td>" + result[i].input_time + "</td><td><a class='mr-5' onclick=\"report_index(" + result[i].id + ")\">详情</a></td></tr>");
                                    }
								}
							}
							})
						}
					});
					for(var i=0;i<result.length;i++){
					    if(userLevel!='1'){
                            $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td>" + result[i].location + "</td>><td>" + result[i].construction_area + "</td><td>" + result[i].administrator + "</td><td>" + result[i].phone + "</td><td>" + result[i].established_time + "</td><td>" + result[i].input_time + "</td><td><a class='mr-5' onclick=\"report_index(" + result[i].id + ")\">详情</a> <a onclick=\"delete_data(" + result[i].id + ")\">删除</a></td></tr>");
                        }else{
                            $("#complete_report").append("<tr><td>" + result[i].region_name + "</td><td>" + result[i].location + "</td>><td>" + result[i].construction_area + "</td><td>" + result[i].administrator + "</td><td>" + result[i].phone + "</td><td>" + result[i].established_time + "</td><td>" + result[i].input_time + "</td><td><a class='mr-5' onclick=\"report_index(" + result[i].id + ")\">详情</a></td></tr>");
                        }

						var icon = new AMap.Icon({
							image:'img/wj/material.png',    
							size: new AMap.Size(76, 54)            
						});
						var lnglatXY=result[i].location.replace(/[;]/g,'').split(",");
						//创建一个标记对象
						var marker = new AMap.Marker({       
							icon: icon,    
							position:lnglatXY,               
							zIndex: 300,
							title:result[i].region_name,        
							map:map                         
						})
						marker.setLabel({
							offset: new AMap.Pixel(-50, -20),
							content: result[i].region_name+'；'+result[i].phone
						});
						markerClick(marker,result[i]);
					};
					map.setFitView();
				}
			}else{
				layer.msg(data.var);
			}
		},
		error: function (e) {
			layer.alert("网络不好，请刷新试试！", {
			skin: 'layui-layer-molv' 
			,closeBtn: 0,anim: 4,btnAlign: 'c'
			});
		}
	});
	// 数据统计
	sendAjax({
		"url":"fire/fire_material_reserve/statisticsFireMaterialReserve",
		"data":{},"callback":function(data){
            
			if (data.code=="s_ok") {
				var result=data.var;
				$("#count_material").html("");
				for(var i=0;i<result.length;i++){
					$("#count_material").append("<tr><td>" + result[i].name + "</td><td>" + result[i].quantity + "</td><td>" + result[i].construction_area + "</td><td>" + result[i].sum
                    + "</td></tr>");
				};
			}else{
				layer.msg(data.var);
			}
		},
		error: function (e) {
			layer.alert("网络不好，请刷新试试！", {
			skin: 'layui-layer-molv' 
			,closeBtn: 0,anim: 4,btnAlign: 'c'
			});
		}
	});
}
//点击查询的时候
function queryBtn() {
    listMap=$("#numberBySearch").val();
    query();
}
//编辑
function remove_disabled() {
    $(".enter_map_two").show();$("#detail_latLngs").css("width","105px")
    $("body").find(".detail_info").find(".remove_disabled").removeAttr("disabled");
    $("#detail_photoName1").removeClass('hide_it');
    $('select').removeAttr("style");
    $('#detail_img').removeClass('hide_it');
    $("#imgBox img").removeClass("imgbig");$("#imgBox img").addClass("up-section");
};
//保存
function disabled_user(id){
    var region=$("#province").val();
    $("#city_two").val()==''||$("#city_two").val()==undefined?region=$("#province").val():$("#area").val()==''||$("#area").val()==undefined?region=$("#city_two").val():region=$("#area").val();
    if(img_del.length>0){
        //说明在修改中有删除图片
        for(var x=0;x<img_del.length;x++){
            list.splice(img_del[x],1);
        }
    }
    if(imgName.length>0){
        for(var y=0;y<imgName.length;y++){
            list.push(imgName[y]);
        }
    }
    var img=list;
    var add_info={
        "id":id,
        "region":region,
        "location":$("#detail_latLngs").val().replace(/[;]/g,'').replace(/[ ]/g,""),
        "established_time":$('#detail_buildtime').val(),
        "administrator":$('#detail_manager').val(),
        "duty":$('#detail_duty').val(),
        "phone":$('#detail_phone').val(),
        "gps":$('#detail_gps').val(),
        "chain_saw":$('#detail_yj').val(),
        "water_pump":$("#detail_sb").val(),
        "broadax":$('#detail_df').val(),
        "hacking_knife":$('#detail_kd').val(),
        "clothing":$('#detail_fz').val(),
        "tent":$('#detail_zp').val(),
        "sleeping_bag":$('#detail_sd').val(),
        "rests":$('#detail_qt').val(),
        "uav":$('#detail_wrj').val(),
        "brush_cutter":$('#detail_ggj').val(),
        "anemograph":$('#detail_fsy').val(),
        "fire_shovel":$('#detail_xfc').val(),
        "dynamo":$('#detail_fdj').val(),
        "dynamo_exploder":$('#detail_dhj').val(),
        "fire_fighting_water_wheel":$('#detail_mhsc').val(),
        "two_three_tool":$('#detail_eshgj').val(),
        "pneumatic_extinguisher":$('#detail_flmhj').val(),
        "residual_fire_detector":$('#detail_yhtcy').val(),
        "handheld_radio_equipment":$('#deatil_scdjj').val(),
        "wind_water_fire_extinguisher":$('#detail_fsmhj').val(),
        "high_pressure_mist_extinguisher":$('#detail_gyxswmhj').val(),
        "describe":$('#detail_desc').val(),
        "communication_van":$('#detail_txc').val(),
        "vehicular_locating_set":$('#detail_czt').val(),
        "troop_crawler":$("#detail_ybc").val(),
        "fire_hoses":$("#detail_mhsq").val(),
        "team_image":img,
        "construction_area":$("#detail_buildArea").val(),
        "duty":$("#detail_duty").val()
    };
    if (!(/^((\d{3}-\d{8}|\d{4}-\d{7,8})|(1[3|5|7|8][0-9]{9}))$/.test(add_info.phone))) {                      
        layer.msg("手机号填写的格式不对，请正确填写");
        return false;
    }
    if(add_info.city!=''&&add_info.latlng!=''&&add_info.buildTime!=''&&add_info.inputTime!=''&&add_info.buildArea!=''&&add_info.manager!=''&&add_info.phone!=''&&add_info.gps!=''&&add_info.yj!==''&&add_info.sb!=''&&add_info.df!=''&&add_info.kd!=''&&add_info.fz!=''&&add_info.zp!=''&&add_info.sd!=''&&add_info.qt!=''&&add_info.wrj!=''&&add_info.ggj!=''&&add_info.fsy!=''&&add_info.xfc!=''&&add_info.fdj!=''&&add_info.dhj!=''&&add_info.mhsc!=''&&add_info.eshgj!=''&&add_info.flmhj!=''&&add_info.yhtcy!=''&&add_info.scdjj!=''&&add_info.fsmhj!=''&&add_info.gyxswmhj!=''&&add_info.txc!=''&&add_info.czt!=''&&add_info.ybc!=''&&add_info.mhsq!=''){
        sendAjax({
            "url":"fire/fire_material_reserve/editFireMaterialReserve",
            "data":add_info,
            "callback":function(data){
            if (data.code=="s_ok") {
                layer.closeAll('page');
                map.clearMap();
                query();
                layer.msg('保存成功');
                imgName=[];
            }else{
                layer.msg(data.var);imgName=[];
                } 
            },
            error:function(e){
                console.log('错误');
                layer.msg("错误！！");
            }
        });
    }else{
        layer.alert("请完善物资储备库信息", {
            skin: 'layui-layer-molv',
            title:'温馨提示',
            closeBtn: 0,anim: 4,btnAlign: 'c'
        });
    }
};
//地图和列表切换
$("#materialSwitch").click(function(){
    if($(this).val()=="切换成列表模式"){
        $("#container_materialmap").hide();
        $(".container_table").show();
        $(this).val("切换成地图模式");
        $(".button-group").hide();
        listMap=10;
        query();
    }else{
        $("#container_materialmap").show();
        $(".container_table").hide();
        $(this).val("切换成列表模式");
        $(".button-group").show();
        listMap=$("#numberBySearch").val();
        query();
    }
});  
//删除
function delete_data(fireid){
    layer.confirm('确定要删除吗？',{
		btn: ['确定','取消'],
		skin: 'layui-layer-molv',
		title:'提示',
		btnAlign: 'c'
	}, function(){
		sendAjax({
			"url":"fire/fire_material_reserve/delFireMaterialReserve",
			"data":{"id": Number(fireid)},"callback":function(element){
				if (element.code=="s_ok"){
				layer.closeAll('page');
				layer.msg('删除成功');
				query();
				infoWindow.close();
				}else{
				layer.msg(element.var);
				}
			},
			error:function(e){
				layer.alert("网络不好，请刷新试试！", {
				skin: 'layui-layer-molv' 
				,closeBtn: 0,anim: 4,btnAlign: 'c'
				});
			}
		});
	}, function(){
		layer.closeAll();
	});
};
//进入数据统计
$(".count_material").click(function(){
    $("#container_materialmap").hide();
    $(".container_table").hide();
    $(".container_count").show();
    //菜单
    $(".main_menu").hide();
    $(".count_menu").show();
});
//数据统计返回
$(".count_menu").click(function(){
    if($("#materialSwitch").val()=="切换成列表模式"){
        $("#container_materialmap").show();
        $(".button-group").hide();
        $(".container_table").show();
        $(".container_count").hide();
        //菜单
        $(".main_menu").show();
        $(".count_menu").hide();
    }else{
        $(".button-group").show();
        $("#container_materialmap").hide();
        $(".container_table").show();
        $(".container_count").hide();
        //菜单
        $(".main_menu").show();
        $(".count_menu").hide();
    }
});
// 放大图片
$("body").on('click','.imgbig',function () {
    var src=$(this).attr("src");
    var $h1="<img src=\"" +src+ "\" style=\"height:98%;width:98%\">";
    layer.confirm(''+$h1+'', {
        type: 0,
        anim: 7,
        skin: 'layui-layer-molv',
        title:'图片预览',
        area: ['570px', '500px;'],
        shadeClose: true,
        btnAlign: 'c'
    }, function(){
        event.preventDefault();
        event.stopPropagation();
        layer.closeAll('dialog');
    }, function(){
    });
})