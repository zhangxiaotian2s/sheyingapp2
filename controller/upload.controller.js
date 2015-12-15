var aniShowStyle="slide-in-bottom"
mui.init()
mui.plusReady(function() {
})
	//关闭按钮事件
var closebtn = document.getElementById('closebtn')
closebtn.addEventListener('tap', function() {
	var activeTab = plus.storage.getItem('activeTab')
	var listview = plus.webview.getWebviewById(activeTab)
	var indexview = plus.webview.currentWebview().parent()
	indexview.evalJS('tabBtnClass()')
	listview.evalJS('markclose()')
	plus.webview.hide('pages/upload.html', 'zoom-in')
}, false)

var album = document.getElementById('album')
album.addEventListener('tap', function() {
	galleryImg()
}, false)

function galleryImg() {
	// 从相册中选择图片
	plus.gallery.pick(function(path) {
		gotoImageUpload(path)
	}, function(e) {}, {
		filter: "image"
	});
}
//拍照上传事件
var camera = document.getElementById('camera')
camera.addEventListener('tap', function() {
	getImage()
}, false)

function getImage() {
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p) {
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			gotoImageUpload(entry.fullPath)
		}, function(e) {
			alert("读取拍照文件错误：" + e.message);
		});
	}, function(e) {
	}, {
		filename: "_doc/camera/",
		index: 1
	});
}
//调整页面
function gotoImageUpload(imgsrc) {
	mui.openWindow({
		url: 'imgupload.html',
		id: 'imgupload.html',
		show: {
			 aniShow:aniShowStyle,
		},
		waiting:{
			autoShow:false
		},
		extras: {
			imgsrc: imgsrc
		}
	})
}