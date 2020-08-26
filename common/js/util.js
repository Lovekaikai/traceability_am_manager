// 小程序和APP需要
let API_Url = "https://zs-beta.cntracechain.com"

// let baseUrl = process.env.NODE_ENV === 'development' ? '/api' : ''
export default class Util {
	// get请求封装
	static get(url, param, loading = true) {
		if (loading) {
			Util.loading()
		}
		return new Promise((resolve, reject) => {
			url = API_Url + url		
			uni.request({
				url: url,
				method: "GET",
				data: param,
				success: (res) => {
					resolve(res)
				},
				fail: (rej) => {
					reject(rej)
				},
				complete: () => {
					Util.hideLo()
				}
			})
		})
	}
	// post请求封装
	static httpPost(url, param, loading = true) {
		if (loading) {
			Util.loading()
		}
		return new Promise((resolve, reject) => {	
			url = API_Url + url		
			uni.request({
				url: url,
				method: "POST",
				data: param,
				success: (res) => {
					resolve(res)
				},
				fail: (rej) => {
					reject(rej)
				},
				complete: (data) => {
					Util.hideLo()
				}
			})
		})
	}
	
		// 请求方法
	static request(params,loading = true) {
			//调用一次方法让数量自增
			console.log(params)
			// requestCount++;
			//显示 加载
			if(loading) {
				Util.loading()
			}
			
			return new Promise((resolve,reject) => {
				uni.request({
					...params,
					url : API_Url + params.url,
					success: (res) => {
						resolve(res.data)
					},
					fail: (err) => {
						reject(err)
					},
					complete: () => {
						// 当请求次数都完成时 隐藏 加载
						Util.hideLo()	
					}
				})
			})
	}
	//显示 加载
	static loading() {
		uni.showLoading({
			title: '加载中',
			duration: 1500
		})
	}
	//隐藏 加载
	static hideLo() {
		uni.hideLoading()
	}
	// 弹窗提醒
	static showToast(params) {
		uni.showToast({
			...params,
			mask: true,
			duration: 1000,
		})
	}
	// 路由跳转
	static navigateTo(url) {
		uni.navigateTo({
			url: url,
		});
	}
	// 获取当前时间并格式化为(xxxx-xx-xx)
	static newDate (time) {
	  	    // console.log(time)
	  		let date = new Date(time);
	  		let year = date.getFullYear();
	  		let mouth = date.getMonth() + 1;
	  		let day = date.getDate();
	  		
	  		mouth = mouth < 10 ? '0' + mouth : mouth;
	  		day = day < 10 ? '0' + day : day;
	  		
	  		return year + '/' + mouth + '/' + day;		
	}
		// 格式化时间 (xxxx/xx/xx)
		static formatDate1(time) {
			console.log(time)
			let date = new Date(time);
			let year = date.getFullYear();
			let mouth = date.getMonth() + 1;
			let day = date.getDate();
			
			mouth = mouth < 10 ? '0' + mouth : mouth;
			day = day < 10 ? '0' + day : day;
			
			return year + '/' + mouth + '/' + day;
		}
	// 默认图片显示
	static defaultImg() {
			return "https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/trace/2019/12/4/3790b6f8-5cd1-45da-8d4d-b068127d356b.webp";
		}
		// 默认内容显示
		static defaultDesc() {
			return '暂无提供';
		}	
	// 图片预览
	static preViewImg(index,Urls) {
			uni.previewImage({
				current : Urls[index],
				urls : Urls,
				indicator : 'default'
			})
		}
	//显示模态弹窗
		
}