<template>
	<view class="location">
		<view class="name">
			<image src="@/static/image/lacation.png" mode=""></image>
			<text>{{roomInfo.hotelBranch.name || '客服服务管家'}}</text>
		</view>
		<text class="number">房号/桌号：{{roomInfo.roomCode}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				roomInfo: {}
			}
		},
		mounted() {
			this.roomInfo = uni.getStorageSync('roomInfo')
		}
	}
</script>

<style lang="scss">
	.location {
		margin: 0 0 16rpx;
		background: #fff;
		border-radius: 8rpx;
		padding: 10rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 26rpx;
		height: 80rpx;
	
		.name {
			display: flex;
			align-items: center;
	
			image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 6rpx;
			}
	
			text {
				color: #333;
			}
		}
	
		.number {
			color: #666;
		}
	
	}
	
</style>
