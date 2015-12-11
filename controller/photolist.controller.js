var aniShow = "pop-in";
//只有ios支持的功能需要在Android平台隐藏；
//WEBSQL
if (mui.os.android) {
	var list = document.querySelectorAll('.ios-only');
	if (list) {
		for (var i = 0; i < list.length; i++) {
			list[i].style.display = 'none';
		}
	}
	//Android平台暂时使用slide-in-right动画
	if (parseFloat(mui.os.version) < 4.4) {
		aniShow = "slide-in-right";
	}
}
var pagesnumber = 1;
var ishavedata = true;
mui.plusReady(function() {
	//读取本地存储，检查是否为首次启动
	//	var showGuide = plus.storage.getItem("lauchFlag");
	var showGuide = true
	if (showGuide) {
		//有值，说明已经显示过了，无需显示；
		insertPhotoListFromStroge()
		if (mui.os.android) {
			setTimeout(function() {
				ajaxGetPhotoList(1)
			}, 1000)
		}
		//预加载
	} else {
		//显示启动欢迎界面
		mui.openWindow({
			id: 'guide',
			url: 'mypages/guide.html',
			show: {
				aniShow: 'none'
			},
		});
		//延迟的原因：优先打开启动导航页面，避免资源争夺
		setTimeout(function() {
			//预加载
			preload();
		}, 200);
	}
});
mui.init({
	statusBarBackground: '#FFFFFF',
	pullRefresh: {
		container: "#photoRefresh", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		up: {
			contentdown: "正在加载...", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentnomore: '没有更多数据了', //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			callback: function() {
					var _this = this
					pagesnumber++
					ajaxGetPhotoList(pagesnumber)
					console.log(ishavedata)
					if (ishavedata) {
						_this.endPullupToRefresh(false);
					} else {
						_this.endPullupToRefresh(true);
					}
				} //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		},
		down: {
			auto: true,
			contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback: function() {
				ajaxGetPhotoList(1)
				mui("#photoRefresh").pullRefresh().endPulldownToRefresh()
				mui("#photoRefresh").pullRefresh().endPullUpToRefresh()
			}
		}
	}
});
var index = null; //主页面

//在android4.4.2中的swipe事件，需要preventDefault一下，否则触发不正常
window.addEventListener('dragstart', function(e) {
	mui.gestures.touch.lockDirection = true; //锁定方向
	mui.gestures.touch.startDirection = e.detail.direction;
});
window.addEventListener('dragright', function(e) {
	if (!mui.isScrolling) {
		e.detail.gesture.preventDefault();
	}
});

var photo_list = document.getElementById('photo_list');

function ajaxGetPhotoList(page) {
	var nowtime = new Date().getTime()
	var cachetime = parseInt(plus.storage.getItem('cachetime'))
	if (page == 1 && (nowtime - cachetime) > 1000 * 60 * 5) {
		//保证上拉刷新可以开启
		ishavedata = true
		return
	}


	mui.ajax('http://api.mastergolf.cn:80/v1/home/beauties/list.json' + page, {
		data: {
			page: page
		},
		type: 'get',
		dataType: 'json',
		timeout: '5000',
		success: function(data, abv, xhr) {
			var httpstatus = parseInt(xhr.getResponseHeader('status'))
			console.log(httpstatus)
			var code = data.code
			if (page == 1) {
				//缓存第一页数据
				plus.storage.setItem('photolistcache', JSON.stringify(data.data))
					//设置缓存时间 
				plus.storage.setItem('cachetime', (new Date().getTime()).toString())
			}
			if (code == 10000) {
				console.log(data.data.length)
				if (data.data.length == 0) {
					ishavedata = false
				} else {
					ishavedata = true
					insertPhotoListFromAjax(data.data, page)
				}
			}
		},
		error: function() {

		}
	})
}

function insertPhotoListFromStroge() {
	var photolists = plus.storage.getItem('photolistcache');
	if (photolists == null) {
		ajaxGetPhotoList(1)
	} else {
		photolists = JSON.parse(photolists)
		var html = ""
		var _l = photolists.length
		for (i = 0; i < _l; i++) {
			html += '<li class=""><div><img src="' + photolists[i].image + '"></div><p>' + photolists[i].name + '</p></li>'
		}
		photo_list.innerHTML = html;
	}
}


function insertPhotoListFromAjax(photolists, page) {
	if (page == 1) {
		if (pagesnumber == 1) {
			photo_list.innerHTML = ""
			pagesnumber = 1
		} else {
			var _html = photo_list.innerHTML
			photo_list.innerHTML=""
			var _l = photolists.length
			for (i = 0; i < _l; i++) {
				var li = document.createElement('li')
				li.innerHTML = '<div><img src="' + photolists[i].image + '"  class="fade-in"></div><p>' + photolists[i].name + '</p>'
				photo_list.appendChild(li)
			}
			photo_list.innerHTML +=_html
		}
	}else{
	var _l = photolists.length
	for (i = 0; i < _l; i++) {
		var li = document.createElement('li')
		li.innerHTML = '<div><img src="' + photolists[i].image + '"  class="fade-in"></div><p>' + photolists[i].name + '</p>'
		photo_list.appendChild(li)
	}
	}
}












//	主列表点击事件
//mui('#photo_list').on('tap', 'li', function() {
//	var type = this.getAttribute("open-type");
//	var uuid = this.getAttribute('data-uuid');
//	//不使用父子模板方案的页面
//	mui.openWindow({
//		id: 'mypages/photo.html',
//		url: 'mypages/photo.html',
//		styles: {
//			hardwareAccelerated: true,
//			scrollsToTop: true,
//		},
//		show: {
//			//				autoShow: true,
//			//				duration: 300
//		},
//		waiting: {
//			autoShow: false
//		},
//		extras: {
//			uuid: uuid
//		}
//	});
//
//});