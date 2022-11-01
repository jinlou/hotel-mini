<template>
	<view class="location">
		<view class="name">
			<image src="@/static/image/manage.png" mode=""></image>
			<text>{{roomInfo.hotelBranch.name || '客服服务管家'}}</text>
		</view>
		<text class="number">房间号：{{roomInfo.roomCode}}</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				roomInfo: {
					hotelBranch: {
						name: ''
					},
					roomCode: ''
				}
			}
		},
		onShow() {
			
		},
		mounted() {
			console.log(111)
			console.log(uni.getStorageSync('roomInfo'))
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
		border-radius: 10rpx;
		box-shadow: 0px 2px 3px 1px rgba(0,0,0,0.1);
	
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
