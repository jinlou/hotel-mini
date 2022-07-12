<template>
	<view class="content">
		<Room></Room>
		<view class="choose">
			<view class="cleanTime">
				<text>续房类型</text>
				<view class="types">
					<picker @change="bindPickerChange" v-model="type" :range="typeList" range-key="name">
						<view class="uni-input">
							{{typeList[type].name}}
							<uni-icons type="right" color="#666" size="14"></uni-icons>
						</view>

					</picker>
				</view>
			</view>
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
			}
		},
		components: {
			Room
		},
		onLoad() {},
		mounted() {
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
			getRoomInfo() {
				this.$api.hotelStay({
					roomId: uni.getStorageSync('roomInfo').roomId
				}).then(res => {
					if(res.code == 0) {
						if(res.data.type.length && res.data.days.length) {
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
			submit() {
				this.$api.applyHotelStay({
					hotelRoomId: uni.getStorageSync('roomInfo').roomId,
					contactNumber: uni.getStorageSync('userInfo').phone,
					remark: this.content,
					hotelStayType: this.typeList[this.type].id,
					days: this.dayList[this.day].id,
				}).then(res => {
					if(res.code == 0) {
						uni.showToast({
							icon: 'none',
							title: '服务已提交，请稍后…'
						})
						wx.requestSubscribeMessage({
							tmplIds: this.$serviceIDs,
							success (res) { 
								console.log(res)
							},
							complete() {
								uni.navigateBack()
							}
						})
					}
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.msg
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

	.choose {
		background: #fff;
		border-radius: 8rpx;


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
		}
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
</style>
