<template>
	<view class="businessinfor">
		<navbar class="nav">
			<!-- 插槽 -->
			<view class="navtitle">
				<view class="business">商户资料</view>
			</view>
		</navbar>

		<view class="uni-padding-wrap uni-common-mt">
			<view class="uni-flex uni-column">
				<view class="flex-item flex-item-V ">
					<text class="label">商户名称：</text>
					<text class="value">{{adminInfo.merchantName}}</text>
				</view>
				<view class="flex-item flex-item-V ">
					<text class="label">录入员：</text>
					<text class="value">{{adminInfo.realName}}</text>
				</view>
				<view class="flex-item flex-item-V ">
					<text class="label">手机号码：</text>
					<text class="value">{{adminInfo.concatNum}}</text>
				</view>
				<view class="license">
					<view class="item" v-if="adminInfo.papersUrl">
						<image :src="adminInfo.papersUrl" @tap="handlePreview(adminInfo.papersUrl)"></image>
					</view>
					<view class="item" v-else>
						<text class="noimg">暂无上传营业执照</text>
					</view>
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
				accountId: "", //账号id
				merchantId: "", //商家id
				adminInfo: {}, //商户管理员信息获取对象
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			_self = this;
			uni.getStorage({
				key: 'useinfo',
				success: function(res) {
					// console.log(res.data);
					_self.merchantId = res.data.merchant.merchantId
					_self.accountId = res.data.id
					// console.log(_self.merchantId);
					_self.getadminInfo();
				}
			});
		},
		methods: {
			getadminInfo() {
				var _param = {
					merchantId: this.merchantId, //商家id
					accountId: this.accountId, //	账号id
				};
				// console.log(this.merchantId)		
				this.$util.get(`/traceability_am/login/adminInfo?merchantId=${_param.merchantId}&accountId=${_param.accountId}`).then(
					res => {
						console.log(res)
						if (Number(res.data.code) === 200) {
							this.adminInfo = res.data.data;
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
	.businessinfor {
		.navtitle {
			.business {
				// width: 141rpx;
				height: 34rpx;
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(255, 255, 255, 1);
				padding-left: 100rpx;
				padding-top: 120rpx;
			}
		}

		.uni-flex {
			margin-top: 80rpx;
			min-height: 600rpx;

			.flex-item {
				margin: 0 85rpx;
				border-bottom: 1rpx solid rgba(179, 179, 179, 1);
				min-height: 100rpx;
				line-height: 100rpx;
				display: flex;

				.label,
				.value {
					width: 120rpx;
					height: 26rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: rgba(128, 128, 128, 1);
					flex: 1;
				}

				.value {
					flex: 2;
					font-weight: 500;
					color: rgba(51, 51, 51, 1);
					text-align: left;
				}
			}

			.license {
				margin: 85rpx;
				display: flex;

				.item {
					flex: 1;
					width: 280rpx;
					height: 280rpx;
					margin: 0 auto;
					background: rgba(255, 255, 255, 1);
					border: 1rpx solid rgba(204, 204, 204, 1);

					image {
						display: block;
					}

					.noimg {
						height: 26rpx;
						font-size: 28rpx;
						font-family: PingFang SC;
						font-weight: 400;
						color: rgba(128, 128, 128, 1);

					}
				}
			}

		}
	}
</style>
