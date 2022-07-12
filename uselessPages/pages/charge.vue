<template>
	<view class="page">
		<image src="@/static/image/logo.png" mode="" class="bg"></image>
		<view class="chargeList">
			<view class="one" v-for="(item, index) in chargeList" :key="index" @click="submit(item)">
				<text class="goodsName">{{item.goodsName}}</text>
				<image :src="baseURL + item.goodsImage" mode=""></image>
				<text class="goodsPrice">{{item.goodsPrice}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		baseURL
	} from '@/api/baseURL.js'
	export default {
		data() {
			return {
				baseURL: baseURL + '/',
				chargeList: [],
			}
		},
		mounted() {
			this.getChargeList()
		},
		methods: {
			getChargeList() {
				this.$api.getGoodsList({
					hotelId: uni.getStorageSync('roomInfo').hotelId,
					hotelBranchId: uni.getStorageSync('roomInfo').hotelBranchId,
					goodsName: '',
					goodsType: 'charge',
				}).then(res => {
					if(res.code == 0) {
						this.chargeList = res.data.data
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
			submit(item) {
				let orderGoods = {}
				orderGoods[item.goodsId] = 1
				this.$api.submitAccount({
					roomId: uni.getStorageSync('roomInfo').roomId,
					hotelBranchId: uni.getStorageSync('roomInfo').hotelBranchId,
					hotelId: uni.getStorageSync('roomInfo').hotelId,
					remark: '',
					payType: 1,
					orderGoods: JSON.stringify(orderGoods)
				}).then(res => {
					if (res.code == 0) {
						this.prepay(res.data)
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
			prepay(data) {
				this.$api.prepay(data).then(res => {
					if(res.code == 0) {
						console.log(res.data.prepay_id)
						this.wxPay(res.data)
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
			wxPay(data) {
				console.log(data)
				uni.requestPayment({
					appid: 'wx640db0216dc8de75',
					provider: 'wxpay', // 服务提供商
					timeStamp: data.timestamp,
					nonceStr: data.noncestr,
					package: 'prepay_id=' + data.prepay_id,
					signType: data.signType,
					paySign: data.paySign,
					success: (res) => {
						uni.showToast({
							title: '支付成功',
							icon: 'none'
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
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		position: relative;
		
		.chargeList {
			position: fixed;
			height: calc(100% - 200rpx);
			width: 100%;
			top: 200rpx;
			z-index: 2;
			border-top-left-radius: 60rpx;
			background: #fff;
			padding: 40rpx 30rpx;
			
			.one {
				height: 200rpx;
				margin-bottom: 20rpx;
				position: relative;
				
				image {
					width: 100%;
					height: 100%;
				}
				
				.goodsName {
					position: absolute;
				}
				
				.goodsPrice {
					position: absolute;
					right: 50rpx;
					top: 50rpx;
				}
			}
		}
	}
</style>
