<template>
	<view class="content">
		<view class="orderStatus">
			<view class="left">
				<view class="top">
					<image src="@/static/image/logo.png" mode=""></image>
					<text>订单已提交，等待商家接单…</text>
				</view>
				<view class="time">
					{{orderDetail.time}}
				</view>
			</view>
			<view class="right">
				未支付
			</view>
		</view>

		<view class="orderInfo">
			<view class="top">
				<image src="@/static/image/logo.png" mode=""></image>
				<text>客房服务管家体验</text>
			</view>

			<view class="info">
				<view class="one">
					<view class="left">
						订单编号
					</view>
					<view class="right">
						{{orderDetail.orderNo}}
					</view>
				</view>
				<view class="one">
					<view class="left">
						房号/桌号
					</view>
					<view class="right">
						{{orderDetail.roomNo}}
					</view>
				</view>
				<view class="one">
					<view class="left">
						支付方式
					</view>
					<view class="right">
						{{orderDetail.payType}}
					</view>
				</view>
				<view class="one">
					<view class="left">
						备注
					</view>
					<view class="right">
						{{orderDetail.mark || '无'}}
					</view>
				</view>
			</view>
		</view>

		<view class="choosedGoods">
			<view class="top">
				<image src="@/static/image/logo.png" mode=""></image>
				<text>共计{{allNum}}件商品</text>
			</view>
			<view class="goods">
				<view class="one" v-for="(item, index) in choosedGoods" :key="index">
					<view class="goodsInfo">
						<image :src="item.url" mode=""></image>
						<view class="info">
							<text>{{item.name}}</text>
							<text>￥{{item.price}}</text>
						</view>
					</view>
					<view class="amount">
						<text style="color: #f25022;font-size: 26rpx;">×{{item.value}}</text>
					</view>
				</view>
			</view>
			<view class="price">
				<text>小计：</text>
				<text>{{allMoney}}元</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Room from '@/components/room.vue'
	export default {
		data() {
			return {
				content: '',
				choosedGoods: [],
				orderDetail: {
					time: '2022-03-03 03:03:03',
					orderNo: 123456798,
					roomNo: '自己想在哪',
					payType: '现金支付',
					mark: '自己想在哪自己想在哪自己想在哪自己想在哪自己想在哪自己想在哪自己想在哪自己想在哪自己想在哪'
				}
			}
		},
		computed: {
			allNum() {
				let num = 0
				this.choosedGoods.forEach(v => {
					num += v.value
				})
				return num
			},
			allMoney() {
				let num = 0
				this.choosedGoods.forEach(v => {
					num += v.value * v.price
				})
				return num
			},
		},
		components: {
			Room
		},
		onLoad() {

		},
		mounted() {
			console.log(uni.getStorageSync('choosedGoods'))
			this.choosedGoods = uni.getStorageSync('choosedGoods')
		},
		methods: {
			getPhone() {

			}
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 20rpx 30rpx;
		background: #eee;
		min-height: 100vh;
		color: #333;
	}

	.more {
		margin-top: 16rpx;
		background: #fff;
		border-radius: 8rpx;
		padding: 0 20rpx 20rpx;
		font-size: 24rpx;

		text {
			line-height: 60rpx;
		}

		.info {
			height: 140rpx;
			background: #eee;
			padding: 8rpx 6rpx;
			width: 100%;
			border-radius: 10rpx;
			box-sizing: border-box;
		}
	}

	.choosedGoods {
		background: #fff;
		margin-top: 20rpx;
		border-radius: 10rpx;

		.top {
			height: 90rpx;
			display: flex;
			padding: 0 30rpx;

			align-items: center;

			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}

			text {
				color: #333;
				font-size: 26rpx;
			}
		}

		.goods {
			border-top: 1px solid #ebedf2;
			border-bottom: 1px solid #ebedf2;
			padding: 10rpx 0;

			.one {
				display: flex;
				padding: 10rpx 30rpx;
				align-items: center;

				.amount {
					height: 100%;
				}
			}
		}

		.price {
			height: 90rpx;
			display: flex;
			padding: 0 30rpx;
			align-items: center;
			justify-content: flex-end;
			font-size: 24rpx;
		}
	}

	.goodsInfo {
		flex: 1;
		display: flex;

		image {
			width: 120rpx;
			height: 120rpx;
			margin-right: 10rpx;
		}

		.info {
			display: flex;
			flex-direction: column;

			text:nth-child(1) {
				font-size: 24rpx;
				color: #333;
			}

			text:nth-child(2) {
				font-size: 26rpx;
				color: #f25022;
			}
		}
	}

	.orderStatus {
		background: #fff;
		margin-top: 20rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		justify-content: space-between;

		.left {
			display: flex;
			flex-direction: column;

			.top {
				font-size: 26rpx;
				display: flex;
				align-items: center;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 10rpx;
				}
			}

			.time {
				font-size: 22rpx;
				color: #666;
			}
		}

		.right {
			background: rgba(0, 164, 239, 0.4);
			color: rgba(0, 164, 239, 1);
			font-size: 22rpx;
			padding: 6rpx 14rpx;
			border-radius: 10rpx;
		}
	}

	.orderInfo {
		background: #fff;
		margin-top: 20rpx;
		border-radius: 10rpx;

		.top {
			font-size: 26rpx;
			display: flex;
			align-items: center;
			border-bottom: 1px solid #ebedf2;
			padding: 0 30rpx;
			height: 90rpx;

			image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}

		.info {
			padding: 30rpx 0;

			.one {
				display: flex;
				padding: 0 30rpx;
				margin-bottom: 20rpx;

				.left {
					color: #666;
					font-size: 24rpx;
					width: 140rpx;
					flex-shrink: 1;
				}

				.right {
					flex: 1;
					color: #000;
					font-size: 24rpx;
					word-break: break-all;
				}
			}
		}
	}
</style>
