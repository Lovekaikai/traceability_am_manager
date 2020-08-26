<template>
	<view class="createProduct">
		<!-- 头部 start -->
		<navbar>
			<view class="title">新建商品</view>
		</navbar>
		<!-- 头部 end -->

		<!-- 主体  strat -->
		<view class="main">
			<view class="form">
				<view class="form_item">
					<view class="item_title">商品名称 <text class="require">*</text></view>
					<!-- <input type="text" maxlength="20" v-model.trim="goodNewForm.productName" placeholder="请输入商品名称" class="input" /> -->
					<view class="uni-list">
						<view class="uni-list-cell">
							<bjx-inputs class="bjx-inputs"  the-style="margin: 20rpx auto;font-size: 28rpx;"
							 :value="goodNewForm.productName" placeholder='请输入内容' @list="getData1" @select='select1' overflow="auto">
							</bjx-inputs>

						</view>
					</view>
				</view>
				<view class="form_item">
					<view class="item_title">商品分类 <text class="require">*</text></view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<bjx-inputs class="bjx-inputs" v-model="goodNewForm.classificationName" the-style="margin: 20rpx auto;font-size: 28rpx;"
							 :value="goodNewForm.classificationName" item-key="classificationName" placeholder='请输入内容' @list="getData2"
							 @select='select2' overflow="auto">
							</bjx-inputs>

						</view>
					</view>
				</view>
				<view class="form_item">
					<view class="item_title">商品数量 (单位:kg)<text class="require">*</text></view>
					<input type="number" maxlength="16" v-model.tirm="goodNewForm.productReady" placeholder="请输入商品数量" class="input" />
				</view>
				<view class="form_item">
					<view class="item_title">商品来源地 <text class="require">*</text></view>
					<input type="text" maxlength="80" v-model.trim="goodNewForm.productOrigin" placeholder="请输入商品来源地" class="input" />
				</view>
				<view class="good_img_wrap">
					<view class="item_title">商品图片<text class="require">*</text></view>
					<robby-image-upload v-model="goodNewForm.productImg" :value="imgarr" @delete="delProductImg" @add="addProductImg"
					 :enable-drag="true" :enable-del="true" :enable-add="true" fileKeyName="file" :server-url="serverUrl">
						<view class="text">点击上传</view>
					</robby-image-upload>
				</view>
				<view class="good_img_wrap inspection">
					<view class="item_title">检疫合格证明<text class="require">*</text></view>
					<robby-image-upload v-model="goodNewForm.checkImg" @delete="delCheckImg" @add="addCheckImg" :enable-drag="true"
					 :enable-del="true" :enable-add="true" fileKeyName="file" :server-url="serverUrl">
						<view class="text">点击上传</view>
					</robby-image-upload>
				</view>
			</view>

			<view class="next_wrap" @tap="toflowTraceEnter()">
				<view class="btn">下一步</view>
			</view>
		</view>
		<!-- 主体  end -->
	</view>
</template>

<script>
	var _self;
	import navbar from '@/components/navbar/navbar.vue';
	import BjxInputs from '@/components/bjx-inputs/bjx-inputs.vue'
	import robbyImageUpload from '@/components/robby-image-upload/robby-image-upload.vue';
	export default {
		components: {
			navbar,
			robbyImageUpload,
			BjxInputs,
		},
		data() {
			return {
				// imageData : [],
				// imageData1: [],
				data1: [], //商品名称数据
				data2: [], //商品分类数据
				imglist: [], //生产图片二维数组
				imgarr: [],
				serverUrl: "https://zs-beta.cntracechain.com/imageService/file/upload",
				index: 0,
				//新建商品验证表单对象
				goodNewForm: {
					productName: "", //商品名称	
					classificationName: "", //分类名称			
					productReady: "", //当日进货数量（和库存填一样）
					productStock: "", //库存数量	
					productOrigin: "", //商品来源地
					productImg: [], //生产图片
					checkImg: [], //检验图片
					stallId: "", //摊位id					
					stallHolderId: "", //摊主id
					merchantId: "", //商家id
					accountId: "", //用户id
				},

			};
		},
		onLoad(e) {
			console.log(e);
			this.goodNewForm.stallId = e.stallId
			this.goodNewForm.stallHolderId = e.stallHolderId
			_self = this;
			uni.getStorage({
				key: 'useinfo',
				success: function(res) {
					// console.log(res.data);
					_self.goodNewForm.merchantId = res.data.merchant.merchantId
					_self.goodNewForm.accountId = res.data.id
				}
			});
			this.getAllClass()

		},
		onUnload: function() {
			// 页面销毁时执行
			// console.log(e)
			// this.goodNewForm.productImg = []
			// this.goodNewForm.checkImg = []
		},
		// watch: {
		// 	'goodNewForm.productName'() {
		// 		this.getGoodList(this.goodNewForm.productName)
		// 	}
		// },
		// onBackPress(e) {
		//     console.log(e);
		//     if(e.from == 'backbutton'){
		//     // this.$util.showModal('提示','新增商品资料未保存,确认退出吗?',true,'继续编辑','确定').then(()=>{
		//     // 	console.log('确定')
		//     // 	uni.navigateBack({
		//     // 		delta:1
		//     // 	})
		//     // }).catch(()=>{
		//     // 	console.log('继续编辑')
		//     // })
		// 	uni.showModal({
		// 	    title: '提示',
		// 	    content: '这是一个模态弹窗',
		// 	    success: function (res) {
		// 	        if (res.confirm) {
		// 	            console.log('用户点击确定');
		// 	        } else if (res.cancel) {
		// 	            console.log('用户点击取消');
		// 	        }
		// 	    }
		// 	});
		//     return true;//阻止默认返回行为
		//     }
		// },
		mounted() {
			// #ifdef H5
			var u = navigator.userAgent;
			var flag;
			var myFunction;
			var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
			if (isIOS) {
				document.body.addEventListener('focusin', () => { //软键盘弹起事件
					flag = true;
					clearTimeout(myFunction);
				})
				document.body.addEventListener('focusout', () => { //软键盘关闭事件
					flag = false;
					if (!flag) {
						myFunction = setTimeout(function() {
							window.scrollTo({
								top: window.scrollY,
								left: 0,
								behavior: "smooth"
							}) //重点  =======当键盘收起的时候让页面回到原始位置(这里的top可以根据你们个人的需求改变，并不一定要回到页面顶部)

						}, 200);
					} else {
						return
					}
				})
			} else {
				return
			}
			// #endif
		},
		methods: {
			// 远程加载数据 返回一个对象，{value: 输入框值, callback: 回调函数}
		async	getData1(e) {
				console.log("222",e)
				// 覆盖 value1
				this.goodNewForm.productName = e.value
				this.getGoodList(this.goodNewForm.productName).then(()=>{
					if (!e.value) {
						e.callback(this.data1)
					} else {
						let data = []
						this.data1.forEach(item => {
							if (item.indexOf(e.value) > -1) {
								data.push(item)
							}
						})
						e.callback(this.data1)
					}
				})
				
			},
			select1(value, index) {
				// console.log(index)

				// console.log(this.imglist[index])
				let arr = this.imglist[index].map(function(value, index, self) {
					return value.url;
				})
				this.goodNewForm.productImg = arr
				this.imgarr = arr
				this.goodNewForm.productName = value.split("-")[0]
				console.log(1, value)
				this.goodNewForm.classificationName = value.split("-")[1]
				this.goodNewForm.productOrigin = value.split("-")[2]
			},
			getData2(e) {
				// console.log(e)
				this.goodNewForm.classificationName = e.value
				if (!e.value) {
					e.callback(this.data2)
				} else {
					let data = []
					this.data2.forEach(item => {
						if (item.classificationName.indexOf(e.value) > -1) {
							data.push(item)
						}
					})
					e.callback(data)
				}
				// console.log(data)
			},
			select2(value) {
				this.goodNewForm.classificationName = value.classificationName
				console.log(2, value)
			},
			// focus1(e){
			// 	console.log('框聚焦', e)
			// },
			// blur1(e){
			// 	console.log('框失焦', e)
			// },
			//上传商品图片
			addProductImg: function(e) {
				console.log(e);
				// let arr = e.allImages.map(function(item){
				// 	if(item.code ==200){
				// 		return item.data.url;
				// 	}				   
				// });
				// console.log(arr)
				// this.goodNewForm.productImg = arr				
			},
			//删除上传商品图片
			delProductImg: function(e) {
				console.log(e);
				// let arr = e.allImages.map(function(item){
				// 	if(item.code ==200){
				// 		return item.data.url;
				// 	}				   
				// });

				// // console.log(arr)
				// this.goodNewForm.productImg = []
				// this.goodNewForm.productImg = arr	
			},


			//上传检疫合格证明
			addCheckImg: function(e) {
				console.log(e);
			},
			//删除上传检疫合格证明
			delCheckImg: function(e) {
				console.log(e);
			},

			// 点击下一步
			toflowTraceEnter: function() {
				//商品图片处理
				// let arr1 = this.goodNewForm.productImg
				console.log(this.goodNewForm.productImg)
				// let productImgList = arr1.map(function(item,index, arr) {
				// 	 if (item.code == 200) {
				// 		return item.data.url;
				// 	}
				// })
				// console.log(productImgList)
				//检疫合格证明处理
				// let arr2 = this.goodNewForm.checkImg
				console.log(this.goodNewForm.checkImg)
				// let checkImgList = arr2.map(function(item) {
				// 	 if (item.code == 200) {
				// 		return item.data.url;
				// 	}
				// })
				// console.log(checkImgList)
				//新建商品必填参数
				let params = {
					productName: this.goodNewForm.productName,
					productOrigin: this.goodNewForm.productOrigin,
					productReady: this.goodNewForm.productReady,
					productStock: this.goodNewForm.productReady,
					productImg: this.goodNewForm.productImg,
					checkImg: this.goodNewForm.checkImg,
					stallId: this.goodNewForm.stallId,
					stallHolderId: this.goodNewForm.stallHolderId,
					merchantId: this.goodNewForm.merchantId,
					accountId: this.goodNewForm.accountId,
					classificationName: this.goodNewForm.classificationName,
				}
				// console.log(params.classificationName)
				// console.log(params.stallId)
				// console.log(params.stallHolderId)
				// console.log(params.merchantId)



				if (params.productName == '' || params.productName == undefined || params.productName == null) {
					this.$util.showToast({
						title: "商品名称不能为空",
						icon: 'none'
					});
					return false;
				} else if (params.classificationName.trim() == '' || params.classificationName == undefined || params.classificationName ==
					null) {
					this.$util.showToast({
						title: "商品分类不能为空",
						icon: 'none'
					});
					return false;
				} else if (params.productReady == '' || params.productReady == undefined || params.productReady == null) {
					this.$util.showToast({
						title: "商品数量不能为空",
						icon: 'none'
					});
					return false;
				} else if (params.productOrigin == '' || params.productOrigin == undefined || params.productOrigin == null) {
					this.$util.showToast({
						title: "商品来源地不能为空",
						icon: 'none'
					});
					return false;
				} else if (params.productImg.length <= 0) {
					this.$util.showToast({
						title: "商品图片不能为空,未上传",
						icon: 'none'
					});
					return false;
				} else if (params.checkImg.length <= 0) {
					this.$util.showToast({
						title: "检疫合格证明不能为空,未上传",
						icon: 'none'
					});
					return false;
				} else {
					//把新建商品参数进行存储
					uni.setStorage({
						key: 'addgoodsObj',
						data: params,
						success: function() {
							// console.log('success');	
							console.log("跳转流通追溯录入")
							uni.redirectTo({
								url: "../flowTraceEnter/flowTraceEnter"
							})
						}
					});

					// setTimeout(() => {

					// }, 2000)
				}




				//校验表单 自定义验证规则
				// const {
				// 	productName,
				// 	classificationId,
				// 	productReady,
				// 	productOrigin,
				// 	productImg,
				// 	checkImg,
				// } = this.goodNewForm;
				// // 自定义验证规则
				// const rules = {
				// 	productName: {
				// 		value: productName,
				// 		message: '商品名称不能为空'
				// 	},
				// 	classificationId: {
				// 		value: classificationId,
				// 		message: '分类id不能为空'
				// 	},
				// 	productReady: {
				// 		value: productReady,
				// 		message: '商品数量不能为空'
				// 	},
				// 	productOrigin: {
				// 		value: productOrigin,
				// 		message: '商品来源地不能为空'
				// 	},
				// 	productImg: {
				// 		value: productImg,
				// 		message: '商品图片不能为空'
				// 	},
				// 	checkImg: {
				// 		value: checkImg,
				// 		message: '检疫合格证明不能为空'
				// 	}
				// }

				// let valid = true
				// Object.keys(rules).forEach(v => {
				// 	let item = rules[v];
				// 	if (!item.value.trim()) {
				// 		valid = false;
				// 		this.$util.showToast({
				// 			title: item.message,
				// 			icon: 'none'
				// 		});
				// 	}
				// })

				// if (!valid) return;

				// uni.navigateTo({
				// 	url: "../flowTraceEnter/flowTraceEnter"
				// })
			},
			//根据模糊查询条件查询商品
			getGoodList(val) {
				return new Promise((resolve,reject)=>{
					this.$util.get("/traceability_am/goods/list?type=2&pageSize=50&productName=" + val).then(res => {
						// console.log(res)
						if (Number(res.data.code) === 200) {
							let dataArr = res.data.data.list.map((item, index, arr) => {
								return item.goodsInfo
							});
							// console.log(dataArr)
							//对数据拼接处理						 
							let newArr = dataArr.map((item, index, arr) => {
								// console.log(item.specValue)
								let aaa = item.productName + "-" + item.amClassification.classificationName + "-" + item.productOrigin;
								// let imgObj = {
								// 	url: item.productImg.forEach((item1, idx) => {
								// 		_images.push(item.imageUrl)
								// 	}),
								// 	fullProductName: arr1
								// }
								// let a = Object.assign(item, imgObj)
								// console.log('sjfjf', a)
								// return a;							
								return aaa
							});
							let newArr2 = dataArr.map((item, index, arr) => {
								return item.productImg
							});
							this.imglist = newArr2
							// console.log(newArr2)
							this.data1 = newArr;
						} else {
							uni.showToast({
								title: res.data.message,
								icon: 'none',
								mask: true,
								duration: 1000,
							})
						}
						resolve(true)
					});
				})
				

			},
			//获取所有商品分类
			getAllClass() {
				this.$util.get("/traceability_am/classification/getAll").then(res => {
					// console.log(res)
					if (Number(res.data.code) === 200) {
						this.data2 = res.data.data;

						// console.log(this.data2)
					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none',
							mask: true,
							duration: 1000,
						})
					}
				});
			},

		}
	};
</script>

<style lang="less" scoped>
	@import './createProduct.less';
</style>
