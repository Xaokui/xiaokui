//可以通过闭包实现模块化开发
(function ($, React, ReactRouter) {
// 定义一些变量
var BANNER_NUM = 2;
var ITEM_NUM = 33;
var app = $('#app')
// 定义数据容器
var DataBase;

/**
 * 定义图片加载器
 * @step 	每张图片加载成功时候的回调函数
 * @success 加载成功时候的回调函数
 * @fail	加载失败时候执行的回调函数
 **/ 

var ImageLoader = function (step, success, fail) {
	this.step = step;
	this.success = success;
	this.fail = fail;
	this.init();
}
ImageLoader.prototype = {
	// 初始化一些数据的
	init: function () {
		// item图片总数，以及当前图片数
		this.totalNum = this.num = ITEM_NUM;
		// banner图片的总数，以及当前banner图片数
		this.totalBannerNum = this.bannerNum = BANNER_NUM;
		// 加载这些图片
		this.loader()
	},
	// 加载图片
	loader: function () {
		// 加载banner
		while(--this.bannerNum >= 0) {
			// 加载banner图片
			this.loadImage(this.bannerNum, true)
		}
		this.bannerNum++;
		// 加载item图片
		while(--this.num >= 0) {
			// 加载图片
			this.loadImage(this.num)
		}
		this.num++;
	},
	/**
	 * 处理加载的图片数据
	 * @isBanner 	是否是bannner图片
	 ***/ 
	dealNum: function (isBanner) {
		// 判断是否是banner图片
		if (isBanner) {
			// 加bannerNum
			this.bannerNum++;
		} else {
			// 加num
			this.num++;
		}
	},
	/**
	 * 执行回调函数
	 * @isFail 	是否是失败的
	 **/ 
	isReady: function (isFail) {
		// 已经加载完成的图片
		var num = this.num + this.bannerNum;
		// 图片总数
		var total = this.totalNum + this.totalBannerNum;
		// 都要执行一次step,传入已经加载完成的图片，以及图片总数
		if (isFail) {
			this.fail()
		} else {
			this.step(num, total);
		}
		// 加载完成
		if (num === total) {
			this.success()
		}
	},
	/**
	 * 加载一张图片的
	 * @num 		图片索引值
	 * @isBanner 	是否是banner图片
	 **/
	loadImage: function (num, isBanner) {
		var img = new Image();
		// 图片加载成功回调
		img.onload = function () {
			// 处理加载的图片数据
			this.dealNum(isBanner);
			// 执行回调函数
			this.isReady();
		}.bind(this)
		// 图片加载失败执行fail
		img.onerror = function () {
			// 处理加载的图片数据
			this.dealNum(isBanner);
			// 执行回调函数
			this.isReady(true);
		}.bind(this)
		// 加载图片
		img.src = this.getImageUrl(num, isBanner)
	},
	/**
	 * 获取图片地址的
	 * @num 		图片索引值
	 * @isBanner 	是否是banner图片
	 * return 		图片地址
	 **/
	getImageUrl: function (num, isBanner) {
		if (isBanner) {
			return 'img/banner/banner' + num + '.jpg';
		} else {
			return 'img/item/item' + num + '.jpg';
		}
	}
}

$.get('data/sites.json', function (res) {
	if (res && res.errno === 0) {
		// 存储数据
		DataBase = res.data;
		// 加载图片
		new ImageLoader(
			function (num, total) {
				// console.log('step', num, total)
				app.find('.loader-text span').html((num / total * 100).toFixed(2))
			},
			function () {
				// 渲染组件
				React.render(<h1>爱创课堂</h1>, app[0])
			}
		)
	}
})


})(jQuery, React, ReactRouter);