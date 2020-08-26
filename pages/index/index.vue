<template>
	<view class="index">
		<!-- 头部轮播图 start -->
		<view class="logo">
			<swiper indicator-dots autoplay circular class="swiper">
				<swiper-item v-for="(item,index) in swiperList" :key="index" @tap="handlePreview(index)">
					<image :src="item || $util.defaultImg()"></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- 头部轮播图 end -->

		<view class="title">
			<text class="market">{{merchantName}}</text>
		</view>
		<view class="list">
			<view class="item" @tap="toMerchantInfor">
				<image class="imglogo" style="width: 100rpx; height: 100rpx;" src="../../static/images/merchantInfor.png" mode=""></image>
				<text>\n商户资料</text>
			</view>
			<view class="item" @tap="toBoothManagement">
				<image class="imglogo" style="width: 100rpx; height: 100rpx;" src="../../static/images/boothManage.png" mode=""></image>
				<text>\n摊位管理</text>
			</view>
		</view>
	</view>
</template>

<script>
	var _self;
	// import { mapGetters } from 'vuex';
	export default {
		data() {
			return {
				merchantName: "", //农贸商家名称
				swiperList: [] // 轮播图
			}
		},
		onLoad() {
			//获取本地存储的登录状态
			// uni.getStorage({
			// 	key: "isLogin",
			// 	success: function(res) {
			// 		// _self.isLogin = res;
			// 		console.log(res)
			// 	}
			// });
			// if (this.isLogin !== true) {
			// 	this.$util.navigateTo('../login/login');
			// 	this.$util.showToast({
			// 		title: '请先去登录',
			// 		icon: 'none'
			// 	});
			// 	return;
			// };
			//获取轮播图  
			this.getSwiperList();
			_self = this;
			uni.getStorage({
				key: "useinfo",
				success: function(res) {
					_self.merchantName = res.data.merchant.merchantName;
				}
			});
		},
		methods: {
			//跳转商户资料
			toMerchantInfor() {
				uni.navigateTo({
					url: "../businessinfor/businessinfor"
					// url: "../merchantproductrun/merchantproductrun"
				})
			},
			//跳转摊位管理
			toBoothManagement() {
				uni.navigateTo({
					url: "../boothmanagement/boothmanagement"
				})
			},
			// 获取轮播图逻辑
			async getSwiperList() {
				try {
					const res = await this.$util.request({
						url: '/traceability_am/banner/getByType?type=2'
					});
					console.log(res)
					if (Number(res.code) === 200) {
						this.swiperList = res.data;
					}
				} catch (err) {
					console.log(err);
				}
			},

			// 图片预览
			handlePreview(index) {
				const urls = this.swiperList;
				urls.forEach((item, i) => {
					if (!item) {
						url[i] = this.$util.defaultImg();
					}
				})

				this.$util.preViewImg(index, urls);
			}
		}
	}
</script>

<style lang="less" scoped>
	.index {
		.logo {
			// width: 750rpx;
			// height: 440rpx;
			// background: pink;
			overflow: hidden;

			.swiper {
				width: 440px;
				height: 440rpx;

				image {
					width: 440px;
					height: 440rpx;
				}
			}
		}

		.title {
			padding-left: 63rpx;
			padding-top: 63rpx;

			.market {
				width: 221rpx;
				height: 31rpx;
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
			}
		}

		.list {
			margin-top: 80rpx;
			margin-left: 108rpx;
			display: flex;

			.item {
				flex: 1;
				margin: 0 30rpx;

				text {
					width: 110rpx;
					height: 26rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
				}

				// .imglogo{
				//  width:84rpx !important;
				//  height:84rpx !important;
				// }
			}
		}
	}
</style>
