<template>
	<view class="header">
		<slot></slot>
	</view>
</template>

<script>
</script>

<style lang="less" scoped>
	.header {
		width: 100%;
		height: 286rpx;
		background: url('https://zs-1256645015.cos.ap-guangzhou.myqcloud.com/shuangli/banner.png') no-repeat;		
		background-size: cover;
		position: relative;
	}
</style>
