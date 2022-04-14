<template>
	<view class="content">
		<Room></Room>
		<view class="choose">
			<view class="cleanTime">
				<text>叫醒时间</text>
				<view class="types">
					<picker mode="time" :value="time" start="00:00" end="23:59" @change="bindPickerChange">
						<view class="uni-input">{{time}}
						<uni-icons type="right" color="#666" size="14"></uni-icons>
						</view>
					</picker>
				</view>
			</view>
			<view class="cleanTime">
				<text>可提前叫醒时间</text>
				<view class="types">
					<picker @change="bindPickerChangeDay" v-model="day" :index="dayIndex" :range="dayList">
						<view class="uni-input">
							{{dayList[dayIndex]}}
							<uni-icons type="right" color="#666" size="14"></uni-icons>
						</view>
					</picker>
				</view>
			</view>
			<view class="cleanTime">
				<text>呼叫手机</text>
				<view class="types">
					<input type="text" v-model="phone" style="text-align: right;padding-right: 28rpx;"/>
				</view>
			</view>
		</view>

		<view class="more">
			<text>备注</text>
			<textarea class="info" v-model.trim="content" placeholder="如有其他需求,请输入…" />
			<view class="allow">
				<radio v-model="allow" color="#007aff"/>
				<text>如手机未接听，允许酒店人员敲门叫醒！</text>
			</view>
		</view>
		<button type="primary" @click="submit" class="submit">提交</button>
	</view>
</template>

<script>
	import Room from '@/components/room.vue'
	export default {
		data() {
			return {
				time: '',
				day: 1,
				dayIndex: 0,
				dayList: [
					3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
				],
				content: '',
				phone: '',
			}
		},
		components: {
			Room
		},
		onLoad() {},
		mounted() {
			let now = new Date()
			console.log()
			this.time = now.getHours() + ':' + now.getMinutes()
		},
		methods: {
			bindPickerChange(e) {
				console.log(e)
				this.typeIndex = e.detail.value
			},
			bindPickerChangeDay(e) {
				console.log(e)
				this.dayIndex = e.detail.value
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
	
	.allow {
		height: 90rpx;
		display: flex;
		align-items: center;
		font-size: 24rpx;
		radio {
			transform: scale(0.7);
		}
	}
</style>
