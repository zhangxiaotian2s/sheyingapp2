//mui初始化
mui.init({
	swipeBack: true,
	gestureConfig: {
		doubletap: true
	}
});
var mian
var subpages = ['pages/photolist.html', 'pages/tab-webview-subpage-chat.html', 'pages/tab-webview-subpage-contact.html', 'pages/tab-webview-subpage-setting.html'];
var subpage_style = {
	top: '45px',
	bottom: '51px',
	hardwareAccelerated: true
};
var aniShow = {};
//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {
	plus.navigator.setFullscreen(false);
	plus.screen.lockOrientation("portrait-primary");
	var self = plus.webview.currentWebview();
	mian = self
	for (var i = 0; i < 4; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
		if (i > 0) {
			sub.hide();
		} else {
			temp[subpages[i]] = "true";
			mui.extend(aniShow, temp);
		}
		self.append(sub);
	}
});
//当前激活选项
var activeTab = subpages[0];

var title = document.getElementById("title");
//选项卡点击事件
mui('.mui-bar-tab').on('tap', 'a', function(e) {
	var targetTab = this.getAttribute('href');
	if (targetTab == activeTab) {
		return;
	}
	//更换标题
	title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
	//显示目标选项卡
	//若为iOS平台或非首次显示，则直接显示
	if (mui.os.ios || aniShow[targetTab]) {
		plus.webview.show(targetTab);
	} else {
		//否则，使用fade-in动画，且保存变量
		var temp = {};
		temp[targetTab] = "true";
		mui.extend(aniShow, temp);
		plus.webview.show(targetTab, "fade-in", 300);
	}
	//隐藏当前;
	plus.webview.hide(activeTab);
	//更改当前活跃的选项卡
	activeTab = targetTab;
});
//自定义事件，模拟点击“首页选项卡”
document.addEventListener('gohome', function() {
	var defaultTab = document.getElementById("defaultTab");
	//模拟首页点击
	mui.trigger(defaultTab, 'tap');
	//切换选项卡高亮
	var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
	if (defaultTab !== current) {
		current.classList.remove('mui-active');
		defaultTab.classList.add('mui-active');
	}
});
document.querySelector('header').addEventListener('doubletap', function() {
	mian.children()[0].evalJS('mui.scrollTo(0, 100)');
});
var first = null;
mui.back = function() {
	//首次按键，提示‘再按一次退出应用’
	if (!first) {
		first = new Date().getTime();
		mui.toast('再按一次退出应用');
		setTimeout(function() {
			first = null;
		}, 1000);
	} else {
		if (new Date().getTime() - first < 1000) {
			plus.runtime.quit();
		}
	}
};