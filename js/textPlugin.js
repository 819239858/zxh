(function($) {
    videoName=[];
    var imageNum = 1;
    if ($("#maxImageNum").val() != null) {
        imageNum = $("#maxImageNum").val();
    }
    var delParent;
    $.fn.extend({
        takungaevideoup : function(opt, serverCallBack) {
            if (typeof opt != "object") {
                alert('参数错误!');
                return;
            }
            var $fileInput = $(this);
            var $fileInputId = $fileInput.attr('id');//视频格式rm，rmvb，mpeg1－4 mov mtv dat wmv avi 3gp amv dmv flv
            var defaults = {
                fileType : [ "mp4","WebM ","ogg","rmvb","3gp","zip","doc","xls","xlsx","pptx","ppt","pdf","PDF","rar","docx" ], // 上传文件的类型
                fileSize : 1024 * 1024 * 200, // 上传文件的大小 200M
                count : 0
                // 计数器
            };

            // 组装参数;
            if (opt.success) {
                var successCallBack = opt.success;
                delete opt.success;
            }

            if (opt.error) {
                var errorCallBack = opt.error;
                delete opt.error;
            }

            /* 点击视频的文本框 */
            $(this).change(function() {
                var reader = new FileReader();    //新建一个FileReader();
                var idFile = $(this).attr("id");
                var file = document.getElementById(idFile);
                var imgContainer = $("."+opt.id+"");
                var fileList = file.files;  //获取的视频文件
                var input = $(this).parent(); //文本框的父亲元素
                var imgArr = [];
                // 遍历得到的视频文件
                var numUp = imgContainer.find(".up-section").length;
                var totalNum = numUp + fileList.length; // 总的数量
                if (fileList.length > imageNum || totalNum > imageNum) {
                    alert("上传数目不可以超过1个，请重新选择"); // 一次选择上传超过5个
                    // 或者是已经上传和这次上传的到的总数也不可以超过5个
                } else if (numUp < imageNum) {
                    fileList = validateUp(fileList,defaults);
                    for ( var i = 0; i < fileList.length; i++) {
                        var imgUrl = window.URL.createObjectURL(fileList[i]);
                        imgArr.push(imgUrl);
                        uploadImg(opt, fileList[i],imgArr);
                    };
                }
                $(this).val("");
            });
            // 验证文件的合法性
            function validateUp(files, defaults) {
                var arrFiles = [];// 替换的文件数组
                for ( var i = 0, file; file = files[i]; i++) {
                    // 获取文件上传的后缀名
                    var newStr = file.name.split("").reverse().join("");
                    if (newStr.split(".")[0] != null) {
                        var type = newStr.split(".")[0].split("")
                            .reverse().join("");
                        if (jQuery.inArray(type, defaults.fileType) > -1) {
                            // 类型符合，可以上传
                            if (file.size >= defaults.fileSize) {
                                alert('文件大小"' + file.name + '"超出200M限制！');
                            } else {
                                arrFiles.push(file);
                            }
                        } else {
                            alert('您上传的"' + file.name + '"不符合上传类型；');
                        }
                    } else {
                        alert('您上传的"' + file.name + '"无法识别类型');
                    }
                }
                return arrFiles;
            };
            //文件上传的时候
            function uploadImg(opt, file, imgArr) {
                $("#imguploadFinish").val(false);
                console.log(file);
                //type显示的是上传文件的类型
                var type=file.name.split(".")[1];
                if(type=='mp4' || type=='rmvb' || type=='3gp'){
                    type='video';
                }else if(type=='doc' || type=='docx'){
                    type='doc';
                }else{
                    type='other';
                }
                videoName=[];
                // 验证通过视频异步上传
                layer.msg('文件较大，正在努力上传中', {
                    icon: 16,shade: 0.01,time:false
                });
                var url = opt.url;
                var data = new FormData();
                var s_token = sessionStorage.getItem("s_token");
                data.append("file[]", file);
                data.append("path", opt.formData.path);//path
                data.append("file_ext", type);//opt.formData.file_ext
                // console.log(data)
                $.ajax({
                    type : 'POST',
                    url : Public_address+url+'?s_token='+s_token,
                    data : data,
                    processData: false,
                    contentType: false,
                    dataType : 'json',
                    success : function(data) {
                        layer.closeAll('dialog');
                        if (data.code =="s_ok") {
                            // 预览
                            videoName.push(data.var.join());
                            $("."+opt.id+"").html("<span style='margin-left:20px;cursor: pointer;white-space: inherit;' onclick=\"wj_remove('"+data.var+"',this)\">"+imgArr.join()+"<i class='icon-remove' style='color:#addc9d;'></i></span>");

                            layer.msg('上传成功');
                            if(imgArr.length>0){
                                console.log('有视频');
                            }else{
                                console.log('没有视频');
                            }

                            $("#video").attr("src",imgArr.join());
                            $("#video").show();
                        }
                        if (data.error == "error") {
                            layer.msg('上传失败');
                        }
                    },
                    error : function(e) {
                        layer.msg('上传失败');
                        $("#imguploadFinish").val(false);
                        if (errorCallBack) {
                            errorCallBack(err);
                        }
                    }
                });
            }

        }
    });

})(jQuery);
function wj_remove(params,e) {
    layer.confirm('确定要删除吗？', {
        btn: ['确定','取消'],
        skin: 'layui-layer-molv',
        title:'温馨提示',
        btnAlign: 'c'
    }, function(){
        e.remove();
        videoName.splice($.inArray(params,videoName),1);
        layer.msg("删除成功！")
    }, function(){
    });
}