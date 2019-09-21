$(document).ready(function(){
	
	//获取缓存user_token
	var user_token = p.get_cache("user_token");
	
	//鉴权
	function check(){
		var check_data = {
			path: "/default/check?user_token="+user_token,
			fun:function(data,status){
				if(data.code=="200"){
					
				}else{
					$.toast(data.message);
					if(data.code == 403){
						p.jump(p.login_href,2000);
					}
					return false;
				}
			}
		}
		p.data_post(check_data);
	}
	
	
	//登录
//	if($("#login-content").length>0){
//		//鉴权
//		var check_data = {
//			path: "/default/check?user_token="+user_token,
//			fun:function(data,status){
//				if(data.code=="200"){
//					p.jump("home.html");
//				}
//			}
//		}
//		p.data_post(check_data);
//		
//		//验证码获取
//		$(document).on('click','#sms-get',function(){
//			var phone_number = $("#phone_number").val();
//			
//			if(!p.verify('mobile',phone_number)){
//				$.toast("请输入正确的手机号");
//				return false;
//			}else{
//				var sms_data = {
//					path: "/default/verify-code",
//					parameter: {
//						phone: phone_number
//					},
//					fun:function(data,status){
//						if(data.code=="200"){
//							$.toast("验证码已发送");
//							p.SMS_countdown("#sms-get");
//						}else{
//							$.toast(data.message);
//							return false;
//						}
//					}
//				}
//				p.data_post(sms_data);
//			}
//		});
//		
//		//登录
//		$(document).on('click','#login-post',function(){
//			var phone_number = $("#phone_number").val();
//			var sms_code = $("#sms_code").val();
//			
//			if(!p.verify('mobile',phone_number)){
//				$.toast("请输入正确的手机号");
//				return false;
//			}else if(sms_code==""){
//				$.toast("请输入验证码");
//				return false;
//			}else{
//				var sms_data = {
//					path: "/user/login",
//					parameter: {
//						phone: phone_number,
//						verify_code: sms_code
//					},
//					fun:function(data,status){
//						if(data.code=="200"){
//							$.toast("登录成功");
//							p.cache("user_token",data.data.access_token);
//							p.jump("home.html",2000);
//						}else if(data.code=="400"){
//							$.toast(data.message);
//					return false;
//						}else{
//							$.toast("登录失败");
//						}
//					}
//				}
//				p.data_post(sms_data);
//			}
//		});
//	}else{  
//		//鉴权
////		var check_data = {
////			path: "/default/check?user_token="+user_token,
////			fun:function(data,status){
////				if(data.code=="200"){
////					
////				}else if(data.code=="403"){
////					$.toast(data.message);
////					p.jump("login.html",2000);
////					return false;
////				}
////			}
////		}
////		p.data_post(check_data);
//	}
	
	
	//首页
	if($("#home-content").length>0){
		
		//缓存user_token
		if(user_token=="null" || user_token==null){
			p.cache("user_token",p.url_data_get('user_token'));
			user_token = p.get_cache("user_token");
		}
		
		if(p.del_cache('jump_data_save')!=null){
			//清空预约缓存
  			p.del_cache('jump_data_save');
		}
		
		//数据
		
		//消息通知提示红点
		var red_notice_data = {
			path: "/user/profile?user_token="+user_token,
			fun:function(data,status){
				if(data.code=="200"){
					if(data.data.notice == 1){
						$("#red-notice-icon").addClass("active-red");
					}
				}else{
					$.toast(data.message);
					if(data.code == 403){
						p.jump(p.login_href,2000);
					}
					return false;
				}
			}
		}
		p.data_post(red_notice_data);
		
		//首页轮播图和菜单
		var home_data_1 = {
			path: "/default/header",
			fun:function(data,status){
				if(data.code=="200"){
					//轮播图数据
					var banner_data = "";
					//跳转标题
					var a_title = "&title="+encodeURI(encodeURI("活动专区"));	//中文encodeURI转码
					data.data.banner.forEach(function(value,index){
						var banner_href = 
							value.type==0? "":
							value.type==1? 'href=article-details.html?article_id='+value.params_id:
							value.type==2? 'href=activity-area.html?id=' + value.params_id + a_title:'';
							
						var banner_url = value.image_url;
						banner_data	+=
						"<a "+ banner_href +" class='swiper-slide'>"+
			        		"<img src="+banner_url+" />"+
			        	"</a>";
					});
					$('#home-banner .swiper-container .swiper-wrapper').html(banner_data);
					
					//首页轮播图
					var mySwiper = new Swiper ('.home-carousel .swiper-container', {
					    loop: true, // 循环模式选项
					    autoplay: {
						    delay: 3000,
						  },
					    // 如果需要分页器
					    pagination: {
					      el: '.home-carousel .swiper-container .swiper-pagination',
					      bulletClass: 'swiper-pagination-bullet-new',
					      bulletActiveClass: 'swiper-pagination-bullet-active-new'
					    }
					});
					
					//首页选项按钮
					var home_option = "";
					data.data.menu.forEach(function(value,index){
						var a_name = value.name;
						var a_logo = value.logo;
						var a_title = "&title="+encodeURI(encodeURI(value.name));	//中文encodeURI转码
						var a_params = 
							value.params==""? "":
							value.params.hasOwnProperty('id')? "id="+value.params.id:
							value.params.hasOwnProperty('classify_id')?  "classify_id="+value.params.classify_id:"";
						var a_href = 
							value.type=="item"? "shop-list.html":
							value.type=="subitem"? "excipient-shop.html":
							value.type=="article"? "article-details.html":
							value.type=="activity"? "activity-area.html":"";
						a_href = a_href+"?"+a_params+a_title;
						home_option	+=
						"<a class='home-option-icon' href="+a_href+">"+
							"<img src="+a_logo+" />"+
							"<span>"+a_name+"</span>"+
						"</a>";
					});
					$('#home-option').html(home_option);
					
					
					
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(home_data_1);
		
		//首页推荐列表
		//下拉加载
		// 每次加载添加多少条目
		var itemsPerLoad = 5;
		var pull_down_data_1 = {
			path: "/default/recommend?page_size=" + itemsPerLoad,
			fun:function(data,status){
				if(data.code=="200"){
					// 加载flag
			      	var loading = false;
					// 最多可加载的条目
					var maxItems = parseInt(data.data.pager.total_page);
					
					//删除加载图标
					if(maxItems==1 || data.data.list.length==0){
						$('.infinite-scroll-preloader').remove();
					}else{
						//显示加载图标
				      	$(".infinite-scroll-preloader").removeClass("display-no");
					}
					
					function addItems(number, lastIndex) {
						// 生成新条目的HTML
						var content_1_html = "";
						var pull_down_data_2 = {
							path: "/default/recommend?page=" + lastIndex + "&page_size=" + number,
							fun:function(data,status){
								if(data.code=="200"){
									data.data.list.forEach(function(value,index){
										var a_article_id = "article_id="+value.article_id;	//中文encodeURI转码
										var a_title = value.title;	//中文encodeURI转码
										var a_url_title = "&title="+encodeURI(encodeURI(value.title));	//中文encodeURI转码
										var a_href = "article-details.html?"+a_article_id+a_url_title;
										var a_img = value.cover_img;
										
										content_1_html += 
										"<li>"+
											"<a href="+a_href+">"+
												"<div style='background-image: url("+a_img+");'></div>"+
												"<span>"+a_title+"</span>"+
											"</a>"+
										"</li>"
									});
									
									// 添加新条目
									$('.page-scrollView #recommended-sharing').append(content_1_html);
								}else{
									$.toast(data.message);
									return false;
								}
							}
						}
						p.data_post(pull_down_data_2);
					}
					
					// 初始页码
			      	var lastIndex = 1;
					
					//预先加载x条
					addItems(itemsPerLoad, lastIndex);
					//显示加载图标
//			      	$(".infinite-scroll-preloader").removeClass("display-no");
			      	
			      	// 注册'infinite'事件处理函数
			      	$(document).on('infinite', '.infinite-scroll', function() {
						// 如果正在加载，则退出
						if(loading) return;
					
						// 设置flag
						loading = true;
						
						// 模拟1s的加载过程
						setTimeout(function() {
							// 重置加载flag
							loading = false;
							
							//更新序号
							lastIndex++;
							if(lastIndex > maxItems) {
								// 加载完毕，则注销无限加载事件，以防不必要的加载
								$.detachInfiniteScroll($('.infinite-scroll'));
								// 删除加载提示符
								$('.infinite-scroll-preloader').html("没有更多了");
								return;
							}
					
							// 添加新条目
							addItems(itemsPerLoad, lastIndex);
							//容器发生改变,如果是js滚动，需要刷新滚动
							$.refreshScroller();
						}, 1000);
					});
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(pull_down_data_1);
		
		$.init();	//初始化方法
	}
	
	//商品详情
	if($("#shop-details-content").length>0){
		
		//获取商品轮播图
		var content_1_html = "";
		var item_id = p.url_data_get("item_id");
		
		$("#make-an-appointment").attr("href","make-an-appointment.html?item_id="+item_id);
		$("#confirm-order").attr("href","confirm-order.html?item_id="+item_id);
		
		var content_data_1 = {
			path: "/item/detail?user_token=" + user_token + "&id=" + item_id,
			fun:function(data,status){
				if(data.code=="200"){
					if(parseInt(data.data.type)==1){
						$(".panoramic-entrance").removeClass("display-no");
						$(".panoramic-entrance").attr("href","panoramic.html?item_id=" + item_id);
					}
					data.data.imgs.forEach(function(value,index){
						content_1_html+='<div class="swiper-slide" style="background-image: url('+value+');"></div>';
					});
					$("#shop-details-banner").html(content_1_html);
					
					//商品详情页轮播图
					var mySwiper = new Swiper ('.shop-details-carousel .swiper-container', {
					    loop: true, // 循环模式选项
					    autoplay: {
						    delay: 3000,
						  },
					    // 如果需要分页器
					    pagination: {
					      el: '.shop-details-carousel .swiper-container .swiper-pagination',
					      bulletClass: 'swiper-pagination-bullet-new-shop',
					      bulletActiveClass: 'swiper-pagination-bullet-active-new-shop'
					    }
					})
					
					$("#shop-details-title").text(data.data.name);
					
					var a_unit = data.data.unit;
					var a_summary = data.data.summary;
					$("#shop-details-keyword").text(a_summary);
					
					//价格
					$("#price").text(data.data.price);
					$("#origin-price").text(data.data.origin_price);
					$(".shop-details-unit").text("/"+a_unit);
					
					//相关推荐
					var content_2_html = "";
					var content_data_2 = {
						path: "/item/list?user_token=" + user_token + "&except_id=" + item_id + "&classify_id=" + data.data.classify_id + "&page_size=6",
						fun:function(data,status){
							if(data.code=="200"){
								if(data.data.list.length==0){
									content_2_html = "<p>暂无数据</p>"
									$('#shop-related-suggestion').html(content_2_html);
								}else{
									data.data.list.forEach(function(value,index){
										var a_href = "shop-details.html?item_id=" + value.item_id;
										var a_cover_img = value.cover_img;
										var a_name = value.name;
										var a_name = value.name;
										var a_price = value.price;
										var a_unit = value.unit;
										
										content_2_html+=
										'<li>'+
											'<a href='+a_href+'>'+
												'<span class="dom-w-h bg-auto" style="background-image: url('+a_cover_img+');"></span>'+
												'<h1>'+a_name+'</h1>'+
												'<div class="flex-box-x-z">'+
													'<span><i>&yen;</i><b>'+a_price+'</b>/'+a_unit+'</span>'+
												'</div>'+
											'</a>'+
										'</li>'
									});
									$('#shop-related-suggestion').html(content_2_html);
									p.w_h_set("#shop-related-suggestion",".dom-w-h");
								}
							}else{
								$.toast(data.message);
								return false;
							}
						}
					}
					p.data_post(content_data_2);
					
					//滚动到底部详情区域加载
					var a_detail = data.data.detail;
					var a_attr = data.data.attr;
					var a_service_description = data.data.service_description;
					
		            var a = document.getElementById("buttons-tab").offsetTop;
		            var a_status = false;
		            
		            if (a >= $("#page-scrollView").scrollTop() && a < ($("#page-scrollView").scrollTop() + $("#page-scrollView").height()) && !a_status) {
		                a_status=true;
		                buttons_shop_details(a_detail,a_attr,a_service_description);
		            }
					$("#page-scrollView").scroll(function() {
			            a = document.getElementById("buttons-tab").offsetTop;
			            if (a >= $("#page-scrollView").scrollTop() && a < ($("#page-scrollView").scrollTop() + $("#page-scrollView").height()) && !a_status) {
			                a_status=true;
		                	buttons_shop_details(a_detail,a_attr,a_service_description);
			            }
			        });
					
					//详情加载方法
					function buttons_shop_details(a,b,c){
						$("#tab1").html(a);
						var content_3_html = "";
						b.forEach(function(value,index){
							var b_name = value.name;
							var b_val = value.val;
							
							content_3_html+=
							'<p class="flex-box-x-l-y-c">'+
				          		'<span>'+b_name+'</span>'+
				          		'<b>'+b_val+'</b>'+
				          	'</p>'
						});
						$("#tab2 > .content-box").html(content_3_html);
						$("#tab3 > .content-box").html(c);
					}
					
					//商品详情收藏
					var a_is_favorite = data.data.is_favorite;
					var collection_status =  a_is_favorite == 0? false : true;
					if(!collection_status){
						$('#collection-shop').find('img').attr('src','img/footer-icon-5.png');
						$('#collection-shop').find('span').text("收藏");
					}else{
						$('#collection-shop').find('img').attr('src','img/footer-icon-5-on.png');
						$('#collection-shop').find('span').text("已收藏");
					}
					$(document).on('click','#collection-shop', function () {
						if(!collection_status){
							var content_data_1 = {
								path: "/item/favorite?user_token=" + user_token,
								parameter:{
									item_id: item_id
								},
								fun:function(data,status){
									if(data.code=="200"){
										$('#collection-shop').find('img').attr('src','img/footer-icon-5-on.png');
										collection_status = true;
										$('#collection-shop').find('span').text("已收藏");
										$.toast("添加收藏夹成功!",1000,'collection-shop-toast');
									}else{
										$.toast(data.message);
										if(data.code == 403){
											p.jump(p.login_href,2000);
										}
										return false;
									}
								}
							}
							p.data_post(content_data_1);
						}else{
							var content_data_1 = {
								path: "/item/favorite-cancel?user_token=" + user_token,
								parameter:{
									item_id: item_id
								},
								fun:function(data,status){
									if(data.code=="200"){
										$('#collection-shop').find('img').attr('src','img/footer-icon-5.png');
										collection_status = false;
										$('#collection-shop').find('span').text("收藏");
										$.toast("取消收藏夹成功!",1000,'collection-shop-toast correct-shop-toast');
									}else{
										$.toast(data.message);
										if(data.code == 403){
											p.jump(p.login_href,2000);
										}
										return false;
									}
								}
							}
							p.data_post(content_data_1);
						}
						
					});
					
				}else{
					$.toast(data.message);
					return false;
				}
			}
			
		}
		p.data_post(content_data_1);
		
		//客服电话
		var consumer_hotline = {
			path: "/default/service-phone?user_token=" + user_token,
			fun:function(data,status){
				if(data.code=="200"){
					
					//商品详情客服弹出选项
					$(document).on('click','#shop-details-clothing', function () {
						
					  	var buttons1 = [
					        {
					          text: '在线客服',
					          bold: true,
					          onClick: function() {
					            window.location.href = "customer-service.html";
					          }
					        },
					        {
					          text: '客服电话' + data.data.phone,
					          onClick: function() {
					            
					          }
					        }
					  	];
					  	var buttons2 = [
					        {
					          text: '取消',
					          color: "danger"
					    	}
						];
						var groups = [buttons1, buttons2];
						$.actions(groups);
				    	
				  	});
					
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(consumer_hotline);
	}
	
	//全景展示
	if($("#panoramic-content").length>0){
		var item_id = p.url_data_get("item_id");
		
		//全景预览
		function panoramic_set(panoramic_img){
	//		$.showPreloader();
			viewer = pannellum.viewer('panoramic-box-content', ﻿{
		        "autoLoad": true,	//自动加载全景图
		        "compass": false,	 //指南针控件关闭
		    	"showFullscreenCtrl": false,	//全屏控件关闭
	      	  	"panorama": panoramic_img,	//图片路径
	      	  	"hfov": 60,		//视野大小
	      	  	"friction": 0.2,	//拖动后停止摩擦力
	      	  	"touchPanSpeedCoeffFactor": 1.3,	//拖拽平移速度
	      	  	"minHfov": 30,	//最小视野
	      	  	"maxHfov": 72,	//最大视野
			});
		}
		
		(function(){
			var panoramic_img_src = [];
			var show = true;
			
			var content_1_html = "";
			var content_data_1 = {
				path: "/item/detail?user_token=" + user_token + "&id=" + item_id,
				fun:function(data,status){
					if(data.code=="200"){
						data.data.vr_data.forEach(function(value,index){
							var a_cover_img = value.cover_img;
							var a_title = value.title;
							var a_vr_img = value.vr_img;
							if(index==0){
								content_1_html+=
								'<li class="panoramic-option-active" style="background-image: url('+a_cover_img+');">'+
									'<p>'+a_title+'</p>'+
								'</li>'
							}else{
								content_1_html+=
								'<li class="" style="background-image: url('+a_cover_img+');">'+
									'<p>'+a_title+'</p>'+
								'</li>'
							}
							panoramic_img_src.push(a_vr_img);
							
						});
						$("#panorama-option").html(content_1_html);
						//加载全景插件
//						window.onload = function(){
						  	panoramic_set(panoramic_img_src[0]);
//						}
							
						
						//全景图片切换
						$(document).on('click','.panoramic-option-box ul li',function(){
							//删除提示弹窗
							$(".pnlm-error-msg").remove();
							$(this).siblings('li').removeClass('panoramic-option-active');
							$(this).addClass('panoramic-option-active');
							panoramic_set(panoramic_img_src[$(this).index()]);
				//			$.showPreloader();
						})
						
					}else{
						$.toast(data.message);
						return false;
					}
				}
			}
			p.data_post(content_data_1);
			
			//隐藏选项卡
			$(document).on('click','.collapse-hide-icon',function(){
				if(show){
					$('.panoramic-option-box').hide();
					$(this).find('div > p').css('background-position','right top');
					$(this).find('div > span').text("更多");
					show = false;
				}else{
					$('.panoramic-option-box').css('display','flex');
					$(this).find('div > p').css('background-position','left top');
					$(this).find('div > span').text("隐藏");
					show = true;
				}
				
			})
		})();
	}
	
	//预约上门
	if($("#make-an-appointment-content").length>0){
		//鉴权
		check();
		var item_id = p.url_data_get("item_id");
		
		//将缓存内容补充到页面
		var new_jump_data_save = p.get_cache("jump_data_save");
		
		var content_data_1 = {
			path: "/item/detail?user_token=" + user_token + "&id=" + item_id,
			fun:function(data,status){
				if(data.code=="200"){
					var a_name = data.data.name;
					$("#intent-product-list > div #name").text(a_name);
					
					if(new_jump_data_save!=null){
						new_jump_data_save = JSON.parse(p.get_cache("jump_data_save"));
						
						new_jump_data_save.data_1.forEach(function(value,index){
							
							$("#intent-product-list").append(
								'<div class="flex-box-x-l-y-c">'+
									'<p id="name">'+value.item_name+'</p>'+
//									'<span>×1</span>'+
								'</div>'
							);
						});
						
						$("#decoration-area").text(new_jump_data_save.data_2);
						$("#contact").text(new_jump_data_save.contact);
						$("#phone").text(new_jump_data_save.phone);
						$("#select-home-time").text(new_jump_data_save.select_home_time);
						$("#memo").text(new_jump_data_save.memo);
					}
				}else{
					$.toast(data.message);
					if(data.code == 403){
						p.jump(p.login_href,2000);
					}
					return false;
				}
			}
		}
		p.data_post(content_data_1);
		
		
		//查看收货地址跳转
		var content_data_4 = {
			path: "/address/default?user_token=" + user_token,
			fun:function(data,status){
				if(data.code=="200"){
					if(!data.data.recipient){
						$('#address_appointment').attr('href','no-address.html');
						$('#address_appointment').text("请添加服务地址");
					}else{
						var a_province = data.data.province == ""? "" : data.data.province+" ";
						var a_city = data.data.city+" ";
						var a_district = data.data.district+" ";
						var a_address = data.data.address;
						$('#address_appointment').attr('href','address-list.html');
						$('#address_appointment').text(a_province+a_city+a_district+a_address);
					}
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(content_data_4);
		
		
      	
//    	//获取地址缓存
//		var address_appointment = p.get_cache('address_appointment');
//		if(address_appointment!=null){
//			$('#address_appointment').text(address_appointment);
//		}
		
		//下拉加载
		// 每次加载添加多少条目
		var itemsPerLoad = 4;
		var content_data_3 = {
			path: "/item/wish-list?user_token=" + user_token + "&item_id=" + item_id + "&page_size=" + itemsPerLoad,
			fun:function(data,status){
				if(data.code=="200"){
					// 加载flag
			      	var loading = false;
					// 最多可加载的条目
					var maxItems = parseInt(data.data.pager.total_page);
					function addItems(number, lastIndex) {
						// 生成新条目的HTML
						var content_1_html = "";
						var content_data_2 = {
							path: "/item/wish-list?user_token=" + user_token + "&item_id=" + item_id + "&page=" + lastIndex + "&page_size=" + number ,
							fun:function(data,status){
								if(data.code=="200"){
									data.data.list.forEach(function(value,index){
										var a_cover_img = value.cover_img;
										var a_name = value.name;
										var a_price = value.price;
										var a_unit = value.unit;
										var a_item_id = value.item_id;
										
										var a_name_2 = "";
										
										if(new_jump_data_save!=null){
											new_jump_data_save = JSON.parse(p.get_cache("jump_data_save"));
											new_jump_data_save.data_1.forEach(function(value_b,index_b){
												if(value_b.item_id==a_item_id){
													a_name_2 = "shop-add-select-icon-active";
												}
											});
										}
										
										content_1_html += 
										'<li>'+
											'<a>'+
												'<span class="dom-w-h bg-auto" style="background-image: url('+a_cover_img+');"></span>'+
												'<h1>'+a_name+'</h1>'+
												'<div class="flex-box-x-z">'+
													'<span><i>&yen;</i><b>'+a_price+'</b>/'+a_unit+'</span>'+
													"<p class='shop-add-select-icon '"+a_name_2+" data-item-id="+a_item_id+" data-item-name='"+a_name+"'></p>"+
												'</div>'+
											'</a>'+
										'</li>';
									});
									
									// 添加新条目
									$('.infinite-scroll .list-container').append(content_1_html);
		 							p.w_h_set(".infinite-scroll .list-container li a",".dom-w-h");	//给图片设置高度
								}else{
									$.toast(data.message);
									return false;
								}
							}
						}
						p.data_post(content_data_2);
					}
					
					// 初始页码
			      	var lastIndex = 1;
					
					//预先加载4条
					addItems(itemsPerLoad, lastIndex);
			      	
			      	// 注册'infinite'事件处理函数
			      	$(document).on('infinite', '.infinite-scroll', function() {
						// 如果正在加载，则退出
						if(loading) return;
					
						// 设置flag
						loading = true;
						
						// 模拟1s的加载过程
						setTimeout(function() {
							// 重置加载flag
							loading = false;
							
							//更新序号
							lastIndex++;
							if(lastIndex > maxItems) {
								// 加载完毕，则注销无限加载事件，以防不必要的加载
								$.detachInfiniteScroll($('.infinite-scroll'));
								// 删除加载提示符
								$('.infinite-scroll-preloader').html("没有更多了");
								return;
							}
					
							// 添加新条目
							addItems(itemsPerLoad, lastIndex);
							//容器发生改变,如果是js滚动，需要刷新滚动
							$.refreshScroller();
						}, 1000);
					});
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(content_data_3);
		
			
		
		
		//意向产品添加
		var h_status = false;	//只在第一次设置高度
		$(document).on('click','#intention-shop-add', function () {
			$(".page-scrollView").addClass("view-no-soller");
		 	$.popup('.popup');
		 	if(!h_status){
		 		p.w_h_set(".infinite-scroll .list-container li a",".dom-w-h");	//给图片设置高度
		 		$('.mescroll-style-1').height(
					$('.mescroll-style-1 .list-container').height()
				);
				h_status = true;
		 	}
		});
		
		//意向产品展示默认产品html
		//选中的商品id
		var a_item_id_data = [item_id];
		if(new_jump_data_save!=null){
			new_jump_data_save = JSON.parse(p.get_cache("jump_data_save"));
			new_jump_data_save.data_1.forEach(function(value,index){
				a_item_id_data.push(value.item_id);
			});
		}
		var a_item_name_data = [];
		var a_item_html_1 = $("#intent-product-list").html();
		$(document).on('click','#intention-shop-add-hide,.modal-overlay-visible', function () {
			$(".page-scrollView").removeClass("view-no-soller");
			//删除除第一个默认商品外的其他商品
			$("#intent-product-list > div:nth-child(1)").siblings().remove();
			
			//选中的商品id
			a_item_id_data = [item_id];
			a_item_name_data = [];
			
			$(".list-container .shop-add-select-icon-active").each(function(){
				a_item_id_data.push($(this).attr("data-item-id"));
				a_item_name_data.push({
					item_id: $(this).attr("data-item-id"),
					item_name: $(this).attr("data-item-name")
				});
				
				//意向产品展示
				var a_item_html_2=
				'<div class="flex-box-x-l-y-c">'+
					'<p id="name">'+$(this).attr("data-item-name")+'</p>'+
//					'<span>×1</span>'+
				'</div>';
				$("#intent-product-list").append(a_item_html_2);
			});
			$.closeModal('.popup');
			p.mask_box_1_del();
		});
		
		//意向产品选择
		$('.mescroll-style-1 .list-container').on('click','li', function () {
			if($(this).find('.shop-add-select-icon').hasClass('shop-add-select-icon-active')){
				$(this).find('.shop-add-select-icon').removeClass('shop-add-select-icon-active');
			}else{
				if($(".list-container .shop-add-select-icon-active").length>=4){
					$.alert_2('意向产品最多可选择5个', '提示',function(){},'我知道了');
					return false;
				}
				$(this).find('.shop-add-select-icon').addClass('shop-add-select-icon-active');
			}
		});
		
		//获取日期
		function getDateStr(AddDayCount) {
		    var dd = new Date();
		    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
		    var y = dd.getFullYear();
		    var m = dd.getMonth()+1;//获取当前月份的日期
		    var d = dd.getDate();
			var time_data = [y,(m<10?'0'+m:m),d];
		    return time_data;
		}
		
		//获取日期
		var aa = new Date();
		
		var new_data = getDateStr(12);
		
		//年
		var year = [];
		
		//月
		var month = [];
		
		//日
		var day = [];
		
		for(var i = 0; i<7; i++){
			var ss = getDateStr(i);
			
			if(year.indexOf(ss[0])==-1){
				year.push(ss[0]);
			}
			
			if(month.indexOf(ss[1])==-1){
				month.push(ss[1]);
			}
			
			if(day.indexOf(ss[2])==-1){
				day.push(ss[2]);
			}
		}
		
		//时
		var hour = [];
		for(var i = 0; i<24; i++){
			hour.push(i.toString());
		}
		
		//分
		var minute = [];
		for(var i = 0; i<60; i++){
			if(i<10){
				minute.push("0"+i.toString());
			}else{
				minute.push(i.toString());
			}
		}
		
		
		//选择上门时间
		$("#select-home-time").picker({
		  toolbarTemplate: '<header class="bar bar-nav">\
		  <button class="button button-link pull-left close-picker color-style-2" id="picker-hide">取消</button>\
		  <button class="button button-link pull-right close-picker color-style-1">确定</button>\
		  <h1 class="title">选择上门时间<span class="color-style-2 display-i-b"> (用户需提前七天预约) </span></h1>\
		  </header>',
		  cols: [
		  	{
		      textAlign: 'center',
		      values: year
		    },{
		      textAlign: 'center',
		      values: month
		    },{
		      textAlign: 'center',
		      values: day
		    },{
		      textAlign: 'center',
		      values: hour
		    },{
		      textAlign: 'center',
		      values: ":",
		      cssClass: "padding-style-3"
		    },{
		      textAlign: 'center',
		      values: minute
		    }
		  ],
		  value: [year[0],month[0],day[0],aa.getHours(),":",aa.getMinutes()],
		  cssClass: 'new-picker-style-1',
		  formatValue: function (picker, value, displayValue){
		  		return value[0]+"-"+value[1]+"-"+value[2]+" "+value[3]+value[4]+value[5];
		  }
		});
		
		//选择上门时间
//		$("#select-home-time").datetimePicker({
//		  toolbarTemplate: '<header class="bar bar-nav">\
//		  <button class="button button-link pull-left close-picker color-style-2" id="picker-hide">取消</button>\
//		  <button class="button button-link pull-right close-picker color-style-1">确定</button>\
//		  <h1 class="title">选择上门时间<span class="color-style-2 display-i-b"> (用户需提前七天预约) </span></h1>\
//		  </header>',
//		  cssClass: 'new-picker-style-1'
//		});
		
		//遮罩添加
		$(document).on('click','#select-home-time', function () {
			$(".page-scrollView").addClass("view-no-soller");
			p.mask_box_1_add();
		});
		
		//遮罩删除
		$(document).on('click','.close-picker,.mask-box-1', function () {
			$(".page-scrollView").removeClass("view-no-soller");
			p.mask_box_1_del();
		});
		
		//提交
		$(document).on('click','#confirm-reservation', function () {
			var user_decoration_area = $("#decoration-area").val();
			var user_contact = $("#contact").val();
			var user_phone = $("#phone").val();
			var user_address_appointment = $("#address_appointment").text();
			var user_select_home_time = $("#select-home-time").val();
			var user_memo = $("#memo").val() == ""? " " : $("#memo").val();
			
			if(user_contact==""){$.toast("请输入您的姓名");return false;}
			if(!p.verify('mobile',user_phone)){$.toast("请输入正确的手机号");return false;}
			if(user_address_appointment=="请添加服务地址"){$.toast("请添加服务地址");return false;}
			if(user_select_home_time=="请选择上门时间"){$.toast("请选择上门时间");return false;}
			
			var content_data_5 = {
				path: "/appointment/submit?user_token=" + user_token,
				parameter: {
					item_ids: a_item_id_data,
					contact: user_contact,
					phone: user_phone,
					address: user_address_appointment,
					time: user_select_home_time,
					area: user_decoration_area,
					memo: user_memo
				},
				fun:function(data,status){
					if(data.code=="200"){
						$.toast("预约成功!");
						p.jump("pay-ok.html?type=0",1000);
					}else{
						$.toast(data.message);
						if(data.code == 403){
							p.jump(p.login_href,2000);
						}
						return false;
					}
				}
			}
			p.data_post(content_data_5);
		});
		$(document).on('click','#confirm-reservation,.return-back', function () {
			//清空预约缓存
      		p.del_cache('jump_data_save');
		});
		
		//页面跳转,储存页面数据
		$(document).on('click','#jump_data_save', function () {
			var jump_data_save = {
				data_1: a_item_name_data,
				data_2: $("#decoration-area").val(),
				contact: $("#contact").val(),
				phone: $("#phone").val(),
				select_home_time: $("#select-home-time").val(),
				memo: $("#memo").val()
			}
			jump_data_save = JSON.stringify(jump_data_save);
			
			//数据储存
			p.cache("jump_data_save",jump_data_save);
		});
		
		$.init();	//初始化方法
	}
	
	//确认订单
	if($("#confirm-order-content").length>0){
		
		//鉴权
		check();
		var item_id = p.url_data_get("item_id");
		
		//将缓存内容补充到页面
		var new_jump_data_save = p.get_cache("jump_data_save");
		
		
		
		var content_data_1 = {
			path: "/item/detail?user_token=" + user_token + "&id=" + item_id,
			fun:function(data,status){
				if(data.code=="200"){
					var a_shop_details_img = data.data.imgs[0];
					var a_shop_details_name = data.data.name;
					var a_shop_details_price = data.data.price;
					var a_shop_details_unit = data.data.unit;
					
					$("#shop-details-img").css("background-image","url("+a_shop_details_img+")");
					$("#shop-details-name").text(a_shop_details_name);
					$("#shop-details-price").text(a_shop_details_price);
					$("#shop-details-unit").text(a_shop_details_unit);
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(content_data_1);
		
		//查看收货地址跳转
		var content_data_2 = {
			path: "/address/default?user_token=" + user_token,
			fun:function(data,status){
				if(data.code=="200"){
					if(!data.data.recipient){
						$('#address_appointment').attr('href','no-address.html');
						$('#address_appointment').text("请添加服务地址");
					}else{
						var a_province = data.data.province == ""? "" : data.data.province+" ";
						var a_city = data.data.city+" ";
						var a_district = data.data.district+" ";
						var a_address = data.data.address;
						$('#address_appointment').attr('href','address-list.html');
						$('#address_appointment').attr('data-address-id',data.data.id);
						$('#address_appointment').text(a_province+a_city+a_district+a_address);
					}
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(content_data_2);
		
		
  		$(document).on("click","#invoice-switch",function(){
  			$("#confirm-order-content").addClass("display-no");
  			$("#invoice-content").removeClass("display-no");
  		});
  		
  		//发票
  		var invoice_details_data = {};
  		
  		$(document).on('click',"#invoice-back",function(){
  			$("#invoice-content").addClass("display-no");
			$("#confirm-order-content").removeClass("display-no");
  		});
		if($("#invoice-content").length>0){
			$(document).on('click','#invoice-y', function () {
				var details_1 = $('#invoice-tab > .active #details-1').val();
				var details_2 = $('#invoice-tab > .active #details-2').val();
				var details_title_1 = $('#invoice-tab > .active #details-1').attr('data-invoice-title');
				var details_title_2 = $('#invoice-tab > .active #details-2').attr('data-invoice-title');
				if(details_1==""){$.toast("请填写完整内容");return false;}
				if(details_2==""){$.toast("请填写完整内容");return false;}
				invoice_details_data = {
					'details_1':details_1,
					'details_2':details_2,
					'details_title_1':details_title_1,
					'details_title_2':details_title_2,
					'type': $(".buttons-row .active").attr("data-invoice-type")
				};
				
				$('#invoice-title-1').text(invoice_details_data.details_title_1);
				$('#invoice-title-2').text(invoice_details_data.details_title_2);
				$('#invoice-details-1').text(invoice_details_data.details_1);
				$('#invoice-details-2').text(invoice_details_data.details_2);
				$('#invoice-form').show();
				$('#invoice-switch').text('需要');
				
				$("#invoice-content").addClass("display-no");
				$("#confirm-order-content").removeClass("display-no");
			});
		}
		
		//下拉加载
		// 每次加载添加多少条目
		var itemsPerLoad = 4;
		var content_data_3 = {
			path: "/item/subitem-list?user_token=" + user_token + "&item_id=" + item_id + "&page_size=" + itemsPerLoad,
			fun:function(data,status){
				if(data.code=="200"){
					// 加载flag
			      	var loading = false;
					// 最多可加载的条目
					var maxItems = parseInt(data.data.pager.total_page);
					function addItems(number, lastIndex) {
						// 生成新条目的HTML
						var content_1_html = "";
						var content_data_4 = {
							path: "/item/subitem-list?user_token=" + user_token + "&item_id=" + item_id + "&page=" + lastIndex + "&page_size=" + number ,
							fun:function(data,status){
								if(data.code=="200"){
									data.data.list.forEach(function(value,index){
										var a_cover_img = value.cover_img;
										var a_name = value.name;
										var a_price = value.price;
										var a_unit = value.unit;
										var a_item_id = value.item_id;
										
										var a_name_2 = "";
										
										if(new_jump_data_save!=null){
											new_jump_data_save = JSON.parse(p.get_cache("jump_data_save"));
											new_jump_data_save.data_1.forEach(function(value_b,index_b){
												if(value_b.item_id==a_item_id){
													a_name_2 = "shop-add-select-icon-active";
												}
											});
										}
										
										content_1_html += 
										'<li>'+
											'<a>'+
												'<span class="dom-w-h bg-auto" style="background-image: url('+a_cover_img+');"></span>'+
												'<h1>'+a_name+'</h1>'+
												'<div class="flex-box-x-z">'+
													'<span><i>&yen;</i><b>'+a_price+'</b>/'+a_unit+'</span>'+
													"<p class='shop-add-select-icon '"+a_name_2+" data-item-id="+a_item_id+" data-item-name="+a_name+" data-item-price="+a_price+" data-item-unit="+"/"+a_unit+" data-item-img="+a_cover_img+"></p>"+
												'</div>'+
											'</a>'+
										'</li>';
									});
									
//									// 添加新条目
									$('.infinite-scroll .list-container').append(content_1_html);
		 							p.w_h_set(".infinite-scroll .list-container li a",".dom-w-h");	//给图片设置高度
								}else{
									$.toast(data.message);
									return false;
								}
							}
						}
						p.data_post(content_data_4);
					}
					
					// 初始页码
			      	var lastIndex = 1;
					
					//预先加载4条
					addItems(itemsPerLoad, lastIndex);
			      	
			      	// 注册'infinite'事件处理函数
			      	$(document).on('infinite', '.infinite-scroll', function() {
						// 如果正在加载，则退出
						if(loading) return;
					
						// 设置flag
						loading = true;
						
						// 模拟1s的加载过程
						setTimeout(function() {
							// 重置加载flag
							loading = false;
							
							//更新序号
							lastIndex++;
							if(lastIndex > maxItems) {
								// 加载完毕，则注销无限加载事件，以防不必要的加载
								$.detachInfiniteScroll($('.infinite-scroll'));
								// 删除加载提示符
								$('.infinite-scroll-preloader').html("没有更多了");
								return;
							}
					
							// 添加新条目
							addItems(itemsPerLoad, lastIndex);
							//容器发生改变,如果是js滚动，需要刷新滚动
							$.refreshScroller();
						}, 1000);
					});
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(content_data_3);
			
		//辅料产品添加
		var h_status = false;	//只在第一次设置高度
		$(document).on('click','#confirm-shop-add', function () {
		 	$.popup('.popup');
		 	$(".page-scrollView").addClass("view-no-soller");
		 	if(!h_status){
		 		p.w_h_set(".infinite-scroll .list-container li a",".dom-w-h");	//给图片设置高度
		 		$('.mescroll-style-1').height(
					$('.mescroll-style-1 .list-container').height()
				);
				h_status = true;
		 	}
		});
		
		
		$(document).on('click','#confirm-shop-add-hide,.modal-overlay-visible', function () {
			//辅料费
			var accessories_money = 0;
			//辅料费设置
			$("#accessories-money").text(0.00);
			//辅料产品选择
			var excipient_list_html = "";
			$(".list-container .shop-add-select-icon-active").each(function(){
				
				//辅料产品展示
				excipient_list_html+=
				'<div class="flex-box-x-z-no-w margin-t-1 excipient-box" data-item-id='+$(this).attr("data-item-id")+' data-item-id='+$(this).attr("data-item-id")+'>'+
					'<div class="order-details-shop-img bg-auto" data-bg-img='+$(this).attr("data-item-img")+' style="background-image: url('+$(this).attr("data-item-img")+');">'+
					'</div>'+
					'<div class="order-details-shop-1 flex-1 flex-box">'+
						'<p class="content-top">'+$(this).attr("data-item-name")+'</p>'+
						'<div class="content-bottom flex-box-x-z-y-e">'+
							'<span data-item-price='+$(this).attr("data-item-price")+' data-item-unit='+$(this).attr("data-item-unit")+' >&yen;'+$(this).attr("data-item-price")+$(this).attr("data-item-unit")+'</span>'+
							'<div class="shop-number-edit flex-box-x-c-y-c">'+
								'<span class="excipient-less" data-price='+$(this).attr("data-item-price")+'>'+
									'<img src="img/shop-less-icon.png" />'+
								'</span>'+
								'<p class="excipient-num">1</p>'+
								'<span class="excipient-add" data-price='+$(this).attr("data-item-price")+'>'+
									'<img src="img/shop-add-icon.png" />'+
								'</span>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';
				
				accessories_money+=parseFloat($(this).attr("data-item-price"));
			});
			$("#excipient-list").html(excipient_list_html);
			
			//辅料费设置
			$("#accessories-money").text(accessories_money.toFixed(2));
			//材料费
			var material_money = parseFloat($("#material-money").text());
			
			//实付
			$("#actually-paid").text((material_money+accessories_money).toFixed(2));
			$("#all-money").text((material_money+accessories_money).toFixed(2));
			
			$.closeModal('.popup');
			p.mask_box_1_del();
			
			$(".page-scrollView").removeClass("view-no-soller");
		});
		
		//减去数量
		$('#excipient-list').on('click','.excipient-box .excipient-less', function () {
			var excipient_num = parseInt($(this).siblings(".excipient-num").text());
			if(excipient_num==1){
				return false;
			}else{
				excipient_num--;
				
				//辅料费
				var accessories_money = parseFloat($("#accessories-money").text());
				accessories_money=accessories_money-parseFloat($(this).attr("data-price"));
				$("#accessories-money").text(accessories_money);
				//材料费
				var material_money = parseFloat($("#material-money").text());
				//实付
				$("#actually-paid").text((material_money+accessories_money).toFixed(2));
				$("#all-money").text((material_money+accessories_money).toFixed(2));
				
				$(this).siblings(".excipient-num").text(excipient_num);
			}
		});
		
		//添加数量
		$('#excipient-list').on('click','.excipient-box .excipient-add', function () {
			var excipient_num = parseInt($(this).siblings(".excipient-num").text());
			excipient_num++;
			
			//辅料费
			var accessories_money = parseFloat($("#accessories-money").text());
			accessories_money=accessories_money+parseFloat($(this).attr("data-price"));
			$("#accessories-money").text(accessories_money);
			//材料费
			var material_money = parseFloat($("#material-money").text());
			//实付
			$("#actually-paid").text((material_money+accessories_money).toFixed(2));
			$("#all-money").text((material_money+accessories_money).toFixed(2));
			
			$(this).siblings(".excipient-num").text(excipient_num);
		});
		
		//辅料产品选择
		$('.infinite-scroll .list-container').on('click','li', function () {
			if($(this).find('.shop-add-select-icon').hasClass('shop-add-select-icon-active')){
				$(this).find('.shop-add-select-icon').removeClass('shop-add-select-icon-active');
			}else{
				$(this).find('.shop-add-select-icon').addClass('shop-add-select-icon-active');
			}
		});
		
		//获取日期
		function getDateStr(AddDayCount) {
		    var dd = new Date();
		    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
		    var y = dd.getFullYear();
		    var m = dd.getMonth()+1;//获取当前月份的日期
		    var d = dd.getDate();
			var time_data = [y,(m<10?'0'+m:m),d];
		    return time_data;
		}
		
		//获取日期
		var aa = new Date();
		
		var new_data = getDateStr(12);
		
		//年
		var year = [];
		
		//月
		var month = [];
		
		//日
		var day = [];
		
		for(var i = 0; i<7; i++){
			var ss = getDateStr(i);
			
			if(year.indexOf(ss[0])==-1){
				year.push(ss[0]);
			}
			
			if(month.indexOf(ss[1])==-1){
				month.push(ss[1]);
			}
			
			if(day.indexOf(ss[2])==-1){
				day.push(ss[2]);
			}
		}
		
		//时
		var hour = [];
		for(var i = 0; i<24; i++){
			hour.push(i.toString());
		}
		
		//分
		var minute = [];
		for(var i = 0; i<60; i++){
			if(i<10){
				minute.push("0"+i.toString());
			}else{
				minute.push(i.toString());
			}
		}
		
		
		//选择上门时间
		$("#select-delivery-time").picker({
		  toolbarTemplate: '<header class="bar bar-nav">\
		  <button class="button button-link pull-left close-picker color-style-2" id="picker-hide">取消</button>\
		  <button class="button button-link pull-right close-picker color-style-1">确定</button>\
		  <h1 class="title">选择上门时间<span class="color-style-2 display-i-b"> (用户需提前七天预约) </span></h1>\
		  </header>',
		  cols: [
		  	{
		      textAlign: 'center',
		      values: year
		    },{
		      textAlign: 'center',
		      values: month
		    },{
		      textAlign: 'center',
		      values: day
		    },{
		      textAlign: 'center',
		      values: hour
		    },{
		      textAlign: 'center',
		      values: ":",
		      cssClass: "padding-style-3"
		    },{
		      textAlign: 'center',
		      values: minute
		    }
		  ],
		  value: [year[0],month[0],day[0],aa.getHours(),":",aa.getMinutes()],
		  cssClass: 'new-picker-style-1',
		  formatValue: function (picker, value, displayValue){
		  		return value[0]+"-"+value[1]+"-"+value[2]+" "+value[3]+value[4]+value[5];
		  }
		});
		
		//选择上门时间
//		$("#select-delivery-time").datetimePicker({
//		  toolbarTemplate: '<header class="bar bar-nav">\
//		  <button class="button button-link pull-left close-picker color-style-2" id="picker-hide">取消</button>\
//		  <button class="button button-link pull-right close-picker color-style-1">确定</button>\
//		  <h1 class="title">选择配送时间<span class="color-style-2 display-i-b"> (用户需提前七天预约) </span></h1>\
//		  </header>',
//		  cssClass: 'new-picker-style-1'
//		});
		
		//是否安装
		var installation_status = false;
		$(document).on('click','#installation-switch', function () {
			if(!installation_status){
				$('#confirm-order-content #installation-form').show();
				$(this).text('是');
				installation_status = true;
			}else{
				$('#confirm-order-content #installation-form').hide();
				$(this).text('否');
				$("#installation-area").val("");
				$("#installation-fee").text(0);
				installation_status = false;
			}
			
		});
		
		//预计安装费用
		$("#installation-area").bind('input propertychange', function() {
			var installation_area = parseFloat($(this).val());
			$("#installation-fee").text(parseFloat(installation_area*20).toFixed(2));
		})
		
		//面积
		$("#area").bind('input propertychange', function() {
			var new_area = $(this).val();
			if($(this).val()==""){
				new_area = 0;
			}
			
			//商品价格
			var shop_details_price = parseFloat($("#shop-details-price").text());
			//面积数
			var installation_area = parseInt(new_area);
			
			//材料费设置
			$("#material-money").text((shop_details_price*installation_area).toFixed(2));
			
			//材料费
			var material_money = parseFloat($("#material-money").text());
			//辅料费
			var accessories_money = parseFloat($("#accessories-money").text());
			
			//实付
			$("#actually-paid").text((material_money+accessories_money).toFixed(2));
			$("#all-money").text((material_money+accessories_money).toFixed(2));
		})
		
		//遮罩添加
		$(document).on('click','#select-delivery-time', function () {
			$(".page-scrollView").addClass("view-no-soller");
			p.mask_box_1_add();
		});
		
		//遮罩删除
		$(document).on('click','.close-picker,.mask-box-1', function () {
			$(".page-scrollView").removeClass("view-no-soller");
			p.mask_box_1_del();
		});
		
		//支付方式选择
		$('#pay-select').on('click','.form-input-1', function () {
			$(this).siblings().find('.confirm-circle-icon-1').removeClass('confirm-circle-icon-1-active');
			$(this).find('.confirm-circle-icon-1').addClass('confirm-circle-icon-1-active');
			if($(this).attr('data-pay-id')==3){
				$(".page-scrollView").addClass("view-no-soller");
				$.alert_2('线下支付需前往线下实体店完成付款 总部才会发货，若此付款方式不便 操作，请选择其他支付方式', '提示',function(){
					$(".page-scrollView").removeClass("view-no-soller");
				},'我知道了');
			}
		});
		
		$(document).on('click','#submit-orders', function () {
			var a_area = $("#area").val();
			var a_select_delivery_time = $("#select-delivery-time").val();
			var invoice_switch = $("#invoice-switch").text();
			var installation_switch = $("#installation-switch").text();
			var pay_select_id = $("#pay-select .confirm-circle-icon-1-active").parent().attr("data-pay-id");
			var data_address_id = $("#address_appointment").attr("data-address-id");
			
			var invoice_details_1 = $("#invoice-details-1").val();
			var invoice_details_2 = $("#invoice-details-2").val();
			
			var installation_area = $("#installation-area").val();
			var installation_fee = $("#installation-fee").text();
			
			if(data_address_id==""){$.toast("请选择地址!");return false;}
//			if($("#excipient-list .excipient-box").length==0){$.toast("请选择辅料!");return false;}
			if(a_area==""){$.toast("请输入购买面积!");return false;}
			if(a_select_delivery_time==""){$.toast("请选择配送时间!");return false;}
			if($("#pay-select .confirm-circle-icon-1-active").length==0){$.toast("请选择支付方式!");return false;}
			
      		//默认当前订单商品
      		var a_items = [
      			{
      				item_id: item_id,
      				num: a_area
      			}
      		];
      		
      		$("#excipient-list .excipient-box").each(function(){
      			a_items.push(
      				{
      					item_id: $(this).attr("data-item-id"),
      					num: $(this).find(".excipient-num").text()
      				}
      			);
      		});
      		
      		
      		if(installation_switch=="是" && invoice_switch=="需要"){//需要发票和安装
      			var a_parameter = {
					items: a_items,
					item_id: item_id,
					num: a_area,
					payment_type: pay_select_id,
					address_id: data_address_id,
					time: a_select_delivery_time,
					invoice: {
						invoice_type: invoice_details_data.type,
						invoice_title: invoice_details_data.details_1,
						invoice_no: invoice_details_data.details_2
					},
					invoice_type: invoice_details_data.type,
					install: {
						install_area: installation_area,
						install_fee: installation_fee
					}
				};
      		}else if(installation_switch=="是"){//需要安装
      			var a_parameter = {
					items: a_items,
					item_id: item_id,
					num: a_area,
					payment_type: pay_select_id,
					address_id: data_address_id,
					time: a_select_delivery_time,
					install: {
						install_area: installation_area,
						install_fee: installation_fee
					}
				};
      		}else if(invoice_switch=="需要"){//需要发票
      			var a_parameter = {
					items: a_items,
					item_id: item_id,
					num: a_area,
					payment_type: pay_select_id,
					address_id: data_address_id,
					time: a_select_delivery_time,
					invoice: {
						invoice_type: invoice_details_data.type,
						invoice_title: invoice_details_data.details_1,
						invoice_no: invoice_details_data.details_2
					},
					invoice_type: invoice_details_data.type
				};
      		}else{//都不需要
      			var a_parameter = {
					items: a_items,
					item_id: item_id,
					num: a_area,
					payment_type: pay_select_id,
					address_id: data_address_id,
					time: a_select_delivery_time
				};
      		}
      		
      		//订单提交
      		var content_data_5 = {
				path: "/order/submit?user_token=" + user_token,
				parameter: a_parameter,
				fun:function(data,status){
					if(data.code=="200"){
						$.toast("提交成功!");
						if(pay_select_id=="3"){
							p.jump("pay-ok.html?type=1",1000);
						}else{
							p.jump("pay.html?order_id=" + data.data.order_id,1000);
						}
					}else{
						$.toast(data.message,2000,"height-auto max-width-1");
						if(data.code == 403){
							p.jump(p.login_href,2000);
						}
						return false;
					}
				}
			}
			p.data_post(content_data_5);
      		
      		
		});
		
		$(document).on('click','#submit-orders,.return-back', function () {
			//清空预约缓存
      		p.del_cache('jump_data_save');
		});
		
		//缓存数据设置到页面
		if(new_jump_data_save!=null){
			var excipient_list_html = "";
			new_jump_data_save = JSON.parse(p.get_cache("jump_data_save"));
			new_jump_data_save.data_1.forEach(function(value,index){
				excipient_list_html+=
				'<div class="flex-box-x-z-no-w margin-t-1 excipient-box" data-item-id='+value.item_id+' data-item-id='+value.item_id+'>'+
					'<div class="order-details-shop-img bg-auto" data-bg-img='+value.img+' style="background-image: url('+value.img+');">'+
					'</div>'+
					'<div class="order-details-shop-1 flex-1 flex-box">'+
						'<p class="content-top">'+value.name+'</p>'+
						'<div class="content-bottom flex-box-x-z-y-e">'+
							'<span data-item-price='+value.price+' data-item-unit='+value.unit+' >&yen;'+value.price+value.unit+'</span>'+
							'<div class="shop-number-edit flex-box-x-c-y-c">'+
								'<span class="excipient-less" data-price='+value.price+'>'+
									'<img src="img/shop-less-icon.png" />'+
								'</span>'+
								'<p class="excipient-num">'+value.num+'</p>'+
								'<span class="excipient-add" data-price='+value.price+'>'+
									'<img src="img/shop-add-icon.png" />'+
								'</span>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';
				
				//辅料选择
				$("#excipient-list").html(excipient_list_html);
			});
			
			
			$("#area").text(new_jump_data_save.a_area);
			$("#select-delivery-time").text(new_jump_data_save.select_delivery_time);
			
			//发票
			if(new_jump_data_save.invoice_form.stauts){
				$('#invoice-title-1').text(new_jump_data_save.invoice_form.details_title_1);
				$('#invoice-title-2').text(new_jump_data_save.invoice_form.details_title_2);
				$('#invoice-details-1').text(new_jump_data_save.invoice_form.invoice_details_1);
				$('#invoice-details-2').text(new_jump_data_save.invoice_form.invoice_details_2);
				$('#invoice-form').show();
				$('#invoice-switch').text('需要');
			}
			//安装
			if(new_jump_data_save.installation_form.stauts){
				$('#confirm-order-content #installation-form').show();
				$("#installation-switch").text('是');
				installation_status = true;
				
				installation_area: $("#installation-area").val(new_jump_data_save.installation_form.installation_area);
				installation_fee: $("#installation-fee").text(new_jump_data_save.installation_form.installation_fee);
			}
			
			$("#accessories-money").text(new_jump_data_save.accessories_money);
			$("#material-money").text(new_jump_data_save.material_money);
			$("#delivery-money").text(new_jump_data_save.delivery_money);
			$("#all-money").text(new_jump_data_save.all_money);
			
			$("#actually-paid").text(new_jump_data_save.actually_paid);
			
			if(new_jump_data_save.data_pay){
				$("#pay-select .form-input-1").each(function(){
					if($(this).attr("data-pay-id")==new_jump_data_save.data_pay){
						$(this).find('.confirm-circle-icon-1').addClass('confirm-circle-icon-1-active');
					}
				});
			}
		}
				
		
		//页面跳转,储存页面数据
		$(document).on('click','#jump_data_save', function () {
			//默认当前订单商品
      		var a_item_name_data = [];
      		
      		//辅料商品
      		$("#excipient-list .excipient-box").each(function(){
      			a_item_name_data.push(
      				{
      					item_id: $(this).attr("data-item-id"),
      					num: $(this).find(".excipient-num").text(),
      					name: $(this).find(".order-details-shop-1 > .content-top").text(),
      					img: $(this).find(".order-details-shop-img").attr("data-bg-img"),
      					price: $(this).find(".order-details-shop-1 > .content-bottom > span").attr("data-item-price"),
      					unit: $(this).find(".order-details-shop-1 > .content-bottom > span").attr("data-item-unit")
      				}
      			);
      		});
			
			var installation_switch = false;	//安装
			var invoice_switch = false;		//发票
			if($("#installation-switch").text()=="是"){//需要安装
      			installation_switch = true;
      		}
      		if($("#invoice-switch").text()=="需要"){//需要发票
				invoice_switch = true;
			}
      		
      		var data_pay_id = false;
      		//支付方式选择
      		if($("#pay-select .confirm-circle-icon-1-active").length>0){
      			data_pay_id = $("#pay-select .confirm-circle-icon-1-active").parent().attr("data-pay-id");
      		} 
      		
			var jump_data_save = {
				data_1: a_item_name_data,
				a_area: $("#area").val(),
				select_delivery_time: $("#select-delivery-time").val(),
				invoice_form:{	//发票
					invoice_details_1: $("#invoice-details-1").text(),
					invoice_details_2: $("#invoice-details-2").text(),
					details_title_1: $('#invoice-title-1').text(),
					details_title_2: $('#invoice-title-2').text(),
					stauts: invoice_switch
				},
				installation_form:{		//安装
					installation_area: $("#installation-area").val(),
					installation_fee: $("#installation-fee").text(),
					stauts: installation_switch
				},
				accessories_money: $("#accessories-money").text(),
				material_money: $("#material-money").text(),
				delivery_money: $("#delivery-money").text(),
				all_money: $("#all-money").text(),
				actually_paid: $("#actually-paid").text(),
				data_pay: data_pay_id
			}
			
			
			jump_data_save = JSON.stringify(jump_data_save);
			//数据储存
			p.cache("jump_data_save",jump_data_save);
		});
		
		$.init();	//初始化方法
	}
	
	//订单提交成功
	if($("#pay-ok-content").length>0){
		//获取订单类型   type, 0=预约订单   1=支付订单
		var type = p.url_data_get('type');
		if(type==0){
			$("title,.title_text").text("预约成功");
			$("#ok-text").text("平台会尽快安排上门");
		}else if(type==1){
			$("title,.title_text").text("支付成功");
			$("#ok-text").text("平台会尽快安排商品发货");
		}else if(type==2){
			$("title,.title_text").text("支付失败");
			$("#ok-text").text("非常抱歉，支付失败，请重试");
		}
	}
	
	//商品列表
	if($("#shop-list-content").length>0){
		//页面标题
		var title = p.url_data_get('title');
		var classify_id = p.url_data_get('classify_id');
		title = decodeURI(title);	//中文转码
		$('title').text(title);
		$("#shop-list-content .title-header h1").text(title);
		
		
		// 初始页码
	  	var lastIndex = 1;
		// 每次加载添加多少条目
		var itemsPerLoad = 12;
		//初始地址
		var path = "/item/list?";
		var pull_down_data_1 = {
			path: "/item/list?" + "page_size=" + itemsPerLoad + "&classify_id=" + classify_id,
			fun:function(data,status){
				if(data.code=="200"){
					// 加载flag
			      	var loading = false;
			      	//防止切换后第一次会加载
			      	var loading_new = false;
					// 最多可加载的条目
					var maxItems = parseInt(data.data.pager.total_page);
					
					//商品列表加载提示
					if(data.data.list.length==0){
						$('.infinite-scroll-preloader').html("暂无商品");
						$('.infinite-scroll-preloader').removeClass("display-no");
					}else if(maxItems==1 && data.data.list.length>0){
//						$('.infinite-scroll-preloader').remove();
					}else{
						$('.infinite-scroll-preloader').removeClass("display-no");
					}
					function addItems(number, lastIndex, path) {
						// 生成新条目的HTML
						var content_1_html = "";
						var pull_down_data_2 = {
							path: path + "&page=" + lastIndex + "&page_size=" + number + "&classify_id=" + classify_id,
							fun:function(data,status){
								if(data.code=="200"){
									data.data.list.forEach(function(value,index){
										var a_href = "shop-details.html?item_id=" + value.item_id;
										var a_cover_img = value.cover_img;
										var a_name = value.name;
										var a_num = value.num;
										var a_price = value.price;
										var a_summary = value.summary;
										var a_unit = value.unit;
										
										content_1_html+=
										'<li>'+
											'<a href='+a_href+'>'+
												'<span class="dom-w-h bg-auto" style="background-image: url('+a_cover_img+');"></span>'+
												'<h1>'+a_name+'</h1>'+
												'<p class="text-overflow">'+a_summary+'</p>'+
												'<div class="flex-box-x-z">'+
													'<span><i>&yen;</i><b>'+a_price+'</b>/'+a_unit+'</span>'+
													'<span>库存<i>'+a_num+'</i>'+a_unit+'</span>'+
												'</div>'+
											'</a>'+
										'</li>';
									});
									
									// 添加新条目
									$("#shop-list-details").append(content_1_html);
									p.w_h_set("#shop-list-details",".dom-w-h");
								}else{
									$.toast(data.message);
									return false;
								}
							}
						}
						p.data_post(pull_down_data_2);
					}
					
					//预先加载x条
					addItems(itemsPerLoad, lastIndex , path);
//					//显示加载图标
//			      	$(".infinite-scroll-preloader").removeClass("display-no");
			      	// 注册'infinite'事件处理函数
		      		$(document).on('infinite', '.infinite-scroll', function() {
						
						//防止切换后第一次会加载
						if(loading_new){
							loading_new = false; 
							return;
						}
						
						// 如果正在加载，则退出
						if(loading)  return;
						
						// 设置flag
						loading = true;
						
						// 模拟1s的加载过程
						setTimeout(function() {
							// 重置加载flag
							loading = false;
							
							//更新序号
							lastIndex++;
							if(lastIndex > maxItems) {
								
								// 加载完毕，则注销无限加载事件，以防不必要的加载
								//$.detachInfiniteScroll($('.infinite-scroll'));
								// 删除加载提示符
								$('.infinite-scroll-preloader').html("没有更多了");
								return;
							}
					
							// 添加新条目
							addItems(itemsPerLoad, lastIndex , path);
							//容器发生改变,如果是js滚动，需要刷新滚动
							$.refreshScroller();
						}, 1000);
					});
			      	
					
					//商品筛选
					var price_status = false;
					$('.shop-filter > ul').on('click','li', function () {
						//防止切换后第一次会加载
						loading_new = true;
						
						//初始加载图标
						if(maxItems>1){
							$('.infinite-scroll-preloader').html("<div class='preloader'></div>");
						}
						
						//每次切换清空html
						$("#shop-list-details").empty();
						
						//初始化页码
						lastIndex = 1;
						
						//初始化价格筛选图标
						$(this).siblings().removeClass('shop-filter-active');
						$(this).siblings().removeClass('shop-filter-active-2');
						
						//如果选中的是价格筛选
						if($(this).attr('id')=='price'){
							if(!price_status){	//降序
								$(this).removeClass('shop-filter-active-2');
								$(this).addClass('shop-filter-active');
								price_status = true;
								
								//url参数设置
								path = "/item/list?sort_price=desc";
								addItems(itemsPerLoad, lastIndex , path);
							}else{	//升序
								$(this).removeClass('shop-filter-active');
								$(this).addClass('shop-filter-active-2');
								price_status = false;
								
								//url参数设置
								path = "/item/list?sort_price=asc";
								addItems(itemsPerLoad, lastIndex , path);
							}
						}else{
							price_status = false;
							$(this).addClass('shop-filter-active');
							var url_data = $(this).attr("data-filter-tpye") == "comprehensive"? "" : "&" + $(this).attr("data-filter-tpye"); 
							
							//url参数设置
							path = "/item/list?" + url_data;
							addItems(itemsPerLoad, lastIndex , path);
						}
					});
					
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(pull_down_data_1);
		
		$.init();	//初始化方法
	}
	
//	//地址列表
//	if($("#address-list-content").length>0){
//		var title = p.url_data_get('type');
//		
//		$('#address-list-details').on('click','#address-list-details-box', function () {
//			var data = $(this).find('#name').text() +" "+ $(this).find('#tel').text() +" "+ $(this).find('#address-text').text();
//			p.cache('address_appointment',data);
//			window.history.back();
//		});
//	}
	
	//辅料产品
	if($("#fuliao-content").length>0){
		
		// 初始页码
	  	var lastIndex = 1;
		// 每次加载添加多少条目
		var itemsPerLoad = 12;
		//初始地址
		var path = "/item/sub-list?";
		var pull_down_data_1 = {
			path: "/item/sub-list?page_size=" + itemsPerLoad + "&user_token=" + user_token,
			fun:function(data,status){
				if(data.code=="200"){
					var content_html_2 = '';
					
					//筛选列表
					data.data.classify.forEach(function(value,index){
						if(index==0){
							content_html_2+=
							'<li class="shop-filter-active" data-fuliao-id="">全部</li>'+
							'<li data-fuliao-id='+value.classify_id+'>'+value.name+'</li>'
						}else{
							content_html_2+=
							'<li data-fuliao-id='+value.classify_id+'>'+value.name+'</li>'
						}
					});
					
					$("#shimu-shop-list").html(content_html_2);
					
					// 加载flag
			      	var loading = false;
			      	//防止切换后第一次会加载
			      	var loading_new = false;
					// 最多可加载的条目
					var maxItems = parseInt(data.data.pager.total_page);
					
					//商品列表加载提示
					if(data.data.list.length==0){
						$('.infinite-scroll-preloader').html("暂无商品");
						$('.infinite-scroll-preloader').removeClass("display-no");
						return false;
					}else if(maxItems==1 && data.data.list.length>0){
//						$('.infinite-scroll-preloader').remove();
					}else{
						$('.infinite-scroll-preloader').removeClass("display-no");
					}
					function addItems(number, lastIndex, path) {
						// 生成新条目的HTML
						var content_1_html = "";
						var pull_down_data_2 = {
							path: path + "page=" + lastIndex + "&page_size=" + number + "&user_token=" + user_token,
							fun:function(data,status){
								if(data.code=="200"){
									//商品列表加载提示
									if(data.data.list.length==0 && $('.infinite-scroll-preloader').html()!="暂无商品"){
										$('.infinite-scroll-preloader').html("暂无商品");
										$('.infinite-scroll-preloader').removeClass("display-no");
										return false;
									}else if(parseInt(data.data.pager.total_page)==1 && data.data.list.length>0){
										$('.infinite-scroll-preloader').addClass("display-no");
									}else{
										$('.infinite-scroll-preloader').removeClass("display-no");
									}
									
									data.data.list.forEach(function(value,index){
										var a_href = "shop-details.html?item_id=" + value.item_id;
										var a_cover_img = value.cover_img;
										var a_name = value.name;
										var a_num = value.num;
										var a_price = value.price;
										var a_summary = value.summary;
										var a_unit = value.unit;
										
										content_1_html+=
										'<li>'+
											'<a href='+a_href+'>'+
												'<span class="dom-w-h bg-auto" style="background-image: url('+a_cover_img+');"></span>'+
												'<h1>'+a_name+'</h1>'+
												'<p class="text-overflow">'+a_summary+'</p>'+
												'<div class="flex-box-x-z">'+
													'<span><i>&yen;</i><b>'+a_price+'</b>/'+a_unit+'</span>'+
													'<span>库存<i>'+a_num+'</i>'+a_unit+'</span>'+
												'</div>'+
											'</a>'+
										'</li>'
									});
									
									$("#shop-list-details").append(content_1_html);
									p.w_h_set("#shop-list-details",".dom-w-h");
								}else{
									$.toast(data.message);
									return false;
								}
							}
						}
						p.data_post(pull_down_data_2);
					}
					
					//预先加载x条
					addItems(itemsPerLoad, lastIndex , path);
//					//显示加载图标
//			      	$(".infinite-scroll-preloader").removeClass("display-no");
			      	// 注册'infinite'事件处理函数
		      		$(document).on('infinite', '.infinite-scroll', function() {
						
						//防止切换后第一次会加载
						if(loading_new){
							loading_new = false; 
							return;
						}
						
						// 如果正在加载，则退出
						if(loading)  return;
						
						// 设置flag
						loading = true;
						
						// 模拟1s的加载过程
						setTimeout(function() {
							// 重置加载flag
							loading = false;
							
							//更新序号
							lastIndex++;
							if(lastIndex > maxItems) {
								
								// 加载完毕，则注销无限加载事件，以防不必要的加载
								//$.detachInfiniteScroll($('.infinite-scroll'));
								// 删除加载提示符
								$('.infinite-scroll-preloader').html("没有更多了");
								return;
							}
					
							// 添加新条目
							addItems(itemsPerLoad, lastIndex , path);
							//容器发生改变,如果是js滚动，需要刷新滚动
							$.refreshScroller();
						}, 1000);
					});
			      	
					
					//商品筛选
					$('.shop-filter > ul').on('click','li', function () {
						//防止切换后第一次会加载
						loading_new = true;
						
						//初始加载图标
						$('.infinite-scroll-preloader').addClass("display-no");
						$('.infinite-scroll-preloader').html("<div class='preloader'></div>");
						
						//每次切换清空html
						$("#shop-list-details").empty();
						
						//初始化页码
						lastIndex = 1;
						
						$(this).addClass('shop-filter-active');
						$(this).siblings().removeClass('shop-filter-active');
						
						path = $(this).attr("data-fuliao-id") == ""? "/item/sub-list?" : "/item/sub-list?classify_id=" + $(this).attr("data-fuliao-id");
						addItems(itemsPerLoad, lastIndex , path);
					});
					
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(pull_down_data_1);
		
		$.init();	//初始化方法
	}
	
	//全部订单
	if($("#all-order-content").length>0){
		//获取url参数
		var url_status = p.url_data_get("status");
		
		//如果有筛选选项
		if(url_status=="0"){
			$(".shop-filter").removeClass("display-no");
			$("#header-h").removeClass("shop-details-header-h-1");
			$("#header-h").addClass("shop-header-h-1");
			$("title").text("全部订单");
			$("#title-header-text").text("全部订单");
			
		}else if(url_status=="2"){
			$("title").text("待发货");
			$("#title-header-text").text("待发货");
			
		}else if(url_status=="3"){
			$("title").text("运送中");
			$("#title-header-text").text("运送中");
			
		}else if(url_status=="4"){
			$("title").text("待派送");
			$("#title-header-text").text("待派送");
			
		}else if(url_status=="5"){
			$("title").text("售后服务");
			$("#title-header-text").text("售后服务");
			
		}
		
		
		
		//商品列表
		// 初始页码
	  	var lastIndex = 1;
		// 每次加载添加多少条目
		var itemsPerLoad = 11;
		//初始地址
		var path = "/order/list?user_token=" + user_token + "&status=" + url_status;
		var pull_down_data_1 = {
			path: "/order/list?user_token=" + user_token + "&status=" + url_status + "&page_size=" + itemsPerLoad,
			fun:function(data,status){
				if(data.code=="200"){
					// 加载flag
			      	var loading = false;
			      	//防止切换后第一次会加载
			      	var loading_new = false;
					// 最多可加载的条目
					var maxItems = parseInt(data.data.pager.total_page);
					
					//订单加载提示
					if(data.data.list.length==0){
						$('.infinite-scroll-preloader').html("暂无订单");
						$('.infinite-scroll-preloader').removeClass("display-no");
						return false;
					}else if(maxItems==1 && data.data.list.length>0){
//						$('.infinite-scroll-preloader').remove();
					}else{
						$('.infinite-scroll-preloader').removeClass("display-no");
					}
					
					function addItems(number, lastIndex, path) {
						// 生成新条目的HTML
						var content_1_html = "";
						var index_1 = 0;
						var pull_down_data_2 = {
							path: path + "&page=" + lastIndex + "&page_size=" + number,
							fun:function(data,status){
								if(data.code=="200"){
									
									//订单加载提示
									if(data.data.list.length==0 && $('.infinite-scroll-preloader').html()!="暂无商品"){
										$('.infinite-scroll-preloader').html("暂无订单");
										$('.infinite-scroll-preloader').removeClass("display-no");
										return false;
									}else if(parseInt(data.data.pager.total_page)==1 && data.data.list.length>0){
										$('.infinite-scroll-preloader').addClass("display-no");
									}else{
										$('.infinite-scroll-preloader').removeClass("display-no");
									}
									
									data.data.list.forEach(function(value,index){
										var button_html_1 = '<a href="customer-service.html" class="post-button-2">联系客服</a>';
										var button_html_2 = '<a href="logistics.html?id='+value.id+'" class="post-button-2">查看物流</a>';
										var button_html_3 = '<a href="apply-for-after-sale.html?id='+value.id+'" class="post-button-2">售后服务</a>';
										var button_html_4 = '<a class="post-button-2 application-for-return">申请退货</a>';
										var button_html_5 = '<span class="change-order min-size-2">修改订单</span>';
										var button_html_6 = '<span class="change-order min-size-2">确认收货</span>';
										
										
										
										var a_amount = value.amount;
										var a_status_name = value.status_name;
										var a_status = value.status;
										var a_href = "order-details.html?id=" + value.id;
										
										var html_1 = "";
										value.items.forEach(function(value,index){
											var a_cover_img = value.cover_img;
											var a_name = value.name;
											var a_price = parseFloat(value.price);
											var a_num = parseFloat(value.num);
				
											html_1 += 
											'<a href='+a_href+' class="flex-box-x-z-no-w margin-t-1">'+
												'<div class="order-details-shop-img bg-auto" style="background-image: url('+a_cover_img+');">'+
												'</div>'+
												'<div class="order-details-shop-1 flex-1 flex-box">'+
													'<p class="content-top">'+a_name+'</p>'+
													'<div class="content-bottom flex-box-x-z-y-c">'+
														'<span>x'+a_num+'</b></span>'+
														'<span>&yen;<b>'+a_price*a_num+'</b></span>'+
													'</div>'+
												'</div>'+
											'</a>';
										});
										index_1=value.items.length;
										if(a_status=="2"){//待发货 
											content_1_html+=p.html_box_1(
												//订单状态
												a_status_name,
												//修改订单
												button_html_5,
												//订单商品
												html_1,
												//商品数量
												index_1,
												//总价
												a_amount,
												//右下按钮
												button_html_4
											);
										}else if(a_status=="3" || a_status=="4"){//运送中 ,配送中
											content_1_html+=p.html_box_1(
												//订单状态
												a_status_name,
												//修改订单
												button_html_5,
												//订单商品
												html_1,
												//商品数量
												index_1,
												//总价
												a_amount,
												//右下按钮
												button_html_2+button_html_4
											);
										}else if(a_status=="6"){//售后 
											content_1_html+=p.html_box_1(
												//订单状态
												a_status_name,
												//修改订单
												button_html_5,
												//订单商品
												html_1,
												//商品数量
												index_1,
												//总价
												a_amount,
												//右下按钮
												button_html_3+button_html_4
											);
										}else{
											content_1_html+=p.html_box_1(
												//订单状态
												a_status_name,
												//修改订单
												button_html_5,
												//订单商品
												html_1,
												//商品数量
												index_1,
												//总价
												a_amount,
												//右下按钮
												button_html_1
											);
										}
									});
									$("#order-list-detalis").append(content_1_html);
									
								}else{
									$.toast(data.message);
									if(data.code == 403){
										p.jump(p.login_href,2000);
									}
									return false;
								}
							}
						}
						p.data_post(pull_down_data_2);
					}
					
					//预先加载x条
					addItems(itemsPerLoad, lastIndex , path);
//					//显示加载图标
//			      	$(".infinite-scroll-preloader").removeClass("display-no");
			      	// 注册'infinite'事件处理函数
		      		$(document).on('infinite', '.infinite-scroll', function() {
						
						//防止切换后第一次会加载
						if(loading_new){
							loading_new = false; 
							return;
						}
						
						// 如果正在加载，则退出
						if(loading)  return;
						
						// 设置flag
						loading = true;
						
						// 模拟1s的加载过程
						setTimeout(function() {
							// 重置加载flag
							loading = false;
							
							//更新序号
							lastIndex++;
							if(lastIndex > maxItems) {
								
								// 加载完毕，则注销无限加载事件，以防不必要的加载
								//$.detachInfiniteScroll($('.infinite-scroll'));
								// 删除加载提示符
								$('.infinite-scroll-preloader').html("没有更多了");
								return;
							}
					
							// 添加新条目
							addItems(itemsPerLoad, lastIndex , path);
							//容器发生改变,如果是js滚动，需要刷新滚动
							$.refreshScroller();
						}, 1000);
					});
			      	
					
					//订单筛选
					$('#shimu-shop-list').on('click','li', function () {
						//防止切换后第一次会加载
						loading_new = true;
						
						//初始加载图标
						$('.infinite-scroll-preloader').addClass("display-no");
						$('.infinite-scroll-preloader').html("<div class='preloader'></div>");
						
						//每次切换清空html
						$("#order-list-detalis").empty();
						
						//初始化页码
						lastIndex = 1;
						
						$(this).addClass('shop-filter-active');
						$(this).siblings().removeClass('shop-filter-active');
						
						path = "/order/list?user_token=" + user_token + "&status=" + $(this).attr("data-shop-stauts");
						addItems(itemsPerLoad, lastIndex , path);
					});
					
				}else{
					$.toast(data.message);
					if(data.code == 403){
						p.jump(p.login_href,2000);
					}
					return false;
				}
			}
		}
		p.data_post(pull_down_data_1);
		
		$.init();	//初始化方法
	}
	
	//售后服务
	if($("#apply-for-after-sale-content").length>0){
		//获取订单id
		var order_id = p.url_data_get('id');
		
		var content_data_1 = {
			path: "/order/detail?user_token=" + user_token + "&id=" + order_id,
			fun:function(data,status){
				if(data.code=="200"){
					var order_no = data.data.order_no;
					$("#order_no").text(order_no);
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(content_data_1);
		
		var img_data = [];
		
		$(document).on('click','#upload-attachment-icon',function(){
			if(img_data.length>=3){$.toast("最多上传3张图片");return false;};
		});
		$(document).on('change','#upload-attachment',function(){
			var avatar_picture_upload_src = $(this)[0].files[0];
			
			img_data.push(avatar_picture_upload_src);
			
			var rd = new FileReader();//创建文件读取对象
	        rd.readAsDataURL(avatar_picture_upload_src);//文件读取装换为base64类型

			rd.onloadend = function(e) {
	            //加载完毕之后获取结果赋值给img
	            var img_html = "<img class='upload-attachment-icon' src="+this.result+" />";
	            $("#img-box").append(img_html);
	        }
		});
		
		
		$(document).on("click","#post-sale-submission",function(){
			var apply_for_after_sale_text = $("#apply-for-after-sale-text").val();
			if(apply_for_after_sale_text==""){$.toast("请输入售后原因");return false;};
			if(img_data.length==0){$.toast("请上传图片");return false;};
			
			var formData = new FormData();
			var img_url = [];
			img_data.forEach(function(value,index){
				formData.append("img", value);
				
				var content_data_2 = {
					path: "/default/upload-image?user_token=" + user_token,
					parameter: formData,
					fun:function(data,status){
						if(data.code=="200"){
							img_url.push(data.data.url);
							
							if(index==img_data.length-1){
								//提交售后
								var content_data_3 = {
									path: "/order/serve?user_token=" + user_token,
									parameter: {
										order_id: order_id,
										content: apply_for_after_sale_text,
										imgs: img_url
									},
									fun:function(data,status){
										if(status=="success"){
											if(data.code=="200"){
												$.toast("提交成功!",1000);
												p.jump_go(1000);
											}else{
												$.toast(data.message);
												return false;
											}
										}else{
											$.toast("提交失败,请重试");
										}
									}
								}
								p.data_post(content_data_3);
							}
							
						}else{
							$.toast(data.message);
							return false;
						}
					}
				}
				p.data_img_post(content_data_2);
			});
		    
		});
	}
	
	
	//订单详情
	if($("#order-details-content").length>0){
		//获取订单id
		var order_id = p.url_data_get('id');
		
		var content_data_1 = {
			path: "/order/detail?user_token=" + user_token + "&id=" + order_id,
			fun:function(data,status){
				if(data.code=="200"){
					//确认订单
					if(data.data.status==4){
						$("#confirm-receipt").removeClass("display-no");
					}
					
					//物流状态
					var a_status_name = data.data.status_name;
					var a_amount = data.data.amount;
					var a_number = data.data.items.length;
					var content_html_1 = "";
					
					var a_recipient = data.data.shipping.recipient;
					var a_phone = data.data.shipping.phone;
					//地址
					var a_province = data.data.shipping.province == ""? "" : data.data.shipping.province+" ";
					var a_city = data.data.shipping.city+" ";
					var a_district = data.data.shipping.district;
					var a_address = data.data.shipping.address;
					
					//物流
					var a_shipping_no = data.data.shipping.shipping_no;
					
					$("#order-details-logistics").text(a_status_name);
					$("#num").text(a_number);
					$("#amount").text(a_amount);
					$("#view-logistics").attr("href","logistics.html?id=" + order_id);
					
					//收件人信息
					$("#user-name").text(a_recipient);
					$("#user-tel").text(a_phone);
					$("#address").text(a_province+a_city+a_district+a_address);
					
					//物流信息
					$("#logistics-information").text(a_status_name);
					$("#logistics-number").text(a_shipping_no);
					
					//支付信息
					var a_payment_no = data.data.payment.payment_no;
					var a_order_no = data.data.order_no;
					var a_delivery_time = data.data.delivery_time;
					var a_payment_type_name = data.data.payment.payment_type_name;
					var create_time = data.data.create_time;
					var ship_time = data.data.update_time;
					var material_fee = 0;
					var excipient_fee = 0;
					
					data.data.items.forEach(function(value,index){
						var a_cover_img = value.cover_img;
						var a_name = value.name;
						var a_price = parseFloat(value.price);
						var a_num = parseFloat(value.num);
						if(value.type=="1"){
							material_fee=a_price*a_num;
						}else{
							excipient_fee=excipient_fee+a_price*a_num;
						}
						
						content_html_1+=
						'<div class="flex-box-x-z-no-w margin-t-1">'+
							'<div class="order-details-shop-img bg-auto" style="background-image: url('+a_cover_img+');">'+
							'</div>'+
							'<div class="order-details-shop-1 flex-1 flex-box">'+
								'<p class="content-top">'+a_name+'</p>'+
								'<div class="content-bottom flex-box-x-r-y-c">'+
									'<span>&yen;<b>'+a_price*a_num+'</b></span>'+
								'</div>'+
							'</div>'+
						'</div>'
						$("#order-details-shop-list").html(content_html_1);
					});
					
					//支付信息
					$("#payment_no").text(a_order_no);
					$("#payment_type").text(a_payment_type_name);
					$("#delivery_time").text(a_delivery_time);
					$("#create_time").text(create_time);
					$("#ship_time").text(ship_time);
					$("#material_fee").text(material_fee);
					$("#excipient_fee").text(excipient_fee);
					$("#total").text(a_amount);
					
				}else{
					$.toast(data.message);
					if(data.code == 403){
						p.jump(p.login_href,2000);
					}
					return false;
				}
			}
		}
		p.data_post(content_data_1);
		
		$(document).on("click","#confirm-receipt",function(){
			$.confirm('是否确认收货?', function () {
				var confirm_receipt = {
					path: "/order/confirm?user_token=" + user_token,
					parameter:{
						order_id: order_id
					},
					fun:function(data,status){
						if(data.code=="200"){
							$.toast("已确认收货!");
							setTimeout(function(){
								location.reload();
							},1000);
						}else{
							$.toast(data.message);
							if(data.code == 403){
								p.jump(p.login_href,2000);
							}
							return false;
						}
					}
				}
				p.data_post(confirm_receipt);
	      	});
		});
		
	}
	
	//预约详情
	if($("#reservation-details-content").length>0){
		//获取预约id
		var appointment_id = p.url_data_get('appointment_id');
		
		var content_data_1 = {
			path: "/appointment/detail?user_token=" + user_token + "&id=" + appointment_id,
			fun:function(data,status){
				if(data.code=="200"){
//					//物流状态
					var a_handle_content = data.data.appointment.handle_content == null? "未处理" : data.data.appointment.handle_content;
					$("#reservation-details-logistics").text(a_handle_content);
					
					//商品数量
					var a_shop_number = data.data.items.length;
					var content_html_1 = "";
					$("#a-shop-number").text(a_shop_number);
					
					//联系人
					var a_recipient = data.data.appointment.contact;
					var a_phone = data.data.appointment.phone;
					$("#user-name").text(a_recipient);
					$("#user-tel").text(a_phone);
					
					//地址
					var a_address = data.data.appointment.address;
					$("#address").text(a_address);
					
					//预约商品
					data.data.items.forEach(function(value,index){
						var a_cover_img = value.cover_img;
						var a_name = value.name;
						
						content_html_1+=
						'<div class="flex-box-x-z-no-w margin-t-1">'+
							'<div class="order-details-shop-img bg-auto" style="background-image: url('+a_cover_img+');">'+
							'</div>'+
							'<div class="order-details-shop-1 flex-1 flex-box">'+
								'<p class="content-top">'+a_name+'</p>'+
								'<div class="content-bottom flex-box-x-r-y-c">'+
									'<span>×1</span>'+
								'</div>'+
							'</div>'+
						'</div>'
						$("#order-details-shop-list").html(content_html_1);
					});
					
					//预约信息
					$("#time").text(data.data.appointment.appoint_time);
					$("#handle_time").text(data.data.appointment.handle_time);
					$("#area").html(data.data.appointment.area+"m&sup2;");
					$("#memo").text(data.data.appointment.memo);
					
				}else{
					$.toast(data.message);
					if(data.code == 403){
						p.jump(p.login_href,2000);
					}
					return false;
				}
			}
		}
		p.data_post(content_data_1);
		
	}
	
	//文章详情
	if($("#article-content").length>0){
		//获取文章详情
		var article_id = p.url_data_get('article_id') == null? p.url_data_get('id') : p.url_data_get('article_id');
		
		var article_data = {
			path: "/article/detail?id="+article_id,
			fun:function(data,status){
				if(data.code=="200"){
					//如果是安装指南
					if(article_id==3){
						$('title').text(data.data.title);
						$('#header-title').text(data.data.title);
						$('#content-title').remove();
						$("#article-content #article-details #article-details-content").html(data.data.content);
					}else{
						$('title').text(data.data.title);
						$('#header-title').text("推荐分享详情");
						$('#content-title').text(data.data.title);
						$("#article-content #article-details #article-details-content").html(data.data.content);
					}
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(article_data);
	}
	
	//活动专区
	if($("#activity-area-content").length>0){
		//页面标题
		var title = p.url_data_get('title');
		title = decodeURI(title);
		$('title').text(title);
		$("#activity-area-content .title-header h1").text(title);
		
		//获取活动详情
		var id = p.url_data_get('id');
		
		//下拉加载
		// 每次加载添加多少条目
		var itemsPerLoad = 11;
		var pull_down_data_1 = {
			path: "/activity/list?page_size=" + itemsPerLoad + "&id=" + id,
			fun:function(data,status){
				if(data.code=="200"){
					//活动详情banner
					var activity_area_banner = "<img src="+data.data.activity.cover_img+" />";
					$("#activity-area-banner").html(activity_area_banner);
					
					// 加载flag
			      	var loading = false;
					// 最多可加载的条目
					var maxItems = parseInt(data.data.pager.total_page);
					
					//删除加载图标
					if(maxItems==1 || data.data.list.length==0){
						$('.infinite-scroll-preloader').remove();
					}else{
						//显示加载图标
				      	$(".infinite-scroll-preloader").removeClass("display-no");
					}
					
					function addItems(number, lastIndex) {
						// 生成新条目的HTML
						var content_1_html = "";
						var pull_down_data_2 = {
							path: "/activity/list?page=" + lastIndex + "&page_size=" + number + "&id=" + id,
							fun:function(data,status){
								if(data.code=="200"){
									data.data.list.forEach(function(value,index){
										var a_href = "shop-details.html?item_id="+value.item_id; 
										
										content_1_html += 
										"<div class='flex-box-x-z-no-w'>"+
											"<div class='order-details-shop-img bg-auto' style='background-image: url("+value.cover_img+");'>"+
											"</div>"+
											"<div class='order-details-shop-1 flex-1 flex-box'>"+
												"<p class='content-top text-br'>"+value.name+"</p>"+
												"<div class='content-bottom flex-box-x-z-y-c'>"+
													"<p class='shop-prices flex-box-y-e'>"+
														"<span class='color-style-1 line-height-auto'><b class='sale-price-2'>&yen;"+value.price+"</b>/"+value.unit+"</span>"+
														"<span class='line-height-auto color-style-2'>&yen;<b class='cross-line-price-2'>"+value.origin_price+"</b>"+value.unit+"</span>"+
													"</p>"+
													"<a href="+a_href+" class='post-button-2 flex-box-x-c-y-c'>立即购买</a>"+
												"</div>"+
											"</div>"+
										"</div>";
									});
									
									// 添加新条目
									$('#activity-area-details').append(content_1_html);
								}else{
									$.toast(data.message);
									return false;
								}
							}
						}
						p.data_post(pull_down_data_2);
					}
					
					// 初始页码
			      	var lastIndex = 1;
					
					//预先加载x条
					addItems(itemsPerLoad, lastIndex);
					//显示加载图标
//			      	$(".infinite-scroll-preloader").removeClass("display-no");
			      	
			      	// 注册'infinite'事件处理函数
			      	$(document).on('infinite', '.infinite-scroll', function() {
						// 如果正在加载，则退出
						if(loading) return;
					
						// 设置flag
						loading = true;
						
						// 模拟1s的加载过程
						setTimeout(function() {
							// 重置加载flag
							loading = false;
							
							//更新序号
							lastIndex++;
							if(lastIndex > maxItems) {
								// 加载完毕，则注销无限加载事件，以防不必要的加载
								$.detachInfiniteScroll($('.infinite-scroll'));
								// 删除加载提示符
								$('.infinite-scroll-preloader').html("没有更多了");
								return;
							}
					
							// 添加新条目
							addItems(itemsPerLoad, lastIndex);
							//容器发生改变,如果是js滚动，需要刷新滚动
							$.refreshScroller();
						}, 1000);
					});
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(pull_down_data_1);
		
		$.init();	//初始化方法
	}
	
	//分享海报
	if($("#share-it-content").length>0){
		
		//分享海报图片
		var share_it_data = {
			path: "/default/share-image",
			fun:function(data,status){
				if(data.code=="200"){
					var share_it_details = "<img src="+data.data.image_url+" />";
					$("#share-image").html(share_it_details);
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(share_it_data);
	}
	
	//我的
	if($("#user-content").length>0){
		
		//获取用户信息
		
		//个人信息
		var user_data_1 = {
			path: "/user/profile?user_token=" + user_token,
			fun:function(data,status){
				if(data.code=="200"){
					var a_avatar_url = data.data.userinfo.avatar_url == ""? "img/personal-information-picture.png" : data.data.userinfo.avatar_url;
					data.data.userinfo.phone = data.data.userinfo.phone.substr(0,3)+"****"+data.data.userinfo.phone.substr(7);	//手机号中间隐藏
					$('#user_picture').css('background-image','url('+a_avatar_url+')');
					$('#user_name').text(data.data.userinfo.nickname);
					$('#user_tel').text(data.data.userinfo.phone);
					
					if(data.data.order.paid > 0){
						$("#paid").removeClass("display-no");
					}
					if(data.data.order.shipping > 0){
						$("#shipping").removeClass("display-no");
					}
					if(data.data.order.delivery > 0){
						$("#delivery").removeClass("display-no");
					}
					$("#paid").text(data.data.order.paid > 99? "99+" : data.data.order.paid);
					$("#shipping").text(data.data.order.shipping > 99? "99+" : data.data.order.shipping);
					$("#delivery").text(data.data.order.delivery > 99? "99+" : data.data.order.delivery);
					
					$('#views-count').text(data.data.statis.views_count);
					$('#favorite-count').text(data.data.statis.favorite_count);
					$('#appoint-count').text(data.data.statis.appoint_count);
				}else{
					$.toast(data.message);
					if(data.code == 403){
						p.jump(p.login_href,2000);
					}
					return false;
				}
			}
		}
		p.data_post(user_data_1);

	}
	
	//浏览记录
	if($("#browse-record-content").length>0){
		
		//获取浏览记录
		//下拉加载
		// 每次加载添加多少条目
		var itemsPerLoad = 12;
		var pull_down_data_1 = {
			path: "/user/view-list?user_token=" + user_token + "&page_size=" + itemsPerLoad,
			fun:function(data,status){
				if(data.code=="200"){
					// 加载flag
			      	var loading = false;
					// 最多可加载的条目
					var maxItems = parseInt(data.data.pager.total_page);
					
					//删除加载图标
					if(maxItems==1 || data.data.list.length==0){
						$('.infinite-scroll-preloader').remove();
					}else{
						//显示加载图标
				      	$(".infinite-scroll-preloader").removeClass("display-no");
					}
					
					function addItems(number, lastIndex) {
						// 生成新条目的HTML
						var content_1_html = "";
						var pull_down_data_2 = {
							path: "/user/view-list?user_token=" + user_token + "&page=" + lastIndex + "&page_size=" + number,
							fun:function(data,status){
								if(data.code=="200"){
									
									data.data.list.forEach(function(value,index){
//										var a_href = parseInt(value.type) == 1? "shop-details.html" : "excipient-details.html";
										var a_href = "shop-details.html";
										a_href = a_href + "?item_id=" + value.item_id;
										var a_cover_img = value.cover_img;
										var a_name = value.name;
										var a_price = value.price;
										
										content_1_html+=
										"<div class='shop-order'>"+
											"<div class='order-details-shop'>"+
												"<a class='flex-box-x-z-no-w' href="+a_href+">"+
													"<div class='order-details-shop-img bg-auto' style='background-image: url("+value.cover_img+");'>"+
													"</div>"+
													"<div class='order-details-shop-1 flex-1 flex-box'>"+
														"<p class='content-top'>"+a_name+"</p>"+
														"<div class='content-bottom flex-box-x-r-y-c'>"+
															"<span class='color-style-3'>&yen;<b>"+a_price+"</b></span>"+
														"</div>"+
													"</div>"+
												"</a>"+
											"</div>"+
										"</div>"
									});
									$("#browse-record-details").append(content_1_html);
									
								}else{
									$.toast(data.message);
									if(data.code == 403){
										p.jump(p.login_href,2000);
									}
									return false;
								}
							}
						}
						p.data_post(pull_down_data_2);
					}
					
					// 初始页码
			      	var lastIndex = 1;
					
					//预先加载x条
					addItems(itemsPerLoad, lastIndex);
//			      	$(".infinite-scroll-preloader").removeClass("display-no");
			      	
			      	// 注册'infinite'事件处理函数
			      	$(document).on('infinite', '.infinite-scroll', function() {
						// 如果正在加载，则退出
						if(loading) return;
					
						// 设置flag
						loading = true;
						
						// 模拟1s的加载过程
						setTimeout(function() {
							// 重置加载flag
							loading = false;
							
							//更新序号
							lastIndex++;
							if(lastIndex > maxItems) {
								// 加载完毕，则注销无限加载事件，以防不必要的加载
								$.detachInfiniteScroll($('.infinite-scroll'));
								// 删除加载提示符
								$('.infinite-scroll-preloader').html("没有更多了");
								return;
							}
					
							// 添加新条目
							addItems(itemsPerLoad, lastIndex);
							//容器发生改变,如果是js滚动，需要刷新滚动
							$.refreshScroller();
						}, 1000);
					});
					
				}else{
					$.toast(data.message);
					if(data.code == 403){
						p.jump(p.login_href,2000);
					}
					return false;
				}
			}
		}
		p.data_post(pull_down_data_1);
		
		$.init();	//初始化方法
	}
	
	//收藏记录
	if($("#collection-record-content").length>0){
		
		//获取收藏记录
		//下拉加载
		// 每次加载添加多少条目
		var itemsPerLoad = 12;
		var pull_down_data_1 = {
			path: "/user/fav-list?user_token=" + user_token + "&page_size=" + itemsPerLoad,
			fun:function(data,status){
				if(data.code=="200"){
					// 加载flag
			      	var loading = false;
					// 最多可加载的条目
					var maxItems = parseInt(data.data.pager.total_page);
					
					//删除加载图标
					if(maxItems==1 || data.data.list.length==0){
						$('.infinite-scroll-preloader').remove();
					}else{
						//显示加载图标
				      	$(".infinite-scroll-preloader").removeClass("display-no");
					}
					
					function addItems(number, lastIndex) {
						// 生成新条目的HTML
						var content_1_html = "";
						var pull_down_data_2 = {
							path: "/user/fav-list?user_token=" + user_token + "&page=" + lastIndex + "&page_size=" + number,
							fun:function(data,status){
								if(data.code=="200"){
									
									data.data.list.forEach(function(value,index){
//										var a_href = parseInt(value.type) == 1? "shop-details.html" : "excipient-details.html";
										var a_href = "shop-details.html";
										a_href = a_href + "?item_id=" + value.item_id;
										var a_cover_img = value.cover_img;
										var a_name = value.name;
										var a_price = value.price;
										
										content_1_html+=
										"<div class='shop-order'>"+
											"<div class='order-details-shop'>"+
												"<a class='flex-box-x-z-no-w' href="+a_href+">"+
													"<div class='order-details-shop-img bg-auto' style='background-image: url("+value.cover_img+");'>"+
													"</div>"+
													"<div class='order-details-shop-1 flex-1 flex-box'>"+
														"<p class='content-top'>"+a_name+"</p>"+
														"<div class='content-bottom flex-box-x-r-y-c'>"+
															"<span class='color-style-3'>&yen;<b>"+a_price+"</b></span>"+
														"</div>"+
													"</div>"+
												"</a>"+
											"</div>"+
										"</div>"
									});
									$("#collection-record-details").append(content_1_html);
									
								}else{
									$.toast(data.message);
									if(data.code == 403){
										p.jump(p.login_href,2000);
									}
									return false;
								}
							}
						}
						p.data_post(pull_down_data_2);
					}
					
					// 初始页码
			      	var lastIndex = 1;
					
					//预先加载x条
					addItems(itemsPerLoad, lastIndex);
//			      	$(".infinite-scroll-preloader").removeClass("display-no");
			      	
			      	// 注册'infinite'事件处理函数
			      	$(document).on('infinite', '.infinite-scroll', function() {
						// 如果正在加载，则退出
						if(loading) return;
					
						// 设置flag
						loading = true;
						
						// 模拟1s的加载过程
						setTimeout(function() {
							// 重置加载flag
							loading = false;
							
							//更新序号
							lastIndex++;
							if(lastIndex > maxItems) {
								// 加载完毕，则注销无限加载事件，以防不必要的加载
								$.detachInfiniteScroll($('.infinite-scroll'));
								// 删除加载提示符
								$('.infinite-scroll-preloader').html("没有更多了");
								return;
							}
					
							// 添加新条目
							addItems(itemsPerLoad, lastIndex);
							//容器发生改变,如果是js滚动，需要刷新滚动
							$.refreshScroller();
						}, 1000);
					});
					
				}else{
					$.toast(data.message);
					if(data.code == 403){
						p.jump(p.login_href,2000);
					}
					return false;
				}
			}
		}
		p.data_post(pull_down_data_1);
		
		$.init();	//初始化方法
		
	}
	
	//预约记录
	if($("#appointment-record-content").length>0){
		
		//获取预约记录
		//下拉加载
		// 每次加载添加多少条目
		var itemsPerLoad = 12;
		var pull_down_data_1 = {
			path: "/appointment/list?user_token=" + user_token + "&page_size=" + itemsPerLoad,
			fun:function(data,status){
				if(data.code=="200"){
					// 加载flag
			      	var loading = false;
					// 最多可加载的条目
					var maxItems = parseInt(data.data.pager.total_page);
					
					//删除加载图标
					if(maxItems==1 || data.data.list.length==0){
						$('.infinite-scroll-preloader').remove();
					}else{
						//显示加载图标
				      	$(".infinite-scroll-preloader").removeClass("display-no");
					}
					
					function addItems(number, lastIndex) {
						// 生成新条目的HTML
						var content_1_html = "";
						var pull_down_data_2 = {
							path: "/appointment/list?user_token=" + user_token + "&page=" + lastIndex + "&page_size=" + number,
							fun:function(data,status){
								if(data.code=="200"){
									data.data.list.forEach(function(value,index){
										var button_html_1 = '<span class="min-size-2 line-height-auto">'+value.status_name+'</span>';
										var html_1 = "";
										var a_href = "reservation-details.html";
										a_href = a_href + "?appointment_id=" + value.appointment_id;
										value.items.forEach(function(value,index){
											var a_cover_img = value.cover_img;
											var a_name = value.name;
				//							var a_price = value.price;
				
											html_1 += 
											"<a class='flex-box-x-z-no-w margin-t-1' href="+a_href+">"+
												"<div class='order-details-shop-img bg-auto' style='background-image: url("+a_cover_img+");'>"+
												"</div>"+
												"<div class='order-details-shop-1 flex-1 flex-box'>"+
													"<p class='content-top'>"+a_name+"</p>"+
													"<div class='content-bottom flex-box-x-r-y-c color-style-2'>×1</div>"+
												"</div>"+
											"</a>";
										});
										index_1=value.items.length;
										
										content_1_html+=
										"<div class='shop-order'>"+
											"<div class='form-input-2 order-details-username flex-box-x-z'>"+
												"<div class='flex-box-x-z-y-e'>"+
													"<img src='img/logo-mini.png'>"+
													"<p>财纳沃德</p>"+
												"</div>"+
												button_html_1+
											"</div>"+
											"<div class='form-input-2 order-details-shop'>"+html_1+"</div>"+
											"<div class='order-details-operating flex-box-x-z-y-c flex-box-top'>"+
												"<div class='content-left'>"+
													"<p class='flex-box min-size-2'>意向产品共"+index_1+"件商品</p>"+
												"</div>"+
												"<div class='content-right flex-box-top'>"+
													"<a href='customer-service.html' class='post-button-2'>联系客服</a>"+
												"</div>"+
											"</div>"+
										"</div>"
										
									});
									$("#appointment-record-details").append(content_1_html);
									
								}else{
									$.toast(data.message);
									if(data.code == 403){
										p.jump(p.login_href,2000);
									}
									return false;
								}
							}
						}
						p.data_post(pull_down_data_2);
					}
					
					// 初始页码
			      	var lastIndex = 1;
					
					//预先加载x条
					addItems(itemsPerLoad, lastIndex);
//			      	$(".infinite-scroll-preloader").removeClass("display-no");
			      	
			      	// 注册'infinite'事件处理函数
			      	$(document).on('infinite', '.infinite-scroll', function() {
						// 如果正在加载，则退出
						if(loading) return;
					
						// 设置flag
						loading = true;
						
						// 模拟1s的加载过程
						setTimeout(function() {
							// 重置加载flag
							loading = false;
							
							//更新序号
							lastIndex++;
							if(lastIndex > maxItems) {
								// 加载完毕，则注销无限加载事件，以防不必要的加载
								$.detachInfiniteScroll($('.infinite-scroll'));
								// 删除加载提示符
								$('.infinite-scroll-preloader').html("没有更多了");
								return;
							}
					
							// 添加新条目
							addItems(itemsPerLoad, lastIndex);
							//容器发生改变,如果是js滚动，需要刷新滚动
							$.refreshScroller();
						}, 1000);
					});
					
				}else{
					$.toast(data.message);
					if(data.code == 403){
						p.jump(p.login_href,2000);
					}
					return false;
				}
			}
		}
		p.data_post(pull_down_data_1);
		
		$.init();	//初始化方法
		
	}
	
	//系统通知
	if($("#notice-content").length>0){
		
		//下拉加载
		// 每次加载添加多少条目
		var itemsPerLoad = 12;
		var pull_down_data_1 = {
			path: "/user/notice-list?user_token=" + user_token + "&page_size=" + itemsPerLoad,
			fun:function(data,status){
				if(data.code=="200"){
					// 加载flag
			      	var loading = false;
					// 最多可加载的条目
					var maxItems = parseInt(data.data.pager.total_page);
					
					//删除加载图标
					if(maxItems==1 || data.data.list.length==0){
						$('.infinite-scroll-preloader').remove();
					}else{
						//显示加载图标
				      	$(".infinite-scroll-preloader").removeClass("display-no");
					}
					
					function addItems(number, lastIndex) {
						// 生成新条目的HTML
						var content_1_html = "";
						var pull_down_data_2 = {
							path: "/user/notice-list?user_token=" + user_token + "&page=" + lastIndex + "&page_size=" + number,
							fun:function(data,status){
								if(data.code=="200"){
									
									data.data.list.forEach(function(value,index){
										var a_title = value.title;
										var a_create_time = value.create_time;
										var a_summary = value.summary;
										var a_id = value.id;
										
										content_1_html+=
										"<li class='notice-box' data-notice-id="+a_id+">"+
											"<a>"+
												"<div class='flex-box-x-z-y-c'>"+
													"<p>"+
														"<img src='img/notice-list-icon.png' />"+
													"</p>"+
													"<p class='flex-box-x-z-y-e flex-1'>"+
														"<b>"+a_title+"</b>"+
														"<span>"+a_create_time+"</span>"+
													"</p>"+
												"</div>"+
												"<p class='list-text'>"+a_summary+"</p>"+
											"</a>"+
										"</li>"
										
									});
									
									$("#notice-details").append(content_1_html);
								}else{
									$.toast(data.message);
									return false;
								}
							}
						}
						p.data_post(pull_down_data_2);
					}
					
					// 初始页码
			      	var lastIndex = 1;
					
					//预先加载x条
					addItems(itemsPerLoad, lastIndex);
//			      	$(".infinite-scroll-preloader").removeClass("display-no");
			      	
			      	// 注册'infinite'事件处理函数
			      	$(document).on('infinite', '.infinite-scroll', function() {
						// 如果正在加载，则退出
						if(loading) return;
					
						// 设置flag
						loading = true;
						
						// 模拟1s的加载过程
						setTimeout(function() {
							// 重置加载flag
							loading = false;
							
							//更新序号
							lastIndex++;
							if(lastIndex > maxItems) {
								// 加载完毕，则注销无限加载事件，以防不必要的加载
								$.detachInfiniteScroll($('.infinite-scroll'));
								// 删除加载提示符
								$('.infinite-scroll-preloader').html("没有更多了");
								return;
							}
					
							// 添加新条目
							addItems(itemsPerLoad, lastIndex);
							//容器发生改变,如果是js滚动，需要刷新滚动
							$.refreshScroller();
						}, 1000);
					});
					
					//删除信息
					$("#notice-details").on('click','.notice-box', function () {
						var data_notice_id = $(this).attr("data-notice-id");
						$.confirm('确定要删除吗?', function () {
				        	//删除消息记录
							var content_data_2 = {
								path: "/user/notice-del?user_token=" + user_token,
								parameter:{
									id: data_notice_id
								},
								fun:function(data,status){
									if(data.code=="200"){
										$.toast("删除成功!");
										setTimeout(function(){
											location.reload();
										},1000);
									}else{
										$.toast(data.message);
										if(data.code == 403){
											p.jump(p.login_href,2000);
										}
										return false;
									}
								}
							}
							p.data_post(content_data_2);
				      	});
						
					});
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(pull_down_data_1);
		
		$.init();	//初始化方法
	}
	
	//用户信息详情
	if($("#personal-information-content").length>0){
		
		//用户信息详情
		var content_data_1 = {
			path: "/user/get-info?user_token=" + user_token,
			fun:function(data,status){
				if(data.code=="200"){
					var a_avatar_url = data.data.userinfo.avatar_url != ""? data.data.userinfo.avatar_url : "img/personal-information-picture.png";
					data.data.userinfo.phone = data.data.userinfo.phone.substr(0,3)+"****"+data.data.userinfo.phone.substr(7);	//手机号中间隐藏
					$('#user_picture').css('background-image','url('+a_avatar_url+')');
					$('#user_name').text(data.data.userinfo.nickname);
					$('#user_tel').text(data.data.userinfo.phone);
				}else{
					$.toast(data.message);
					if(data.code == 403){
						p.jump(p.login_href,2000);
					}
					return false;
				}
			}
		}
		p.data_post(content_data_1);
		
		//头像上传
		$(document).on('change','#avatar-picture-upload',function(){
			//加载提示器
			$.showPreloader();
			var avatar_picture_upload_src = $(this)[0].files[0];
			var formData = new FormData();
		    formData.append("img", avatar_picture_upload_src);
			var content_data_2 = {
				path: "/default/upload-image?user_token=" + user_token,
				parameter: formData,
				fun:function(data){
					if(data.code=="200"){
						var content_data_3 = {
							path: "/user/set-info?user_token=" + user_token,
							parameter: {
								avatar_url: data.data.url
							},
							fun:function(data,status){
								if(data.code=="200"){
									//关闭加载提示器
									$.hidePreloader();
									location.reload();
								}else{
									$.toast(data.message);
									return false;
								}
							}
						}
						p.data_post(content_data_3);
					}else{
						$.toast(data.message);
						return false;
					}
				}
			}
			p.data_img_post(content_data_2);
		    
		});
		
		//查看收货地址跳转
		var content_data_4 = {
			path: "/address/default?user_token=" + user_token,
			fun:function(data,status){
				if(data.code=="200"){
					if(!data.data.recipient){
						$('#shipping-address-href').attr('href','no-address.html');
					}else{
						$('#shipping-address-href').attr('href','address-list.html');
					}
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(content_data_4);
		
		//退出登录
		$(document).on('click','#sign-out',function(){
			p.del_cache('user_token');
			$.toast("退出成功!",1000);
			p.jump("home.html",1000);
		});
		
	}
	
	//修改昵称
	if($("#edit-user-details-content").length>0){
		$(document).on('click','#post-button',function(){
			var user_name = $('#user-name').val();
			if(user_name==""){$.toast("请输入昵称",1000);return false;}
			var content_data_1 = {
				path: "/user/set-info?user_token=" + user_token,
				parameter: {
					nickname: user_name
				},
				fun:function(data,status){
					if(data.code=="200"){
						$.toast("修改成功!",1000);
						p.jump_back(1000);
					}else{
						$.toast(data.message);
						return false;
					}
				}
			}
			p.data_post(content_data_1);
		});
	}
	
	//修改手机号
	if($("#edit-user-details-content").length>0){
		//验证码获取
		$(document).on('click','#sms-get',function(){
			var phone_number = $("#new-tel").val();
			
			if(!p.verify('mobile',phone_number)){
				$.toast("请输入正确的手机号");
				return false;
			}else{
				var sms_data = {
					path: "/default/verify-code?user_token=" + user_token,
					parameter: {
						phone: phone_number
					},
					fun:function(data,status){
						if(data.code=="200"){
							$.toast("验证码已发送");
							p.SMS_countdown("#sms-get");
						}else{
							$.toast(data.message);
							return false;
						}
					}
				}
				p.data_post(sms_data);
			}
		});
		
		//修改提交
		$(document).on('click','#edit-post',function(){
			var phone_number = $("#new-tel").val();
			var sms_code = $("#sms-code").val();
			
			if(!p.verify('mobile',phone_number)){
				$.toast("请输入正确的手机号");
				return false;
			}else if(sms_code==""){
				$.toast("请输入验证码");
				return false;
			}else{
				var sms_data = {
					path: "/user/reset-phone?user_token=" + user_token,
					parameter: {
						phone: phone_number,
						verify_code: sms_code
					},
					fun:function(data,status){
						if(data.code=="200"){
							$.toast("修改成功!",1000);
							p.jump_back(1000);
						}else{
							$.toast(data.message);
							return false;
						}
					}
				}
				p.data_post(sms_data);
			}
		});
	}
	
	//地址展示
	if($("#address-list-content").length>0){
		var content_1_html = "";
		var content_data_1 = {
			path: "/address/default?user_token=" + user_token,
			fun:function(data,status){
				if(data.code=="200"){
					var value = data.data;
					var a_recipient = value.recipient;
					var a_province = value.province == ""? "" : value.province+" ";
					var a_city = value.city+" ";
					var a_district = value.district;
					var a_address = value.address;
					var a_phone = value.phone;
					var a_href = "address-list-edit.html?id=" + value.id;
					
					content_1_html+=
					"<a href="+a_href+" class='content-box-2 flex-box-x-z-no-w' id='address-list-details-box'>"+
						"<div class='left-icon'>"+
							"<img src='img/address-list-icon-1.PNG' />"+
						"</div>"+
						"<div class='right-content flex-1'>"+
							"<div class='address-title flex-box-x-l-y-c flex-box-top'>"+
								"<b>收货人</b>"+
								"<b id='name'>"+a_recipient+"</b>"+
								"<span id='tel'>"+a_phone+"</span>"+
							"</div>"+
							"<p id='address-text text-br'>"+a_province+a_city+a_district+"</p>"+
							"<p id='address-text text-br'>"+a_address+"</p>"+
						"</div>"+
					"</a>"
					$("#address-list-details").html(content_1_html);
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(content_data_1);
	}
	
	//地址修改
	if($("#address-list-edit-content").length>0){
		//加载未更改的地址
		var content_data_1 = {
			path: "/address/default?user_token=" + user_token,
			fun:function(data,status){
				if(data.code=="200"){
					var value = data.data;
					
					var a_recipient = value.recipient;
					var a_province = value.province == ""? "" : value.province+" ";
					var a_city = value.city+" ";
					var a_district = value.district;
					var a_address = value.address;
					var a_phone = value.phone;
					
					$('#recipient').val(a_recipient);
					$('#phone').val(a_phone);
					$('#regional-choice').val(a_province+a_city+a_district);
					$('#address').val(a_address);
					
					//省市数据
					var province_city_district = [a_province,a_city,a_district];
					
					//选择所在地区
					$("#regional-choice").cityPicker({
					    toolbarTemplate: '<header class="bar bar-nav">\
						<button class="button button-link pull-left close-picker color-style-2" id="picker-hide">取消</button>\
						<button class="button button-link pull-right close-picker color-style-1">确定</button>\
						<h1 class="title">选择所在地区</h1>\
						</header>',
						cssClass: 'new-picker-style-1 new-picker-style-2',
						onClose: function(value){
							province_city_district = [];
							if(value.value[(value.value.length)-1]==""){
								value.value.forEach(function(item,index){
									if(index==0){
										province_city_district.push(" ");
										province_city_district.push(item);
									}else if(index<(value.value.length)-1){
										province_city_district.push(item);
									}
								})
							}else{
								province_city_district = value.value;
							}
						}
				  	});
					
					//遮罩添加
					$(document).on('click','#regional-choice', function () {
						p.mask_box_1_add();
					});
					
					//遮罩删除
					$(document).on('click','.close-picker,.mask-box-1', function () {
						p.mask_box_1_del();
					});
					//修改地址
					$(document).on('click','#address-save',function(){
						
						var recipient = $('#recipient').val();
						var phone = $('#phone').val();
						var address = $('#address').val();
						if(recipient==""){$.toast("请输入收货人",1000);return false;}
						if(!p.verify('mobile',phone)){$.toast("请输入正确的手机号码",1000);return false;}
						if(province_city_district.length==0){$.toast("请选择所在地区",1000);return false;}
						if(address==""){$.toast("请输入详细地址",1000);return false;}
						
						var content_data_2 = {
							path: "/address/edit?user_token=" + user_token,
							parameter: {
								id: parseInt(p.url_data_get("id")),
								recipient: recipient,
								province: province_city_district[0] == ""? " " : province_city_district[0],	//解决省,内容为空,无法提交问题
								city: province_city_district[1],
								district: province_city_district[2],
								address: address,
								phone: phone
							},
							fun:function(data,status){
								if(data.code=="200"){
									$.toast("修改成功!",1000);
									p.jump_go(1000);
								}else{
									$.toast(data.message);
									return false;
								}
							}
						}
						p.data_post(content_data_2);
					});
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(content_data_1);
	}
	
	//添加收货地址
	if($("#address-list-add-content").length>0){
		//省市数据
		var province_city_district = [];
		//选择所在地区
		$("#regional-choice").cityPicker({
		    toolbarTemplate: '<header class="bar bar-nav">\
			<button class="button button-link pull-left close-picker color-style-2" id="picker-hide">取消</button>\
			<button class="button button-link pull-right close-picker color-style-1">确定</button>\
			<h1 class="title">选择所在地区</h1>\
			</header>',
			cssClass: 'new-picker-style-1 new-picker-style-2',
			onClose: function(value){
				province_city_district = [];
				if(value.value[(value.value.length)-1]==""){
					value.value.forEach(function(item,index){
						if(index==0){
							province_city_district.push(" ");
							province_city_district.push(item);
						}else if(index<(value.value.length)-1){
							province_city_district.push(item);
						}
					})
				}else{
					province_city_district = value.value;
				}
			}
	  	});
		
		//遮罩添加
		$(document).on('click','#regional-choice', function () {
			p.mask_box_1_add();
		});
		
		//遮罩删除
		$(document).on('click','.close-picker,.mask-box-1', function () {
			p.mask_box_1_del();
		});
		
		//添加地址
		$(document).on('click','#address-save',function(){
			
			var recipient = $('#recipient').val();
			var phone = $('#phone').val();
			var address = $('#address').val();
			
			if(recipient==""){$.toast("请输入收货人",1000);return false;}
			if(!p.verify('mobile',phone)){$.toast("请输入正确的手机号码",1000);return false;}
			if(province_city_district.length==0){$.toast("请选择所在地区",1000);return false;}
			if(address==""){$.toast("请输入详细地址",1000);return false;}
			
			var content_data_1 = {
				path: "/address/add?user_token=" + user_token,
				parameter: {
					recipient: recipient,
					phone: phone,
					province: province_city_district[0],
					city: province_city_district[1],
					district: province_city_district[2],
					address: address
				},
				fun:function(data,status){
					if(data.code=="200"){
						$.toast("添加成功!",1000);
						p.jump_go(1000,2);
					}else{
						$.toast(data.message);
						return false;
					}
				}
			}
			p.data_post(content_data_1);
		});
	}
	
	//帮助中心
	if($("#help-center-content").length>0){
		var content_1_html = "";
		var content_data_1 = {
			path: "/article/detail?user_token=" + user_token + "&type=6",
			fun:function(data,status){
				if(data.code=="200"){
					content_1_html = data.data.content; 
					$("#help-center-details").html(content_1_html);
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(content_data_1);
	}
	
	//关于我们
	if($("#about-us-content").length>0){
		var content_1_html = "";
		var content_data_1 = {
			path: "/article/detail?user_token=" + user_token + "&type=7",
			fun:function(data,status){
				if(data.code=="200"){
					content_1_html = data.data.content; 
					$('#about-us-details').html(content_1_html);
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(content_data_1);
	}
	
	//APP服务协议
	if($("#service-agreement-content").length>0){
		var content_1_html = "";
		var content_data_1 = {
			path: "/article/detail?user_token=" + user_token + "&type=4",
			fun:function(data,status){
				if(data.code=="200"){
					content_1_html = data.data.content; 
					$('#service-agreement-details').html(content_1_html);
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(content_data_1);
	}
	
	//商品搜索
	if($("#search-for-content").length>0){
		$(document).on('click','#search-for-post',function(){
			var search_for_text = $("#search-for-text").val();
			if(search_for_text==""){$.toast("请输入搜索内容",1000);return false;}
			var content_data_1 = {
				path: "/item/list?user_token=" + user_token + "&keyword=" + search_for_text,
				fun:function(data,status){
					if(data.code=="200"){
						if(data.data.list.length==0){
							p.jump("search-for-no.html");
						}else{
							search_for_text = "search_title="+encodeURI(encodeURI(search_for_text));	//中文encodeURI转码
							p.jump("search-for-rear.html?"+search_for_text);
						}
					}else{
						$.toast(data.message);
						return false;
					}
				}
			}
			p.data_post(content_data_1);
			return false;
		});
	}
	
	//商品搜索后,商品展示
	if($("#search-for-rear-content").length>0){
		var search_title = p.url_data_get('search_title');
		search_title = decodeURI(search_title);	//中文转码
		$("#search-for-title").text(search_title);
		
		//获取商品列表
		//下拉加载
		// 每次加载添加多少条目
		var itemsPerLoad = 12;
		var pull_down_data_1 = {
			path: "/item/list?user_token=" + user_token + "&page_size=" + itemsPerLoad + "&keyword=" + search_title,
			fun:function(data,status){
				if(data.code=="200"){
					// 加载flag
			      	var loading = false;
					// 最多可加载的条目
					var maxItems = parseInt(data.data.pager.total_page);
					
					//删除加载图标
					if(maxItems==1 || data.data.list.length==0){
						$('.infinite-scroll-preloader').remove();
					}else{
						//显示加载图标
				      	$(".infinite-scroll-preloader").removeClass("display-no");
					}
					
					function addItems(number, lastIndex) {
						// 生成新条目的HTML
						var content_1_html = "";
						var pull_down_data_2 = {
							path: "/item/list?user_token=" + user_token + "&page=" + lastIndex + "&page_size=" + number + "&keyword=" + search_title,
							fun:function(data,status){
								if(data.code=="200"){
									
									data.data.list.forEach(function(value,index){
										var a_href = "shop-details.html?item_id=" + value.item_id;
										var a_cover_img = value.cover_img;
										var a_name = value.name;
										var a_num = value.num;
										var a_price = value.price;
										var a_summary = value.summary;
										var a_unit = value.unit;
										
										content_1_html+=
										'<li>'+
											'<a href='+a_href+'>'+
												'<span class="dom-w-h bg-auto" style="background-image: url('+a_cover_img+');"></span>'+
												'<h1>'+a_name+'</h1>'+
												'<p class="text-overflow">'+a_summary+'</p>'+
												'<div class="flex-box-x-z">'+
													'<span><i>&yen;</i><b>'+a_price+'</b>/'+a_unit+'</span>'+
													'<span>库存<i>'+a_num+'</i>'+a_unit+'</span>'+
												'</div>'+
											'</a>'+
										'</li>'
										
									});
									$("#search-for-rear-details").append(content_1_html);
									p.w_h_set("#search-for-rear-details",".dom-w-h");
									
								}else{
									$.toast(data.message);
									return false;
								}
							}
						}
						p.data_post(pull_down_data_2);
					}
					
					// 初始页码
			      	var lastIndex = 1;
					
					//预先加载x条
					addItems(itemsPerLoad, lastIndex);
//			      	$(".infinite-scroll-preloader").removeClass("display-no");
			      	
			      	// 注册'infinite'事件处理函数
			      	$(document).on('infinite', '.infinite-scroll', function() {
						// 如果正在加载，则退出
						if(loading) return;
					
						// 设置flag
						loading = true;
						
						// 模拟1s的加载过程
						setTimeout(function() {
							// 重置加载flag
							loading = false;
							
							//更新序号
							lastIndex++;
							if(lastIndex > maxItems) {
								// 加载完毕，则注销无限加载事件，以防不必要的加载
								$.detachInfiniteScroll($('.infinite-scroll'));
								// 删除加载提示符
								$('.infinite-scroll-preloader').html("没有更多了");
								return;
							}
					
							// 添加新条目
							addItems(itemsPerLoad, lastIndex);
							//容器发生改变,如果是js滚动，需要刷新滚动
							$.refreshScroller();
						}, 1000);
					});
					
				}else{
					$.toast(data.message);
					return false;
				}
			}
		}
		p.data_post(pull_down_data_1);
		
		$.init();	//初始化方法
	}
	
	//查看物流
	if($("#logistics-content").length>0){
		var order_id = p.url_data_get("id");
		
		var content_html_1 = "";
		var content_data_1 = {
			path: "/order/shipping-info?user_token=" + user_token + "&order_id=" + order_id,
			fun:function(data,status){
				if(data.code=="200"){
					$("#shipping_no").text(data.data.shipping_no);
					
					data.data.info.forEach(function(value,index){
						var a_text = value.text;
						var a_time = value.time;
						
						content_html_1+=
						'<li class="flex-box-x-z">'+
							'<p class="express-process-line"></p>'+
							'<div class="form-input-1">'+
								'<div>'+
									'<p class="text-overflow-2">'+a_text+'</p>'+
									'<span class="text-overflow-1 text-br">'+a_time+'</span>'+
								'</div>'+
							'</div>'+
						'</li>';
					});
					$("#logistics-details").html(content_html_1);
				}else{
					$.toast(data.message);
					if(data.code == 403){
						p.jump(p.login_href,2000);
					}
					return false;
				}
			}
		}
		p.data_post(content_data_1);
	}
	
	//input输入框弹起软键盘的解决方案。
	var bfscrolltop = document.getElementsByClassName("page-scrollView").scrollTop;
	$("input").focus(function () {
      document.getElementsByClassName("page-scrollView").scrollTop = bfscrolltop;
      //console.log(document.body.scrollTop);
    }).blur(function () {
      document.body.scrollTop = 0;
      //console.log(document.body.scrollTop);
    });
	//select输入框弹起软键盘的解决方案。
    $("select").focus(function () {
      document.getElementsByClassName("page-scrollView").scrollTop = bfscrolltop;
      //console.log(document.body.scrollTop);
    }).blur(function () {
      document.body.scrollTop = 0;
      //console.log(document.body.scrollTop);
    });
	//textarea输入框弹起软键盘的解决方案。
    $("textarea").focus(function () {
      document.getElementsByClassName("page-scrollView").scrollTop = bfscrolltop;
      //console.log(document.body.scrollTop);
    }).blur(function () {
      document.body.scrollTop = 0;
      //console.log(document.body.scrollTop);
    });
	
})


