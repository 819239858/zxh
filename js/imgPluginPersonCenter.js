(function($) {
	imgName = [];
    img_del=[];//删除的图片在数组中的下标
	var imageNum = 1;
	if ($("#maxImageNum").val() != null) {
		imageNum = $("#maxImageNum").val();
	}
    // var delParent;
	$.fn.extend({
		takungaeImgup : function(opt, serverCallBack) {
			if (typeof opt != "object") {
				alert('参数错误!');
				return;
			}
			var $fileInput = $(this);
			// var $fileInputId = $fileInput.attr('id');
			var defaults = {
				fileType : [ "jpg", "png", "bmp", "jpeg","JPG","PNG","JPEG","BMP","doc","DOC","docx","xls","xlsx","pptx","ppt","zip","rar","pdf","PDF" ], // 上传文件的类型
				fileSize : 1024 * 1024 * 10, // 上传文件的大小 2M
				count : 0
			};
			// 组装参数;
			if (opt.success) {
				// var successCallBack = opt.success;
				delete opt.success;
			}
			if (opt.error) {
				var errorCallBack = opt.error;
				delete opt.error;
			}

			/* 点击图片的文本框 */
			$(this).change(function() {
				// var reader = new FileReader();  //新建一个FileReader();
				var idFile = $(this).attr("id");
				var file = document.getElementById(idFile);
				var imgContainer = $("#"+opt.id+"");// 存放图片的父亲元素
				var fileList = file.files; // 获取的图片文件
				// var input = $(this).parent();// 文本框的父亲元素
				var imgArr = [];
				// 遍历得到的图片文件
				var numUp = imgContainer.find(".up-section").length;
				var totalNum = numUp + fileList.length; // 总的数量
				if (fileList.length > imageNum || totalNum > imageNum) {
					alert("上传图片数目不可以超过1个，请重新选择"); // 一次选择上传超过5个
					// 或者是已经上传和这次上传的到的总数也不可以超过5个
				} else if (numUp < imageNum) {
                    // 验证文件的合法性
					fileList = validateUp(fileList,defaults);
					for ( var i = 0; i < fileList.length; i++) {
						// var imgUrl = window.URL.createObjectURL(fileList[i]);
						if(window.createObjectURL != undefined){
                            var imgUrl = window.createObjectURL(fileList[i]);
						}else if(window.URL != undefined){
                            var imgUrl = window.URL.createObjectURL(fileList[i]);
						}else if(window.webkitUrl != undefined){
                            var imgUrl = window.webkitUrl.createObjectURL(fileList[i]);
						}else{
							console.log('无法识别图片的文件');
						}
						imgArr.push(imgUrl);
					};
                    uploadImg(opt, fileList,imgArr);
				}
				//input内容清空
				$(this).val("");
			});
			// 删除图片
			$(this).parents("ul").delegate(".up-section", "click", function(event) {
				var src=$(this).attr("src");
				var that=$(this);
				var $h1="<img src=\"" +src+ "\" style=\"height:98%;width:98%\">";
				layer.confirm(''+$h1+'', {
					type: 0,
					anim: 0,
		            btn: ['删除','取消'],
		            skin: 'layui-layer-molv',
		            title:'图片预览',
		            area: ['570px', '500px;'],
		            shadeClose: true,
		            btnAlign: 'c'
		        }, function(){
		            event.preventDefault();
					event.stopPropagation();
					var img_index =that.index();
					layer.confirm('<div style=\'text-align: center;margin:10px 0;\'>你确定要删除吗？</div>', {
				        type: 0,
				        skin: 'layui-layer-molv',
				        closeBtn: 1,
				        anim: 2,
				        btn: ['确定','取消'],
				        title:"删除图片",
				        shadeClose: true, 
				        btnAlign: 'c',
				    }, function(){
				    	imgName.splice(img_index,1);
				        layer.closeAll('dialog');
						$fileInput.parents("ul").find(".up-section").eq(img_index).remove();
				        layer.msg('删除成功');
                        img_del.push(img_index);//记录已经删除的下标
				    }, function(){
				    	event.preventDefault();
						event.stopPropagation();
				    });
		        }, function(){
		        });
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
								alert('文件大小"' + file.name + '"超出2M限制！');
							} else {
								arrFiles.push(file);
							}
						} else {
							alert('您上传的"' + file.name + '"不符合上传类型');
							return false;
						}
					} else {
						alert('您上传的"' + file.name + '"无法识别类型');
                        return false;
					}
				}
				return arrFiles;
			};
			//图片上传的时候
			function uploadImg(opt, file,imgArr) {
				$("#imguploadFinish").val(false);
				// 验证通过图片异步上传
				layer.msg('正在努力上传中', {
				  icon: 16,shade: 0.01,time:false
				});
				var url = opt.url;
				var data = new FormData();
				var s_token = sessionStorage.getItem("s_token");
				for(var x=0;x<file.length;x++){
                    data.append("file[]", file[x]);
				}
				data.append("path", opt.formData.path);
				data.append("file_ext", opt.formData.file_ext);
				$.ajax({
					type : 'POST',
					url : Public_address+url+'?s_token='+s_token,
					data : data,
					processData : false,
					contentType : false,
					dataType : 'json',
					success : function(data) {
						if (data.code =="s_ok") {
							// 预览
							if(imgArr.length>0){
								for(var i=0;i<imgArr.length;i++){
                                    var $img = $("<img class='up-section'>");
                                    $img.attr("src",imgArr[i]);
                                    $img.attr("data-src", imgArr[i]);
                                    $("#"+opt.id+"").append($img);
								}
							}
							layer.closeAll('dialog');
							layer.msg('上传成功');
							imgName.push(data.var.join());
							if(opt.formData.name=="hotfile"){
								layer.closeAll('page');showFireHot_two();
							}
						}else{
                            layer.closeAll('dialog');
                            layer.msg('上传失败:'+data.var);
                        }

					},
					error : function(e) {
						var err = "上传失败，请联系管理员！";
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
