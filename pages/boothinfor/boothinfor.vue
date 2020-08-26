<template>
	<view class="boothinfor">
		<navbar class="nav">
			<!-- 插槽 -->
			<view class="navtitle">摊主资料</view>
			<image class="img" :src="stallDetail.businessLicense" mode="" v-if="stallDetail.businessLicense"></image>
			<image class="img" src="../../static/images/noimg.png" mode="" v-else></image>
			<view class="license" @tap="handlePreview(stallDetail.businessLicense)">查看营业执照</view>
			<view class="avatar">
				<image style="width:164rpx;height:164rpx" :src="stallDetail.stallHolderPortrait" mode=""></image>
			</view>
		</navbar>

		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-flex uni-column">
				<view class="flex-item flex-item-V ">
					<text class="label">商户名称：</text>
					<text class="value">{{stallDetail.merchantName}}</text>
				</view>
				<view class="flex-item flex-item-V ">
					<text class="label">摊位编号：</text>
					<text class="value">{{stallDetail.stallNo}}</text>
				</view>
				<view class="flex-item flex-item-V ">
					<text class="label">经营品类：</text>
					<text class="value">{{stallDetail.categoryName}}</text>
				</view>
				<view class="flex-item flex-item-V ">
					<text class="label">设备编号：</text>
					<text class="value">{{stallDetail.assertNo}}</text>
				</view>
				<view class="flex-item flex-item-V ">
					<text class="label">负责人：</text>
					<text class="value"> {{stallDetail.stallHolderName}}</text>
				</view>
				<view class="flex-item flex-item-V ">
					<text class="label">手机号码：</text>
					<text class="value">{{stallDetail.stallHolderNo}}</text>
				</view>
				<view class=" flex-item-V  loginbtn" @tap="toMerchantproductrun()">
					<button type="primary">商品管理</button>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	var _self;
	import navbar from '@/components/navbar/navbar.vue'
	export default {
		components: {
			navbar
		},
		data() {
			return {
				merchantId: "", //农贸商家id（路径参数）
				stallId: "", //摊位id（普通get请求参数）	
				stallDetail: {}, //摊位信息（农贸小程序版）
			}
		},

		onLoad(e) {
			// console.log(e);
			this.stallId = e.stallId
			_self = this;
			uni.getStorage({
				key: 'useinfo',
				success: function(res) {
					// console.log(res.data);
					_self.merchantId = res.data.merchant.merchantId
					console.log(_self.merchantId);
					_self.getstallDetail();
				}
			});
		},
		methods: {
			//跳转商品管理 携带商品摊位id和商品摊主id
			toMerchantproductrun() {
				// 商品摊位id
				let merchantStallId = this.stallDetail.stallId
				// 商品摊主id
				let merchantStallHolderId = this.stallDetail.stallHolderId
				uni.navigateTo({
					url: "../merchantproductrun/merchantproductrun?merchantStallId=" + merchantStallId + "&merchantStallHolderId=" +
						merchantStallHolderId
				})
			},
			getstallDetail() {
				var _param = {
					merchantId: this.merchantId, //是	int	农贸商家id(路径参数)
					stallId: this.stallId, //否	string	摊位名称（普通get请求参数）
				};
				this.$util.get("/traceability_am/m-stall/stallDetail/am-applet/" + _param.merchantId + "?stallId=" + _param.stallId)
					.then(res => {
						// console.log(res)
						if (Number(res.data.code) === 200) {
							this.stallDetail = res.data.data;
							console.log(res.data.data)
							//   uni.showToast({
							//         title: res.data.message,
							//         icon: 'none',
							//         mask: true,
							//         duration: 1000,
							//  });

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
			// 点击图片预览
			handlePreview(url) {
				uni.previewImage({
					current: url,
					urls: [url],
					indicator: 'default'
				})
			}


		}

	}
</script>

<style lang="less" scoped>
	.boothinfor {
		.header {

			.navtitle {
				position: absolute;
				top: 126rpx;
				left: 70rpx;
				font-size: 36rpx;
				font-weight: bold;
				font-family: PingFang SC;
				color: rgba(255, 255, 255, 1);
			}

			.img {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				bottom: 60rpx;
				right: 160rpx;
				border-radius: 50%;
			}

			.avatar {
				image {
					position: absolute;
					top: 204rpx;
					left: 293rpx;

					background: rgba(255, 255, 255, 1);
					box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(154, 222, 195, 1);
					border-radius: 50%;
				}

			}

			.license {
				position: absolute;
				bottom: 15rpx;
				right: 44rpx;
				width: 118px;
				height: 20px;
				font-weight: 400;
				font-size: 28rpx;
				font-family: PingFang SC;
				color: rgba(255, 255, 255, 1);
			}
		}

		.uni-flex {
			margin-top: 87rpx;
			min-height: 800rpx;
			.flex-item {
				margin: 0 85rpx;
				border-bottom: 1rpx solid rgba(179, 179, 179, 1);
				min-height: 100rpx;
				line-height: 100rpx;
				display: flex;
				flex-wrap: nowrap;				
				.label,
				{
					width: 200rpx;
					height: 26rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(128, 128, 128, 1);
					// flex: 1;
				}
				.value {
					flex: 2;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(51, 51, 51, 1);
					text-align: left;
	                white-space: nowrap;
	                overflow: hidden;
	                text-overflow: ellipsis;	
				}
			}

			.loginbtn {
				margin: 100rpx 87rpx 0 83rpx;
				width: 580rpx;
				height: 84rpx;

				button {
					background: rgba(93, 183, 147, 1);
					border-radius: 40px;
				}
			}


		}
	}
</style>
