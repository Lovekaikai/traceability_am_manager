<template>
	<view class="uni-steps">
		<view :class="[direction==='column'?'uni-steps__column':'uni-steps__row']">
			<view :class="[direction==='column'?'uni-steps__column-text-container':'uni-steps__row-text-container']">
				<view v-for="(item,index) in options" :key="index" :class="[direction==='column'?'uni-steps__column-text':'uni-steps__row-text']" v-if="currentIndex === 0">
					<text :style="{color:index<=active?activeColor:activeColor}" :class="[direction==='column'?'uni-steps__column-title':'uni-steps__row-title']">{{item.tracebilityDate ? item.tracebilityDate : '暂无日期提供'}}</text>
			        <text :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']"><text class="tracking-info">经营商户:<text style="font-size:24rpx;color:#333;margin-left:20rpx;">{{item.merchantManagement || $util.defaultDesc()}}</text></text></text>
					<text  :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']"><text class="tracking-info">详细地址:<text style="font-size:24rpx;color:#333;margin-left:20rpx;">{{item.detailAddress || $util.defaultDesc()}}</text></text></text>
					<text  :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']"><text class="tracking-info">录入员:<text style="font-size:24rpx;color:#333;margin-left:20rpx;">{{item.personName || $util.defaultDesc()}}</text></text></text>
					<text  :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']"><text class="tracking-info">联系电话:<text style="font-size:24rpx;color:#333;margin-left:20rpx;">{{item.contactPerson || $util.defaultDesc()}}</text></text></text>
				</view>
				
				<view v-for="(item,index1) in options" :key="index1" :class="[direction==='column'?'uni-steps__column-text':'uni-steps__row-text']" v-if="currentIndex === 1">
					<text :style="{color:index1<=active?activeColor:activeColor}" :class="[direction==='column'?'uni-steps__column-title':'uni-steps__row-title']">{{item.produceDate ? item.produceDate : '暂无日期提供'}}</text>
				    <text :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']"><text class="tracking-info">环节名称:</text>{{item.produceName || $util.defaultDesc()}}</text>
					<text  :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']"><text class="tracking-info">录入员:</text>{{item.personName || $util.defaultDesc()}}</text>
					<text  :class="[direction==='column'?'uni-steps__column-desc':'uni-steps__row-desc']"><text class="tracking-info">环节描述:</text>{{item.produceDescription || $util.defaultDesc()}}</text>
					<view class="pics_wrap">
						<view class="pic_item" v-for="(ImgItem,index) in item.produceImgList" :key="ImgItem.imgId">
							<image :src="ImgItem.imgUrl || $util.defaultImg()" @tap="handlePreview(index)"></image>
						</view>
					</view>
				</view>
			</view>
			<view :class="[direction==='column'?'uni-steps__column-container':'uni-steps__row-container']">
				<view :class="[direction==='column'?'uni-steps__column-line-item':'uni-steps__row-line-item']" v-for="(item,index2) in options"
				 :key="index2">
					<view :class="[direction==='column'?'uni-steps__column-line':'uni-steps__row-line',direction==='column'?'uni-steps__column-line--before':'uni-steps__row-line--before']"
					 :style="{backgroundColor:index2<=active&&index2!==0?activeColor:index2===0?'transparent':deactiveColor}"></view>
					<view :class="[direction==='column'?'uni-steps__column-check':'uni-steps__row-check']">
						<!-- <uni-icons :color="activeColor" type="checkbox-filled" size="14"></uni-icons> -->
						<!-- <uni-icons :color="activeColor" type="checkbox-filled" size="14"></uni-icons> -->
						<view class="activeColor"><text class="circle"></text></view>
					</view>
					<!-- <view :class="[direction==='column'?'uni-steps__column-circle':'uni-steps__row-circle']" v-else :style="{backgroundColor:index<active?activeColor:deactiveColor}"></view> -->
					<view :class="[direction==='column'?'uni-steps__column-line':'uni-steps__row-line',direction==='column'?'uni-steps__column-line--after':'uni-steps__row-line--after']"
					 :style="{backgroundColor:index2 <= active && index2 !== options.length-1 ? activeColor : index2 === options.length-1?'transparent':activeColor}"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from '../uni-icons/uni-icons.vue';
	import  formatDate1  from '../../common/formatDate/formatDate.js';
	
	export default {
		name: 'UniSteps',
		components: {
			uniIcons
		},
		props: {
			currentIndex : {
				type: Number,
				default : 0
			},
			direction: {
				// 排列方向 row column
				type: String,
				default: 'row'
			},
			activeColor: {
				// 激活状态颜色
				type: String,
				// default: '#1aad19'
				default: '#5DB793'
			},
			deactiveColor: {
				// 未激活状态颜色
				type: String,
				default: '#999999'
			},
			shopInfoColor: {
				type: String,
				default: '#999999'
			},
			active: {
				// 当前步骤
				type: Number,
				default: 0
			},
			options: {
				type: Array,
				default () {
					return []
				}
			} // 数据
		},
		data() {
			return {}
		},
		
		methods: {
			// 图片预览
			handlePreview(index) {
				let urls = [];
				this.options.forEach((item,i) => {
					urls = item.produceImgList.map(v => v.imgUrl);
					urls.forEach((item,i) => {
						if(!item) {
							urls[i] = this.$util.defaultImg()
						}
					})
				})				
				this.$util.preViewImg(index,urls);
			}
		},
		
		//过滤器
		filters: {
			formatDate1
		}
	}
</script>

<style lang="scss" scoped>
	.uni-steps {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		/* #ifdef APP-NVUE */
		flex: 1;
		/* #endif */
		flex-direction: column;
		
	}

	.uni-steps__row {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-steps__column {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row-reverse;
		color: #333333;
	}

	.uni-steps__row-text-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-steps__column-text-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		flex: 1;
	}

	.uni-steps__row-text {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		flex: 1;
		flex-direction: column;
	}

	.uni-steps__column-text {
		padding: 6px 0px;
		// border-bottom-style: solid;
		// border-bottom-width: 1px;
		// border-bottom-color: $uni-border-color;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
	}

	.uni-steps__row-title {
		font-size: $uni-font-size-base;
		line-height: 32rpx;
		text-align: center;
	}

	.uni-steps__column-title {
		// font-size: $uni-font-size-base;
		margin-top: -6rpx;
		margin-bottom: 30rpx;
		font-size: 30rpx;
		text-align: left;
		line-height: 36rpx;
	}

	.uni-steps__row-desc {
		font-size: 24rpx;
		line-height: 28rpx;
		text-align: center;
	}

	.uni-steps__column-desc {
		font-size: $uni-font-size-sm;
		text-align: left;
		line-height: 36rpx;
	}

	.uni-steps__row-container {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.uni-steps__column-container {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		width: 60rpx;
		flex-direction: column;
	}

	.uni-steps__row-line-item {
		/* #ifndef APP-NVUE */
		display: inline-flex;
		/* #endif */
		flex-direction: row;
		flex: 1;
		height: 28rpx;
		line-height: 28rpx;
		align-items: center;
		justify-content: center;
	}

	.uni-steps__column-line-item {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		flex: 1;
		align-items: center;
		justify-content: center;
	}

	.uni-steps__row-line {
		flex: 1;
		height: 2rpx;
		background-color: $uni-text-color-grey;
	}

	.uni-steps__column-line {
		width: 2rpx;
		background-color: $uni-text-color-grey;
		background-color: #FE9A5D;
	}

	.uni-steps__row-line--after {
		transform: translateX(2rpx);
	}

	.uni-steps__column-line--after {
		flex: 1;
		transform: translate(0px, 2rpx);
	}

	.uni-steps__row-line--before {
		transform: translateX(-2rpx);
	}

	.uni-steps__column-line--before {
		height: 7px;
		transform: translate(0px, -2rpx);
	}

	.uni-steps__row-circle {
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		background-color: $uni-text-color-grey;
		// margin: 0px 3px;
	}

	.uni-steps__column-circle {
		// position: absolute;
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		background-color: $uni-text-color-grey;
		// margin: 4px 0px 5px 0px;
	}

	.uni-steps__row-check {
		// margin: 0px 6px;
	}

	.uni-steps__column-check {
		height: 28rpx;
		line-height: 28rpx;
		// margin: 2px 0px;
	}
	.activeColor {
		position: relative;
		width: 24rpx;
		height: 24rpx;
		border: 2rpx solid #5DB793;
		border-radius: 50%;
		
	}
	.activeColor .circle {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		background-color: #5DB793;
	}
	.tracking-info {
		display: inline-block;
		margin-bottom: 25rpx;
		font-size: 28rpx;
		color: #808080;		
	}
	.desc {
		width: 70%;
		color: #333;
	}
	.pics_wrap {
		display: flex;
		flex-wrap: wrap;
		.pic_item {
			margin-right: 28rpx;
			margin-bottom: 10rpx;
			image {
				width: 164rpx;
				height: 154rpx;
			}
		}
	}

</style>
