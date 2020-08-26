<template>
	<view class="merchantProductRun">
		<!-- 头部 start -->
		<navbar class="navbar">
			<view class="title">商品管理</view>
			<view class="pickDate_wrap">
				<div class="content">
					<image src="../../static/images/calendar.png"></image>
					<view class="date" id="pickDate">{{pickDate}}</view>
					<view class="close" @tap="closeDate">X</view>
					<view>
						<uni-calendar ref="calendar" :insert="false" @confirm="confirm" />
						<view class="btn" @tap="open()">选择日期</view>
					</view>
				</div>
			</view>
		</navbar>
		<!-- 头部 end -->

		<!-- 主体 start -->
		<view class="main">
			<view class="add_good" @tap="toCreateProduct()">
				<image style="width:40rpx;height:40rpx;" src="../../static/images/addgoods.png" mode=""></image>
				<view class="txt">
					新建商品
				</view>
			</view>
			<template v-if="goodList.length">
				<navigator :url="'/pages/merchantTracking/merchantTracking?productId=' + item.stallProductId" class="good_item"
				 v-for="item in goodList" :key="item.stallProductId">
					<view class="good_batch">商品批次号：{{ item.traceabilityBatchNo }}</view>
					<view class="good_info_wrap">
						<image :src="item.productImg[0].url || $util.defaultImg()"></image>
						<view class="good_desc">
							<view class="good_name">商品名称：<text>{{ item.productName }}</text></view>
							<view class="good_num">商品数量：<text>{{ item.productReady }}kg</text></view>
							<view class="samplingbtn" @tap.stop="toProductsample(item.stallProductId)"><button type="primary">发起抽检</button></view>
						</view>
					</view>
				</navigator>
			</template>
			<view v-else style="text-align:center;">
				<image style="width:210rpx;height: 210rpx;" src="../../static/images/nogoods.png" mode=""></image>
				<view class="nogoodstext">
					暂无任何商品，点击新建商品新建
				</view>
			</view>
		</view>
		<!-- 主体 end -->
	</view>
</template>

<script>
	import navbar from '@/components/navbar/navbar.vue';
	import uniCalendar from "@/components/uni-calendar/uni-calendar";
	import formatDate from '@/common/formatDate/formatDate.js';
	export default {
		components: {
			navbar,
			uniCalendar,
		},
		filters: {
			formatDate
		},
		data() {
			return {
				pickDate: '请选择日期', // 时间
				goodList: [], //商品列表
				pageNum: 1, //当前页
				totalPage: 0, //总页数	
				merchantStallId: "", //商品摊位id
				merchantStallHolderId: "", //商品摊主id
			}
		},

		onLoad(e) {

			console.log(e)
			this.merchantStallId = e.merchantStallId
			this.merchantStallHolderId = e.merchantStallHolderId
			this.getGoodList(); // 调用方法

		},
		//上拉刷新
		onReachBottom() {
			// 检测是否还有下一页
			if (this.pageNum >= this.totalPage) {
				this.$util.showToast({
					title: '没有下一页了',
					icon: 'none'
				})
			} else {
				this.pageNum++;
				this.getGoodList();
			}
		},
		methods: {
			closeDate() {
				this.pickDate = '请选择日期';
				this.getGoodList();
			},
			open() {
				this.$refs.calendar.open();
			},
			confirm(e) {
				console.log(e)
				this.pickDate = e.fulldate;
				// 页数需返回第一页
				this.pageNum = 1;
				this.goodList = [];
				this.getGoodList();
			},
			// 获取商品列表
			async getGoodList() {
				// console.log(666)
				// 把时间转成秒
				let time;
				// 把时间转成秒
				if (this.pickDate === '请选择日期') {
					time = '';
				} else {
					time = new Date(this.pickDate).getTime() / 1000;
					this.$util.newDate(time);
				}
				// console.log(this.merchantStallId)
				// console.log(this.merchantStallHolderId)
				// console.log(this.pageNum)
				try {
					const res = await this.$util.request({
						// url: `/traceability_am/goods/list?createTime=${time}&pageNum=${this.pageNum}`
						url: `/traceability_am/goods/list?merchantStallHolderId=${this.merchantStallHolderId}&createTime=${time}&pageNum=${this.pageNum}`,
						load: true
					});
					// console.log(res);
					if (res.code === 200) {
						// 旧数据 
						const oldGoodList = this.goodList;
						// 新数据					
						const newGoodList = res.data.list.map((item, index, arr) => {
							return item.goodsInfo
						});
						// console.log(newGoodList);
						// 把新旧数据合并
						this.goodList = [...oldGoodList, ...newGoodList];
						console.log(this.goodList)
						// 总页数
						this.totalPage = res.data.totalPage;
					} else {
						this.$util.showToast({
							title: res.message,
							icon: 'none'
						});
					}
				} catch (err) {
					console.log(err);
				}
			},
			//点击新建商品按钮跳转
			toCreateProduct() {
				console.log(666)
				let stallId = this.merchantStallId
				let stallHolderId = this.merchantStallHolderId
				uni.navigateTo({
					url: "../createProduct/createProduct?stallId=" + stallId + "&stallHolderId=" + stallHolderId
				})
			},
			//点击发起抽检跳转 根据商品id判断是否抽检过
			toProductsample(params) {
				this.$util.get("/traceability_am/checkLog/isChecked?productId=" + params).then(res => {
					console.log(res)
					if (Number(res.data.code) === 200) {

						if (res.data.data === true) {
							uni.showToast({
								title: "该商品已经抽检",
								icon: 'none',
								mask: true,
								duration: 1000,
							});
						} else if (res.data.data === false) {
							// console.log(params)
							let id = params
							uni.navigateTo({
								url: "../productsample/productsample?id=" + id
							})
						}

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
		filters: {
			formatDate
		}
	}
</script>

<style lang="less" scoped>
	.merchantProductRun {
		.header {
			margin-bottom: 100rpx;

			.title {
				position: absolute;
				top: 64rpx;
				left: 71rpx;
				font-size: 36rpx;
				color: #fff;
			}

			.pickDate_wrap {
				position: absolute;
				width: 80%;
				bottom: 65rpx;
				padding: 0 71rpx 0 116rpx;

				.content {
					display: flex;
					align-items: center;

					image {
						width: 40rpx;
						height: 40rpx;
					}

					.date {
						font-size: 24rpx;
						flex: 3;
						color: #fff;
						padding: 21rpx 25rpx;
						border-bottom: 1rpx solid #fff;
						margin: 0 23rpx 0 14rpx;
						opacity: .9;
					}

					.close {
						color: #fff;
						margin-right: 20rpx;
						font-size: 30rpx;
					}

					.btn {
						font-size: 24rpx;
						width: 140rpx;
						height: 52rpx;
						background-color: #fff;
						color: #5DB793;
						border-radius: 26rpx;
						text-align: center;
						line-height: 52rpx;
					}
				}
			}

		}

		.main {
			margin-top: 200rpx;
			padding: 0 32rpx;
			position: relative;

			.add_good {
				width: 120rpx;
				height: 120rpx;
				background: rgba(93, 183, 147, 1);
				box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(138, 218, 186, 1);
				border-radius: 50%;
				position: absolute;
				top: -160rpx;
				right: 65rpx;

				image {
					padding-left: 43rpx;
					padding-top: 12rpx;
				}

				.txt {
					// width:55rpx;
					// padding-top: 12rpx;
					padding-left: 15rpx;
					height: 14rpx;
					font-size: 24rpx;
					font-family: PingFang SC;
					font-weight: 500;
					color: rgba(255, 255, 255, 1);
				}
			}

			.nogoodstext {
				// width:417rpx;
				height: 29rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 400;
				color: rgba(128, 128, 128, 1);
			}

			.good_item {
				position: relative;
				border: 1rpx solid #ccc;
				border-left: 4rpx solid #5DB793;
				margin: 32rpx;

				.good_batch {
					padding-top: 30rpx;
					padding-left: 10rpx;
					// width:531rpx;
					height: 27rpx;
					font-size: 28rpx;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(93, 183, 147, 1);
					margin-bottom: 34rpx;
				}



				.good_info_wrap {
					display: flex;

					image {
						width: 200rpx;
						height: 200rpx;
						padding: 10rpx;
					}

					.good_desc {
						padding-left: 38rpx;

						.good_name,
						.good_num {
							font-size: 28rpx;
							font-family: PingFang SC;
							font-weight: 400;
							color: rgba(128, 128, 128, 1);
							margin-bottom: 31rpx;

							text {
								font-size: 28rpx;
								font-family: PingFang SC;
								font-weight: 500;
								color: rgba(51, 51, 51, 1);
							}
						}

						.samplingbtn {
							button {
								// width:161rpx;
								position: absolute;
								bottom: 34rpx;
								right: 30rpx;
								height: 56rpx;
								line-height: 56rpx;
								background: rgba(93, 183, 147, 1);
								border: 1rpx solid rgba(93, 183, 147, 1);
								border-radius: 28rpx;
								font-size: 28rpx;
								font-family: PingFang SC;
								font-weight: 400;
								color: rgba(255, 255, 255, 1);
							}
						}
					}
				}
			}
		}
	}
</style>
