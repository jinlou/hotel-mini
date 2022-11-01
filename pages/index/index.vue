<template>
	<view class="content">
		<view class="bg">
			<image src="/static/image/index.jpg" mode=""></image>
		</view>
		<view class="top">
			<!-- <view class="uni-padding-wrap">
				<view class="page-section swiper">
					<view class="page-section-spacing">
						<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="4000"
							:duration="500">
							<swiper-item v-for="(item, index) in swipers" :key="index" class="swiper-item">
								<view class="swiper-item uni-bg-red">
									<image :src="item.bg" mode=""></image>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view> -->
			<!-- <image style="width: 100%;height: 120px;" src="https://img1.baidu.com/it/u=3757403282,3297426190&fm=253&fmt=auto&app=138&f=JPEG?w=1280&h=333" mode=""></image> -->
			
			<view class="scan">
				<image @click="scan" class="logo" src="/static/image/index/scan_all.png"></image>
				<view class="text">
					<view class="v1">扫描设备二维码</view>
					<view class="v2">
						<image @click="scan" class="logo" src="/static/image/index/left.png"></image>
						<text>智能客房管家将为你服务</text>
						<image @click="scan" class="logo" src="/static/image/index/right.png"></image>

					</view>
				</view>
				<view class="minis">
					<view class="mini" v-for="(item, index) in minis" :key="index" @click="scan">
						<view class="out">
							<image :src="item.bg" mode=""></image>
						</view>
						<text>{{item.text}}</text>
					</view>
				</view>
			</view>
			
			
			<!-- <view class="other">
				<view class="title">
					<view class="left">
						<text>出行服务</text>
						<image src="/static/image/index/text_line.png" mode=""></image>
					</view>
					<text class="right">TRAVEL SERVICE</text>
				</view>
				<view class="some">
					<view class="left">
						<view class="txt">打车</view>
						<view class="title1">低至3折起</view>
						<image src="/static/image/index/texi.png" mode=""></image>
					</view>
					<view class="right">
						<view class="someOne" v-for="(item, index) in minis2" :key="index" @click="goTo(item)">
							<view class="txt">{{item.text}}</view>
							<view class="title1">{{item.title}}</view>
							<image :src="item.bg" mode=""></image>
						</view>
					</view>
				</view>
				<view class="minis1">
					<view class="mini" v-for="(item, index) in minis1" :key="index" @click="goTo(item)">
						<view class="out">
							<image :src="item.bg" mode=""></image>
						</view>
						<view>{{item.text}}</view>
					</view>
				</view>
			</view> -->
			
		</view>
		<view style="margin: 20px 12px;">
			<ad unit-id="adunit-44ae282c4fd0fff0" ad-type="video" ad-theme="white"></ad>
		</view>
		<view style="width: 100%;position: fixed;bottom: 0;left: 0;background: gray;z-index: 9;">
			<official-account></official-account>
		</view>
	</view>
</template>

<script>
	import {
		baseURL
	} from 'api/axios'
	export default {
		data() {
			return {
				title: 'Hello',
				swipers: [{
					content: '',
					url: '',
					bg: ''
				}],
				takeawayAll: 68,
				takeawayMount: 55,
				minis: [{
						text: '手机充电',
						bg: require('@/static/image/index/charge.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '连接WiFi',
						bg: require('@/static/image/index/wifi.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '客房服务',
						bg: require('@/static/image/index/phone.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '特产超市',
						bg: require('@/static/image/index/market.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '游玩攻略',
						bg: require('@/static/image/index/play.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '更多',
						bg: require('@/static/image/index/more.png'),
						appID: '',
						defaultPage: ''
					}
				],
				minis1: [
					{
						text: '景区门票',
						bg: require('@/static/image/index/ticket.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '跟团游',
						bg: require('@/static/image/index/trip.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '附近公交',
						bg: require('@/static/image/index/bus.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '地铁线路',
						bg: require('@/static/image/index/subway.png'),
						appID: '',
						defaultPage: ''
					},
				],
				minis2: [
					{
						text: '特价机票',
						title: '全网最低价',
						bg: require('@/static/image/index/plane.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '汽车票',
						title: '点击查看详情',
						bg: require('@/static/image/index/automobile.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '火车票',
						title: '赠80元抢票特权',
						bg: require('@/static/image/index/train.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '租车',
						title: '点击查看详情',
						bg: require('@/static/image/index/car.png'),
						appID: '',
						defaultPage: ''
					},
				],
			}
		},
		onLoad() {
			console.log(baseURL)
		},
		onShow() {
			let roomInfo = uni.getStorageSync('roomInfo') || {}
			if(roomInfo.roomId) {
				uni.navigateTo({
					url: '/pages/service/service'
				})
			}
		},
		mounted() {
		},
		onShareAppMessage(res) {
			return {
				title: 'DC MIPS云',
				path: `/pages/index/index`
			}
		},
		methods: {
			scan() {
				console.log('扫描')
				uni.scanCode({
					scanType: ['qrCode'],
					success: res => {
						console.log('条码类型：' + res);
						console.log('条码内容：' + res.result);
						// https://dev.qyqycp.com/api/v1/device/GJ00001002
						let data = res.result.split('/')
						let code = data[data.length - 1]
						if (code) {
							uni.navigateTo({
								url: '/pages/service/service?code=' + code
							})
						} else {
							// uni.showToast({
							// 	icon: 'none',
							// 	title: '扫码失败'
							// })
						}
					},
					fail: err => {
						console.log(err)
						uni.showToast({
							icon: 'none',
							title: '扫码失败'
						})
					}
				})
			},
			goTo(item) {
				// if (to == 'meituan') {
				// 	uni.navigateToMiniProgram({
				// 		appId: 'wx2c348cf579062e56',
				// 		path: 'packages/restaurant/restaurant/restaurant?poi_id=1027434691792581&aas=1003&cat_id=0',
				// 		extraDta: {
				// 			'data1': 'test'
				// 		},
				// 		success(res) {
				// 			console.log('tiao')
				// 		}
				// 	})
				// }
				uni.navigateToMiniProgram({
					appId: item.appID,
					path: item.defaultPage,
					success(res) {
						console.log('跳转')
					}
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// justify-content: center;
		// position: absolute;
		background: #eee;
		height: auto;
		width: 100vw;
		min-height: 100vh;
	}

	.bg {
		// position: absolute;	
		width: 100%;
		height: 120px;
		left: 0;
		top: 0;
		background: #00a4ef;
		z-index: 0;
		border-bottom-left-radius: 40px;
		border-bottom-right-radius: 40px;
		
		image {
			width: 100%;
			height: 100%;
		}
	}

	.top {
		position: relative;
		z-index: 2;
		top: 0;
		width: 100%;
		z-index: 2;
		margin-top: -15px;
		padding-bottom: 20px;

		>view {
			margin-left: 12px;
			margin-right: 12px;
			width: calc(100% - 24px);
		}
	}


	.uni-padding-wrap {
		height: 90px;

		.swiper {
			height: 70px;
			margin: 0 auto;

			.swiper-item {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom-left-radius: 5px;
				border-bottom-right-radius: 5px;
				border-top-left-radius: 15px;
				border-top-right-radius: 15px;
				position: relative;

				image {
					width: 100%;
					height: 100%
				}

				text {}
			}
		}
	}

	.scan {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		// margin-top: 100px;
		background: #fff;
		z-index: 2;
		border-radius: 15px;
		padding: 30rpx 0 20rpx;
		box-shadow: 0px 2px 3px 1px rgba(0,0,0,0.1000);

		image {
			width: 90px;
			height: 90px;
		}

		.text {
			text-align: center;

			.v1 {
				font-weight: bold;
				font-size: 52rpx;
				color: #00a4ef;
			}

			.v2 {
				margin-top: 20rpx;
				font-size: 28rpx;
				display: flex;
				align-items: center;

				image {
					height: 4rpx;
					width: 64rpx;

					&:first-child {
						margin-right: 10rpx;
					}

					&:last-child {
						margin-left: 10rpx;
					}
				}
			}
		}
	}

	.minis {
		display: flex;
		justify-content: space-between;
		height: 80px;
		color: #fff;
		width: 100%;
		margin-top: 12px;
		padding: 0 20rpx;
		
		border-radius: 10rpx;
		margin-bottom: 15rpx;

		.mini {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;

			image {
				width: 80rpx;
				height: 80rpx;
			}

			text {
				line-height: 50rpx;
				font-size: 22rpx;
				color: #333;
			}
		}
	}
	
	.other {
		width: 100%;
		padding: 20rpx;
		box-shadow: 0px 2px 3px 1px rgba(0,0,0,0.1000);
		border-radius: 10rpx;
		margin-top: 15rpx;
		background: #fff;
	}
	
	.title {
		display: flex;
		align-items: flex-end;
		padding: 0 10rpx;
		height: 40rpx;
		
		.left {
			position: relative;
			font-size: 32rpx;
			font-weight: 600;
			height: 40rpx;
			width: 130rpx;
			
			text {
				position: absolute;
				z-index: 3;
			}
			
			image {
				position: absolute;
				width: 124rpx;
				height: 12rpx;
				right: 0;
				bottom: 0;
				z-index: 1;
			}
		}
		
		.right {
			color: rgb(157,169,189);
			font-size: 24rpx;
		}
		
	}
	
	.some {
		display: flex;
		justify-content: space-between;
		margin-top: 16rpx;
		
		.left {
			width: 30%;
			background: #e8e8e8;
			border-radius: 8rpx;
			position: relative;
			padding: 20rpx;
			flex-grow: 0;
			flex-shrink: 0;
			margin-right: 2%;
			
			view {
				&.txt {
					font-size: 28rpx;
					font-weight: bold;
					color: #000000;
				}
				
				&.title1 {
					font-size: 18rpx;
					color: #333;
				}
			}
			
			image {
				width: 56rpx;
				height: 56rpx;
				position: absolute;
				right: 0;
				bottom: 0;
			}
		}
		
		.right {
			display: flex;
			flex-wrap: wrap;
			
			.someOne {
				width: 48%;
				background: #e8e8e8;
				border-radius: 8rpx;
				position: relative;
				padding: 20rpx;
				
				&:nth-child(2n + 1) {
					margin: 0 2% 0 0;
				}
				
				&:nth-child(1),&:nth-child(2) {
					margin-bottom: 20rpx;
				}
				
				view {
					&.txt {
						font-size: 28rpx;
						font-weight: bold;
						color: #000000;
					}
					
					&.title1 {
						font-size: 18rpx;
						color: #333;
					}
				}
				
				image {
					width: 56rpx;
					height: 56rpx;
					position: absolute;
					right: 0;
					bottom: 0;
				}
			}
		}
	}

	.minis1 {
		display: flex;
		justify-content: space-between;
		height: 80px;
		color: #333;
		width: 100%;
		margin-top: 12px;

		.mini {
			flex: 1;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.out {
				
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #fff;

				image {
					// width: 50rpx;
					width: 64rpx;
					height: 64rpx;
				}
			}

			view {
				line-height: 20px;
				font-size: 14px;
				text-align: center;
			}
		}
		
		
	}
</style>
