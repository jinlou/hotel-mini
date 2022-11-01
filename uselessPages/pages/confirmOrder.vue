<template>
	<view class="content">
		<Room></Room>
		<view class="choosedGoods">
			<view class="top">
				<image src="@/static/image/shopping_car.png" mode=""></image>
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
						<text style="color: #f25022;font-size: 26rpx;">×{{item.value}}</text>
					</view>
				</view>
			</view>
			<view class="price">
				<text>小计：</text>
				<text>{{allMoney}}元</text>
			</view>
		</view>

		<view class="more">
			<text>备注</text>
			<textarea class="info" v-model.trim="content" placeholder="如有其他需求,请输入…" />
		</view>

		<view class="payType">
			<view class="top">支付方式</view>
			<radio-group @change="change">
				<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
					<view class="txt">
						<image v-if="item.value == 1" src="@/static/image/saoma_success.png" mode=""></image>
						<image v-else src="@/static/image/crash.png" mode=""></image>
						<text>{{item.name}}</text>
					</view>
					<view>
						<radio :value="item.value" :checked="index == current" style="transform:scale(0.8)" />
					</view>
				</label>
			</radio-group>
		</view>

		<view class="pay">
			<view class="left">
				<image src="@/static/image/shopping_car.png" mode=""></image>
				<text>合计：{{allMoney}}元</text>
			</view>
			<button @click="submit" class="submit">提交订单</button>
		</view>
	</view>
</template>

<script>
	import {
		baseURL
	} from '@/api/baseURL.js'
	import Room from '@/components/room.vue'
	export default {
		data() {
			return {
				content: '',
				choosedGoods: [],
				items: [
					{
						value: '0',
						name: '现金支付'
					},
					{
						value: '1',
						name: '微信支付'
					},
				],
				current: 0,
				baseURL: baseURL + '/',
				loading: false,
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
					num += v.value * v.goodsPrice
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
			change(e) {
				console.log(e)
				this.current = e.detail.value
			},
			submit() {
				if(this.loading) return
				let orderGoods = {}
				for(let i=0;i<this.choosedGoods.length;i++){
					orderGoods[this.choosedGoods[i].goodsId] = this.choosedGoods[i].value
				}
				console.log(orderGoods)
				this.loading = true
				this.$api.submitAccount({
					roomId: uni.getStorageSync('roomInfo').roomId,
					hotelBranchId: uni.getStorageSync('roomInfo').hotelBranchId,
					hotelId: uni.getStorageSync('roomInfo').hotelId,
					remark: this.content,
					payType: this.current,
					orderGoods: JSON.stringify(orderGoods)
				}).then(res => {
					this.loading = false
					if (res.code == 0) {
						if(this.current == 1) {
							this.prepay(res.data)
						} else {
							uni.showToast({
								icon: 'none',
								title: '服务已提交，请稍后…'
							})
							setTimeout(() => {
								uni.navigateTo({
									url: '/uselessPages/pages/orderDetail?orderId=' + res.data.orderId
								})
							}, 1500)
						}
						
					} else {
						uni.showToast({
							icon: 'none',
							title: err.msg || '网络错误'
						})
					}
				}).catch(err => {
					this.loading = false
					uni.showToast({
						icon: 'none',
						title: err.msg || '网络错误'
					})
				})
			},
			prepay(data) {
				this.$api.prepay(data).then(res => {
					if(res.code == 0) {
						console.log(res.data.prepay_id)
						this.wxPay(res.data, data.orderId)
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
			wxPay(data, orderId) {
				console.log(data)
				uni.requestPayment({
					provider: 'wxpay', // 服务提供商
					timeStamp: data.timestamp,
					nonceStr: data.noncestr,
					package: 'prepay_id=' + data.prepay_id,
					signType: data.signType,
					paySign: data.paySign,
					success: (res) => {
						// uni.showToast({
						// 	title: '支付成功',
						// 	icon: 'none'
						// })
						wx.requestSubscribeMessage({
							appId: this.appID,
							tmplIds: this.$serviceIDs,
							success (res) { 
								console.log(res)
							},
							complete() {
								uni.showToast({
									icon: 'none',
									title: '服务已提交，请稍后…'
								})
								setTimeout(() => {
									uni.navigateTo({
										url: '/uselessPages/pages/orderDetail?orderId=' + orderId
									})
								}, 1500)
							}
						})
					},
					fail: (res) => {
						console.log(data)
						console.log(res)
						console.log(res.errMsg)
						if (res.errMsg != 'requestPayment:fail cancel') {
							uni.showToast({
								title: '支付失败，请联系管理员或稍后重试',
								icon: 'none',
								mask: true,
								duration: 2000
							})
						} else {
							uni.showToast({
								title: res.msg || '取消支付',
								icon: 'none',
								mask: true,
								duration: 2000
							})
						}
					}
				});
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
				font-size: 24rpx;
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
			justify-content: space-between;
			
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

	.payType {
		background: #fff;
		margin-top: 20rpx;
		border-radius: 10rpx;

		.top {
			border-bottom: 1px solid #ebedf2;
			height: 90rpx;
			display: flex;
			padding: 0 30rpx;
			align-items: center;
		}

		.uni-list-cell-pd {
			display: flex;
			justify-content: space-between;
			height: 90rpx;
			align-items: center;
			padding: 0 30rpx;

			.txt {
				display: flex;
				align-items: center;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 10rpx;
				}

				text {
					font-size: 26rpx;
					color: #333;
				}
			}
		}
	}

	.pay {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;

		.left {
			display: flex;
			font-size: 26rpx;
			color: #333;
		}

		image {
			width: 40rpx;
			height: 40rpx;
			margin-right: 10rpx;
		}

		.submit {
			width: 160rpx;
			font-size: 26rpx;
			color: #fff;
			background: $uni-color-primary;
			height: 60rpx;
			line-height: 60rpx;
			margin: 0;
			border-radius: 30rpx;
		}
	}
</style>
