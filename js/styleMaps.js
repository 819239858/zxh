var fireMaps = new Map();
var forestMaps = new Map();
var fireTypeMaps = new Map();
var fireStatus = new Map();
var fireStaticMap = new Map();
var rewutype = new Map();
var rewuStatus = new Map();
var taskObj =new Map();
var fireStaticMap =new Map();
var nature = new Map();
var userLevel = new Map();
var character = new Map();
var file_type = new Map();
var level = new Map();
var feedback = new Map();
var videotype = new Map();
var news_Type = new Map();
var sign = new Map();
var seenLevel=new Map();

userLevel.put(1,"省");
userLevel.put(2,"市");
userLevel.put(3,"县");
userLevel.put(4,"街道");

character.put(3,"超级管理员");
character.put(1,"普通用户");
character.put(2,"管理员");

taskObj.put(4,"消防员");
taskObj.put(3,"护林员");
taskObj.put(2,"无人机");
taskObj.put(1,"载人机");
taskObj.put(0,"后台用户");

rewuStatus.put("0","已发布");
rewuStatus.put("1","执行中");
rewuStatus.put("2","已完成");
rewuStatus.put("-1","已取消");
rewuStatus.put("-2","已过期");
rewuStatus.put("-3","已拒绝");

rewutype.put("1","森林火灾调查");
rewutype.put("2","林业有害生物");
rewutype.put("3","破坏森林资源调查");
rewutype.put("4","偷猎野生动物调查");
rewutype.put("5","热点核查");
rewutype.put("6","日常核查");
rewutype.put("7","紧急核查");
rewutype.put("8","森林火灾调查");
rewutype.put("9","林业有害生物");
rewutype.put("10","破坏森林资源调查");
rewutype.put("11","偷猎野生动物调查");
rewutype.put("12","空中喷洒");

nature.put("0","专业");
nature.put("1","半专业");
nature.put("2","业余");

fireMaps.put(0, "一般");
fireMaps.put(1, "较大");
fireMaps.put(2, "重大");
fireMaps.put(3, "特别重大");

forestMaps.put("0", "森林火灾");
forestMaps.put("1", "破坏森林资源");
forestMaps.put("2", "偷猎野生生物");
forestMaps.put("3", "林业有害生物");
forestMaps.put("4", "其他情况");

fireTypeMaps.put("0", "地表火");
fireTypeMaps.put("1", "林冠火");
fireTypeMaps.put("2", "地下火");

fireStatus.put("1","已上报");
fireStatus.put("2","已跟踪");
fireStatus.put("3","已结束");

fireStaticMap.put("0","火情上报数(起)");
fireStaticMap.put("1","过火面积(亩)");
fireStaticMap.put("2","死亡人数(人)");
fireStaticMap.put("3","受伤人数(人)");
fireStaticMap.put("4","经济损失(万元)");


level.put("0","高");
level.put("1","中");
level.put("2","低");

file_type.put("0","省");
file_type.put("1","市");
file_type.put("2","县");


feedback.put("","");
feedback.put("0","林火");
feedback.put("1","草原火");
feedback.put("2","计划烧除");
feedback.put("3","农用火");
feedback.put("4","炼山");
feedback.put("5","灌木火");
feedback.put("6","工矿用火");
feedback.put("7","其他");
feedback.put("8","境外火");
feedback.put("9","未找到");
feedback.put("10","核查中");

videotype.put("0","无人机视频");
videotype.put("1","森林消防知识");
videotype.put("2","突发事件视频")

news_Type.put("0","防火动态");
news_Type.put("1","当前火情");
news_Type.put("2","火险预报");
news_Type.put("3","经验交流");

sign.put("0","否");
sign.put("1","是");

seenLevel.put("1","湖南省森林防灭火指挥部发文");
seenLevel.put("2","湖南省森林防灭火指挥部办公室发文");
seenLevel.put("3","新闻发布");
seenLevel.put("4","森林防火简报");
seenLevel.put("5","森林火情专报");
seenLevel.put("6","天气预报 预警信息");
seenLevel.put("7","湖南省应急管理厅");