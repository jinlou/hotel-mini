<template>
	<view class="content">
		<Room></Room>
		<view class="cleanTime">
			<text>选择清扫时间</text>
			<view class="types">
				<picker @change="bindPickerChange" v-model="time" :index="index" :range="timeList">
					<view class="time">
						<text class="uni-input">{{timeList[index]}}</text>
						<uni-icons custom-prefix="custom-icon" type="right" size="14"></uni-icons>
					</view>
				</picker>
				<!-- <uni-datetime-picker type="datetime" v-model="time" :border="false"/> -->
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
				// time: '',
				time: '立即清扫',
				index: 0,
				timeList: [
					'立即清扫',
					'10:00',
					'10:30',
					'11:00',
					'11:30',
					'12:00',
					'12:30',
					'13:00',
					'13:30',
					'14:00',
					'14:30',
					'15:00',
					'15:30',
					'16:00',
					'16:30',
					'17:00',
					'17:30',
					'18:00',
					'18:30',
				],
				content: '',
			}
		},
		components: {
			Room
		},
		onLoad() {},
		mounted() {},
		methods: {
			bindPickerChange(e) {
				console.log(e)
				this.index = e.detail.value
			},
			getDate(type) {
				let today = new Date()
				let targetDay = today.getTime()
				today.setTime(targetDay)
				let year = today.getFullYear()
				let month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : '0' + (today.getMonth() + 1)
				let date = today.getDate() > 9 ? today.getDate() : '0' + today.getDate()
				let hour = today.getHours() > 9 ? today.getHours() : '0' + today.getHours()
				let min = today.getMinutes() > 9 ? today.getMinutes() : '0' + today.getMinutes()
				let dateTime = year + '-' + month + '-' + date + ' ' + hour + ':' + min
				let dateTime1 = year + '-' + month + '-' + date
				console.log('日：' + dateTime)
				return type ? dateTime : dateTime1
			},
			submit() {
				let time = this.time == '立即清扫' ? this.getDate(1) : (this.getDate(0) + ' ' + this.time)
				this.$api.roomClean({
					hotelRoomId: uni.getStorageSync('roomInfo').roomId,
					contactNumber: uni.getStorageSync('userInfo').phone,
					remark: this.content,
					cleanTime: time
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
							},complete() {
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

	.cleanTime {
		padding: 0rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		border-radius: 8rpx;
		font-size: 26rpx;

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
		font-size: 26rpx;

		text {
			line-height: 60rpx;
		}

		.info {
			height: 140rpx;
			background: #eee;
			padding: 8rpx 6rpx;
			width: 100%;
			border-radius: 10rpx;
			font-size: 26rpx;
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
	
	.time {
		height: 80rpx;
		display: flex;
		align-items: center;
	}
</style>
