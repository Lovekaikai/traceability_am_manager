<template>
	<view class="productTraceEnter">
		<!-- 头部 start -->
		<navbar>
			<view class="title">生产追溯录入</view>
			<view class="add_btn" @tap="handleAdd">添加环节</view>
		</navbar>
		<!-- 头部 end -->

		<!-- 主体 start -->
		<view class="main">
			<view class="form">
				<view class="form_item" v-for="(item,index) in productForm" :key="index">
					<view class="item_title">
						<view class="left">生产环节<text>{{index + 1}}</text></view>
						<view class="right" v-if="index !==0" @click="delinfor(index)">删除环节<text>{{index + 1}}</text></view>
					</view>

					<view class="subform">
						<view class="subform_item">
							<view class="subitem_title">环节名称</view>
							<input type="text" maxlength="20" v-model="item.produceName" placeholder="请输入" />
						</view>
						<view class="subform_item">
							<view class="subitem_title">环节描述</view>
							<input type="text" maxlength="50" v-model="item.produceDescription" placeholder="请输入" />
						</view>
						<view class="subform_item">
							<view class="subitem_title">时间段</view>
							<!-- <input type="text" v-model="item.produceDate" placeholder="请输入" /> -->
							<view class="uni-list">
								<view class="uni-list-cell">
									<view class="uni-list-cell-db" @tap="getIndex(index)">
										<picker mode="date" :value="item.date" :start="startDate" :end="endDate" @change="bindDateChange">
											<view class="uni-input">{{item.date}}</view>
										</picker>
									</view>
								</view>
							</view>
						</view>
						<view class="subform_item"  @tap="getImgIndex(index)">
							<view class="subitem_title">上传多张图片</view>
							<!-- v-model="productForm[index].produceImgList" -->
							<robby-image-upload v-model="productForm[index].produceImgList"  @delete="deleteImage" @add="addImage" :enable-drag="true"
							 :enable-del="true" :enable-add="true" fileKeyName="file" serverUrl="https://zs-beta.cntracechain.com/imageService/file/upload">
								<view class="text" >点击上传</view>
							</robby-image-upload>
						</view>
					</view>
				</view>
			</view>

			<view class="next_btn_wrap">
				<view class="btn" @tap="handleNext">保存</view>
			</view>
		</view>
		<!-- 主体 end -->
	</view>
</template>

<script>
	var _self;
	import navbar from '@/components/navbar/navbar.vue';
	import robbyImageUpload from '@/components/robby-image-upload/robby-image-upload.vue';
	export default {
		components: {
			navbar,
			robbyImageUpload
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				productForm: [{
					produceName: '',
					produceDescription: '',
					produceDate: '',
					produceImgList: [],
					date: "请选择时间"
				}],
				date: "请选择时间",
				selectIndex: "", //当前时间选择的索引	
				imgUploadIndex: "", //点击上传图片按钮索引

                // arr:[],

				productName: "", //商品名称	
				productReady: "", //当日进货数量（和库存填一样）
				productStock: "", //库存数量	
				productOrigin: "", //商品来源地
				productImg: [], //生产图片
				checkImg: [], //检验图片
				classificationName: "",
				stallId: "", //摊位id					
				stallHolderId: "", //摊主id
				merchantId: "", //商家id
				accountId: "", //用户id


				tracebilityNodes: [],
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad(e) {
			_self = this;
			uni.getStorage({
				key: 'addgoodsObj',
				success: function(res) {
					console.log(res);
					_self.accountId = res.data.accountId
					_self.stallId = res.data.stallId
					_self.merchantId = res.data.merchantId
					_self.stallHolderId = res.data.stallHolderId
					_self.classificationName = res.data.classificationName
					_self.productName = res.data.productName
					_self.productReady = res.data.productReady
					_self.productStock = res.data.productStock
					_self.productOrigin = res.data.productOrigin
					_self.productImg = res.data.productImg
					_self.checkImg = res.data.checkImg
				}
			});
			uni.getStorage({
				key: 'tracebilityNodes',
				success: function(res) {
					// console.log(res);
					_self.tracebilityNodes = res.data
				}
			});

		},
		methods: {
			//获取当前选择日期的索引
			getIndex(index) {
				this.selectIndex = index
				 console.log(this.selectIndex)
			},
			//上传图片获取索引
			getImgIndex(index) {
				this.imgUploadIndex = index
				console.log(this.imgUploadIndex)
			},
			//年月日时间选择
			bindDateChange: function(e) {
				console.log(e)
				// console.log(index) 
				// this.date = e.target.value
				this.productForm[this.selectIndex].date = e.target.value
				//获取到秒级时间戳
				if (e.target.value.length > 0) {
					var time = Date.parse(e.target.value) / 1000
				}
				// console.log(this.productForm[this.selectIndex].date)
				// console.log(time)
				this.productForm[this.selectIndex].produceDate = time
			},
			//删除环节按钮
			delinfor(tok) {
				this.productForm.splice(tok, 1);
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			//新增环节
			handleAdd() {
				this.productForm.push({
					produceName: '',
					produceDescription: '',
					produceDate: '',
					produceImgList: [],
					date: "请选择时间"
				});
			},
			//上传图片
			addImage: function(e) {
                // console.log(e);
				// console.log(this.imgUploadIndex);
				for (var i = 0; i < this.productForm.length; i++) {
					if (i === Number(this.imgUploadIndex)) {
						// let arr = e.allImages.map(function(item) {
						// 	if (item.code == 200) {
						// 		return item.data.url;
						// 	}
						// });
						this.productForm[i].produceImgList = e.allImages;
						console.log(this.productForm);
					}
				}
			},
			//删除图片
			deleteImage: function(e) {
				console.log(e);
				// console.log(this.imgUploadIndex);
				// for (var i = 0; i < this.productForm.length; i++) {
				// 	if (i === Number(this.imgUploadIndex)) {
						// let arr = e.allImages.map(function(item) {
						// 	if (item.code == 200) {
						// 		return item.data.url;
						// 	}
						// });
				// 		this.productForm[i].produceImgList = e.allImages;
    //                     console.log(this.productForm);  
				// 	}
				// }
				// console.log(this.productForm);	
			},
			handleNext() {

				let produceNodes = this.productForm.map(function(item, index, array) {
					delete item.date;
					// console.log(item) 
					return item
				})
				console.log(produceNodes)


				let _param = {
					productName: this.productName, //商品名称
					productReady: this.productReady, //当日进货数量（和库存填一样）
					productStock: this.productStock, //库存数量	
					productOrigin: this.productOrigin, //商品来源地
					productImg: this.productImg, //生产图片
					checkImg: this.checkImg, //检验图片
					classificationName: this.classificationName,
					stallId: this.stallId, //摊位id					
					stallHolderId: this.stallHolderId, //摊主id
					merchantId: this.merchantId, //商家id
					accountId: this.accountId, //用户id
					tracebilityNodes: this.tracebilityNodes,
					produceNodes: produceNodes,
				};

				this.$util.httpPost("/traceability_am/goods/add", _param).then(res => {
					console.log(res)
					if (Number(res.data.code) === 200) {
						uni.showToast({
							title: '新建商品成功',
							icon: 'success',
							mask: true,
							duration: 1000,
						});
						//添加成功后清除本地缓存
						uni.removeStorage({
							key: 'addgoodsObj',
							success: function(res) {
								console.log('success');
							}
						});
						uni.removeStorage({
							key: 'tracebilityNodes',
							success: function(res) {
								console.log('success');
							}
						});
						//跳转摊位管理页面
						setTimeout(() => {
							uni.redirectTo({
								url: "../boothmanagement/boothmanagement"
							})
						}, 1000)


					} else {
						uni.showToast({
							title: res.data.message,
							icon: 'none',
							mask: true,
							duration: 1000,
						})
					}
				});



			}
		},
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
		}
	}
</script>

<style lang="less" scoped>
	@import './productTraceEnter.less';
</style>
,
