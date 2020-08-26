<template>
	<view class="trackTab">
		<view class="tab">
			<view 
			:class="currentIndex === index ? 'tab_item active' : 'tab_item'" 
			v-for="(item,index) in trackTabList" 
			:key="item.id"
			@click="changeTab(index)">{{item.text}}</view>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			trackTabList : {
				type : Array,
				default : []
			},
			currentIndex : {
				type : Number,
				default : 0
			}
		},
		methods: {
			changeTab(index) {
				this.$emit('getIndex',index)
			}
		}
	}
</script>

<style lang="less" scoped>
	.trackTab {
		.tab {
			display: flex;
			padding: 0 49rpx 0 52rpx;
			justify-content: space-between;
			.tab_item {
				font-size: 28rpx;
				width: 180rpx;
				height: 64rpx;
				background-color: #D9D9D9;
				border-radius: 32rpx;
				color: #808080;
				text-align: center;
				line-height: 64rpx;
			}
			.active {
				background-color: #5DB793;
				color: #fff;
			}
		}
	}
</style>
