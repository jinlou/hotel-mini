<template>
	<view class="content">
		<view class="bg"></view>
		<view class="top">
			<view class="uni-padding-wrap">
				<view class="page-section swiper">
					<view class="page-section-spacing">
						<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="4000"
							:duration="500">
							<swiper-item v-for="(item, index) in swipers" :key="index" class="swiper-item">
								<view class="swiper-item uni-bg-red">
									<!-- <text>{{item.content}}</text> -->
									<image :src="item.bg" mode=""></image>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			<view class="scan">
				<image @click="scan" class="logo" src="/static/image/scan.png"></image>
				<view class="text">
					<view class="v1">扫描设备二维码</view>
					<view class="v2">智能客房管家将为你服务</view>
				</view>
			</view>
			<view class="takeaway">
				<view class="left">
					<image class="logo" src="/static/image/take_out.png"></image>
					<view class="text">
						<view class="">
							<text class="fontRed">{{takeawayAll}}</text>
							<text>外卖红包</text>
						</view>
						<text>今日剩余{{takeawayMount}}个</text>
					</view>
				</view>
				<view class="right">
					立即领取
				</view>
			</view>
			<view class="minis">
				<view class="mini" v-for="(item, index) in minis" :key="index" @click="goTo(item)">
					<view class="out">
						<image :src="item.bg" mode=""></image>
					</view>
					<text>{{item.text}}</text>
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
					content: '高大妞',
					url: 'www.baidu.com',
					bg: 'https://img1.baidu.com/it/u=3757403282,3297426190&fm=253&fmt=auto&app=138&f=JPEG?w=1280&h=333'
				}],
				takeawayAll: 68,
				takeawayMount: 55,
				minis: [{
						text: '打车',
						bg: require('@/static/image/mini/mini8.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '特价机票',
						bg: require('@/static/image/mini/mini7.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '车票',
						bg: require('@/static/image/mini/mini6.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '火车票',
						bg: require('@/static/image/mini/mini5.png'),
						appID: '',
						defaultPage: ''
					}
				],
				minis1: [{
						text: '外卖',
						bg: require('@/static/image/mini/mini4.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '订酒店',
						bg: require('@/static/image/mini/mini3.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '美食',
						bg: require('@/static/image/mini/mini2.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '门票',
						bg: require('@/static/image/mini/mini1.png'),
						appID: '',
						defaultPage: ''
					},
					{
						text: '攻略',
						bg: require('@/static/image/mini/mini9.png'),
						appID: '',
						defaultPage: ''
					}
				],
			}
		},
		onLoad() {
			console.log(baseURL)
		},
		methods: {
			scan() {
				console.log('扫描')
				uni.scanCode({
					scanType: ['qrCode'],
					success: res => {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						// https://dev.qyqycp.com/api/v1/device/GJ00001002
						let data = res.result.split('/')
						let code = data[data.length - 1]
						if (code) {
							uni.navigateTo({
								url: '/pages/service/service?code=' + code
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: '扫码失败'
							})
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
						console.log('tiao')
					}
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		background: #eee;
		min-height: 100vh;
	}

	.bg {
		position: absolute;
		width: 100%;
		height: 120px;
		left: 0;
		top: 0;
		background: #00a4ef;
		z-index: 0;
		border-bottom-left-radius: 40px;
		border-bottom-right-radius: 40px;
	}

	.top {
		position: absolute;
		top: 0;
		width: 100%;
		padding: 0 12px;

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
				
				text {
					
				}
			}
		}
	}

	.scan {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		height: 180px;
		width: 100%;
		background: #fff;
		z-index: 2;
		border-radius: 15px;

		image {
			width: 60px;
			height: 60px;
		}

		.text {
			text-align: center;
			margin-top: 15px;

			.v1 {
				font-weight: bold;
				font-size: 18px;
			}

			.v2 {
				margin-top: 5px;
				font-size: 14px;
			}
		}
	}

	.takeaway {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100px;
		background: #fff;
		margin-top: 7px;
		border-radius: 15px;
		padding: 0 12px;
		box-sizing: border-box;

		.left {
			display: flex;

			image {
				width: 60px;
				height: 60px;
				border-radius: 50%;
			}

			.text {
				font-size: 17px;
				font-weight: bold;
				margin-left: 8px;

				.fontRed {
					color: red;
				}
			}
		}

		.right {
			width: 80px;
			text-align: center;
			height: 60rpx;
			line-height: 60rpx;
			background: #ea6571;
			border-radius: 30rpx;
			color: #fff;
			font-size: 24rpx;
		}
	}

	.minis {
		display: flex;
		justify-content: space-between;
		height: 80px;
		color: #fff;
		width: 100%;
		margin-top: 12px;

		.mini {
			width: 24%;
			height: 100%;
			position: relative;
			display: flex;
			justify-content: flex-end;
			align-items: flex-end;
			border-radius: 20rpx;

			.out {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 8rpx;
				box-shadow: 0px 0px 10px #fff inset;
				border: 1rpx solid #fff;

				image {
					width: 50rpx;
					height: 50rpx;
				}
			}

			text {
				position: absolute;
				left: 6px;
				top: 6rpx;
				line-height: 20px;
				font-size: 14px;
			}

			&:first-child {
				background-image: linear-gradient(#fd639d, #fc8ea0);
			}

			&:nth-child(2) {
				background-image: linear-gradient(#fc646e, #fd7e5d);
			}

			&:nth-child(3) {
				background-image: linear-gradient(#fe884e, #fcb662);
			}

			&:nth-child(4) {
				background-image: linear-gradient(#2ea5f6, #48dce6);
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
			width: 50px;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.out {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				background: #fff;

				image {
					width: 50rpx;
					height: 50rpx;
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
