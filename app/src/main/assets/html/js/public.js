//公共js方法

$.config = {router: false};	//禁用msui路由功能

//返回上一页
$(document).on('click','.return-back', function () {
	window.history.back();
});


var p = {};


//遮罩添加
p.mask_box_1_add = function(fun){
	$("body").append("<div class='mask-box-1'></div>");
}
//遮罩删除
p.mask_box_1_del = function(){
	$(".mask-box-1").remove();
}

//登录跳转地址
p.login_href = "login.html";


//数据请求
var post_url = "http://app.cnwdhome.com/";
p.data_post = function(_data){
	var url_data_get = post_url+_data.path;
	$.post(url_data_get,_data.parameter,function(data,status){
		_data.fun(data,status);
	})
	
	//网络连接判断
	$.ajax({
        'url': post_url,
        'timeout': 5000,
        'success':function(response){
            //正常成功执行
        },
        'error':function(jqXHR, textStatus, errorThrown){
            p.jump("the-internet-no.html");
        }
    })
}

//ajax图片提交
p.data_img_post = function(_data){
	var url_data_get = post_url+_data.path;
	$.ajax({
        url: url_data_get,
        type: "post",
        data: _data.parameter,
        dataType: "json",
        cache: false,//上传文件无需缓存
        processData: false,//用于对data参数进行序列化处理 这里必须false
        contentType: false, //必须*/
        success: function (data) {
            _data.fun(data,status);
        }
    });
}

//短信倒计时
p.SMS_countdown = function(dom){
	$(dom).attr("disabled","disabled");
	var time = 60;
	var b = setInterval(a,1000);
	
	function a(){
		$(dom).val(time+"s");
		time--;
		if(time==0){
			clearInterval(b);
			$(dom).removeAttr("disabled");
			$(dom).val("重新发送");
		}
	}
}

//正则验证
p.verify = function(type,parama,paramb){
	if(type == 'number'){
		if(parama == 'int'){ // 正整数
			var R = /^[1-9]*[1-9][0-9]*$/;
		}else if(parama == 'intAndLetter'){ //数字和字母
			var R = /^[A-Za-z0-9]*$/;
		}else if(parama == 'money'){ //金额,最多2个小数
			var R = /^\d+\.?\d{0,2}$/;
		}
		return R.test(paramb);
	}else if(type == 'mobile'){ //手机
		var R = /^1[2|3|4|5|6|7|8|9]\d{9}$/;
		return R.test(parama);
	}else if(type == 'cn'){ //中文
		var R = /^[\u2E80-\u9FFF]+$/;
		return R.test(parama);
	}
};

//跳转
p.jump = function(url,time){
	time = time > 0?time : 0;
	setTimeout(function(){
		location.href = url;
	},time);
}

//返回上一页
p.jump_back = function(time){
	time = time > 0?time : 0;
	setTimeout(function(){
		window.history.back();
	},time);
}

//返回页面并刷新
p.jump_go = function(time,index){
	time = time > 0?time : 0;
	index = index > 1?index : 1;
	setTimeout(function(){
		window.history.go(-index);
	},time);
}

//缓存储存
p.cache = function(name,data){
	localStorage.setItem(name,data); 
}

//读取缓存
p.get_cache = function(name){
	return localStorage.getItem(name);
}

//删除缓存
p.del_cache = function(name){
	return localStorage.removeItem(name);;
}


//获取url中的参数
p.url_data_get = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

//user_token
p.user_token = p.url_data_get('user_token') == null? "" : p.url_data_get('user_token');

//将dom宽高设置一致
p.w_h_set = function(box,dom){
	$(box).find(dom).height($(box).find(dom).width());
}


//退货提示弹窗
$(document).on('click','.application-for-return', function () {
	$.alert_2('如需申请退货,<br/>请联系客服处理相关事宜', '提示',function(){
		p.jump('customer-service.html');
	},'联系客服');
});

//修改订单提示弹窗
$(document).on('click','.change-order', function () {
	$.alert_2('如需修改订单信息,<br/>请联系客服处理相关事宜', '提示',function(){
		p.jump('customer-service.html');
	},'联系客服');
});


//通用页面模板1
p.html_box_1 = function(s_status,s_button_html_box_1,s_html_1,s_index_1,s_a_amount,s_button_html_box_2){
	var html_data = '<div class="shop-order">'+
		'<div class="form-input-2 flex-box-x-z-y-c line-height-auto">'+
			'<label class="line-height-auto color-style-3 min-size-2 flex-1 text-overflow-1">'+s_status+'</label>'+
			s_button_html_box_1+
		'</div>'+
		'<div class="form-input-2 order-details-shop">'+s_html_1+'</div>'+
		'<div class="order-details-operating flex-box-x-z-y-c flex-box-top">'+
			'<div class="content-left">'+
				'<p class="flex-box min-size-2 line-height-auto">'+
					'共'+s_index_1+'件商品 总计：<span class="color-style-3">&yen;'+s_a_amount+'</span>'+
				'</p>'+
			'</div>'+
			'<div class="content-right flex-box-top">'+
				s_button_html_box_2+
			'</div>'+
		'</div>'+
	'</div>';
	return html_data;
}


