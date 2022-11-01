<template>
	<view class="page1">
		<view class="card">
			<view class="v1">
				<image src="@/static/image/novel/vip1.png" />
				<text>超级会员</text>
			</view>
			<view class="time" v-show="deadTime">到期时间：{{deadTime}}</view>
			<view class="v2">
				<text>万本小说随心看 免广告</text>
				<view class="continue">续费</view>
			</view>
		</view>
		<view class="tit">VIP会员套餐</view>
		<view class="types">
			<view :class="['one',item.vipId == vipId ? 'active':'']" v-for="(item, index) in types" :key="index" @click="choose(item)">
				<view class="title">{{item.title}}</view>
				<view class="price">
					<text class="t1">￥</text>
					<text class="t2">{{item.price}}</text>
				</view>
			</view>
		</view>
		<!-- <view class="note">到期前一天为您自动续费19元/月（可取消，不再自动续费）</view> -->
		<view class="note">
			<radio-group @change="change">
				<radio value="true" @change="change" color="#007DF8" style="transform:scale(0.7)" />
			</radio-group>
			<text @click="goTo">我已详细阅读《VIP会员服务协议》</text>
		</view>

		<view class="submit" @click="sumbit">立即购买</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeList: [],
				deadTime: '',
				types: [{
						title: '连续包月',
						price: 19,
						vipId: 2,
					},
					{
						title: '季度会员',
						price: 49,
						vipId: 3,
					},
					{
						title: '年度会员',
						price: 99,
						vipId: 4,
					},
				],
				i: 0,
				vipId: 2,
				agree: false
			}
		},
		onLoad(options) {
			console.log(options)
		},
		mounted() {
			this.userNovelShelfPage()
			if(uni.getStorageSync('novelVip') && uni.getStorageSync('novelVip').overdueTime){
				this.deadTime = uni.getStorageSync('novelVip').overdueTime
			}
		},

		methods: {
			userNovelShelfPage() {
				this.$api.userNovelShelfPage({
					page: 1,
					per_page: 3000
				}).then(res => {
					console.log(res)
					this.storeList = res.data.data
				}).catch(err => {
					console.log(err)
				})
			},
			goTo() {
				uni.navigateTo({
					url: '/uselessPages/pages/novelAgreement'
				})
			},
			change(e) {
				console.log(e)
				this.agree = e.target.value
			},
			choose(item) {
				this.vipId = item.vipId
			},
			sumbit() {
				if(this.agree) {
					this.$api.rechargeVip({
						vipId: this.vipId
					}).then(res => {
						console.log(res)
						this.prepay(res.data)
					}).catch(err => {
						console.log(res)
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '请勾选协议'
					})
				}
			},
			prepay(data) {
				this.$api.rechargeNovelVip({
					orderId: data.orderId,
					orderSn: data.orderSn
				}).then(res => {
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
						uni.navigateBack()
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
			},
 		}
	}
</script>

<style lang="scss" scoped>
	.page1 {
		background: #DFEEFF;
		min-height: 100vh;
		padding: 13px 0;

		.card {
			margin: 0 30px 13px;
			height: 109px;
			background: linear-gradient(152deg, #017CF8 0%, #B2D8FF 56%, #086CD1 100%);
			border-radius: 10px;
			padding: 8px 10px 10px 30px;

			.v1 {
				height: 40px;
				display: flex;
				align-items: center;

				image {
					width: 40px;
					height: 40px;
					margin-right: 8px;
				}

				text {
					font-size: 24px;
					color: #fff;
				}
			}

			.time {
				font-size: 10px;
				color: #fff;
				margin-top: 13px;
			}

			.v2 {
				display: flex;
				justify-content: space-between;
				align-items: center;

				text {
					font-size: 16px;
					color: #fff;
				}

				.continue {
					width: 68px;
					height: 26px;
					border-radius: 14px;
					border: 1px solid #FFFFFF;
					text-align: center;
					line-height: 26px;
					color: #fff;
					font-size: 14px;
				}
			}
		}

		.tit {
			font-size: 22px;
			font-family: PingFang SC-Bold, PingFang SC;
			font-weight: bold;
			color: #000000;
			margin: 30px 0 12px 8px;
		}

		.types {
			display: flex;
			justify-content: space-around;

			.one {
				width: 25%;
				height: 135px;
				background: #FFFFFF;
				border-radius: 10px;
				opacity: 1;
				border: 5px solid #ABCFFF;
				display: flex;
				align-items: center;
				flex-direction: column;
				padding: 12px 0;

				&.active {
					height: 135px;
					background: #007DF8;
					border-radius: 10px 10px 10px 10px;
					opacity: 1;
					border: 5px solid #ABCFFF;
					color: #fff;
				}

				.title {
					font-size: 15px;
					font-family: PingFang SC-Bold, PingFang SC;
					font-weight: bold;
				}

				.price {
					display: flex;
					align-items: baseline;
					margin-top: 20px;

					.t1 {
						font-size: 15px;
					}

					.t2 {
						font-size: 30px;
					}
				}
			}
		}

		.note {
			display: flex;
			justify-content:center;
			align-items: center;
			font-size: 10px;
			font-family: PingFang SC-Bold, PingFang SC;
			font-weight: bold;
			color: #000000;
			text-align: center;
			margin-top: 12px;
		}

		.submit {
			position: absolute;
			bottom: 50px;
			left: 30px;
			right: 30px;
			height: 50px;
			line-height: 50px;
			text-align: center;
			background: linear-gradient(93deg, #CCE6FF 0%, #007DF8 53%, #CCE6FF 100%);
			border-radius: 25px;
			color: #fff;
		}
	}
</style>
