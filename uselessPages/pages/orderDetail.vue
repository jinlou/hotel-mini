<template>
	<view class="content">
		<view class="orderStatus">
			<view class="left">
				<view class="top" @click="re()">
					<image src="@/static/image/logo.png" mode=""></image>
					<text v-if="orderDetail.status == 0">订单已提交，等待商家接单…</text>
					<text v-if="orderDetail.status == 1 || orderDetail.status == 2">商家已接单，请耐心等待…</text>
					<text v-if="orderDetail.status == 3 || orderDetail.status == 4">商品已配送</text>
					<text v-if="orderDetail.status == 5">订单已取消</text>
				</view>
				<view class="time">{{orderDetail.addTime}}</view>
			</view>
			<view class="right">{{orderDetail.status | statusFilter}}</view>
		</view>

		<view class="orderInfo">
			<view class="top">
				<image src="@/static/image/logo.png" mode=""></image>
				<text>客房服务管家体验</text>
			</view>

			<view class="info">
				<view class="one">
					<view class="left">订单编号</view>
					<view class="right">{{orderDetail.orderSn}}</view>
				</view>
				<view class="one">
					<view class="left">房号/桌号</view>
					<view class="right">{{orderDetail.roomInfo.roomCode}}</view>
				</view>
				<view class="one">
					<view class="left">支付方式</view>
					<view class="right">{{orderDetail.payType ? '微信支付' : '现金支付'}}</view>
				</view>
				<view class="one">
					<view class="left">备注</view>
					<view class="right">{{orderDetail.remark || '无'}}</view>
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
						<image :src="baseURL + item.goodsImage" mode=""></image>
						<view class="info">
							<text>{{item.goodsName}}</text>
							<text>￥{{item.goodsPrice}}</text>
						</view>
					</view>
					<view class="amount">
						<text style="color: #f25022;font-size: 26rpx;">×{{item.count}}</text>
					</view>
				</view>
			</view>
			<view class="price">
				<text>小计：</text>
				<text>{{allMoney}}元</text>
			</view>
		</view>
		<button class="submit" v-if="orderDetail.status == 0" @click.stop="cancelOrder()">取消订单</button>
		<button type="error" @click="submit" class="submit" v-if="orderDetail.status < 4 && orderDetail.status > 0  && orderDetail.payStatus">确认订单</button>
	</view>
</template>

<script>
	import {baseURL} from '@/api/baseURL.js'
	export default {
		data() {
			return {
				baseURL: baseURL + '/',
				content: '',
				choosedGoods: [],
				orderDetail: {
					orderGoods: []
				}
			}
		},
		filters: {
			statusFilter(status) {
				if(status == 1 || status == 2) {
					return '已接单'
				} else if (status == 3 || status == 4) {
					return '已完成'
				} else if (status == 5) {
					return '已取消'
				} else{ 
					return '待接单'
				}
			}
		},
		computed: {
			allNum() {
				let num = 0
				this.choosedGoods.forEach(v => {
					num += v.count
				})
				return num
			},
			allMoney() {
				let num = 0
				this.choosedGoods.forEach(v => {
					num += v.count * v.goodsPrice
				})
				return num
			},
		},
		onLoad(options) {
			console.log(options)
			this.getOrderInfo(options.orderId)
		},
		mounted() {
			
		},
		methods: {
			re() {
				uni.$emit('updateList')
			},
			getOrderInfo(orderId) {
				this.$api.getOrderInfo({
					orderId
				}).then(res => {
					if(res.code == 0) {
						this.orderDetail = res.data
						this.choosedGoods = res.data.orderGoods
					} else {
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			cancelOrder() {
				this.$api.cancelOrder({
					orderId: this.orderDetail.orderId,
					orderSn: item.orderSn,
				}).then(res => {
					if(res.code == 0) {
						uni.showToast({
							icon: 'none',
							title: '已取消订单'
						})
						uni.$emit('updateList')
					} else {
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			submit() {
				this.$api.confirmReceipt({
					orderId: this.orderDetail.orderId,
					orderSn: item.orderSn,
				}).then(res => {
					if(res.code == 0) {
						uni.showToast({
							icon: 'none',
							title: '已确认订单'
						})
						uni.$emit('updateList')
					} else {
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
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
	
	.submit {
		margin-top: 30rpx;
		background: #f25022;
		color: #fff;
	}
</style>
