<template>
	<view class="content">
		<image src="@/static/logo.png" mode=""></image>
		<text class="txt1">提交成功</text>
		<text class="txt2">您的需求已提交至酒店管理，酒店会及时给您反馈，请耐心等待！</text>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.content {
		padding: 60rpx 40rpx;
		background: #fff;
		color: #333;
		display: flex;
		flex-direction: column;
		align-items: center;
		
		image {
			width: 200rpx;
			height: 200rpx;
		}
		
		.txt1 {
			font-size: 22rpx;
			font-weight: 600;
			margin: 30rpx 0 20rpx;
		}
		
		.txt2 {
			font-size: 20rpx;
		}
	}
</style>
