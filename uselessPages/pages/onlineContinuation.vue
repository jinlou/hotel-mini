<template>
	<view class="content">
		<Room></Room>
		<view class="choose">
			<view class="cleanTime">
				<text>续房天数</text>
				<view class="types">
					<picker @change="bindPickerChangeDay" v-model="day" :range="dayList" range-key="name">
						<view class="uni-input">
							{{dayList[day].name}}
							<uni-icons type="right" color="#666" size="14"></uni-icons>
						</view>
					</picker>
				</view>
			</view>
			<!-- <view class="cleanTime">
				<text>续房类型</text>
				<view class="types">
					<picker @change="bindPickerChange" v-model="type" :range="typeList" range-key="name">
						<view class="uni-input">
							{{typeList[type].name}}
							<uni-icons type="right" color="#666" size="14"></uni-icons>
						</view>
			
					</picker>
				</view>
			</view> -->
			
			<view class="cleanTime">
				<text>续房金额</text>
				<view class="types" style="padding-right: 14px;">{{price * (Number(day) + 1)}}元</view>
			</view>
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


		<view class="more">
			<text>备注</text>
			<textarea class="info" v-model.trim="content" placeholder="如有其他需求,请输入…" />
		</view>
		<button type="primary" @click="submit" class="submit">提交</button>
	</view>
</template>

<script>
	import Room from '@/components/room.vue'
	export default {
		data() {
			return {
				type: 0,
				typeList: [
					// '续住此房间',
					// '换房续住',
				],
				day: 0,
				dayList: [],
				content: '',
				price: 0,
				items: [
					{
						value: '0',
						name: '线下支付'
					},
					{
						value: '1',
						name: '微信支付'
					},
				],
				current: 0,
			}
		},
		components: {
			Room
		},
		onLoad() {},
		mounted() {
			this.stayPrice()
			this.getRoomInfo()
		},
		methods: {
			bindPickerChange(e) {
				console.log(e)
				this.typeIndex = e.detail.value
				this.type = e.detail.value
			},
			bindPickerChangeDay(e) {
				console.log(e)
				this.dayIndex = e.detail.value
				this.day = e.detail.value
			},
			stayPrice() {
				this.$api.stayPrice({
					roomId: uni.getStorageSync('roomInfo').roomId
				}).then(res => {
					console.log(res)
					this.price = res.data.stayPrice == '0.00' ? 0 : res.data.stayPrice
				})
			},
			getRoomInfo() {
				this.$api.hotelStay({
					roomId: uni.getStorageSync('roomInfo').roomId
				}).then(res => {
					if (res.code == 0) {
						if (res.data.type.length && res.data.days.length) {
							this.typeList = res.data.type
							this.dayList = res.data.days
						} else {
							uni.showToast({
								icon: 'none',
								title: '无法续住'
							})
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
					})
				})
			},
			change(e) {
				console.log(e)
				this.current = e.detail.value
			},
			submit() {
				if(!this.price) {
					uni.showToast({
						icon: 'none',
						title: '该房间无法续住，请联系前台处理…'
					})
					return
				}
				this.$api.applyHotelStay({
					hotelRoomId: uni.getStorageSync('roomInfo').roomId,
					contactNumber: uni.getStorageSync('userInfo').phone,
					remark: this.content,
					hotelStayType: this.typeList[this.type].id,
					days: this.dayList[this.day].id,
				}).then(res => {
					if (res.code == 0) {
						// uni.showToast({
						// 	icon: 'none',
						// 	title: '服务已提交，请稍后…'
						// })
						// wx.requestSubscribeMessage({
						// 	tmplIds: this.$serviceIDs,
						// 	success(res) {
						// 		console.log(res)
						// 	},
						// 	complete() {
						// 		uni.navigateBack()
						// 	}
						// })
						if(this.current == 1) {
							this.prepay({
								orderId: res.data.order.orderId,
								orderSn: res.data.order.orderSn
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: '服务已提交，请稍后…'
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)
						}
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
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
			},
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

	.choose {
		background: #fff;
		border-radius: 8rpx;
		box-shadow: 0px 2px 3px 1px rgba(0, 0, 0, 0.1);

	}

	.cleanTime {
		padding: 16rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;

		.types {
			display: flex;
			flex: 1;
			justify-content: flex-end;
			
			picker {
				width: 100%;
				text-align: right;
			}
		}
	}

	.more {
		margin-top: 16rpx;
		background: #fff;
		border-radius: 8rpx;
		padding: 0 20rpx 20rpx;
		font-size: 24rpx;
		box-shadow: 0px 2px 3px 1px rgba(0, 0, 0, 0.1);

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

	.submit {
		margin: 10px 0 30px;
		background: $uni-color-primary;
	}

	.button {
		height: 40rpx;
		line-height: 28rpx;
		font-size: 20rpx;
		padding: 6rpx 10rpx;
		color: #fff;
		background: $uni-color-primary;
		flex-grow: 0;
		flex-shrink: 0;
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
</style>
